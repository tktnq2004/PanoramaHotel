import { Renderer } from 'expo-three';
import { useRef } from 'react';
import * as THREE from 'three';

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
