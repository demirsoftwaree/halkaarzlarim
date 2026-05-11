import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, s } from "@/lib/styles";

const ARACLAR = [
  { id: "tavan-simulatoru", baslik: "Tavan Simülatörü", aciklama: "Kaç tavan olursa ne kadar kazanırsın?", icon: "trending-up" as const, renk: colors.green, route: "/araclar/tavan-simulatoru" },
  { id: "kar-hesaplama", baslik: "Kâr Hesaplama", aciklama: "Halka arzdan net kârını hesapla", icon: "cash" as const, renk: colors.amber, route: "/araclar/kar-hesaplama" },
  { id: "lot-dagitim", baslik: "Lot Dağıtım Hesaplayıcı", aciklama: "Kaç kişi başvurursa kaç lot düşer?", icon: "people" as const, renk: "#06b6d4", route: "/araclar/lot-dagitim" },
  { id: "tavan-raporu", baslik: "Tavan Raporu", aciklama: "Son arzların tavan performansı", icon: "bar-chart" as const, renk: "#8b5cf6", route: "/araclar/tavan-raporu" },
];

const REHBERLER = [
  { label: "Halka Arz Nedir?", route: "/rehber/ipo-nedir" },
  { label: "Nasıl Başvurulur?", route: "/rehber/nasil-yapilir" },
  { label: "Tavan Nedir?", route: "/rehber/tavan-nedir" },
  { label: "Sık Sorulan Sorular", route: "/rehber/sss" },
];

export default function Araclar() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[s.px4, { paddingTop: 16, paddingBottom: 8 }]}>
          <Text style={s.title}>Araçlar</Text>
          <Text style={[s.bodyMuted, { marginTop: 4 }]}>Halka arz hesaplama araçları</Text>
        </View>
        <View style={[s.px4, { marginTop: 8 }]}>
          {ARACLAR.map(a => (
            <TouchableOpacity key={a.id} onPress={() => router.push(a.route as any)} style={[s.card, s.mb3, s.row, s.gap4]}>
              <View style={[s.iconBox, { width: 52, height: 52, borderRadius: 16, backgroundColor: `${a.renk}20` }]}>
                <Ionicons name={a.icon} size={26} color={a.renk} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.body}>{a.baslik}</Text>
                <Text style={[s.caption, { marginTop: 2 }]}>{a.aciklama}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.dim} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={[s.px4, { marginTop: 16, marginBottom: 32 }]}>
          <Text style={[s.caption, { fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }]}>Rehberler</Text>
          {REHBERLER.map(item => (
            <TouchableOpacity key={item.route} onPress={() => router.push(item.route as any)} style={[s.row, { justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={s.bodyMuted}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.dim} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
