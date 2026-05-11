import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, s } from "@/lib/styles";
import { useWatchlist } from "@/lib/use-watchlist";
import { useAuth } from "@/lib/auth-context";

interface Arz { id: string; slug: string; sirketAdi: string; ticker: string; arsFiyatiAlt: number; arsFiyatiUst: number; durum: string; logo?: string; talepBaslangic?: string; talepBitis?: string; }

function ArzIcon({ logo, ticker }: { logo?: string; ticker: string }) {
  const [err, setErr] = useState(false);
  if (logo && !err) {
    return (
      <View style={[s.iconBox, { backgroundColor: "#fff", overflow: "hidden" }]}>
        <Image source={{ uri: logo }} style={{ width: 36, height: 36 }} onError={() => setErr(true)} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={s.iconBox}>
      <Text style={{ color: colors.green, fontWeight: "700", fontSize: 13 }}>{ticker?.slice(0, 2)}</Text>
    </View>
  );
}

const API = "https://halkaarzlarim.com/api/arzlar";
const DURUMLAR = ["Tümü", "aktif", "yaklasan"];
const DURUM_LABEL: Record<string, string> = { "Tümü": "Tümü", aktif: "Aktif", yaklasan: "Yaklaşan", tamamlandi: "Tamamlandı" };
const DURUM_COLOR: Record<string, string> = { aktif: colors.green, yaklasan: colors.blue, tamamlandi: colors.muted };

export default function Arzlar() {
  const router = useRouter();
  const [arzlar, setArzlar] = useState<Arz[]>([]);
  const [filtered, setFiltered] = useState<Arz[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [durum, setDurum] = useState("Tümü");
  const { user } = useAuth();
  const { isFollowing, toggle } = useWatchlist();

  async function handleToggle(arz: Arz) {
    const result = await toggle({ slug: arz.slug, sirketAdi: arz.sirketAdi, ticker: arz.ticker });
    if (result === "not_logged_in") {
      router.push("/giris");
    } else if (result === "limit_reached") {
      Alert.alert("Limit Doldu", "Ücretsiz hesapla en fazla 5 halka arz takip edebilirsin. Premium'a geç!");
    }
  }

  async function fetchData() {
    try {
      const res = await fetch(API);
      const json = await res.json();
      const SIRALAMA: Record<string, number> = { aktif: 0, yaklasan: 1, "basvuru-surecinde": 1, tamamlandi: 2, ertelendi: 3 };
      const data: Arz[] = (json.arzlar || [])
        .map((a: any, i: number) => ({ ...a, id: a.id || a.slug, _idx: i }))
        .sort((a: any, b: any) => {
          const sd = (SIRALAMA[a.durum] ?? 9) - (SIRALAMA[b.durum] ?? 9);
          if (sd !== 0) return sd;
          const dA = a.talepBitis || a.borsadaIslemGormeTarihi || a.talepBaslangic || "";
          const dB = b.talepBitis || b.borsadaIslemGormeTarihi || b.talepBaslangic || "";
          if (!dA && !dB) return a._idx - b._idx; // ikisi de tarih yok → API sırası
          if (!dA) return -1; // tarih yok → en başa
          if (!dB) return 1;
          return dB.localeCompare(dA); // yeniden eskiye
        });
      setArzlar(data); setFiltered(data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    let res = arzlar;
    if (durum !== "Tümü") res = res.filter(a => a.durum === durum);
    if (search) res = res.filter(a =>
      a.sirketAdi?.toLowerCase().includes(search.toLowerCase()) ||
      a.ticker?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(res);
  }, [search, durum, arzlar]);

  if (loading) return <View style={[s.screen, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>;

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.px4}>
        <Text style={[s.title, { marginTop: 16, marginBottom: 12 }]}>Halka Arzlar</Text>
        <View style={[s.row, { backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.dim} />
          <TextInput style={[{ flex: 1, color: colors.text, paddingVertical: 12, paddingHorizontal: 8, fontSize: 14 }]} placeholder="Şirket veya sembol ara..." placeholderTextColor={colors.dim} value={search} onChangeText={setSearch} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {DURUMLAR.map(d => (
            <TouchableOpacity key={d} onPress={() => setDurum(d)} style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: durum === d ? colors.green : colors.card, borderWidth: 1, borderColor: durum === d ? colors.green : colors.border }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: durum === d ? "#fff" : colors.muted }}>{DURUM_LABEL[d]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.green} />} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={[s.center, { paddingVertical: 64 }]}>
            <Ionicons name="search-outline" size={40} color={colors.dim} />
            <Text style={[s.bodyMuted, { marginTop: 12 }]}>Sonuç bulunamadı.</Text>
          </View>
        ) : filtered.map(arz => (
          <TouchableOpacity key={arz.id} onPress={() => router.push(`/arz/${arz.slug}`)} style={[s.card, s.mb3]}>
            <View style={[s.row, { justifyContent: "space-between" }]}>
              <View style={[s.row, s.gap3, { flex: 1 }]}>
                <ArzIcon logo={arz.logo} ticker={arz.ticker} />
                <View style={{ flex: 1 }}>
                  <Text style={s.body} numberOfLines={1}>{arz.sirketAdi}</Text>
                  <Text style={s.caption}>{arz.ticker}</Text>
                </View>
              </View>
              <View style={[s.row, { gap: 8, alignItems: "center" }]}>
                {arz.durum !== "tamamlandi" && (
                  <View style={[s.badge, { backgroundColor: `${DURUM_COLOR[arz.durum] || colors.muted}20` }]}>
                    <Text style={[s.badgeText, { color: DURUM_COLOR[arz.durum] || colors.muted }]}>{DURUM_LABEL[arz.durum] || arz.durum}</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => handleToggle(arz)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name={isFollowing(arz.slug) ? "star" : "star-outline"} size={20} color={isFollowing(arz.slug) ? colors.amber : colors.dim} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
