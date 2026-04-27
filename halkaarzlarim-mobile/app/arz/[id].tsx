import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Dimensions, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";
import { useWatchlist } from "@/lib/use-watchlist";
import { useAuth } from "@/lib/auth-context";

const { width: SCREEN_W } = Dimensions.get("window");
const CHART_W = SCREEN_W - 48;
const CHART_H = 180;

interface TahsisatGrubu { grup: string; kisi: number; lot: number; oran: number; }
interface Arz {
  id: string; slug: string; sirketAdi: string; ticker: string; durum: string; sektor?: string; pazar?: string;
  talepBaslangic?: string; talepBitis?: string; borsadaIslemGormeTarihi?: string;
  arsFiyatiAlt?: number; arsFiyatiUst?: number;
  dagitimYontemi?: string; toplamArzLot?: number; araciKurum?: string;
  fiiliDolasimdakiPay?: number; fiiliDolasimdakiPayOrani?: number;
  halkaAciklik?: number; halkaArzIskontosu?: number; halkaArzBuyklugu?: string;
  tavanSayisi?: number; kapLinki?: string; logo?: string;
  sirketHakkinda?: string; aciklama?: string;
  tahsisatSonuclari?: TahsisatGrubu[];
  ozetBolumler?: { baslik: string; icerik: string }[];
}

const DURUM_LABEL: Record<string, string> = { aktif: "Aktif", yaklasan: "Yaklaşan", tamamlandi: "Tamamlandı", "basvuru-surecinde": "Başvuru Sürecinde", ertelendi: "Ertelendi" };
const DURUM_COLOR: Record<string, string> = { aktif: colors.green, yaklasan: colors.blue, tamamlandi: colors.muted, "basvuru-surecinde": colors.blue, ertelendi: colors.amber };

function fmt(d?: string) {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}
function fmtN(n: number) { return new Intl.NumberFormat("tr-TR").format(n); }

function ArzLogoBox({ logo, ticker }: { logo?: string; ticker: string }) {
  const [err, setErr] = useState(false);
  if (logo && !err) {
    return (
      <View style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", backgroundColor: "#fff", padding: 4 }}>
        <Image source={{ uri: logo }} style={{ width: 44, height: 44 }} onError={() => setErr(true)} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={{ width: 52, height: 52, backgroundColor: `${colors.green}20`, borderRadius: 14, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.green, fontWeight: "700", fontSize: 16 }}>{ticker?.slice(0, 2)}</Text>
    </View>
  );
}

function Satir({ label, value }: { label: string; value: string }) {
  return (
    <View style={[s.row, { justifyContent: "space-between", paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "rgba(51,65,85,0.4)" }]}>
      <Text style={[s.caption, { flex: 1 }]}>{label}</Text>
      <Text style={[s.body, { fontWeight: "500", maxWidth: "55%", textAlign: "right" }]}>{value}</Text>
    </View>
  );
}

function Baslik({ title }: { title: string }) {
  return <Text style={[s.body, { fontWeight: "700", marginBottom: 12 }]}>{title}</Text>;
}

// Basit SVG çizgi grafiği
function PriceChart({ ticker, arzFiyati }: { ticker: string; arzFiyati: number }) {
  const [closes, setCloses] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("3a");

  const RANGES = ["1g", "1h", "1a", "3a", "tumu"];
  const RANGE_LABEL: Record<string, string> = { "1g": "1G", "1h": "1H", "1a": "1A", "3a": "3A", tumu: "Max" };

  useEffect(() => {
    setLoading(true);
    fetch(`https://halkaarzlarim.com/api/chart?ticker=${ticker}&range=${range}`)
      .then(r => r.json())
      .then(d => {
        setCloses(d.closes || []);
        setCurrentPrice(d.regularMarketPrice ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ticker, range]);

  const getiri = currentPrice && arzFiyati > 0
    ? ((currentPrice - arzFiyati) / arzFiyati * 100)
    : null;
  const positive = getiri !== null ? getiri >= 0 : true;

  if (loading) return (
    <View style={[s.card, { marginBottom: 16, alignItems: "center", paddingVertical: 40 }]}>
      <ActivityIndicator color={colors.green} />
    </View>
  );

  if (closes.length < 2) return (
    <View style={[s.card, { marginBottom: 16 }]}>
      <Baslik title="Canlı Grafik" />
      <View style={[s.row, { gap: 6, marginBottom: 16 }]}>
        {RANGES.map(r => (
          <TouchableOpacity key={r} onPress={() => setRange(r)}
            style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: range === r ? colors.green : colors.border }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: range === r ? "#fff" : colors.muted }}>{RANGE_LABEL[r]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ alignItems: "center", paddingVertical: 32 }}>
        <Ionicons name="bar-chart-outline" size={32} color={colors.dim} />
        <Text style={[s.bodyMuted, { marginTop: 8 }]}>Bu aralık için veri bulunamadı.</Text>
      </View>
    </View>
  );

  const min = Math.min(...closes, arzFiyati * 0.95);
  const max = Math.max(...closes, arzFiyati * 1.05);
  const range_ = max - min || 1;
  const lineColor = positive ? colors.green : colors.red;

  // Normalize 0–1
  const norm = (v: number) => (v - min) / range_;
  // Bar chart columns
  const BAR_COUNT = Math.min(closes.length, 60);
  const step = Math.max(1, Math.floor(closes.length / BAR_COUNT));
  const sampled = closes.filter((_, i) => i % step === 0);
  const arzNorm = norm(arzFiyati);

  return (
    <View style={[s.card, { marginBottom: 16 }]}>
      <Baslik title="Canlı Grafik" />

      {/* Fiyat ve getiri */}
      <View style={[s.row, { justifyContent: "space-between", marginBottom: 12 }]}>
        <View>
          <Text style={s.caption}>Anlık Fiyat</Text>
          <Text style={[s.body, { fontWeight: "700", fontSize: 22 }]}>
            {currentPrice ? `₺${currentPrice.toFixed(2)}` : "–"}
          </Text>
        </View>
        {getiri !== null && (
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.caption}>Halka Arz Getirisi</Text>
            <Text style={{ fontWeight: "700", fontSize: 18, color: positive ? colors.green : colors.red }}>
              {positive ? "+" : ""}{getiri.toFixed(1)}%
            </Text>
          </View>
        )}
      </View>

      {/* Range butonları */}
      <View style={[s.row, { gap: 6, marginBottom: 12 }]}>
        {RANGES.map(r => (
          <TouchableOpacity key={r} onPress={() => setRange(r)}
            style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: range === r ? colors.green : colors.border }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: range === r ? "#fff" : colors.muted }}>{RANGE_LABEL[r]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bar chart */}
      <View style={{ height: CHART_H, position: "relative" }}>
        {/* Arz fiyatı referans çizgisi */}
        <View style={{
          position: "absolute", left: 0, right: 0,
          top: CHART_H - arzNorm * CHART_H - 1,
          height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: colors.amber
        }} />
        <Text style={{ position: "absolute", right: 0, top: CHART_H - arzNorm * CHART_H - 14, fontSize: 9, color: colors.amber }}>
          Arz ₺{arzFiyati.toFixed(2)}
        </Text>

        {/* Barlar */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", height: CHART_H, gap: 1 }}>
          {sampled.map((c, i) => {
            const h = Math.max(2, norm(c) * CHART_H);
            const isAboveArz = c >= arzFiyati;
            return (
              <View key={i} style={{
                flex: 1, height: h,
                backgroundColor: isAboveArz ? `${colors.green}99` : `${colors.red}99`,
                borderTopLeftRadius: 2, borderTopRightRadius: 2,
              }} />
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function ArzDetay() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [arz, setArz] = useState<Arz | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isFollowing, toggle } = useWatchlist();

  async function handleWatchlist() {
    if (!arz) return;
    if (!user) { router.push("/giris"); return; }
    const result = await toggle({ slug: arz.slug, sirketAdi: arz.sirketAdi, ticker: arz.ticker });
    if (result === "limit_reached") {
      Alert.alert("Takip Listesi Doldu", `Ücretsiz hesapta en fazla 5 arz takip edebilirsin. Sınırsız takip için Premium'a geç.`, [
        { text: "İptal", style: "cancel" },
        { text: "Premium'a Geç", onPress: () => router.push("/premium") },
      ]);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetch("https://halkaarzlarim.com/api/arzlar")
      .then(r => r.json())
      .then(json => {
        const found = (json.arzlar || []).find((a: any) => a.slug === id || a.id === id);
        if (found) setArz({ ...found, id: found.id || found.slug });
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <View style={[s.screen, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>;
  if (!arz) return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
      </View>
      <View style={[s.flex1, s.center]}><Text style={s.bodyMuted}>Arz bulunamadı.</Text></View>
    </SafeAreaView>
  );

  const tamamlandi = arz.durum === "tamamlandi";
  const durumRenk = DURUM_COLOR[arz.durum] || colors.muted;
  const arsFiyati = arz.arsFiyatiUst || arz.arsFiyatiAlt || 0;
  const fiyatStr = arz.arsFiyatiAlt && arz.arsFiyatiUst
    ? arz.arsFiyatiAlt === arz.arsFiyatiUst
      ? `₺${arz.arsFiyatiUst.toFixed(2)}`
      : `₺${arz.arsFiyatiAlt.toFixed(2)} – ₺${arz.arsFiyatiUst.toFixed(2)}`
    : "–";

  // Bireysel grup özeti
  const bireysel = arz.tahsisatSonuclari?.find(t => t.grup.toLowerCase().includes("bireysel"));
  const lotBasina = bireysel && bireysel.kisi > 0 ? Math.floor(bireysel.lot / bireysel.kisi) : null;

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20, flex: 1 }]} numberOfLines={1}>{arz.ticker}</Text>
        <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: `${durumRenk}20` }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: durumRenk }}>{DURUM_LABEL[arz.durum] || arz.durum}</Text>
        </View>
        <TouchableOpacity
          onPress={handleWatchlist}
          style={{ padding: 6, borderRadius: 10, backgroundColor: isFollowing(arz.slug) ? `${colors.amber}18` : colors.border }}
        >
          <Ionicons
            name={isFollowing(arz.slug) ? "star" : "star-outline"}
            size={20}
            color={isFollowing(arz.slug) ? colors.amber : colors.dim}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>

        {/* Header kartı */}
        <View style={[s.card, { marginTop: 8, marginBottom: 16 }]}>
          <View style={[s.row, { gap: 12 }]}>
            <ArzLogoBox logo={arz.logo} ticker={arz.ticker} />
            <View style={{ flex: 1 }}>
              <Text style={[s.body, { fontWeight: "700", fontSize: 17 }]}>{arz.sirketAdi}</Text>
              <View style={[s.row, { gap: 8, marginTop: 3, flexWrap: "wrap" }]}>
                {arz.sektor && <Text style={s.caption}>{arz.sektor}</Text>}
                {arz.pazar && <Text style={s.caption}>· {arz.pazar}</Text>}
              </View>
            </View>
          </View>
        </View>

        {/* Halka Arz Bilgileri */}
        <View style={[s.card, { marginBottom: 16 }]}>
          <Baslik title="Halka Arz Bilgileri" />
          {arz.talepBaslangic && <Satir label="Halka Arz Tarihi" value={`${fmt(arz.talepBaslangic)} – ${fmt(arz.talepBitis)}`} />}
          <Satir label="Halka Arz Fiyatı" value={fiyatStr} />
          {arz.dagitimYontemi && <Satir label="Dağıtım Yöntemi" value={arz.dagitimYontemi} />}
          {arz.toplamArzLot ? <Satir label="Pay (Toplam Lot)" value={`${fmtN(arz.toplamArzLot)} Lot`} /> : null}
          {arz.araciKurum && <Satir label="Aracı Kurum" value={arz.araciKurum} />}
          {arz.pazar && <Satir label="Pazar" value={arz.pazar} />}
          {arz.borsadaIslemGormeTarihi && <Satir label="BIST İlk İşlem Tarihi" value={fmt(arz.borsadaIslemGormeTarihi)} />}
          {arz.fiiliDolasimdakiPayOrani != null && arz.fiiliDolasimdakiPayOrani > 0 &&
            <Satir label="Fiili Dolaşım Oranı" value={`%${arz.fiiliDolasimdakiPayOrani.toFixed(2)}`} />}
          {arz.halkaAciklik != null && <Satir label="Halka Açıklık" value={`%${arz.halkaAciklik.toFixed(2)}`} />}
          {arz.halkaArzBuyklugu && <Satir label="Halka Arz Büyüklüğü" value={arz.halkaArzBuyklugu} />}
          {arz.tavanSayisi !== undefined && <Satir label="Tavan Sayısı" value={`${arz.tavanSayisi} tavan`} />}
        </View>

        {/* Halka Arz Sonuçları (tahsisat tablosu) */}
        {tamamlandi && arz.tahsisatSonuclari && arz.tahsisatSonuclari.length > 0 && (
          <View style={[s.card, { marginBottom: 16 }]}>
            <Baslik title={`${arz.ticker} Halka Arz Sonuçları`} />

            {/* Bireysel özet */}
            {lotBasina !== null && bireysel && (
              <View style={{ backgroundColor: `${colors.green}15`, borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: `${colors.green}30` }}>
                <Text style={[s.caption, { color: colors.text }]}>
                  Dağıtılan Pay: <Text style={{ color: colors.green, fontWeight: "700" }}>
                    {fmtN(bireysel.kisi)} katılımcı – {fmtN(lotBasina)} Lot
                    {arsFiyati > 0 ? ` (${fmtN(Math.round(lotBasina * arsFiyati))} ₺)` : ""}
                  </Text>
                </Text>
                <Text style={[s.caption, { marginTop: 2 }]}>* Bireysel Yatırımcı Grubu</Text>
              </View>
            )}

            {/* Tablo başlık */}
            <View style={[s.row, { paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[s.caption, { fontWeight: "700", flex: 1 }]}>Grup</Text>
              <Text style={[s.caption, { fontWeight: "700", width: 64, textAlign: "right" }]}>Kişi</Text>
              <Text style={[s.caption, { fontWeight: "700", width: 72, textAlign: "right" }]}>Lot</Text>
              <Text style={[s.caption, { fontWeight: "700", width: 44, textAlign: "right" }]}>Oran</Text>
            </View>

            {/* Satırlar */}
            {arz.tahsisatSonuclari.map((t, i) => (
              <View key={i} style={[s.row, { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(51,65,85,0.3)" }]}>
                <Text style={[s.caption, { color: colors.text, flex: 1 }]} numberOfLines={2}>{t.grup}</Text>
                <Text style={[s.caption, { color: colors.text, width: 64, textAlign: "right" }]}>{fmtN(t.kisi)}</Text>
                <Text style={[s.caption, { color: colors.text, width: 72, textAlign: "right" }]}>{fmtN(t.lot)}</Text>
                <Text style={[s.caption, { color: colors.green, fontWeight: "700", width: 44, textAlign: "right" }]}>%{t.oran}</Text>
              </View>
            ))}

            {/* Toplam */}
            <View style={[s.row, { paddingVertical: 10, backgroundColor: "rgba(51,65,85,0.3)", borderRadius: 8, paddingHorizontal: 4, marginTop: 4 }]}>
              <Text style={[s.body, { fontWeight: "700", flex: 1 }]}>Toplam</Text>
              <Text style={[s.body, { fontWeight: "700", width: 64, textAlign: "right" }]}>
                {fmtN(arz.tahsisatSonuclari.reduce((s, t) => s + t.kisi, 0))}
              </Text>
              <Text style={[s.body, { fontWeight: "700", width: 72, textAlign: "right" }]}>
                {fmtN(arz.tahsisatSonuclari.reduce((s, t) => s + t.lot, 0))}
              </Text>
              <Text style={[s.body, { fontWeight: "700", width: 44, textAlign: "right" }]}>%100</Text>
            </View>
          </View>
        )}

        {/* Canlı Grafik */}
        {tamamlandi && arz.ticker && arsFiyati > 0 && (
          <PriceChart ticker={arz.ticker} arzFiyati={arsFiyati} />
        )}

        {/* Şirket Hakkında */}
        {(arz.sirketHakkinda || arz.aciklama) && (
          <View style={[s.card, { marginBottom: 16 }]}>
            <Baslik title="Şirket Hakkında" />
            <Text style={[s.bodyMuted, { lineHeight: 22 }]}>{arz.sirketHakkinda || arz.aciklama}</Text>
          </View>
        )}

        {/* Butonlar */}
        <View style={{ gap: 12, marginBottom: 32 }}>
          {arz.kapLinki && (
            <TouchableOpacity onPress={() => Linking.openURL(arz.kapLinki!)}
              style={[s.card, s.row, { gap: 12 }]}>
              <Ionicons name="document-text" size={20} color={colors.green} />
              <Text style={{ color: colors.green, fontWeight: "500", flex: 1 }}>KAP İzahnamesi</Text>
              <Ionicons name="open-outline" size={16} color={colors.dim} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push("/araclar/tavan-simulatoru")}
            style={[s.btn, s.row, { justifyContent: "center", gap: 8 }]}>
            <Ionicons name="trending-up" size={20} color="#fff" />
            <Text style={s.btnText}>Tavan Simülatörü'nde Hesapla</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
