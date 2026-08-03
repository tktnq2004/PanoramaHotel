import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import { useRef, useState } from 'react';
import { PanResponder, PixelRatio } from 'react-native';
import * as THREE from 'three';

export interface HotspotItem {
  id: string;
  name: string;
  position: [number, number, number];
  type?: 'INFO' | 'NAVIGATION';
  onPress: () => void;
}

export interface ProjectedHotspot extends HotspotItem {
  screenX: number;
  screenY: number;
  visible: boolean;
}

const SPHERE_RADIUS = 500;
const HOTSPOT_RADIUS = 490;

interface UsePanoramaSceneParams {
  imageUrl: string;
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
    
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const lonRef = useRef(0);
  const latRef = useRef(0);
  const lastGestureRef = useRef({ x: 0, y: 0 });

  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);

  // Xử lý PanResponder cảm ứng mượt mà
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastGestureRef.current = { x: 0, y: 0 };
      },
      onPanResponderMove: (_, gestureState) => {
        const dx = gestureState.dx - lastGestureRef.current.x;
        const dy = gestureState.dy - lastGestureRef.current.y;

        // Xoay góc vuốt phù hợp với hướng LANDSCAPE_RIGHT
        lonRef.current -= dx * 0.25;
        latRef.current += dy * 0.25;
        latRef.current = Math.max(-85, Math.min(85, latRef.current));

        lastGestureRef.current = { x: gestureState.dx, y: gestureState.dy };
      },
    })
  ).current;

  const updateCameraAspect = () => {
    if (cameraRef.current && screenWidth > 0 && screenHeight > 0) {
      cameraRef.current.aspect = screenWidth / screenHeight;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const onContextCreate = async (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setPixelRatio(Math.min(2, PixelRatio.get()));

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const geometry = new THREE.SphereGeometry(SPHERE_RADIUS, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = await new TextureLoader().loadAsync(imageUrl);

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereMeshRef.current = sphere;

    const targetVector = new THREE.Vector3();

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      targetVector.x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
      targetVector.y = SPHERE_RADIUS * Math.cos(phi);
      targetVector.z = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetVector);
      camera.updateMatrixWorld();

      if (hotspots && hotspots.length > 0) {
        const updated: ProjectedHotspot[] = hotspots.map((hs) => {
          const pos3D = new THREE.Vector3(...hs.position)
            .normalize()
            .multiplyScalar(HOTSPOT_RADIUS);

          const camDir = new THREE.Vector3();
          camera.getWorldDirection(camDir);
          const isBehind = pos3D.clone().normalize().dot(camDir) < 0.2;

          pos3D.project(camera);

          const screenX = ((pos3D.x + 1) * screenWidth) / 2;
          const screenY = ((-pos3D.y + 1) * screenHeight) / 2;

          return {
            ...hs,
            screenX,
            screenY,
            visible: !isBehind && pos3D.z < 1,
          };
        });

        setProjectedHotspots(updated);
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
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
    panHandlers: panResponder.panHandlers,
    projectedHotspots,
    onContextCreate,
    updateCameraAspect,
    disposeScene,
  };
}