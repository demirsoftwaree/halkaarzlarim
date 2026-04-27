import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

const ADIMLAR = [
  { no: "1", baslik: "Aracı Kurum Hesabı Aç", icerik: "Garanti, İş Bankası, Yapı Kredi, Akbank, Ziraat, Halkbank veya başka bir aracı kurumda yatırım hesabı aç." },
  { no: "2", baslik: "Takvimi Takip Et", icerik: "HalkaArzlarım'da yaklaşan arzları, talep tarihlerini ve fiyat aralıklarını takip et." },
  { no: "3", baslik: "Bakiyeni Hazırla", icerik: "Talep başlamadan önce hesabında yeterli bakiye bulunduğundan emin ol." },
  { no: "4", baslik: "Talep Ver", icerik: "Talep toplama süresinde mobil bankacılık veya şube üzerinden talep gir. Lot miktarını belirt." },
  { no: "5", baslik: "Sonucu Bekle", icerik: "Talep süresi bittikten 2-3 gün sonra lotlar hesabına aktarılır." },
  { no: "6", baslik: "Sat veya Bekle", icerik: "Borsa açılışında hisseyi istediğin fiyattan satabilirsin. Tavan stratejisi için simülatörümüzü kullan." },
];

export default function NasilYapilir() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Nasıl Başvurulur?</Text>
      </View>
      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>
        <Text style={[s.bodyMuted, { marginTop: 8, marginBottom: 16 }]}>Halka arza başvurmak 6 adımda çok kolay:</Text>
        {ADIMLAR.map(({ no, baslik, icerik }) => (
          <View key={no} style={[s.row, { gap: 12, marginBottom: 16, alignItems: "flex-start" }]}>
            <View style={{ width: 32, height: 32, backgroundColor: colors.green, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 4, flexShrink: 0 }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>{no}</Text>
            </View>
            <View style={[s.card, { flex: 1 }]}>
              <Text style={[s.body, { fontWeight: "700", marginBottom: 4 }]}>{baslik}</Text>
              <Text style={[s.bodyMuted, { lineHeight: 24 }]}>{icerik}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity onPress={() => router.push("/araclar/tavan-simulatoru")}
          style={[s.btn, { marginBottom: 32 }]}>
          <Text style={s.btnText}>Tavan Simülatörünü Dene →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
