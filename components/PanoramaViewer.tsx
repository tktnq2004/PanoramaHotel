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
}

export default function PanoramaViewer({ imageUrl, hotspots, onBack }: Props) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const {
    panHandlers,
    projectedHotspots,
    loadError,
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
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}

        <HotspotOverlay hotspots={projectedHotspots} />
      </View>

      {loadError && (
        <View style={styles.errorOverlay} pointerEvents="none">
          <Ionicons name="warning-outline" size={32} color="#F87171" />
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  glView: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  errorText: {
    color: '#F1F5F9',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});