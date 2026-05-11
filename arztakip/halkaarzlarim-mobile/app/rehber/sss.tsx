import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

const SORULAR = [
  { s: "Halka arz nedir?", c: "Bir şirketin hisselerini ilk kez halka sunarak borsada işlem görmeye başlamasıdır. Yatırımcılar arz fiyatından hisse alır ve borsa açılışında satabilir." },
  { s: "Hangi bankadan başvurabilirim?", c: "Garanti BBVA, İş Bankası, Yapı Kredi, Akbank, Ziraat, Halkbank, TEB, Midas ve diğer aracı kurumlar üzerinden başvurabilirsiniz." },
  { s: "Minimum ne kadar yatırım gerekiyor?", c: "Minimum 1 lot × arz fiyatı kadar para gereklidir. Örneğin arz fiyatı 50 TL ise en az 50 TL ile başvurabilirsiniz." },
  { s: "Tavan nedir?", c: "Borsada bir hissenin günde maksimum %10 artabilmesidir. 5 tavan = yaklaşık %61 getiri, 10 tavan = yaklaşık %159 getiri sağlar." },
  { s: "Kaç lot düşeceğini nasıl öğrenirim?", c: "Toplam arz lot sayısı, başvuran yatırımcı sayısına bölünür. Herkes eşit oranda lot alır. Talep yoğunsa daha az lot düşer." },
  { s: "Talep süresi ne kadar?", c: "Genellikle 3-7 iş günüdür. Kesin tarihler için halka arz takvimini takip edin." },
  { s: "Lotlar ne zaman hesaba geçer?", c: "Talep toplama süresinin bitmesinden genellikle 2-3 iş günü sonra hesabınıza aktarılır." },
  { s: "Başvuru ücretsiz mi?", c: "Başvuru için ücret alınmaz. Ancak bazı aracı kurumlar küçük komisyon kesintisi yapabilir." },
  { s: "Halka arz her zaman kârlı mıdır?", c: "Hayır. Bazı arzlar beklentinin altında kalabilir. Şirket analizi ve piyasa koşullarını mutlaka değerlendirin." },
  { s: "Birden fazla bankadan başvurabilir miyim?", c: "Hayır. Aynı arza birden fazla aracı kurum üzerinden başvurursanız başvurunuz iptal edilir." },
];

export default function SSS() {
  const router = useRouter();
  const [acik, setAcik] = useState<number | null>(null);

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Sık Sorulan Sorular</Text>
      </View>
      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 8, marginBottom: 32 }}>
          {SORULAR.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => setAcik(acik === i ? null : i)}
              style={[s.card, { marginBottom: 12, padding: 0, overflow: "hidden" }]}>
              <View style={[s.row, { justifyContent: "space-between", padding: 16 }]}>
                <Text style={[s.body, { fontWeight: "600", flex: 1, paddingRight: 12 }]}>{item.s}</Text>
                <Ionicons name={acik === i ? "chevron-up" : "chevron-down"} size={18} color={colors.dim} />
              </View>
              {acik === i && (
                <View style={{ paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: "rgba(51,65,85,0.5)" }}>
                  <Text style={[s.bodyMuted, { lineHeight: 24, marginTop: 12 }]}>{item.c}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
