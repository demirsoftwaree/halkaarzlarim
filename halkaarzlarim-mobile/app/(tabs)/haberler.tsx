import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, s } from "@/lib/styles";
import AdBanner from "@/components/AdBanner";

interface Haber { id: string; baslik: string; ozet?: string; gorsel?: string; kategori?: string; tarih?: any; slug?: string; yayinda?: boolean; }

const KATEGORİ_ETIKET: Record<string, string> = {
  "halka-arz":       "Halka Arz",
  "sirket-haberi":   "Şirket Haberi",
  "sirket-haberleri":"Şirket Haberi",
  "blog":            "Blog",
  "duyuru":          "Duyuru",
  "borsa":           "Borsa",
  "sermaye":         "Sermaye",
  "genel-kurul":     "Genel Kurul",
  "temettu":         "Temettü",
};

function fmt(t: any) {
  if (!t) return "";
  const d = t?.toDate ? t.toDate() : new Date(t);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function Haberler() {
  const router = useRouter();
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData() {
    try {
      const snap = await getDocs(query(collection(db, "haberler"), orderBy("tarih", "desc"), limit(30)));
      setHaberler(
        snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Haber))
          .filter(h => h.yayinda !== false)
      );
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }

  useEffect(() => { fetchData(); }, []);

  if (loading) return <View style={[s.screen, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>;

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.px4, { paddingTop: 16, paddingBottom: 8 }]}>
        <Text style={s.title}>Haberler & Blog</Text>
      </View>
      <AdBanner style={{ marginTop: 0, marginBottom: 4 }} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.green} />} showsVerticalScrollIndicator={false}>
        {haberler.map((h, i) => (
          <TouchableOpacity key={h.id} onPress={() => router.push(`/haber/${h.slug || h.id}`)} style={[i === 0 ? s.card : s.cardSm, s.mb3, { overflow: "hidden", padding: 0 }]}>
            {i === 0 && h.gorsel && <Image source={{ uri: h.gorsel }} style={{ width: "100%", height: 180 }} resizeMode="cover" />}
            <View style={{ padding: i === 0 ? 16 : 12, flexDirection: i === 0 ? "column" : "row", gap: 10 }}>
              {i !== 0 && h.gorsel && <Image source={{ uri: h.gorsel }} style={{ width: 72, height: 72, borderRadius: 10 }} resizeMode="cover" />}
              <View style={{ flex: 1 }}>
                {h.kategori && (
                  <Text style={[s.badgeText, { marginBottom: 4 }]}>
                    {KATEGORİ_ETIKET[h.kategori] ?? h.kategori}
                  </Text>
                )}
                <Text style={[s.body, { fontWeight: "600", lineHeight: 20 }]} numberOfLines={i === 0 ? 3 : 2}>{h.baslik}</Text>
                <Text style={[s.caption, { marginTop: 4 }]}>{fmt(h.tarih)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
