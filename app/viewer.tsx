import HotspotInfoModal from '@/components/HotspotInfoModal';
import PanoramaViewer from '@/components/PanoramaViewer';
import ViewerHeader from '@/components/ViewerHeader';
import { usePanoramaNavigation } from '@/hooks/usePanoramaNavigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ViewerScreen() {
    const router = useRouter();
    const { roomId, panoramaId } = useLocalSearchParams<{ roomId?: string; panoramaId?: string }>();

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);

    const {
        currentPano,
        currentRoom,
        selectedInfo,
        setSelectedInfo,
        handleHotspotPress,
    } = usePanoramaNavigation({ roomId, panoramaId });

    return (
        <View style={styles.container}>
            <ViewerHeader
                roomName={currentRoom.name}
                panoName={currentPano.name}
                onBack={() => router.back()}
            />

            <PanoramaViewer
                key={currentPano.id}
                imageUrl={currentPano.imageUrl}
                hotspots={currentPano.hotspots.map((hs) => ({
                    ...hs,
                    onPress: () => handleHotspotPress(hs),
                }))}
            />

            <HotspotInfoModal
                info={selectedInfo}
                onClose={() => setSelectedInfo(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});