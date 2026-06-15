import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAMES } from '../../constants/games';

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#6B8C5E',
  Medium: '#C4873A',
  Hard: '#B85C4A',
};

export default function CategoryDetailScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();

  const games = GAMES.filter(g => g.category === category)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Categories</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>CATEGORY</Text>
      <Text style={styles.title}>{category}</Text>
      <View style={styles.divider} />
      <Text style={styles.count}>{games.length} games</Text>

      <FlatList
        data={games}
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
              <Text style={styles.meta}>{item.players} players · {item.deck}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLORS[item.difficulty] }]}>
              <Text style={styles.badgeText}>{item.difficulty}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8', paddingTop: 60, paddingHorizontal: 20 },
  backButton: { marginBottom: 24 },
  backText: { color: '#C4873A', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#C4873A', letterSpacing: 4, marginBottom: 6 },
  title: { fontSize: 36, fontWeight: '800', color: '#2C2416', lineHeight: 42, letterSpacing: -0.5 },
  divider: { height: 3, width: 48, backgroundColor: '#C4873A', marginTop: 14, marginBottom: 12 },
  count: { fontSize: 13, color: '#8C7B6B', letterSpacing: 0.3 },
  card: { backgroundColor: '#fff', borderRadius: 4, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0D8CC', overflow: 'hidden' },
  cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#C4873A' },
  cardLeft: { flex: 1, paddingLeft: 12 },
  gameName: { color: '#2C2416', fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
  meta: { color: '#8C7B6B', fontSize: 12, marginTop: 3, letterSpacing: 0.2 },
  badge: { borderRadius: 3, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
});