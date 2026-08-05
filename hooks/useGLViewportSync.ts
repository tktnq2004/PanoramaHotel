import { Renderer } from 'expo-three';
import { useRef } from 'react';
import * as THREE from 'three';

// Áp size thật của GL surface cho renderer + camera. Không dùng kích thước từ
// useWindowDimensions làm nguồn chân lý vì chúng có thể lệch pha với kích
// thước thật của GLView khi ScreenOrientation.lockAsync đang xoay màn hình bất
// đồng bộ — đây là nguyên nhân ảnh bị bóp méo ở lần load đầu và luôn xảy ra
// trên các thiết bị/emulator có độ trễ xoay lớn hơn. Ngoài ra, expo-gl chỉ set
// gl.drawingBufferWidth/Height MỘT LẦN lúc tạo context (glGetIntegerv trong
// EXGLNativeContext.cpp), không tự cập nhật lại — nên `syncFromGL` phải được
// gọi lại mỗi frame để bắt kịp đúng thời điểm giá trị đó ổn định.
export function useGLViewportSync() {
  const glRef = useRef<any>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });

  const applySurfaceSize = (width: number, height: number) => {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!renderer || !camera || width <= 0 || height <= 0) return;
    if (lastSizeRef.current.width === width && lastSizeRef.current.height === height) return;

    lastSizeRef.current = { width, height };
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const syncFromGL = () => {
    if (glRef.current) {
      applySurfaceSize(glRef.current.drawingBufferWidth, glRef.current.drawingBufferHeight);
    }
  };

  return {
    glRef,
    rendererRef,
    cameraRef,
    applySurfaceSize,
    syncFromGL,
  };
}
