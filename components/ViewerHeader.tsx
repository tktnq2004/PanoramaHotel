import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface Props {
    roomName: string;
    panoName: string;
    onBack: () => void;
}

export default function ViewerHeader({ roomName, panoName, onBack }: Props) {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backBtnWrapper}
                onPress={onBack}
                activeOpacity={0.7}
            >
                <Text style={styles.backBtn}>‹ Quay lại</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Text style={styles.roomName}>{roomName}</Text>
                <Text style={styles.panoTitle}>{panoName}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 20,
        left: 24,
        right: 24,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtnWrapper: {
        backgroundColor: Colors.overlay.header,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.overlay.borderLight,
    },
    backBtn: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    titleContainer: {
        alignItems: 'flex-end',
        backgroundColor: Colors.overlay.header,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.overlay.borderLight,
    },
    roomName: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: 'bold',
    },
    panoTitle: {
        color: Colors.slate[400],
        fontSize: 11,
        marginTop: 2,
    },
});