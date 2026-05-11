import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth-context";
import { colors, s } from "@/lib/styles";

function MenuItem({ icon, label, sub, onPress, renk = colors.muted }: { icon: keyof typeof Ionicons.glyphMap; label: string; sub?: string; onPress: () => void; renk?: string }) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.row, { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 }]}>
      <View style={[s.iconBox, { backgroundColor: `${renk}15` }]}><Ionicons name={icon} size={20} color={renk} /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.body}>{label}</Text>
        {sub && <Text style={s.caption}>{sub}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.dim} />
    </TouchableOpacity>
  );
}

export default function Hesabim() {
  const router = useRouter();
  const { user, isPremium, signOut } = useAuth();

  if (!user) return (
    <SafeAreaView style={s.screen}>
      <View style={[s.flex1, s.center, { paddingHorizontal: 32 }]}>
        <View style={[s.iconBox, { width: 72, height: 72, borderRadius: 36, marginBottom: 20 }]}><Ionicons name="person" size={36} color={colors.dim} /></View>
        <Text style={[s.title, { textAlign: "center", marginBottom: 8 }]}>Hesabına Giriş Yap</Text>
        <Text style={[s.bodyMuted, { textAlign: "center", marginBottom: 32 }]}>Portföyünü takip etmek ve premium özelliklere erişmek için giriş yap.</Text>
        <TouchableOpacity onPress={() => router.push("/giris")} style={[s.btn, { width: "100%", marginBottom: 12 }]}><Text style={s.btnText}>Giriş Yap</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/kayit")} style={[s.btnSecondary, { width: "100%" }]}><Text style={{ color: colors.muted, fontWeight: "600", fontSize: 15 }}>Kayıt Ol</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.px4}>
          <Text style={[s.title, { marginTop: 16, marginBottom: 16 }]}>Hesabım</Text>
          <View style={[s.card, s.row, s.gap4, { marginBottom: 8 }]}>
            <View style={[s.iconBox, { width: 52, height: 52, borderRadius: 26 }]}><Ionicons name="person" size={26} color={colors.green} /></View>
            <View style={{ flex: 1 }}>
              <Text style={[s.body, { fontWeight: "700" }]}>{user.displayName || "Kullanıcı"}</Text>
              <Text style={s.caption}>{user.email}</Text>
              {isPremium && <Text style={[s.caption, { color: colors.amber, marginTop: 2 }]}>⭐ Premium Üye</Text>}
            </View>
          </View>

          <Text style={[s.caption, { fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 4 }]}>Portföy</Text>
          <MenuItem icon="list" label="Takip Listem" sub="Takip ettiğin arzlar" onPress={() => router.push("/hesabim/takip-listem")} />
          <MenuItem icon="pie-chart" label="Portföyüm" sub="Yatırım takibi" onPress={() => router.push("/hesabim/portfoy")} />

          <Text style={[s.caption, { fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 4 }]}>Premium</Text>
          <MenuItem icon="star" label={isPremium ? "Premium Aktif ✓" : "Premium'a Geç"} sub={isPremium ? "Tüm özelliklere erişimin var" : "Reklamsız, gelişmiş özellikler"} onPress={() => router.push("/premium")} renk={colors.amber} />

          <Text style={[s.caption, { fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginTop: 20, marginBottom: 4 }]}>Destek</Text>
          <MenuItem icon="help-circle" label="Sık Sorulan Sorular" onPress={() => router.push("/rehber/sss")} />
          <MenuItem icon="shield-checkmark" label="Gizlilik Politikası" onPress={() => router.push("/rehber/gizlilik")} />

          <TouchableOpacity onPress={() => Alert.alert("Çıkış Yap", "Hesabından çıkmak istiyor musun?", [{ text: "İptal", style: "cancel" }, { text: "Çıkış Yap", style: "destructive", onPress: signOut }])} style={[s.row, { paddingVertical: 14, marginTop: 8, gap: 12 }]}>
            <View style={[s.iconBox, { backgroundColor: `${colors.red}15` }]}><Ionicons name="log-out" size={20} color={colors.red} /></View>
            <Text style={{ color: colors.red, fontWeight: "600", fontSize: 15 }}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
