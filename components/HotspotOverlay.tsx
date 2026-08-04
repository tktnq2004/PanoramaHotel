import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProjectedHotspot } from '@/hooks/usePanoramaScene';
import { Colors } from '@/constants/theme';

interface Props {
  hotspots: ProjectedHotspot[];
}

export default function HotspotOverlay({ hotspots }: Props) {
  return (
    <>
      {hotspots.map((hs) => {
        if (!hs.visible) return null;

        return (
          <TouchableOpacity
            key={hs.id}
            activeOpacity={0.8}
            style={[
              styles.hotspotBtn,
              {
                left: hs.screenX - 60,
                top: hs.screenY - 20,
              },
            ]}
            onPress={hs.onPress}
          >
            <Text style={styles.hotspotText}>
              {hs.type === 'INFO' ? 'ℹ️' : '🚪'} {hs.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  hotspotBtn: {
    position: 'absolute',
    backgroundColor: Colors.overlay.scrimStrong,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.blue.ios,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  hotspotText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
});