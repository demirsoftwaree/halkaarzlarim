import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

const TABLO = [1,2,3,4,5,6,7,8,9,10].map(t => ({
  tavan: t,
  carpan: Math.pow(1.1, t),
  getiri: (Math.pow(1.1, t) - 1) * 100,
}));

export default function TavanNedir() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Tavan Nedir?</Text>
      </View>
      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>
        <View style={[s.card, { marginTop: 8, marginBottom: 12 }]}>
          <Text style={{ color: colors.green, fontWeight: "700", marginBottom: 8 }}>Tavan Kavramı</Text>
          <Text style={[s.bodyMuted, { lineHeight: 24 }]}>
            Borsa İstanbul'da bir hisse senedi, günde en fazla %10 artabilir. Bu üst limite "tavan" denir. Halka arz sonrası hisse borsada işlem görmeye başladığında art arda tavanlar yapabilir.
          </Text>
        </View>

        <View style={[s.card, { marginBottom: 16, padding: 0, overflow: "hidden" }]}>
          <Text style={[s.body, { fontWeight: "700", padding: 16, paddingBottom: 12 }]}>Tavan Başına Getiri Tablosu</Text>
          <View style={[s.row, { backgroundColor: "rgba(51,65,85,0.5)", paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 12, borderRadius: 10, marginBottom: 8 }]}>
            <Text style={[s.caption, { fontWeight: "700", flex: 1 }]}>Tavan</Text>
            <Text style={[s.caption, { fontWeight: "700", width: 88, textAlign: "right" }]}>Fiyat Çarpanı</Text>
            <Text style={[s.caption, { fontWeight: "700", width: 72, textAlign: "right" }]}>Getiri</Text>
          </View>
          {TABLO.map(({ tavan, carpan, getiri }) => (
            <View key={tavan} style={[s.row, { paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "rgba(51,65,85,0.3)" }]}>
              <Text style={[s.body, { flex: 1 }]}>{tavan} Tavan</Text>
              <Text style={[s.bodyMuted, { width: 88, textAlign: "right" }]}>×{carpan.toFixed(2)}</Text>
              <Text style={{ color: colors.green, fontSize: 13, fontWeight: "700", width: 72, textAlign: "right" }}>%{getiri.toFixed(1)}</Text>
            </View>
          ))}
          <View style={{ height: 4 }} />
        </View>

        <TouchableOpacity onPress={() => router.push("/araclar/tavan-simulatoru")}
          style={[s.btn, { marginBottom: 32 }]}>
          <Text style={s.btnText}>Tavan Simülatöründe Hesapla →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
