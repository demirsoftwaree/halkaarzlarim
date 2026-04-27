import { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { colors, s } from "@/lib/styles";

interface WatchlistItem { slug: string; ticker: string; sirketAdi: string; }

export default function TakipListem() {
  const router = useRouter();
  const { user } = useAuth();
  const [liste, setListe] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      getDocs(collection(db, "users", user.uid, "watchlist"))
        .then(snap => setListe(snap.docs.map(d => d.data() as WatchlistItem)))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [user])
  );

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Takip Listem</Text>
      </View>
      {loading ? (
        <View style={[s.flex1, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>
      ) : !user ? (
        <View style={[s.flex1, s.center, { paddingHorizontal: 32 }]}>
          <Ionicons name="lock-closed" size={40} color={colors.dim} />
          <Text style={[s.bodyMuted, { textAlign: "center", marginTop: 12 }]}>Takip listeni görmek için giriş yapmalısın.</Text>
          <TouchableOpacity onPress={() => router.push("/giris")} style={[s.btn, { marginTop: 16, paddingHorizontal: 24 }]}>
            <Text style={s.btnText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      ) : liste.length === 0 ? (
        <View style={[s.flex1, s.center, { paddingHorizontal: 32 }]}>
          <Ionicons name="bookmark-outline" size={40} color={colors.dim} />
          <Text style={[s.bodyMuted, { textAlign: "center", marginTop: 12 }]}>Henüz takip ettiğin arz yok.</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/arzlar")} style={[s.btn, { marginTop: 16, paddingHorizontal: 24 }]}>
            <Text style={s.btnText}>Arzları Keşfet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: 8 }}>
            {liste.map(item => (
              <TouchableOpacity key={item.slug} onPress={() => router.push(`/arz/${item.slug}`)}
                style={[s.card, s.row, { gap: 12, marginBottom: 12 }]}>
                <View style={[s.iconBox, { borderRadius: 12 }]}>
                  <Text style={{ color: colors.green, fontWeight: "700", fontSize: 13 }}>{item.ticker?.slice(0, 2)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.body, { fontWeight: "600" }]}>{item.ticker}</Text>
                  <Text style={s.caption}>{item.sirketAdi}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.dim} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
