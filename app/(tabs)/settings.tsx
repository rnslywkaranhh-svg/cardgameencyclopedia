import * as WebBrowser from "expo-web-browser";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { usePurchase } from "../../constants/usePurchase";

export default function SettingsScreen() {
  const {
    isAdFree,
    loading,
    purchasing,
    price,
    purchaseAdFree,
    restorePurchases,
  } = usePurchase();

  const handlePurchase = () => {
    Alert.alert(
      "Remove Ads",
      `Purchase ad-free for ${price}? This is a one-time purchase.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Purchase", onPress: purchaseAdFree },
      ],
    );
  };

  const handleRestore = () => {
    Alert.alert("Restore Purchase", "Restore your previous ad-free purchase?", [
      { text: "Cancel", style: "cancel" },
      { text: "Restore", onPress: restorePurchases },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>APP</Text>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUPPORT THE APP</Text>

        {loading ? (
          <ActivityIndicator color="#C4873A" />
        ) : isAdFree ? (
          <View style={styles.adFreeCard}>
            <Text style={styles.adFreeIcon}>♥</Text>
            <Text style={styles.adFreeTitle}>Ad-Free Activated</Text>
            <Text style={styles.adFreeText}>
              Thank you for supporting Card Game Encyclopedia!
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.upgradeCard}>
              <View style={styles.upgradeTop}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.upgradeName}>Remove Ads</Text>
                  <Text style={styles.upgradeDesc}>
                    Enjoy the app without any advertisements. One-time purchase,
                    never expires.
                  </Text>
                </View>
                <Text style={styles.upgradePrice}>{price}</Text>
              </View>
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.purchaseButtonText}>Purchase</Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
            >
              <Text style={styles.restoreText}>Restore Previous Purchase</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.2.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Games</Text>
          <Text style={styles.infoValue}>100+</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>Randeelyn Koshman</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LEGAL</Text>
        <TouchableOpacity
          style={styles.legalRow}
          onPress={() =>
            WebBrowser.openBrowserAsync("https://cardgameencyclopedia.carrd.co")
          }
        >
          <Text style={styles.legalText}>Privacy Policy</Text>
          <Text style={styles.legalArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0E8",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: { marginBottom: 24 },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C4873A",
    letterSpacing: 4,
    marginBottom: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#2C2416",
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  divider: {
    height: 3,
    width: 48,
    backgroundColor: "#C4873A",
    marginTop: 14,
    marginBottom: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E0D8CC",
    borderLeftWidth: 4,
    borderLeftColor: "#C4873A",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C4873A",
    letterSpacing: 3,
    marginBottom: 14,
  },
  adFreeCard: { alignItems: "center", padding: 20 },
  adFreeIcon: { fontSize: 36, color: "#C4873A", marginBottom: 10 },
  adFreeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2416",
    marginBottom: 6,
  },
  adFreeText: { fontSize: 14, color: "#8C7B6B", textAlign: "center" },
  upgradeCard: { marginBottom: 12 },
  upgradeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  upgradeName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2C2416",
    marginBottom: 4,
  },
  upgradeDesc: { fontSize: 13, color: "#8C7B6B", lineHeight: 18 },
  upgradePrice: { fontSize: 20, fontWeight: "800", color: "#C4873A" },
  purchaseButton: {
    backgroundColor: "#C4873A",
    borderRadius: 4,
    padding: 14,
    alignItems: "center",
  },
  purchaseButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  restoreButton: { alignItems: "center", paddingVertical: 10 },
  restoreText: { color: "#8C7B6B", fontSize: 14 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F0E8",
  },
  infoLabel: { fontSize: 15, color: "#4A3F35" },
  infoValue: { fontSize: 15, color: "#8C7B6B" },
  legalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  legalText: { fontSize: 15, color: "#4A3F35" },
  legalArrow: { fontSize: 15, color: "#C4873A" },
});
