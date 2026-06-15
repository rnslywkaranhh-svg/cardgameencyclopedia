import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { GAMES } from '../../constants/games';

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: '#6B8C5E',
  Medium: '#C4873A',
  Hard: '#B85C4A',
};

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filtered = GAMES.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>THE COMPLETE</Text>
        <Text style={styles.title}>Card Game{'\n'}Encyclopedia</Text>
        <View style={styles.divider} />
      </View>
      <TextInput
        style={styles.search}
        placeholder="Search games or categories..."
        placeholderTextColor="#9E8E7E"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C4873A',
    letterSpacing: 4,
    marginBottom: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2C2416',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  divider: {
    height: 3,
    width: 48,
    backgroundColor: '#C4873A',
    marginTop: 14,
  },
  search: {
    backgroundColor: '#EDE8DE',
    color: '#2C2416',
    borderRadius: 4,
    padding: 13,
    fontSize: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D4C9B8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D8CC',
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#C4873A',
  },
  cardLeft: {
    flex: 1,
    paddingLeft: 12,
  },
  gameName: {
    color: '#2C2416',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  category: {
    color: '#8C7B6B',
    fontSize: 13,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  badge: {
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  separator: { height: 10 },
});