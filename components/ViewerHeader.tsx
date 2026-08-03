import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    backBtn: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    titleContainer: {
        alignItems: 'flex-end',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    roomName: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    panoTitle: {
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 2,
    },
});