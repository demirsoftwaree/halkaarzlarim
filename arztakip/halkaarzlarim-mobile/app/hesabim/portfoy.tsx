import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { colors, s } from "@/lib/styles";

interface PortfoyKayit {
  id: string; ticker: string; sirketAdi: string; slug: string;
  lotSayisi: number; alisFiyati: number; satisFiyati?: number; satisTarihi?: string;
}

function fmt(n: number) { return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function Portfoy() {
  const router = useRouter();
  const { user, isPremium } = useAuth();
  const [kayitlar, setKayitlar] = useState<PortfoyKayit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getDocs(collection(db, "users", user.uid, "portfolyo"))
      .then(snap => {
        const data = snap.docs.map(d => d.data() as PortfoyKayit);
        data.sort((a, b) => a.ticker.localeCompare(b.ticker));
        setKayitlar(data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const toplamMaliyet = kayitlar.reduce((s, k) => s + k.alisFiyati * k.lotSayisi, 0);
  const toplamKar = kayitlar.reduce((s, k) => {
    if (!k.satisFiyati) return s;
    return s + (k.satisFiyati - k.alisFiyati) * k.lotSayisi;
  }, 0);

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Portföyüm</Text>
      </View>

      {loading ? (
        <View style={[s.flex1, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>
      ) : !user ? (
        <View style={[s.flex1, s.center, { paddingHorizontal: 32 }]}>
          <Ionicons name="lock-closed" size={40} color={colors.dim} />
          <Text style={[s.bodyMuted, { textAlign: "center", marginTop: 12 }]}>Portföyünü görmek için giriş yapmalısın.</Text>
          <TouchableOpacity onPress={() => router.push("/giris")} style={[s.btn, { marginTop: 16, paddingHorizontal: 24 }]}>
            <Text style={s.btnText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>

          {/* Ücretsiz kullanıcı limit göstergesi */}
          {!isPremium && (
            <TouchableOpacity
              onPress={() => router.push("/premium")}
              style={{ marginTop: 10, marginBottom: 4, backgroundColor: `${colors.amber}10`, borderRadius: 12, borderWidth: 1, borderColor: `${colors.amber}25`, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons name="star" size={18} color={colors.amber} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.amber }}>
                  {kayitlar.length}/3 portföy kullanıldı
                </Text>
                <Text style={{ fontSize: 11, color: colors.dim, marginTop: 1 }}>
                  Sınırsız portföy için Premium'a geç
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.amber }}>→</Text>
            </TouchableOpacity>
          )}

          {kayitlar.length > 0 && (
            <View style={[s.card, { marginTop: 8, marginBottom: 16 }]}>
              <Text style={[s.caption, { marginBottom: 12 }]}>Portföy Özeti</Text>
              <View style={[s.row, { justifyContent: "space-between" }]}>
                <View style={s.center}>
                  <Text style={s.caption}>Toplam Maliyet</Text>
                  <Text style={[s.body, { fontWeight: "700", marginTop: 2 }]}>₺{fmt(toplamMaliyet)}</Text>
                </View>
                <View style={s.center}>
                  <Text style={s.caption}>Net Kâr/Zarar</Text>
                  <Text style={{ fontWeight: "700", marginTop: 2, color: toplamKar >= 0 ? colors.green : colors.red }}>
                    {toplamKar >= 0 ? "+" : ""}₺{fmt(toplamKar)}
                  </Text>
                </View>
                <View style={s.center}>
                  <Text style={s.caption}>Kayıt</Text>
                  <Text style={[s.body, { fontWeight: "700", marginTop: 2 }]}>{isPremium ? kayitlar.length : Math.min(kayitlar.length, 3)}</Text>
                </View>
              </View>
            </View>
          )}

          {kayitlar.length === 0 ? (
            <View style={[s.center, { paddingVertical: 64 }]}>
              <Ionicons name="pie-chart-outline" size={40} color={colors.dim} />
              <Text style={[s.bodyMuted, { textAlign: "center", marginTop: 12 }]}>Henüz kayıt yok.</Text>
              <Text style={[s.caption, { marginTop: 4 }]}>Web sitesinden ekleyebilirsin.</Text>
            </View>
          ) : (isPremium ? kayitlar : kayitlar.slice(0, 3)).map(k => {
            const maliyet = k.alisFiyati * k.lotSayisi;
            const kar = k.satisFiyati ? (k.satisFiyati - k.alisFiyati) * k.lotSayisi : null;
            return (
              <View key={k.id} style={[s.card, { marginBottom: 12 }]}>
                <View style={[s.row, { justifyContent: "space-between", marginBottom: 8 }]}>
                  <View style={[s.row, { gap: 10 }]}>
                    <View style={[s.iconBox, { width: 36, height: 36, borderRadius: 10 }]}>
                      <Text style={{ color: colors.green, fontWeight: "700", fontSize: 11 }}>{k.ticker?.slice(0, 2)}</Text>
                    </View>
                    <View>
                      <Text style={[s.body, { fontWeight: "700" }]}>{k.ticker}</Text>
                      <Text style={s.caption} numberOfLines={1}>{k.sirketAdi}</Text>
                    </View>
                  </View>
                  <View style={[s.row, { gap: 8 }]}>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: k.satisFiyati ? colors.border : `${colors.green}20` }}>
                      <Text style={{ fontSize: 11, color: k.satisFiyati ? colors.muted : colors.green }}>{k.satisFiyati ? "Satıldı" : "Elde"}</Text>
                    </View>
                    {kar !== null && (
                      <Text style={{ fontWeight: "700", color: kar >= 0 ? colors.green : colors.red }}>
                        {kar >= 0 ? "+" : ""}₺{fmt(kar)}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
                  <Text style={s.caption}>{k.lotSayisi} lot</Text>
                  <Text style={s.caption}>Alış: ₺{fmt(k.alisFiyati)}</Text>
                  <Text style={s.caption}>Maliyet: ₺{fmt(maliyet)}</Text>
                  {k.satisFiyati && <Text style={s.caption}>Satış: ₺{fmt(k.satisFiyati)}</Text>}
                </View>
              </View>
            );
          })}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
