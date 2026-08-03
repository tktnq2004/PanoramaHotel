import { PANORAMA_DATA, Room } from '@/constants/data';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const rooms: Room[] = Object.values(PANORAMA_DATA);

  const renderRoomItem = ({ item }: { item: Room }) => {
    const mainPanorama = item.panoramas[0];

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: '/viewer',
            params: {
              roomId: item.id,
              panoramaId: mainPanorama?.id
            },
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardname}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headername}>PanoramaHotel 🏨</Text>

      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headername: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubname: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardname: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardSubname: {
    color: '#E2E8F0',
    fontSize: 13,
    marginTop: 4,
  },
});