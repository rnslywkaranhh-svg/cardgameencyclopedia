import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAMES } from '../../constants/games';

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#6B8C5E',
  Medium: '#C4873A',
  Hard: '#B85C4A',
};

export const FAVOURITES_KEY = 'favourite_games';

export default function FavouritesScreen() {
  const router = useRouter();
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(FAVOURITES_KEY).then(value => {
        setFavouriteIds(value ? JSON.parse(value) : []);
      });
    }, [])
  );

  const favouriteGames = GAMES.filter(g => favouriteIds.includes(g.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>YOUR</Text>
        <Text style={styles.title}>Favourites</Text>
        <View style={styles.divider} />
      </View>

      {favouriteGames.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♥</Text>
          <Text style={styles.emptyTitle}>No favourites yet</Text>
          <Text style={styles.emptyText}>Tap the ♥ on any game detail screen to save it here.</Text>
        </View>
      ) : (
        <FlatList
          data={favouriteGames}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({
                pathname: '/(tabs)/game',
                params: { name: item.name, category: item.category, players: item.players, difficulty: item.difficulty }
              })}>
              <View style={styles.cardAccent} />
              <View style={styles.cardLeft}>
                <Text style={styles.gameName}>{item.name}</Text>
                <Text style={styles.category}>{item.category} · {item.players} players</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLORS[item.difficulty] }]}>
                <Text style={styles.badgeText}>{item.difficulty}</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8', paddingTop: 60, paddingHorizontal: 20 },
  header: { marginBottom: 24 },
  subtitle: { fontSize: 11, fontWeight: '700', color: '#C4873A', letterSpacing: 4, marginBottom: 6 },
  title: { fontSize: 36, fontWeight: '800', color: '#2C2416', lineHeight: 42, letterSpacing: -0.5 },
  divider: { height: 3, width: 48, backgroundColor: '#C4873A', marginTop: 14, marginBottom: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyIcon: { fontSize: 48, color: '#C4873A', marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#2C2416', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#8C7B6B', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  card: { backgroundColor: '#fff', borderRadius: 4, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0D8CC', overflow: 'hidden' },
  cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#C4873A' },
  cardLeft: { flex: 1, paddingLeft: 12 },
  gameName: { color: '#2C2416', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  category: { color: '#8C7B6B', fontSize: 13, marginTop: 3, letterSpacing: 0.3 },
  badge: { borderRadius: 3, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
});