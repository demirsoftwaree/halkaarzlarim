import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

export default function IpoNedir() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Halka Arz Nedir?</Text>
      </View>
      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>
        {[
          { baslik: "Halka Arz (IPO) Nedir?", icerik: "Halka arz, bir şirketin hisselerini ilk kez kamuya satışa sunarak borsada işlem görmeye başlamasıdır. İngilizce'de IPO (Initial Public Offering) olarak bilinir." },
          { baslik: "Neden Yapılır?", icerik: "Şirketler büyüme finansmanı sağlamak, borçlarını kapatmak veya kurucu ortaklara çıkış imkânı vermek amacıyla halka arz yolunu seçer." },
          { baslik: "Yatırımcı Açısından Önemi", icerik: "Halka arz yatırımcılara şirkete düşük fiyattan ortak olma imkânı sunar. Borsada işlem görmeye başladığında hisse fiyatı arz fiyatının üzerine çıkarsa kâr elde edilir." },
          { baslik: "BIST'te Halka Arz Süreci", icerik: "Türkiye'de halka arzlar SPK denetiminde gerçekleşir. Şirket izahname hazırlar, aracı kurum belirler ve yatırımcıların talep toplaması başlar." },
          { baslik: "Riskler", icerik: "Halka arzlar her zaman kârlı değildir. Şirket analizi, sektör değerlendirmesi ve piyasa koşullarını göz önünde bulundurmak önemlidir." },
        ].map(({ baslik, icerik }) => (
          <View key={baslik} style={[s.card, { marginBottom: 12 }]}>
            <Text style={{ color: colors.green, fontWeight: "700", marginBottom: 8 }}>{baslik}</Text>
            <Text style={[s.bodyMuted, { lineHeight: 24 }]}>{icerik}</Text>
          </View>
        ))}
        <TouchableOpacity onPress={() => router.push("/rehber/sss")}
          style={[s.card, s.center, { marginBottom: 32, backgroundColor: colors.border }]}>
          <Text style={[s.body, { fontWeight: "500" }]}>Sık Sorulan Sorular →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
