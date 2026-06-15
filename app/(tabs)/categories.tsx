import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAMES } from '../../constants/games';

const CATEGORY_INFO: Record<string, { icon: string; description: string }> = {
  'Betting':      { icon: '♠', description: 'Games involving wagering and odds' },
  'Trick-taking': { icon: '♥', description: 'Win tricks by playing the highest card' },
  'Matching':     { icon: '♦', description: 'Form sets, runs and melds' },
  'Shedding':     { icon: '♣', description: 'Race to empty your hand first' },
  'Luck':         { icon: '★', description: 'Pure chance — no decisions required' },
  'Counting':     { icon: '✦', description: 'Score points by reaching target totals' },
  'Solo':         { icon: '◆', description: 'Single player patience and solitaire games' },
  'Kids':         { icon: '●', description: 'Simple fun games for all ages' },
  'Fishing':      { icon: '◇', description: 'Capture cards from the table' },
  'Bluffing':     { icon: '◉', description: 'Deceive opponents to win' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Betting':      '#B85C4A',
  'Trick-taking': '#6B8C5E',
  'Matching':     '#C4873A',
  'Shedding':     '#7B6EA0',
  'Luck':         '#4A8C8C',
  'Counting':     '#8C6B4A',
  'Solo':         '#4A6B8C',
  'Kids':         '#8C4A6B',
  'Fishing':      '#6B8C4A',
  'Bluffing':     '#8C4A4A',
};

export default function CategoriesScreen() {
  const router = useRouter();

  const categories = Object.entries(
    GAMES.reduce((acc, game) => {
      if (!acc[game.category]) acc[game.category] = [];
      acc[game.category].push(game);
      return acc;
    }, {} as Record<string, typeof GAMES>)
  ).sort((a, b) => b[1].length - a[1].length);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>BROWSE BY</Text>
        <Text style={styles.title}>Categories</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.totalCount}>{GAMES.length} games across {categories.length} categories</Text>

      {categories.map(([category, games]) => {
        const info = CATEGORY_INFO[category] || { icon: '♠', description: '' };
        const color = CATEGORY_COLORS[category] || '#C4873A';
        const easy = games.filter(g => g.difficulty === 'Easy').length;
        const medium = games.filter(g => g.difficulty === 'Medium').length;
        const hard = games.filter(g => g.difficulty === 'Hard').length;

        return (
          <TouchableOpacity
            key={category}
            style={styles.categoryCard}
            onPress={() => router.push({
              pathname: '/(tabs)/category-detail',
              params: { category }
            })}>
            <View style={[styles.iconBox, { backgroundColor: color }]}>
              <Text style={styles.icon}>{info.icon}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardTop}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.gameCount}>{games.length} games</Text>
              </View>
              <Text style={styles.description}>{info.description}</Text>
              <View style={styles.diffRow}>
                {easy > 0 && <View style={[styles.diffPill, { backgroundColor: '#6B8C5E' }]}><Text style={styles.diffText}>{easy} Easy</Text></View>}
                {medium > 0 && <View style={[styles.diffPill, { backgroundColor: '#C4873A' }]}><Text style={styles.diffText}>{medium} Med</Text></View>}
                {hard > 0 && <View style={[styles.diffPill, { backgroundColor: '#B85C4A' }]}><Text style={styles.diffText}>{hard} Hard</Text></View>}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8', paddingTop: 60, paddingHorizontal: 20 },
  header: { marginBottom: 8 },
  subtitle: { fontSize: 11, fontWeight: '700', color: '#C4873A', letterSpacing: 4, marginBottom: 6 },
  title: { fontSize: 36, fontWeight: '800', color: '#2C2416', lineHeight: 42, letterSpacing: -0.5 },
  divider: { height: 3, width: 48, backgroundColor: '#C4873A', marginTop: 14, marginBottom: 16 },
  totalCount: { fontSize: 13, color: '#8C7B6B', marginBottom: 20, letterSpacing: 0.3 },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0D8CC',
    marginBottom: 12,
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: { fontSize: 22, color: '#fff' },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  categoryName: { fontSize: 17, fontWeight: '700', color: '#2C2416', letterSpacing: 0.2 },
  gameCount: { fontSize: 12, color: '#8C7B6B', fontWeight: '600' },
  description: { fontSize: 13, color: '#8C7B6B', marginBottom: 8, letterSpacing: 0.2 },
  diffRow: { flexDirection: 'row', gap: 6 },
  diffPill: { borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3 },
  diffText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});