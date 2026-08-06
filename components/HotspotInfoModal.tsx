import { Hotspot } from '@/constants/data';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

interface Props {
    info: Hotspot | null;
    onClose: () => void;
}

/*  KHÔNG dùng React Native <Modal>: Modal tạo một cửa sổ/surface native
    riêng, và hiển thị nó đè lên GLView (expo-gl) đang render mỗi frame là tổ hợp
    gây crash rất hay gặp trên Android (đặc biệt với New Architecture) vì việc
    tạo/huỷ window của Modal làm gián đoạn EGL surface giữa lúc vòng lặp render
    vẫn đang gọi gl.endFrameEXP(). Overlay View tuyệt đối bên dưới an toàn hơn
    vì không đụng tới window hệ thống, chỉ vẽ trong cùng cây view của RN. */
export default function HotspotInfoModal({ info, onClose }: Props) {
    const reducedMotion = useReducedMotion();
    if (!info) return null;

    return (
        <Animated.View
            entering={reducedMotion ? undefined : FadeIn.duration(180)}
            exiting={reducedMotion ? undefined : FadeOut.duration(140)}
            style={styles.modalBg}
            pointerEvents="auto"
        >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFillObject} />

            <Animated.View
                entering={reducedMotion ? undefined : ZoomIn.duration(220)}
                exiting={reducedMotion ? undefined : ZoomOut.duration(160)}
                style={styles.modalCard}
            >
                <View style={styles.iconBadge}>
                    <Ionicons name="information" size={18} color={Colors.gold[400]} />
                </View>

                <Text style={styles.modalName}>{info.name}</Text>
                {!!info.description && <Text style={styles.modalDesc}>{info.description}</Text>}

                <Pressable style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]} onPress={onClose}>
                    <Text style={styles.closeBtnText}>Đóng</Text>
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    modalBg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        elevation: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.overlay.scrim,
    },
    modalCard: {
        width: '55%',
        maxWidth: 420,
        backgroundColor: Colors.ink[900],
        borderRadius: Radius.lg,
        padding: 22,
        borderWidth: 1,
        borderColor: Colors.overlay.borderLight,
        borderTopColor: 'rgba(255, 255, 255, 0.18)',
    },
    iconBadge: {
        width: 34,
        height: 34,
        borderRadius: Radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.ink[800],
        borderWidth: 1,
        borderColor: Colors.gold[600],
        marginBottom: 14,
    },
    modalName: {
        fontSize: 19,
        fontFamily: Fonts.semibold,
        color: Colors.white,
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    modalDesc: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.slate[300],
        marginBottom: 22,
        lineHeight: 21,
    },
    closeBtn: {
        backgroundColor: Colors.gold[500],
        paddingVertical: 12,
        borderRadius: Radius.pill,
        alignItems: 'center',
    },
    closeBtnPressed: {
        backgroundColor: Colors.gold[600],
    },
    closeBtnText: {
        color: Colors.ink[950],
        fontFamily: Fonts.semibold,
        fontSize: 14,
    },
});
