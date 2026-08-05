import { Colors, Fonts, Radius } from '@/constants/theme';
import { ProjectedHotspot } from '@/hooks/usePanoramaScene';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
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

  // Vòng pulse quanh marker: kéo chú ý người dùng tới hotspot trên ảnh 360 —
  // đây là quy ước quen thuộc của các app virtual tour (Matterport-style),
  // không phải hiệu ứng trang trí. Tắt hẳn khi bật "Giảm chuyển động".
  useEffect(() => {
    if (reducedMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
  }, [reducedMotion, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 0.6 }],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { left: hotspot.screenX - LABEL_WIDTH / 2, top: hotspot.screenY - MARKER_SIZE / 2 },
      ]}
    >
      <Pressable style={styles.markerColumn} onPress={hotspot.onPress} hitSlop={8}>
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
                name={isInfo ? 'information' : 'arrow-forward'}
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
});
