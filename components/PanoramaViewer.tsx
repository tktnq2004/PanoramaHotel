import { Colors } from '@/constants/theme';
import { HotspotItem, usePanoramaScene } from '@/hooks/usePanoramaScene';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GLView } from 'expo-gl';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import HotspotOverlay from './HotspotOverlay';

interface Props {
  imageUrl: string;
  hotspots: HotspotItem[];
  onBack?: () => void;
  onReady?: () => void;
}

export default function PanoramaViewer({ imageUrl, hotspots, onBack, onReady }: Props) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const {
    panHandlers,
    projectedHotspots,
    loadError,
    isReady,
    onContextCreate,
    updateCameraAspect,
    disposeScene,
  } = usePanoramaScene({ imageUrl, hotspots, screenWidth, screenHeight });

  useEffect(() => {
    updateCameraAspect();
  }, [screenWidth, screenHeight]);

  useEffect(() => {
    return () => disposeScene();
  }, []);

  useEffect(() => {
    if (isReady) onReady?.();
  }, [isReady]);

  return (
    <View style={styles.container} {...panHandlers}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />

      {/* Layer Overlay UI */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        )}

        <HotspotOverlay hotspots={projectedHotspots} />
      </View>

      {loadError && (
        <View style={styles.errorOverlay} pointerEvents="none">
          <Ionicons name="warning-outline" size={32} color={Colors.red.warning} />
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  glView: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
    backgroundColor: Colors.overlay.button,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.overlay.borderSubtle,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  errorText: {
    color: Colors.slate[100],
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});