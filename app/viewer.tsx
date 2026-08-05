import HotspotInfoModal from '@/components/HotspotInfoModal';
import PanoramaViewer from '@/components/PanoramaViewer';
import ViewerHeader from '@/components/ViewerHeader';
import { Colors } from '@/constants/theme';
import { usePanoramaNavigation } from '@/hooks/usePanoramaNavigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const TRANSITION_FADE_IN_MS = 220;
const TRANSITION_FADE_OUT_MS = 350;
// Lưới an toàn: nếu vì lý do gì đó panorama mới không bao giờ báo "sẵn sàng"
// (ảnh lỗi, mạng chậm...), vẫn phải mở lại màn hình sau tối đa khoảng này,
// không được kẹt màn đen vĩnh viễn.
const TRANSITION_MAX_WAIT_MS = 1500;

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

    // Hiệu ứng chuyển cảnh "fade qua màu đen" khi đổi panorama: che màn hình lại
    // trước khi GLView cũ unmount/GLView mới mount (bản thân việc remount này
    // luôn có một khoảng ngắn không có gì để hiển thị), rồi chỉ mở lại khi
    // panorama mới đã thật sự render xong khung hình đầu tiên (tín hiệu isReady
    // từ usePanoramaScene) — không đoán một khoảng thời gian cố định.
    const reducedMotion = useReducedMotion();
    const fadeOpacity = useSharedValue(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const prevPanoIdRef = useRef<string | null>(null);
    const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const isFirstMount = prevPanoIdRef.current === null;
        prevPanoIdRef.current = currentPano.id;
        if (isFirstMount || reducedMotion) return;

        setIsTransitioning(true);
        fadeOpacity.value = withTiming(1, { duration: TRANSITION_FADE_IN_MS });

        if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = setTimeout(() => {
            fadeOpacity.value = withTiming(0, { duration: TRANSITION_FADE_OUT_MS });
            setIsTransitioning(false);
        }, TRANSITION_MAX_WAIT_MS);

        return () => {
            if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
        };
    }, [currentPano.id, reducedMotion]);

    const handlePanoramaReady = () => {
        if (!isTransitioning) return;
        if (readyTimeoutRef.current) {
            clearTimeout(readyTimeoutRef.current);
            readyTimeoutRef.current = null;
        }
        fadeOpacity.value = withTiming(0, { duration: TRANSITION_FADE_OUT_MS });
        setIsTransitioning(false);
    };

    const fadeStyle = useAnimatedStyle(() => ({
        opacity: fadeOpacity.value,
    }));

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
                    onReady={handlePanoramaReady}
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

            <Animated.View
                pointerEvents={isTransitioning ? 'auto' : 'none'}
                style={[styles.transitionOverlay, fadeStyle]}
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
    transitionOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.ink[950],
        zIndex: 200,
    },
});