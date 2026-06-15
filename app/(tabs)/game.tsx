import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { GAMES } from "../../constants/games";
import { AD_UNIT_IDS } from "../../constants/monetization";
import { useAdFree } from "../../constants/useAdFree";

const FAVOURITES_KEY = "favourite_games";
const GAME_DETAILS = Object.fromEntries(GAMES.map((g) => [g.name, g]));
const GAME_VIDEOS: Record<string, string> = {
  Poker: "https://www.youtube.com/watch?v=bOyZbYjUcZg",
  Blackjack:
    "https://www.youtube.com/watch?v=0-XIjDr33Mo&list=PLEAEB55DAA2B75812&index=9",
  Rummy:
    "https://www.youtube.com/watch?v=epu7PrC-GQs&list=PLEAEB55DAA2B75812&index=2",
  "Gin Rummy": "https://www.youtube.com/watch?v=wqrqlCyAHP4",
  Bridge: "https://www.youtube.com/watch?v=2IomnCvxWzM",
  Hearts: "https://www.youtube.com/watch?v=RSr_89K_65c",
  Spades:
    "https://www.youtube.com/watch?v=oQG29Lp6AbA&list=PLEAEB55DAA2B75812&index=5",
  Euchre:
    "https://www.youtube.com/watch?v=XBC_lNo-CsE&list=PLEAEB55DAA2B75812&index=3",
  Cribbage: "https://www.youtube.com/watch?v=tkfRm5pZr4",
  Solitaire:
    "https://www.youtube.com/watch?v=WbbQL7-U-ic&list=PLEAEB55DAA2B75812&index=4",
  FreeCell: "https://www.youtube.com/watch?v=vZWvggL7IuU",
  "Spider Solitaire": "https://www.youtube.com/watch?v=nAusmINetls",
  Canasta:
    "https://www.youtube.com/watch?v=7g4c_BU-vc8&list=PLEAEB55DAA2B75812&index=8",
  Pinochle: "https://www.youtube.com/watch?v=HSpIXNd5uec",
  Whist: "https://www.youtube.com/watch?v=9v5UxlUg55Y",
  War: "https://www.youtube.com/watch?v=yX-jOVer758",
  "Go Fish":
    "https://www.youtube.com/watch?v=rxwQrOUsKWI&list=PLEAEB55DAA2B75812&index=6",
  "Crazy Eights":
    "https://www.youtube.com/watch?v=Gfn_fVpwh_w&list=PLEAEB55DAA2B75812&index=2",
  Uno: "https://www.youtube.com/watch?v=jxKtz0s_lBc",
  Snap: "https://www.youtube.com/watch?v=Ea_fWGSv2y8",
  "Old Maid": "https://www.youtube.com/watch?v=2k1pHpGPMdc",
  Memory: "https://www.youtube.com/watch?v=492bM_dhdR4",
  "Slap Jack": "https://www.youtube.com/watch?v=Qc7aQfGU58w",
  Baccarat: "https://www.youtube.com/watch?v=kIKYcW9R2DI",
  Cheat: "https://www.youtube.com/watch?v=lZHLtWfOmLo&t=49s",
  Palace: "https://www.youtube.com/watch?v=LVFIpjNQ7R4",
  President: "https://www.youtube.com/watch?v=HYcH0bzsmsI",
  Pyramid: "https://www.youtube.com/watch?v=dnRlETGqHec",
  Durak: "https://www.youtube.com/watch?v=3JagmUmUJOc",
  Scopa: "https://www.youtube.com/watch?v=eAzxunbj88Y",
  Yaniv: "https://www.youtube.com/watch?v=2dn__T5KWAA",
  Kemps: "https://www.youtube.com/watch?v=FHuIcGzNgYg",
  Spoons: "https://www.youtube.com/watch?v=P5apwK711_8&t=53s",
  "Egyptian Rat Screw":
    "https://www.youtube.com/watch?v=Y1B4I20SvUA&list=PLEAEB55DAA2B75812&index=7",
  Spit: "https://www.youtube.com/watch?v=yv7k6XYzgSo",
  Nerts: "https://www.youtube.com/watch?v=YOtd1Q8JLKI",
  Skat: "https://www.youtube.com/watch?v=RyiDypsr_cI",
  Tichu: "https://www.youtube.com/watch?v=13pepM10vsI",
  Briscola: "https://www.youtube.com/watch?v=251jrlmDSq8",
  "Mau Mau": "https://www.youtube.com/watch?v=0BF6nkd-H-A",
  "Big Two": "https://www.youtube.com/watch?v=U28DKiVQpVM",
  Sevens: "https://www.youtube.com/watch?v=zAhNv7xpeYg",
  "Thirty One": "https://www.youtube.com/watch?v=xW9FBHR-rLs",
  "Ninety Nine": "https://www.youtube.com/watch?v=4NqsqryYfQQ",
  Golf: "https://www.youtube.com/watch?v=BFNHKZg3VfI",
  "Klondike solitaire": "https://www.youtube.com/watch?v=6dMzrcqCwaQ",
  "Yukon solitaire": "https://www.youtube.com/watch?v=-yJS8bFSkDA",
  "Canfield solitaire": "https://www.youtube.com/watch?v=EwcHlxtCt9U",
  "Accordian solitaire": "https://www.youtube.com/watch?v=9mMP_3e5LaE",
  "Phase 10": "https://www.youtube.com/watch?v=iw8Du4ksiBc",
  "Spite and Malice": "https://www.youtube.com/watch?v=quQIMZPqnHM",
  Donkey: "https://www.youtube.com/watch?v=2EBCMaw9cJc",
  Pig: "https://www.youtube.com/watch?v=8IKgF2YYkAs",
  "Beggar My Neighbour": "https://www.youtube.com/watch?v=A9zYqvS39AY",
  "Ranter Go Round": "https://www.youtube.com/watch?v=9h5cch4WeNU",
  Casino: "https://www.youtube.com/watch?v=WrdSVHMYocc",
  Bastra: "https://www.youtube.com/watch?v=D-CXj5lChvs",
  Seep: "https://www.youtube.com/watch?v=ylVfR_9E7P8",
  Sheepshead: "https://www.youtube.com/watch?v=DcOUGJfI3hA",
  Bezique: "https://www.youtube.com/watch?v=fiB5hwU8ksk",
  Piquet: "https://www.youtube.com/watch?v=Z1bShGQOwrM",
  Truco: "https://www.youtube.com/watch?v=I_nZY0KGbXo",
  Mus: "https://www.youtube.com/watch?v=w4hB1pdCTws",
  Sueca: "https://www.youtube.com/watch?v=UKCijAAIOe8",
  Tressette: "https://www.youtube.com/watch?v=73t4yReh4TM",
  Scopone: "https://www.youtube.com/watch?v=AFC7xgqxWJs",
  Cuarenta: "https://www.youtube.com/watch?v=gVELRQGOxCM",
  Conquian: "https://www.youtube.com/watch?v=Vq00jSkm96I",
  Tonk: "https://www.youtube.com/watch?v=-Yc1Gk8tyU4",
  "Rummy 500": "https://www.youtube.com/watch?v=q00W9AdcRwM",
  "Liverpool Rummy": "https://www.youtube.com/watch?v=wPHP5epzHXU",
  Kalooki: "https://www.youtube.com/watch?v=2ibg2UcQ22E",
  "Coon Can": "https://www.youtube.com/watch?v=JNPbOJVDCBA",
  "Pan Panguingue": "https://www.youtube.com/watch?v=P1UjUBlm6Us",
  Zwicker: "https://www.youtube.com/watch?v=T-HB3DzZvAs",
  Schwimmen: "https://www.youtube.com/watch?v=Bw5CJGuC-X0",
  "Cambio Cabo": "https://www.youtube.com/watch?v=FgsNAMP8te4",
  "Dobble Spot It": "https://www.youtube.com/watch?v=n3s_H3EfrPg",
  "Skull King": "https://www.youtube.com/watch?v=GKCeKMEI1ts",
  Blackout: "https://www.youtube.com/watch?v=Lay6MXQu2_Y",
  "Auction Pitch": "https://www.youtube.com/watch?v=hPeKikwWGGw",
  Pedro: "https://www.youtube.com/watch?v=j4hGjq2WpUM",
  "Red Dog": "https://www.youtube.com/watch?v=HpeRTWNBH28",
  Kaiser: "https://www.youtube.com/watch?v=f0NlQs9cOUI&t=318s",
  "Les Rois": "https://www.youtube.com/watch?v=f0NlQs9cOUI&t=318s",
  "500": "https://www.youtube.com/watch?v=9vrPn--Bj2w",
  "Sergeant Major": "https://www.youtube.com/watch?v=QYxxYdGmvxA",
  "Forty-Fives": "https://www.youtube.com/watch?v=304xcJsMCYw",
  "Bid Whist": "https://www.youtube.com/watch?v=94DsHfr1Jbo",
  "Hand and Foot": "https://www.youtube.com/watch?v=owuxotiNjI4",
  "Knock Rummy": "https://www.youtube.com/watch?v=6ZRnMbqKUhI",
};
const GAME_PLAY_LINKS: Record<string, string> = {
  // cardgames.io — trick-taking
  Bridge: "https://cardgames.io/bridge/",
  Euchre: "https://cardgames.io/euchre/",
  Hearts: "https://cardgames.io/hearts/",
  Pinochle: "https://cardgames.io/pinochle/",
  Skat: "https://cardgames.io/skat/",
  Spades: "https://cardgames.io/spades/",
  Whist: "https://cardgames.io/whist/",

  // cardgames.io — card games
  Canasta: "https://cardgames.io/canasta/",
  "Crazy Eights": "https://cardgames.io/crazyeights/",
  Cribbage: "https://cardgames.io/cribbage/",
  "Gin Rummy": "https://cardgames.io/ginrummy/",
  "Go Fish": "https://cardgames.io/gofish/",
  Rummy: "https://cardgames.io/rummy/",
  Spit: "https://cardgames.io/spit/",
  War: "https://cardgames.io/war/",

  // cardgames.io — solitaires
  Solitaire: "https://cardgames.io/solitaire/",
  "Klondike solitaire": "https://cardgames.io/solitaire/",
  FreeCell: "https://cardgames.io/freecell/",
  "Spider Solitaire": "https://cardgames.io/spidersolitaire/",
  "Yukon solitaire": "https://cardgames.io/yukonsolitaire/",
  "Canfield solitaire": "https://cardgames.io/canfieldsolitaire/",
  Pyramid: "https://cardgames.io/pyramidsolitaire/",
  Golf: "https://cardgames.io/golfsolitaire/",

  // solitaired.com — niche solitaire fallback
  "Accordian solitaire": "https://solitaired.com/accordion",
};
const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#6B8C5E",
  Medium: "#C4873A",
  Hard: "#B85C4A",
};

export default function GameScreen() {
  const { name, category, players, difficulty } = useLocalSearchParams<{
    name: string;
    category: string;
    players: string;
    difficulty: string;
  }>();
  const router = useRouter();
  const { isAdFree } = useAdFree();
  const details = GAME_DETAILS[name] || null;
  const videoUrl = GAME_VIDEOS[name] || null;
  const playUrl = GAME_PLAY_LINKS[name] || null;
  const gameId = details?.id;

  const [isFavourite, setIsFavourite] = useState(false);

  // Load favourite status when screen opens
  useEffect(() => {
    if (!gameId) return;
    AsyncStorage.getItem(FAVOURITES_KEY).then((value) => {
      const ids: string[] = value ? JSON.parse(value) : [];
      setIsFavourite(ids.includes(gameId));
    });
  }, [gameId]);

  // Toggle favourite on/off
  const toggleFavourite = async () => {
    if (!gameId) return;
    const value = await AsyncStorage.getItem(FAVOURITES_KEY);
    const ids: string[] = value ? JSON.parse(value) : [];
    let updated: string[];
    if (ids.includes(gameId)) {
      updated = ids.filter((id) => id !== gameId);
      setIsFavourite(false);
    } else {
      updated = [...ids, gameId];
      setIsFavourite(true);
    }
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← All Games</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={toggleFavourite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={[
              styles.heartIcon,
              { color: isFavourite ? "#C4873A" : "#8C7B6B" },
            ]}
          >
            {isFavourite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.eyebrow}>{category?.toUpperCase()}</Text>
      <Text style={styles.title}>{name}</Text>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: DIFFICULTY_COLORS[difficulty] || "#888" },
          ]}
        >
          <Text style={styles.badgeText}>{difficulty?.toUpperCase()}</Text>
        </View>
        <Text style={styles.meta}>{players} players</Text>
      </View>

      {details ? (
        <>
          {videoUrl && (
            <TouchableOpacity
              style={styles.videoButton}
              onPress={() => WebBrowser.openBrowserAsync(videoUrl)}
            >
              <View style={styles.videoButtonInner}>
                <Text style={styles.videoButtonIcon}>▶</Text>
                <View>
                  <Text style={styles.videoButtonTitle}>Watch How to Play</Text>
                  <Text style={styles.videoButtonSub}>Opens YouTube video</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          {playUrl && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => WebBrowser.openBrowserAsync(playUrl)}
            >
              <View style={styles.videoButtonInner}>
                <Text style={styles.videoButtonIcon}>♠</Text>
                <View>
                  <Text style={styles.videoButtonTitle}>Play Online</Text>
                  <Text style={styles.videoButtonSub}>Opens in browser</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.description}>{details.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objective</Text>
            <Text style={styles.sectionText}>{details.objective}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deck</Text>
            <Text style={styles.sectionText}>{details.deck}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Play</Text>
            {details.rules.map((rule, i) => (
              <View key={i} style={styles.ruleRow}>
                <Text style={styles.ruleNumber}>{i + 1}</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips & Strategy</Text>
            {details.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text style={styles.tipBullet}>—</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionText}>Detailed rules coming soon.</Text>
        </View>
      )}

      {!isAdFree && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : AD_UNIT_IDS.banner}
            size={BannerAdSize.BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      )}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0E8",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {},
  backText: {
    color: "#C4873A",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  heartButton: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 30,
    fontWeight: "600",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: "#C4873A",
    letterSpacing: 4,
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#2C2416",
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  divider: {
    height: 3,
    width: 48,
    backgroundColor: "#C4873A",
    marginTop: 14,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  badge: { borderRadius: 3, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  meta: { color: "#8C7B6B", fontSize: 14, letterSpacing: 0.3 },
  description: {
    color: "#4A3F35",
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 24,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 18,
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
    textTransform: "uppercase",
    marginBottom: 12,
  },
  sectionText: { color: "#4A3F35", fontSize: 15, lineHeight: 24 },
  ruleRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  ruleNumber: { color: "#C4873A", fontWeight: "800", fontSize: 15, width: 20 },
  ruleText: { color: "#4A3F35", fontSize: 15, lineHeight: 23, flex: 1 },
  tipRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  tipBullet: { color: "#C4873A", fontSize: 16, fontWeight: "700" },
  tipText: {
    color: "#4A3F35",
    fontSize: 15,
    lineHeight: 23,
    flex: 1,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  videoButton: {
    backgroundColor: "#C4873A",
    borderRadius: 4,
    padding: 16,
    marginBottom: 14,
  },
  playButton: {
    backgroundColor: "#2C2416",
    borderRadius: 4,
    padding: 16,
    marginBottom: 14,
  },
  videoButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  videoButtonIcon: {
    fontSize: 24,
    color: "#fff",
  },
  videoButtonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  videoButtonSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  adContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
