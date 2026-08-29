import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "score_keeper_state";
const MIN_SLOTS = 2;
const MAX_SLOTS = 8;

type Mode = "players" | "teams";

type Slot = {
  id: string;
  name: string;
  score: number;
};

type SavedState = {
  mode: Mode;
  slots: Slot[];
};

const defaultName = (mode: Mode, index: number): string =>
  mode === "players" ? `Player ${index + 1}` : `Team ${String.fromCharCode(65 + index)}`;

const makeSlots = (mode: Mode, count: number): Slot[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `slot-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: defaultName(mode, i),
    score: 0,
  }));

export default function ScoreKeeperScreen() {
  const [mode, setMode] = useState<Mode>("players");
  const [slots, setSlots] = useState<Slot[]>(() => makeSlots("players", 2));
  const [loaded, setLoaded] = useState(false);

  const [keypadOpen, setKeypadOpen] = useState(false);
  const [keypadTarget, setKeypadTarget] = useState<{ id: string; delta: number } | null>(null);
  const [keypadValue, setKeypadValue] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: SavedState = JSON.parse(raw);
          if (parsed?.mode && Array.isArray(parsed.slots) && parsed.slots.length >= MIN_SLOTS) {
            setMode(parsed.mode);
            setSlots(parsed.slots);
          }
        }
      } catch (e) {}
      finally { setLoaded(true); }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const state: SavedState = { mode, slots };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [mode, slots, loaded]);

  const changeMode = (nextMode: Mode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setSlots(prev =>
      prev.map((s, i) => {
        const oldDefault = defaultName(mode, i);
        const newDefault = defaultName(nextMode, i);
        return s.name === oldDefault ? { ...s, name: newDefault } : s;
      })
    );
  };

  const addSlot = () => {
    if (slots.length >= MAX_SLOTS) return;
    setSlots(prev => [
      ...prev,
      {
        id: `slot-${prev.length}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: defaultName(mode, prev.length),
        score: 0,
      },
    ]);
  };

  const removeSlot = () => {
    if (slots.length <= MIN_SLOTS) return;
    setSlots(prev => prev.slice(0, -1));
  };

  const renameSlot = (id: string, name: string) => {
    setSlots(prev => prev.map(s => (s.id === id ? { ...s, name } : s)));
  };

  const adjustScore = (id: string, delta: number) => {
    setSlots(prev => prev.map(s => (s.id === id ? { ...s, score: s.score + delta } : s)));
  };

  const openKeypad = (id: string, delta: number) => {
    setKeypadTarget({ id, delta });
    setKeypadValue("");
    setKeypadOpen(true);
  };

  const applyKeypad = () => {
    if (!keypadTarget) return;
    const amount = parseInt(keypadValue, 10);
    if (!isNaN(amount) && amount > 0) {
      adjustScore(keypadTarget.id, keypadTarget.delta * amount);
    }
    setKeypadOpen(false);
    setKeypadTarget(null);
    setKeypadValue("");
  };

  const reset = () => {
    setSlots(prev => prev.map(s => ({ ...s, score: 0 })));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>KEEP SCORE</Text>
        <Text style={styles.title}>Score Keeper</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, mode === "players" && styles.modeButtonActive]}
          onPress={() => changeMode("players")}
        >
          <Text style={[styles.modeText, mode === "players" && styles.modeTextActive]}>PLAYERS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === "teams" && styles.modeButtonActive]}
          onPress={() => changeMode("teams")}
        >
          <Text style={[styles.modeText, mode === "teams" && styles.modeTextActive]}>TEAMS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.countLabel}>
          {slots.length} {mode === "players" ? "PLAYERS" : "TEAMS"}
        </Text>
        <View style={styles.countButtons}>
          <TouchableOpacity
            style={[styles.countButton, slots.length <= MIN_SLOTS && styles.countButtonDisabled]}
            onPress={removeSlot}
            disabled={slots.length <= MIN_SLOTS}
          >
            <Text style={styles.countButtonText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countButton, slots.length >= MAX_SLOTS && styles.countButtonDisabled]}
            onPress={addSlot}
            disabled={slots.length >= MAX_SLOTS}
          >
            <Text style={styles.countButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.slotList} contentContainerStyle={styles.slotListContent}>
        {slots.map(slot => (
          <View key={slot.id} style={styles.slotCard}>
            <View style={styles.slotAccent} />
            <TextInput
              style={styles.slotName}
              value={slot.name}
              onChangeText={text => renameSlot(slot.id, text)}
              selectTextOnFocus
              placeholder={defaultName(mode, 0)}
              placeholderTextColor="#9E8E7E"
            />
            <View style={styles.scoreRow}>
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => adjustScore(slot.id, -1)}
                onLongPress={() => openKeypad(slot.id, -1)}
                delayLongPress={300}
              >
                <Text style={styles.scoreButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.scoreValue}>{slot.score}</Text>
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => adjustScore(slot.id, 1)}
                onLongPress={() => openKeypad(slot.id, 1)}
                delayLongPress={300}
              >
                <Text style={styles.scoreButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.resetButton} onPress={reset}>
          <Text style={styles.resetButtonText}>RESET SCORES</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Tap a name to rename. Long-press +/− for a keypad.</Text>
      </ScrollView>

      <Modal
        visible={keypadOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setKeypadOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {keypadTarget?.delta === 1 ? "Add to score" : "Subtract from score"}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={keypadValue}
              onChangeText={setKeypadValue}
              keyboardType="number-pad"
              autoFocus
              placeholder="0"
              placeholderTextColor="#9E8E7E"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setKeypadOpen(false)}
              >
                <Text style={styles.modalButtonCancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonApply]}
                onPress={applyKeypad}
              >
                <Text style={styles.modalButtonApplyText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F0E8", paddingTop: 60, paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  subtitle: { fontSize: 11, fontWeight: "700", color: "#C4873A", letterSpacing: 4, marginBottom: 6 },
  title: { fontSize: 36, fontWeight: "800", color: "#2C2416", lineHeight: 42, letterSpacing: -0.5 },
  divider: { height: 3, width: 48, backgroundColor: "#C4873A", marginTop: 14 },
  modeToggle: { flexDirection: "row", backgroundColor: "#EDE8DE", borderRadius: 4, borderWidth: 1, borderColor: "#D4C9B8", padding: 3, marginBottom: 16 },
  modeButton: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 3 },
  modeButtonActive: { backgroundColor: "#C4873A" },
  modeText: { fontSize: 12, fontWeight: "700", color: "#8C7B6B", letterSpacing: 2 },
  modeTextActive: { color: "#fff" },
  countRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingHorizontal: 4 },
  countLabel: { fontSize: 12, fontWeight: "700", color: "#8C7B6B", letterSpacing: 2 },
  countButtons: { flexDirection: "row", gap: 10 },
  countButton: { width: 32, height: 32, borderRadius: 3, backgroundColor: "#EDE8DE", borderWidth: 1, borderColor: "#D4C9B8", alignItems: "center", justifyContent: "center" },
  countButtonDisabled: { opacity: 0.4 },
  countButtonText: { fontSize: 20, fontWeight: "700", color: "#4A3F35", lineHeight: 22 },
  slotList: { flex: 1 },
  slotListContent: { paddingBottom: 40 },
  slotCard: { backgroundColor: "#fff", borderRadius: 4, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: "#E0D8CC", overflow: "hidden" },
  slotAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4, backgroundColor: "#C4873A" },
  slotName: { color: "#2C2416", fontSize: 17, fontWeight: "700", letterSpacing: 0.2, paddingLeft: 8, paddingVertical: 4, marginBottom: 12 },
  scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 8 },
  scoreButton: { width: 52, height: 52, borderRadius: 4, backgroundColor: "#C4873A", alignItems: "center", justifyContent: "center" },
  scoreButtonText: { color: "#fff", fontSize: 28, fontWeight: "700", lineHeight: 30 },
  scoreValue: { color: "#2C2416", fontSize: 40, fontWeight: "800", letterSpacing: -1, minWidth: 80, textAlign: "center" },
  resetButton: { marginTop: 12, padding: 14, alignItems: "center", borderRadius: 4, borderWidth: 1, borderColor: "#B85C4A" },
  resetButtonText: { color: "#B85C4A", fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  hint: { marginTop: 12, textAlign: "center", color: "#8C7B6B", fontSize: 11, letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(44, 36, 22, 0.5)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard: { backgroundColor: "#F5F0E8", borderRadius: 6, padding: 22, width: "100%", maxWidth: 360, borderWidth: 1, borderColor: "#D4C9B8" },
  modalTitle: { fontSize: 12, fontWeight: "700", color: "#C4873A", letterSpacing: 3, marginBottom: 14, textAlign: "center" },
  modalInput: { backgroundColor: "#fff", borderRadius: 4, borderWidth: 1, borderColor: "#D4C9B8", padding: 14, fontSize: 28, fontWeight: "700", color: "#2C2416", textAlign: "center", marginBottom: 16 },
  modalButtons: { flexDirection: "row", gap: 10 },
  modalButton: { flex: 1, padding: 12, alignItems: "center", borderRadius: 4 },
  modalButtonCancel: { borderWidth: 1, borderColor: "#D4C9B8" },
  modalButtonCancelText: { color: "#8C7B6B", fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  modalButtonApply: { backgroundColor: "#C4873A" },
  modalButtonApplyText: { color: "#fff", fontSize: 12, fontWeight: "700", letterSpacing: 2 },
});
