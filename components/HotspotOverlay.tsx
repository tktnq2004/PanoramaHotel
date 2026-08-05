import { Colors, Fonts, Radius } from '@/constants/theme';
import { ProjectedHotspot } from '@/hooks/usePanoramaScene';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  hotspots: ProjectedHotspot[];
}

const MARKER_SIZE = 40;
const LABEL_WIDTH = 168;
const PEEK_WIDTH = 100;
const PEEK_HEIGHT = 65;
// Khoảng cách giữa đáy thẻ xem trước và đỉnh icon marker.
const PEEK_GAP = 18;
// Ngưỡng giữ tay trước khi hiện thẻ xem trước — đủ nhanh để không có cảm giác
// trễ, nhưng vẫn đủ lâu để phân biệt rõ với một cú tap thường (chuyển cảnh
// ngay lập tức, không đổi hành vi cũ).
const HOLD_THRESHOLD_MS = 350;

export default function HotspotOverlay({ hotspots }: Props) {
  return (
    <>
      {hotspots.map((hs) => {
        if (!hs.visible) return null;
        return <HotspotMarker key={hs.id} hotspot={hs} />;
      })}
    </>
  );
}

function HotspotMarker({ hotspot }: { hotspot: ProjectedHotspot }) {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  const isInfo = hotspot.type === 'INFO';
  const accent = isInfo ? Colors.slate[300] : Colors.gold[500];
  const canPeek = !isInfo && !!hotspot.previewImageUrl;

  const [isPeeking, setIsPeeking] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Vòng pulse quanh marker: kéo chú ý người dùng tới hotspot trên ảnh 360 —
  // đây là quy ước quen thuộc của các app virtual tour (Matterport-style),
  // không phải hiệu ứng trang trí. Tắt hẳn khi bật "Giảm chuyển động".
  useEffect(() => {
    if (reducedMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
  }, [reducedMotion, pulse]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 0.6 }],
  }));

  const handlePressIn = () => {
    if (!canPeek) return;
    holdTimerRef.current = setTimeout(() => setIsPeeking(true), HOLD_THRESHOLD_MS);
  };

  const handlePressOut = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsPeeking(false);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { left: hotspot.screenX - LABEL_WIDTH / 2, top: hotspot.screenY - MARKER_SIZE / 2 },
      ]}
    >
      {isPeeking && canPeek && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeIn.duration(120)}
          exiting={reducedMotion ? undefined : FadeOut.duration(100)}
          style={styles.peekCard}
          pointerEvents="none"
        >
          <Image source={{ uri: hotspot.previewImageUrl }} style={styles.peekImage} resizeMode="cover" />
        </Animated.View>
      )}

      <Pressable
        style={styles.markerColumn}
        onPress={hotspot.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={8}
      >
        <View style={styles.markerAnchor}>
          {!reducedMotion && (
            <Animated.View
              pointerEvents="none"
              style={[styles.pulseRing, { borderColor: accent }, pulseStyle]}
            />
          )}
          <BlurView intensity={40} tint="dark" style={styles.markerBlur}>
            <View style={[styles.marker, { borderColor: accent }]}>
              <Ionicons
                name={isInfo ? 'information' : 'log-in-outline'}
                size={18}
                color={isInfo ? Colors.slate[100] : Colors.gold[400]}
              />
            </View>
          </BlurView>
        </View>

        <BlurView intensity={35} tint="dark" style={styles.labelChip}>
          <Text style={styles.labelText} numberOfLines={1}>
            {hotspot.name}
          </Text>
        </BlurView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: LABEL_WIDTH,
    alignItems: 'center',
  },
  markerColumn: {
    alignItems: 'center',
  },
  markerAnchor: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: 1.5,
  },
  markerBlur: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    overflow: 'hidden',
  },
  marker: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: Colors.overlay.button,
  },
  labelChip: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.overlay.borderLight,
    maxWidth: LABEL_WIDTH,
  },
  labelText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.white,
    textAlign: 'center',
  },
  peekCard: {
    position: 'absolute',
    // Neo theo "top" từ đỉnh wrapper (trùng đỉnh icon marker) thay vì "bottom"
    // — dùng "bottom" trước đây phụ thuộc chiều cao label chip bên dưới (vốn
    // không cố định), khiến thẻ xem trước bị đè lên icon.
    top: -(PEEK_HEIGHT + PEEK_GAP),
    width: PEEK_WIDTH,
    height: PEEK_HEIGHT,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.gold[500],
    backgroundColor: Colors.ink[900],
  },
  peekImage: {
    width: '100%',
    height: '100%',
  },
  peekLabelBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: Colors.overlay.scrimStrong,
  },
  peekLabelText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: Colors.white,
    textAlign: 'center',
  },
});
