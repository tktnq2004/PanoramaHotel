import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
    roomName: string;
    panoName: string;
    onBackToHome: () => void;
    onReturn: () => void;
    canReturn: boolean;
}

export default function ViewerHeader({ roomName, panoName, onBackToHome, onReturn, canReturn }: Props) {
    return (
        <View style={styles.header}>
            <View style={styles.leftButtons}>
                {canReturn && (
                    <TouchableOpacity
                        style={styles.backBtnWrapper}
                        onPress={onReturn}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-undo" size={14} color={Colors.white} />
                        <Text style={styles.backBtn}>Return</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.backBtnWrapper}
                    onPress={onBackToHome}
                    activeOpacity={0.7}
                >
                    <Ionicons name="home-outline" size={14} color={Colors.white} />
                    <Text style={styles.backBtn}>Back to home</Text>
                </TouchableOpacity>
            </View>

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
    leftButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backBtnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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