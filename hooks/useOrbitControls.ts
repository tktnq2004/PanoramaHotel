import { useRef } from 'react';
import { PanResponder } from 'react-native';

const LOOK_SENSITIVITY = 0.25;
const MAX_LATITUDE = 85;

const DEFAULT_FOV = 75;
const MIN_FOV = 30; // zoom in tối đa, tránh phóng to quá gây vỡ nét texture
const MAX_FOV = 90; // zoom out tối đa, giữ dưới ~100 để hạn chế méo rìa khung hình

function getTouchDistance(touches: { pageX: number; pageY: number }[]) {
  const [a, b] = touches;
  const dx = a.pageX - b.pageX;
  const dy = a.pageY - b.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Xử lý gesture vuốt để xoay góc nhìn camera panorama, và gesture chụm/mở
// 2 ngón để zoom (thu hẹp/mở rộng FOV camera). Dùng ref (không phải state)
// cho lon/lat/fov vì các giá trị này được đọc lại mỗi frame trong vòng lặp
// render — nếu để state sẽ gây re-render 60 lần/giây không cần thiết.
export function useOrbitControls() {
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const fovRef = useRef(DEFAULT_FOV);
  const lastGestureRef = useRef({ x: 0, y: 0 });
  // Mốc bắt đầu 1 lần pinch: khoảng cách 2 ngón + FOV tại thời điểm đó, để
  // tính tỉ lệ zoom tương đối thay vì cộng dồn theo từng khung hình.
  const pinchRef = useRef<{ startDistance: number; startFov: number } | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastGestureRef.current = { x: 0, y: 0 };
        pinchRef.current = null;
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length === 2) {
          const distance = getTouchDistance(touches);
          if (!pinchRef.current) {
            pinchRef.current = { startDistance: distance, startFov: fovRef.current };
          } else if (pinchRef.current.startDistance > 0) {
            // 2 ngón xoè ra (distance tăng) => zoom in => FOV giảm, và ngược lại.
            const scale = distance / pinchRef.current.startDistance;
            const nextFov = pinchRef.current.startFov / scale;
            fovRef.current = Math.max(MIN_FOV, Math.min(MAX_FOV, nextFov));
          }
          return;
        }

        if (pinchRef.current) {
          // Vừa nhấc bớt 1 ngón sau khi pinch: reset lại mốc pan để tránh giật
          // hình do gestureState.dx/dy đã tích luỹ từ lúc còn 2 ngón trên màn.
          pinchRef.current = null;
          lastGestureRef.current = { x: gestureState.dx, y: gestureState.dy };
          return;
        }

        const dx = gestureState.dx - lastGestureRef.current.x;
        const dy = gestureState.dy - lastGestureRef.current.y;

        // Xoay góc vuốt phù hợp với hướng LANDSCAPE_RIGHT
        lonRef.current -= dx * LOOK_SENSITIVITY;
        latRef.current += dy * LOOK_SENSITIVITY;
        latRef.current = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, latRef.current));

        lastGestureRef.current = { x: gestureState.dx, y: gestureState.dy };
      },
      onPanResponderRelease: () => {
        pinchRef.current = null;
      },
      onPanResponderTerminate: () => {
        pinchRef.current = null;
      },
    })
  ).current;

  return {
    panHandlers: panResponder.panHandlers,
    lonRef,
    latRef,
    fovRef,
  };
}
