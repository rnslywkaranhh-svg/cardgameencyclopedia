import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAMES } from '../../constants/games';

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#6B8C5E',
  Medium: '#C4873A',
  Hard: '#B85C4A',
};

const PLAYER_OPTIONS = ['Any', '1', '2', '3', '4', '5', '6+'];
const DIFFICULTY_OPTIONS = ['Any', 'Easy', 'Medium', 'Hard'];
const CATEGORY_OPTIONS = ['Any', 'Betting', 'Trick-taking', 'Matching', 'Shedding', 'Solo', 'Luck', 'Counting', 'Kids', 'Fishing', 'Bluffing'];

export default function RandomScreen() {
  const router = useRouter();
  const [players, setPlayers] = useState('Any');
  const [difficulty, setDifficulty] = useState('Any');
  const [category, setCategory] = useState('Any');
  const [suggestion, setSuggestion] = useState<typeof GAMES[0] | null>(null);
  const [noResults, setNoResults] = useState(false);

  const suggestGame = () => {
    let filtered = [...GAMES];

    if (difficulty !== 'Any') {
      filtered = filtered.filter(g => g.difficulty === difficulty);
    }

    if (category !== 'Any') {
      filtered = filtered.filter(g => g.category === category);
    }

    if (players !== 'Any') {
      filtered = filtered.filter(g => {
        const range = g.players;
        if (players === '6+') {
          const max = range.includes('-') ? parseInt(range.split('-')[1]) : parseInt(range);
          return max >= 6;
        }
        const count = parseInt(players);
        if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          return count >= min && count <= max;
        }
        return parseInt(range) === count;
      });
    }

    if (filtered.length === 0) {
      setNoResults(true);
      setSuggestion(null);
      return;
    }

    setNoResults(false);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setSuggestion(random);
  };

  const reset = () => {
    setPlayers('Any');
    setDifficulty('Any');
    setCategory('Any');
    setSuggestion(null);
    setNoResults(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>GAME NIGHT</Text>
        <Text style={styles.title}>Suggest{'\n'}a Game</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.sectionLabel}>NUMBER OF PLAYERS</Text>
      <View style={styles.optionRow}>
        {PLAYER_OPTIONS.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.optionPill, players === p && styles.optionPillActive]}
            onPress={() => setPlayers(p)}>
            <Text style={[styles.optionText, players === p && styles.optionTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>DIFFICULTY</Text>
      <View style={styles.optionRow}>
        {DIFFICULTY_OPTIONS.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.optionPill, difficulty === d && styles.optionPillActive]}
            onPress={() => setDifficulty(d)}>
            <Text style={[styles.optionText, difficulty === d && styles.optionTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>CATEGORY</Text>
      <View style={styles.optionRow}>
        {CATEGORY_OPTIONS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.optionPill, category === c && styles.optionPillActive]}
            onPress={() => setCategory(c)}>
            <Text style={[styles.optionText, category === c && styles.optionTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.suggestButton} onPress={suggestGame}>
        <Text style={styles.suggestButtonText}>✦ Suggest a Game</Text>
      </TouchableOpacity>

      {noResults && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No games match your filters — try broadening your search!</Text>
        </View>
      )}

      {suggestion && (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>WE SUGGEST</Text>
          <Text style={styles.resultName}>{suggestion.name}</Text>
          <View style={styles.divider} />
          <Text style={styles.resultDescription}>{suggestion.description}</Text>

          <View style={styles.resultMeta}>
            <View style={[styles.badge, { backgroundColor: DIFFICULTY_COLORS[suggestion.difficulty] }]}>
              <Text style={styles.badgeText}>{suggestion.difficulty.toUpperCase()}</Text>
            </View>
            <Text style={styles.metaText}>{suggestion.players} players</Text>
            <Text style={styles.metaText}>{suggestion.category}</Text>
          </View>

          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => router.push({
                pathname: '/(tabs)/game',
                params: { name: suggestion.name, category: suggestion.category, players: suggestion.players, difficulty: suggestion.difficulty }
              })}>
              <Text style={styles.viewButtonText}>View Rules →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.againButton} onPress={suggestGame}>
              <Text style={styles.againButtonText}>Try Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity onPress={reset} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset filters</Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E8', paddingTop: 60, paddingHorizontal: 20 },
  header: { marginBottom: 24 },
  subtitle: { fontSize: 11, fontWeight: '700', color: '#C4873A', letterSpacing: 4, marginBottom: 6 },
  title: { fontSize: 36, fontWeight: '800', color: '#2C2416', lineHeight: 42, letterSpacing: -0.5 },
  divider: { height: 3, width: 48, backgroundColor: '#C4873A', marginTop: 14, marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#8C7B6B', letterSpacing: 3, marginBottom: 10, marginTop: 8 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  optionPill: { borderRadius: 4, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0D8CC' },
  optionPillActive: { backgroundColor: '#C4873A', borderColor: '#C4873A' },
  optionText: { fontSize: 13, color: '#8C7B6B', fontWeight: '600' },
  optionTextActive: { color: '#fff' },
  suggestButton: { backgroundColor: '#2C2416', borderRadius: 4, padding: 18, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  suggestButtonText: { color: '#F5F0E8', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  noResults: { backgroundColor: '#fff', borderRadius: 4, padding: 16, borderWidth: 1, borderColor: '#E0D8CC', marginBottom: 16 },
  noResultsText: { color: '#8C7B6B', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  resultCard: { backgroundColor: '#fff', borderRadius: 4, padding: 20, borderWidth: 1, borderColor: '#E0D8CC', borderLeftWidth: 4, borderLeftColor: '#C4873A', marginBottom: 16 },
  resultLabel: { fontSize: 11, fontWeight: '700', color: '#C4873A', letterSpacing: 4, marginBottom: 8 },
  resultName: { fontSize: 32, fontWeight: '800', color: '#2C2416', letterSpacing: -0.5 },
  resultDescription: { color: '#4A3F35', fontSize: 15, lineHeight: 23, marginBottom: 16 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  badge: { borderRadius: 3, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  metaText: { color: '#8C7B6B', fontSize: 14 },
  resultButtons: { flexDirection: 'row', gap: 10 },
  viewButton: { flex: 1, backgroundColor: '#C4873A', borderRadius: 4, padding: 14, alignItems: 'center' },
  viewButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  againButton: { flex: 1, backgroundColor: '#EDE8DE', borderRadius: 4, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D4C9B8' },
  againButtonText: { color: '#2C2416', fontSize: 15, fontWeight: '700' },
  resetButton: { alignItems: 'center', paddingVertical: 10 },
  resetText: { color: '#8C7B6B', fontSize: 14 },
});