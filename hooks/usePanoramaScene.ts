import { Asset } from 'expo-asset';
import { Renderer, TextureLoader } from 'expo-three';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { HotspotItem, ProjectedHotspot, projectHotspots } from '@/utils/projectHotspot';
import { useGLViewportSync } from './useGLViewportSync';
import { useOrbitControls } from './useOrbitControls';

export type { HotspotItem, ProjectedHotspot } from '@/utils/projectHotspot';

const SPHERE_RADIUS = 500;

interface UsePanoramaSceneParams {
  // require() ảnh local (số module Metro gán) — không phải URI đã resolve.
  imageUrl: number;
  hotspots: HotspotItem[];
  screenWidth: number;
  screenHeight: number;
}

export function usePanoramaScene({
  imageUrl,
  hotspots,
  screenWidth,
  screenHeight,
}: UsePanoramaSceneParams) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { panHandlers, lonRef, latRef, fovRef } = useOrbitControls();
  const { glRef, rendererRef, cameraRef, applySurfaceSize, syncFromGL } = useGLViewportSync();

  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const hasSignaledReadyRef = useRef(false);

  const onContextCreate = async (gl: any) => {
    // Bọc toàn bộ phần khởi tạo (load + upload texture) trong try/catch: đây là
    // chỗ dễ ném exception nhất (ảnh hỏng, sai định dạng, URL/asset không tồn
    // tại...). Không bắt thì app chỉ đứng hình màn đen mà không rõ vì sao. Bắt
    // được thì log rõ nguyên nhân + hiện cảnh báo cho người dùng thay vì im lặng.
    try {
      glRef.current = gl;

      const renderer = new Renderer({ gl });
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.set(0, 0, 0);
      cameraRef.current = camera;

      applySurfaceSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40);
      geometry.scale(-1, 1, 1);

      // Asset.fromModule(...).uri chỉ là URL Metro dev server hợp lệ lúc chạy
      // qua Expo Go/dev client. Trong bản release/standalone (không có Metro),
      // phải chủ động downloadAsync() để asset được "giải nén" ra file thật
      // (.localUri) rồi mới nạp cho TextureLoader — nếu không, texture load
      // thất bại âm thầm và cả mặt cầu hiện ra màu đen dù không ném lỗi nào.
      const asset = Asset.fromModule(imageUrl);
      await asset.downloadAsync();
      const resolvedUri = asset.localUri ?? asset.uri;

      const texture = await new TextureLoader().loadAsync(resolvedUri);

      // expo-three tự resolve lại kích thước ảnh từ URI (qua expo-asset-utils,
      // KHÔNG đi qua Metro asset registry như Asset.fromModule ở trên) bằng
      // Image.getSize() của React Native — API này thường trả về kích thước
      // bị chia đôi cho ảnh lớn dạng equirectangular trên Android, khiến
      // gl.texImage2D nhận header kích thước sai trong khi ảnh giải mã thật
      // lớn hơn -> lỗi GL_INVALID_VALUE và cả mặt cầu hiện màu đen (đã xác
      // minh qua log thiết bị thật lẫn emulator). asset.width/height từ
      // Metro registry (dòng trên) luôn đúng nên ghi đè lại để dùng số đúng.
      if (texture.image && asset.width && asset.height) {
        (texture.image as any).width = asset.width;
        (texture.image as any).height = asset.height;
      }

      // GL không tự báo lỗi khi ảnh vượt GL_MAX_TEXTURE_SIZE của thiết bị —
      // texture chỉ âm thầm "incomplete" (đen/méo) mà không ném exception nào.
      // Chủ động so sánh kích thước thật của ảnh với giới hạn GPU và tự ném lỗi
      // rõ ràng để catch bên dưới xử lý thống nhất, thay vì để hiện tượng lạ.
      const maxTextureSize: number = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const imgWidth = texture.image?.width ?? 0;
      const imgHeight = texture.image?.height ?? 0;
      if (imgWidth > maxTextureSize || imgHeight > maxTextureSize) {
        throw new Error(
          `Ảnh panorama ${imgWidth}x${imgHeight} vượt quá GL_MAX_TEXTURE_SIZE (${maxTextureSize}) mà GPU thiết bị này hỗ trợ. Hãy resize ảnh xuống tối đa ${maxTextureSize}px chiều rộng.`
        );
      }

      // Ảnh nguồn có thể ở bất kỳ kích thước/tỉ lệ nào (kể cả ảnh người dùng
      // upload sau này, không nhất thiết lũy thừa 2). Mipmap mặc định của
      // three.js với ảnh NPOT khiến texture "incomplete" -> hiện màu đen trên
      // nhiều driver GLES Android. Tắt mipmap + dùng lọc tuyến tính để luôn an
      // toàn với mọi kích thước ảnh, đồng thời đỡ tốn thời gian dựng mipmap.
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const material = new THREE.MeshBasicMaterial({ map: texture });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphereMeshRef.current = sphere;

      const targetVector = new THREE.Vector3();

      const render = () => {
        try {
          animationFrameRef.current = requestAnimationFrame(render);

          // Đồng bộ lại kích thước renderer/camera mỗi frame theo buffer GL thật,
          // bắt kịp thời điểm xoay màn hình xong dù nó xảy ra bất đồng bộ.
          applySurfaceSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

          // Đồng bộ FOV camera theo gesture pinch (useOrbitControls cập nhật
          // fovRef mỗi lần 2 ngón di chuyển). Chỉ gọi updateProjectionMatrix khi
          // giá trị thực sự đổi để tránh tính toán lại ma trận thừa mỗi frame.
          if (camera.fov !== fovRef.current) {
            camera.fov = fovRef.current;
            camera.updateProjectionMatrix();
          }

          const phi = THREE.MathUtils.degToRad(90 - latRef.current);
          const theta = THREE.MathUtils.degToRad(lonRef.current);

          targetVector.x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
          targetVector.y = SPHERE_RADIUS * Math.cos(phi);
          targetVector.z = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);

          camera.lookAt(targetVector);
          camera.updateMatrixWorld();

          if (hotspots && hotspots.length > 0) {
            setProjectedHotspots(projectHotspots(camera, hotspots, screenWidth, screenHeight));
          }

          renderer.render(scene, camera);
          gl.endFrameEXP();

          // Báo hiệu "đã render xong khung hình đầu tiên" đúng 1 lần, để nơi
          // gọi (màn hình viewer) biết khi nào an toàn để fade màn chuyển cảnh
          // trở lại, thay vì đoán một khoảng thời gian cố định.
          if (!hasSignaledReadyRef.current) {
            hasSignaledReadyRef.current = true;
            setIsReady(true);
          }
        } catch (error) {
          // Lỗi xảy ra giữa lúc render (vd. context bị mất) sẽ lặp lại mỗi frame
          // nếu không dừng vòng lặp -> spam log/crash liên tục. Dừng hẳn RAF loop
          // và báo lỗi một lần duy nhất thay vì để nó lặp 60 lần/giây.
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          console.warn(`[usePanoramaScene] Lỗi khi render panorama "${imageUrl}":`, error);
          setLoadError('Đã xảy ra lỗi khi hiển thị ảnh panorama này.');
        }
      };

      render();
    } catch (error) {
      console.warn(`[usePanoramaScene] Không thể tải ảnh panorama "${imageUrl}":`, error);
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Không thể tải ảnh panorama. Vui lòng kiểm tra lại file ảnh.'
      );
    }
  };

  const disposeScene = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (sphereMeshRef.current) {
      sphereMeshRef.current.geometry.dispose();

      const material = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
      material.map?.dispose();
      material.dispose();
    }

    sceneRef.current?.clear();
  };

  return {
    panHandlers,
    projectedHotspots,
    loadError,
    isReady,
    onContextCreate,
    updateCameraAspect: syncFromGL,
    disposeScene,
  };
}
