import { Hotspot } from '@/constants/data';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    info: Hotspot | null;
    onClose: () => void;
}

export default function HotspotInfoModal({ info, onClose }: Props) {
    return (
        <Modal visible={!!info} transparent animationType="fade">
            <View style={styles.modalBg}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalName}>{info?.name}</Text>
                    <Text style={styles.modalDesc}>{info?.description}</Text>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.closeBtnText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '50%',
        maxWidth: 420,
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    modalDesc: {
        fontSize: 14,
        color: '#CBD5E1',
        marginBottom: 20,
        lineHeight: 20,
    },
    closeBtn: {
        backgroundColor: '#2563EB',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});