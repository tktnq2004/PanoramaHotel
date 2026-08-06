import { PANORAMA_DATA, Room } from '@/constants/data';
import { Colors, Fonts, Radius } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  RESORT: 'leaf-outline',
  HOTEL: 'business-outline',
};

export default function HomeScreen() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const rooms: Room[] = Object.values(PANORAMA_DATA);

  const renderRoomItem = ({ item, index }: { item: Room; index: number }) => (
    <PropertyCard
      item={item}
      index={index}
      reducedMotion={reducedMotion}
      onPress={() =>
        router.push({
          pathname: '/viewer',
          params: {
            roomId: item.id,
            panoramaId: item.panoramas[0]?.id,
          },
        })
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headername}>PanoraStay</Text>
        <Text style={styles.headerSubname}>Hotel and Resort 360°</Text>
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

interface PropertyCardProps {
  item: Room;
  index: number;
  reducedMotion: boolean;
  onPress: () => void;
}

function PropertyCard({ item, index, reducedMotion, onPress }: PropertyCardProps) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const categoryLabel = item.category ?? 'PROPERTY';
  const spaceCount = item.panoramas.length;

  return (
    <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(index * 90).duration(420)}>
      <Animated.View style={pressStyle}>
        <Pressable
          style={styles.card}
          onPressIn={() => {
            scale.value = withTiming(0.97, { duration: 120 });
          }}
          onPressOut={() => {
            scale.value = withTiming(1, { duration: 160 });
          }}
          onPress={onPress}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          <LinearGradient
            colors={['rgba(6,7,8,0)', 'rgba(6,7,8,0.15)', Colors.overlay.scrimStrong]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.categoryChip}>
            <Ionicons
              name={CATEGORY_ICON[categoryLabel] ?? 'sparkles-outline'}
              size={12}
              color={Colors.gold[400]}
            />
            <Text style={styles.categoryChipText}>{categoryLabel}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardName}>{item.name}</Text>
            <View style={styles.cardMetaRow}>
              <Ionicons name="scan-outline" size={13} color={Colors.slate[300]} />
              <Text style={styles.cardMeta}>{spaceCount} không gian để khám phá</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink[950],
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headername: {
    fontSize: 30,
    fontFamily: Fonts.bold,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  headerSubname: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.slate[400],
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 18,
  },
  card: {
    height: 240,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.ink[900],
    borderWidth: 1,
    borderColor: Colors.overlay.borderLight,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryChip: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.overlay.header,
    borderWidth: 1,
    borderColor: Colors.overlay.borderLight,
  },
  categoryChipText: {
    fontSize: 11,
    fontFamily: Fonts.semibold,
    color: Colors.gold[400],
    letterSpacing: 0.6,
  },
  cardContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
  },
  cardName: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: Fonts.semibold,
    letterSpacing: -0.3,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  cardMeta: {
    color: Colors.slate[300],
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
});
