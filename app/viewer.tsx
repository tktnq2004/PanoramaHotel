import HotspotInfoModal from '@/components/HotspotInfoModal';
import PanoramaViewer from '@/components/PanoramaViewer';
import ViewerHeader from '@/components/ViewerHeader';
import { Colors } from '@/constants/theme';
import { usePanoramaNavigation } from '@/hooks/usePanoramaNavigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';

export default function ViewerScreen() {
    const router = useRouter();
    const { roomId, panoramaId } = useLocalSearchParams<{ roomId?: string; panoramaId?: string }>();
    const { width, height } = useWindowDimensions();

    // GLView chụp lại kích thước GL viewport CHỈ MỘT LẦN lúc tạo context (native
    // expo-gl không tự cập nhật lại sau đó). Nếu mount GLView trước khi xoay màn
    // hình xong (đặc biệt lúc cold start / mở lại app sau khi bị kill), context
    // đó sẽ "đóng băng" vĩnh viễn với kích thước sai -> ảnh méo hoặc nửa đen suốt
    // vòng đời GLView đó. Chỉ mount PanoramaViewer khi lockAsync đã resolve VÀ
    // useWindowDimensions đã thật sự phản ánh layout ngang (width > height).
    const [orientationLocked, setOrientationLocked] = useState(false);
    const isLandscapeReady = orientationLocked && width > height;

    useEffect(() => {
        let cancelled = false;
        // .catch() để không bao giờ bị kẹt màn hình loading nếu API khoá xoay
        // không khả dụng/bị từ chối trên một số nền tảng hoặc thiết bị.
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
            .catch(() => {})
            .then(() => {
                if (!cancelled) setOrientationLocked(true);
            });
        return () => {
            cancelled = true;
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

            {isLandscapeReady ? (
                <PanoramaViewer
                    key={currentPano.id}
                    imageUrl={currentPano.imageUrl}
                    hotspots={currentPano.hotspots.map((hs) => ({
                        ...hs,
                        onPress: () => handleHotspotPress(hs),
                    }))}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.white} />
                </View>
            )}

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
        backgroundColor: Colors.black,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});