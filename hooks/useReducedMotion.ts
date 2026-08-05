import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Tương đương RN của prefers-reduced-motion trên web. Mọi animation lặp vô
// hạn hoặc hiệu ứng chuyển cảnh nên đọc giá trị này và rút gọn/tắt đi khi
// người dùng đã bật "Giảm chuyển động" trong Accessibility settings.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
