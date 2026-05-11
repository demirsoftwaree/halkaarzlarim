import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, getDoc, doc, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { colors, s } from "@/lib/styles";

interface Haber { id: string; baslik: string; icerik?: string; ozet?: string; gorsel?: string; kategori?: string; tarih?: any; }

function formatTarih(t: any) {
  if (!t) return "";
  const d = t?.toDate ? t.toDate() : new Date(t);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function HaberDetay() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [haber, setHaber] = useState<Haber | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    // Önce document ID ile dene (web /haberler/${id} formatında yönlendiriyor)
    getDoc(doc(db, "haberler", slug))
      .then(async snap => {
        if (snap.exists()) {
          setHaber({ id: snap.id, ...snap.data() } as Haber);
        } else {
          // Bulamazsa slug field'ı ile ara
          const q = await getDocs(query(collection(db, "haberler"), where("slug", "==", slug), limit(1)));
          if (!q.empty) setHaber({ id: q.docs[0].id, ...q.docs[0].data() } as Haber);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <View style={[s.screen, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>;
  if (!haber) return <View style={[s.screen, s.center]}><Text style={s.bodyMuted}>Haber bulunamadı.</Text></View>;

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", flex: 1 }]} numberOfLines={1}>{haber.kategori || "Haber"}</Text>
      </View>
      <ScrollView style={s.flex1} showsVerticalScrollIndicator={false}>
        {haber.gorsel && <Image source={{ uri: haber.gorsel }} style={{ width: "100%", height: 208 }} resizeMode="cover" />}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          {haber.kategori && (
            <View style={{ backgroundColor: `${colors.green}20`, alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginBottom: 12 }}>
              <Text style={{ color: colors.green, fontSize: 12, fontWeight: "700" }}>{haber.kategori}</Text>
            </View>
          )}
          <Text style={[s.title, { fontSize: 22, lineHeight: 30, marginBottom: 8 }]}>{haber.baslik}</Text>
          <Text style={[s.caption, { marginBottom: 16 }]}>{formatTarih(haber.tarih)}</Text>
          {haber.icerik ? (
            <Text style={[s.bodyMuted, { fontSize: 16, lineHeight: 28 }]}>{haber.icerik}</Text>
          ) : haber.ozet ? (
            <Text style={[s.bodyMuted, { fontSize: 16, lineHeight: 28 }]}>{haber.ozet}</Text>
          ) : null}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
