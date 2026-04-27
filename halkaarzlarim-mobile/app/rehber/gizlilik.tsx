import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

export default function Gizlilik() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Gizlilik Politikası</Text>
      </View>
      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>
        {[
          { baslik: "Toplanan Veriler", icerik: "E-posta adresi, uygulama kullanım verileri ve tercihleriniz Firebase üzerinde güvenli biçimde saklanır." },
          { baslik: "Veri Kullanımı", icerik: "Verileriniz yalnızca hizmet iyileştirme ve hesap yönetimi amacıyla kullanılır. Üçüncü taraflarla paylaşılmaz." },
          { baslik: "Çerezler ve Analitik", icerik: "Uygulama deneyimini iyileştirmek amacıyla anonim kullanım istatistikleri toplanabilir." },
          { baslik: "Veri Güvenliği", icerik: "Tüm veriler Firebase güvenlik altyapısı ve HTTPS protokolüyle korunmaktadır." },
          { baslik: "Haklarınız", icerik: "Hesabınızı ve verilerinizi istediğiniz zaman silebilirsiniz. İletişim için: destek@halkaarzlarim.com" },
        ].map(({ baslik, icerik }) => (
          <View key={baslik} style={[s.card, { marginBottom: 12 }]}>
            <Text style={{ color: colors.green, fontWeight: "700", marginBottom: 8 }}>{baslik}</Text>
            <Text style={[s.bodyMuted, { lineHeight: 24 }]}>{icerik}</Text>
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
