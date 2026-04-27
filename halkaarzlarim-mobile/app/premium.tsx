import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/styles";
import {
  getOfferings, purchasePackage, restorePurchases,
} from "@/lib/purchases";

// ─── Renkler ───────────────────────────────────────────────────
const C = {
  bg:       "#030912",
  card:     "#0A1628",
  border:   "#0F1F35",
  green:    "#10B981",
  greenDim: "rgba(16,185,129,0.12)",
  gold:     "#F59E0B",
  goldLt:   "#FCD34D",
  goldDim:  "rgba(245,158,11,0.12)",
  red:      "#EF4444",
  text:     "#E2E8F0",
  muted:    "#94A3B8",
  dim:      "#475569",
};

// ─── Plan verileri ─────────────────────────────────────────────
const PLANS = [
  {
    id: "free",
    label: "Ücretsiz",
    price: "₺0",
    period: "sonsuza kadar",
    color: C.dim,
    popular: false,
  },
  {
    id: "monthly",
    label: "Premium Aylık",
    price: "₺29",
    period: "aylık",
    color: C.green,
    popular: false,
  },
  {
    id: "yearly",
    label: "Premium Yıllık",
    price: "₺300",
    period: "yıllık · %14 tasarruf",
    color: C.gold,
    popular: true,
  },
];

// ─── Özellik tablosu ───────────────────────────────────────────
type CellVal = "check" | "cross" | string;
interface Feature {
  icon: string;
  label: string;
  free: CellVal;
  monthly: CellVal;
  yearly: CellVal;
}

const FEATURES: Feature[] = [
  { icon: "🎁", label: "7 Gün Deneme",     free: "cross",    monthly: "check",    yearly: "check" },
  { icon: "🤖", label: "AI Chat Sorusu",   free: "3 / gün",  monthly: "Sınırsız", yearly: "Sınırsız" },
  { icon: "📢", label: "Reklamlar",        free: "Var",       monthly: "Reklamsız",yearly: "Reklamsız" },
  { icon: "💼", label: "Portföy Ekleme",   free: "Sınırlı",  monthly: "check",    yearly: "check" },
  { icon: "📊", label: "Kâr/Zarar Takibi",free: "cross",     monthly: "check",    yearly: "check" },
  { icon: "🔔", label: "Alarm & Bildirim", free: "Temel",    monthly: "Gelişmiş", yearly: "Gelişmiş" },
  { icon: "🧠", label: "AI Detay Analiz",  free: "cross",    monthly: "check",    yearly: "check" },
  { icon: "⚡", label: "Bildirim Sistemi", free: "Temel",    monthly: "Öncelikli",yearly: "Öncelikli" },
];

// ─── Hücre bileşeni ───────────────────────────────────────────
function Cell({ val, col }: { val: CellVal; col: "free" | "monthly" | "yearly" }) {
  const isGold  = col === "yearly";
  const accent  = isGold ? C.gold : C.green;

  if (val === "check") {
    return (
      <View style={[ss.tick, { backgroundColor: `${accent}18` }]}>
        <Text style={{ color: accent, fontSize: 11, fontWeight: "800" }}>✓</Text>
      </View>
    );
  }
  if (val === "cross") {
    return (
      <View style={[ss.tick, { backgroundColor: `${C.red}12` }]}>
        <Text style={{ color: C.red, fontSize: 10, fontWeight: "800" }}>✕</Text>
      </View>
    );
  }

  // metin chip
  const isGood = val === "Reklamsız" || val === "Sınırsız" || val === "Gelişmiş" || val === "Öncelikli";
  const isBad  = val === "Var";
  const chipColor = isBad ? C.red : isGood ? accent : C.dim;
  const chipBg    = isBad
    ? `${C.red}12`
    : isGood
    ? `${accent}14`
    : "rgba(255,255,255,0.05)";

  return (
    <View style={[ss.chip, { backgroundColor: chipBg }]}>
      <Text style={{ color: chipColor, fontSize: 9, fontWeight: "700" }}>{val}</Text>
    </View>
  );
}

// ─── Premium Sayfası ──────────────────────────────────────────
export default function Premium() {
  const router   = useRouter();
  const { user, isPremium } = useAuth();

  const [monthly, setMonthly]   = useState<PurchasesPackage | null>(null);
  const [yearly,  setYearly]    = useState<PurchasesPackage | null>(null);
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  const [loading,  setLoading]  = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    getOfferings().then((offering) => {
      if (!offering) return;
      offering.availablePackages.forEach((pkg) => {
        const id = pkg.product.identifier;
        if (id === "premium_monthly") setMonthly(pkg);
        if (id === "premium_yearly")  setYearly(pkg);
      });
    });
  }, []);

  async function handlePurchase() {
    if (!user) { router.push("/giris"); return; }
    const pkg = selected === "monthly" ? monthly : yearly;
    if (!pkg) {
      Alert.alert("Hazırlanıyor", "Abonelik ürünleri henüz aktif değil. Uygulama yayına alındıktan sonra kullanılabilir olacak.");
      return;
    }
    setLoading(true);
    const result = await purchasePackage(pkg, user.uid);
    setLoading(false);
    if (result === "ok") {
      Alert.alert("Premium Aktif 🎉", "Tüm premium özelliklere erişimin açıldı!", [{ text: "Harika!" }]);
    } else if (result === "error") {
      Alert.alert("Hata", "Satın alma işlemi tamamlanamadı. Lütfen tekrar dene.");
    }
    // cancelled → sessizce geç
  }

  async function handleRestore() {
    if (!user) { router.push("/giris"); return; }
    setRestoring(true);
    const ok = await restorePurchases(user.uid);
    setRestoring(false);
    Alert.alert(
      ok ? "Başarılı ✓" : "Bulunamadı",
      ok ? "Premium aboneliğin geri yüklendi." : "Bu hesaba ait aktif abonelik bulunamadı."
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={ss.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={ss.topTitle}>Premium</Text>
        <TouchableOpacity onPress={handleRestore} disabled={restoring} style={{ opacity: restoring ? 0.5 : 1 }}>
          <Text style={{ fontSize: 12, color: C.dim }}>
            {restoring ? "..." : "Geri yükle"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={ss.hero}>
          <View style={ss.appBadge}>
            <Text style={{ fontSize: 13 }}>📈</Text>
            <Text style={ss.appBadgeText}>HalkaArzlarım</Text>
          </View>
          <Text style={ss.heroTitle}>
            Daha Fazlasını Keşfet,{"\n"}
            <Text style={{ color: C.green }}>Yatırımlarını Öne Taşı</Text>
          </Text>
          <Text style={ss.heroSub}>
            Halka arz takibini profesyonel seviyeye taşıyan araçlar,{"\n"}yapay zeka analizleri ve öncelikli bildirimler seni bekliyor.
          </Text>
        </View>

        {isPremium ? (
          /* Aktif durumu */
          <View style={[ss.card, { margin: 16, alignItems: "center", paddingVertical: 32 }]}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: `${C.gold}20`, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Ionicons name="star" size={32} color={C.gold} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: C.text, marginBottom: 6 }}>Premium Aktif ✓</Text>
            <Text style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>Tüm premium özelliklere erişimin var.</Text>
          </View>
        ) : (
          <>
            {/* Plan seçici */}
            <View style={ss.plansRow}>
              {PLANS.map((plan) => {
                const isYearly = plan.id === "yearly";
                const isSel    = selected === plan.id;
                const isSelectable = plan.id !== "free";
                return (
                  <TouchableOpacity
                    key={plan.id}
                    activeOpacity={isSelectable ? 0.7 : 1}
                    onPress={() => isSelectable && setSelected(plan.id as "monthly" | "yearly")}
                    style={[
                      ss.planCard,
                      isYearly && { borderColor: C.gold, shadowColor: C.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: isSel ? 0.35 : 0.15, shadowRadius: 16, elevation: 6 },
                      !isYearly && { borderColor: isSel ? C.green : C.border },
                      isSel && !isYearly && { backgroundColor: `${C.green}08` },
                      isSel && isYearly  && { backgroundColor: `${C.gold}08` },
                    ]}
                  >
                    {isYearly && (
                      <View style={ss.popularBadge}>
                        <Text style={ss.popularText}>⭐ EN POPÜLER</Text>
                      </View>
                    )}
                    <Text style={[ss.planLabel, { color: plan.color }]}>{plan.label}</Text>
                    <Text style={[ss.planPrice, { color: isYearly ? C.goldLt : plan.id === "free" ? C.muted : C.text }]}>
                      {plan.price}
                    </Text>
                    <Text style={[ss.planPeriod, { color: isYearly ? "#B45309" : C.dim }]}>{plan.period}</Text>
                    {isSelectable && (
                      <View style={[ss.planSelect, isSel && { backgroundColor: isYearly ? C.gold : C.green }]}>
                        {isSel && <Ionicons name="checkmark" size={11} color="#000" />}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Özellik tablosu */}
            <View style={ss.table}>
              {/* Tablo başlığı */}
              <View style={[ss.tableRow, { backgroundColor: "rgba(255,255,255,0.02)", paddingVertical: 6 }]}>
                <Text style={[ss.th, { flex: 1.65, textAlign: "left", paddingLeft: 12, color: "rgba(255,255,255,0.2)" }]}>ÖZELLİK</Text>
                <Text style={[ss.th, { flex: 1, color: "rgba(255,255,255,0.2)" }]}>ÜCRETSİZ</Text>
                <Text style={[ss.th, { flex: 1, color: `${C.green}80` }]}>AYLIK</Text>
                <Text style={[ss.th, { flex: 1, color: `${C.gold}90` }]}>YILLIK</Text>
              </View>

              {FEATURES.map((f, i) => (
                <View key={f.label} style={[ss.tableRow, i % 2 === 1 && { backgroundColor: "rgba(255,255,255,0.012)" }]}>
                  <View style={[ss.featName, { flex: 1.65 }]}>
                    <Text style={{ fontSize: 11 }}>{f.icon}</Text>
                    <Text style={ss.featLabel}>{f.label}</Text>
                  </View>
                  <View style={[ss.tableCell, { flex: 1 }]}>
                    <Cell val={f.free}    col="free" />
                  </View>
                  <View style={[ss.tableCell, { flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: `${C.green}10`, backgroundColor: `${C.green}03` }]}>
                    <Cell val={f.monthly} col="monthly" />
                  </View>
                  <View style={[ss.tableCell, { flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: `${C.gold}18`, backgroundColor: `${C.gold}03` }]}>
                    <Cell val={f.yearly}  col="yearly" />
                  </View>
                </View>
              ))}
            </View>

            {/* Tasarruf banner */}
            <View style={ss.savings}>
              <Text style={{ fontSize: 20 }}>💰</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.green }}>Yıllık planla 2 ay bedava!</Text>
                <Text style={{ fontSize: 11, color: C.dim }}>₺29 × 12 = ₺348 yerine sadece ₺300</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#34D399" }}>₺48 kazan</Text>
            </View>

            {/* Satın alma butonu */}
            <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              <TouchableOpacity
                onPress={handlePurchase}
                disabled={loading}
                style={[
                  ss.buyBtn,
                  selected === "yearly"
                    ? { backgroundColor: C.gold }
                    : { backgroundColor: C.green },
                  loading && { opacity: 0.6 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={ss.buyBtnText}>
                    {selected === "yearly" ? "Yıllık Planı Başlat ✦" : "Aylık Planı Başlat →"}
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={ss.legalNote}>
                Google Play üzerinden güvenli ödeme · İstediğin zaman iptal et
              </Text>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Stiller ──────────────────────────────────────────────────
const ss = StyleSheet.create({
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  topTitle: { fontSize: 17, fontWeight: "700", color: C.text },

  hero: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 18 },
  appBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(16,185,129,0.08)",
    borderWidth: 1, borderColor: "rgba(16,185,129,0.2)",
    borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10,
    marginBottom: 14,
  },
  appBadgeText: { fontSize: 12, fontWeight: "700", color: C.green },
  heroTitle: { fontSize: 22, fontWeight: "800", color: C.text, lineHeight: 30, marginBottom: 8 },
  heroSub:   { fontSize: 12, color: C.dim, lineHeight: 18 },

  card: {
    backgroundColor: C.card,
    borderRadius: 16, borderWidth: 1, borderColor: C.border,
    padding: 16,
  },

  plansRow: {
    flexDirection: "row", gap: 6,
    paddingHorizontal: 16, marginBottom: 6,
    alignItems: "flex-end",
  },
  planCard: {
    flex: 1, borderRadius: 14, borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.card,
    padding: 10, alignItems: "center",
    position: "relative",
  },
  popularBadge: {
    position: "absolute", top: -11, alignSelf: "center",
    backgroundColor: C.gold,
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2,
  },
  popularText: { fontSize: 7.5, fontWeight: "900", color: "#1A0800", letterSpacing: 0.5 },
  planLabel:  { fontSize: 8.5, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, marginTop: 6 },
  planPrice:  { fontSize: 19, fontWeight: "800", lineHeight: 22, marginBottom: 1 },
  planPeriod: { fontSize: 9, marginBottom: 8, textAlign: "center" },
  planSelect: {
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 1.5, borderColor: C.border,
    alignItems: "center", justifyContent: "center",
    marginTop: 2,
  },

  table: { marginHorizontal: 16, borderRadius: 12, overflow: "hidden", marginBottom: 14 },
  tableRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.03)" },
  th: { fontSize: 7.5, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", paddingVertical: 5 },
  featName: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 8, paddingLeft: 10 },
  featLabel: { fontSize: 10.5, color: C.muted, fontWeight: "500" },
  tableCell: { alignItems: "center", justifyContent: "center", paddingVertical: 8 },

  tick: { width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  chip: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5 },

  savings: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: "rgba(16,185,129,0.06)",
    borderWidth: 1, borderColor: "rgba(16,185,129,0.15)",
    borderRadius: 12, padding: 12,
  },

  buyBtn: {
    borderRadius: 14, paddingVertical: 15,
    alignItems: "center", justifyContent: "center",
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  buyBtnText: { fontSize: 15, fontWeight: "800", color: "#000" },
  legalNote: { fontSize: 10, color: C.dim, textAlign: "center", lineHeight: 16 },
});
