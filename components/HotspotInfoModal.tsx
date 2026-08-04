import { Hotspot } from '@/constants/data';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    info: Hotspot | null;
    onClose: () => void;
}

export default function HotspotInfoModal({ info, onClose }: Props) {
    if (!info) return null;

    return (
        <View style={styles.modalBg} pointerEvents="auto">
            <View style={styles.modalCard}>
                <Text style={styles.modalName}>{info.name}</Text>
                <Text style={styles.modalDesc}>{info.description}</Text>
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={onClose}
                    activeOpacity={0.8}
                >
                    <Text style={styles.closeBtnText}>Đóng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalBg: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        elevation: 100,
        backgroundColor: Colors.overlay.scrim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '50%',
        maxWidth: 420,
        backgroundColor: Colors.slate[800],
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.slate[700],
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 8,
    },
    modalDesc: {
        fontSize: 14,
        color: Colors.slate[300],
        marginBottom: 20,
        lineHeight: 20,
    },
    closeBtn: {
        backgroundColor: Colors.blue.accent,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeBtnText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
});