import { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, FlatList, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

interface Arz {
  slug: string; sirketAdi: string; ticker: string;
  arsFiyatiAlt?: number; arsFiyatiUst?: number;
  araciKurum?: string; durum: string;
}

function fmt(n: number, dec = 2) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

const API = "https://halkaarzlarim.com/api/arzlar";

export default function TavanRaporu() {
  const router = useRouter();
  const viewRef = useRef<ViewShot>(null);

  const [arzlar, setArzlar] = useState<Arz[]>([]);
  const [secili, setSecili] = useState<Arz | null>(null);
  const [lotStr, setLotStr] = useState("100");
  const [loading, setLoading] = useState(true);
  const [picker, setPicker] = useState(false);
  const [aramaStr, setAramaStr] = useState("");
  const [kayitLoading, setKayitLoading] = useState(false);

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(d => {
        const liste: Arz[] = (d.arzlar || []).filter((a: Arz) => a.durum !== "ertelendi");
        setArzlar(liste);
        if (liste.length > 0) setSecili(liste[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const arsFiyati = secili ? (secili.arsFiyatiUst || secili.arsFiyatiAlt || 0) : 0;
  const lot = parseInt(lotStr) || 0;
  const maliyet = arsFiyati * lot;

  const gunler = Array.from({ length: 10 }, (_, i) => {
    const gun = i + 1;
    const fiyat = arsFiyati * Math.pow(1.1, gun);
    const deger = fiyat * lot;
    const kar = deger - maliyet;
    const karYuzde = maliyet > 0 ? (kar / maliyet) * 100 : 0;
    return { gun, fiyat, deger, kar, karYuzde };
  });

  const tarih = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  async function handleKaydet() {
    if (!secili) return;
    setKayitLoading(true);
    try {
      // Önce ViewShot ile görsel dene
      if (viewRef.current) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          const uri = await (viewRef.current as any).capture();
          await MediaLibrary.saveToLibraryAsync(uri);
          Alert.alert("Kaydedildi", "Tavan raporu fotoğraf galerine kaydedildi.");
          setKayitLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback: PDF oluştur ve paylaş
    try {
      const satirlar = [
        `<tr style="background:#f5f5f5"><td style="padding:10px 8px;color:#555">Arz Günü</td><td style="padding:10px 8px;text-align:right">${fmt(arsFiyati)} ₺</td><td style="padding:10px 8px;text-align:right">${fmt(maliyet)} ₺</td><td style="padding:10px 8px;text-align:right;color:#999">–</td><td style="padding:10px 8px;text-align:right;color:#999">–</td></tr>`,
        ...gunler.map((g, i) => `<tr style="background:${i % 2 === 0 ? "#fff" : "#f9f9f9"}"><td style="padding:10px 8px">${g.gun}. Tavan</td><td style="padding:10px 8px;text-align:right;font-weight:600">${fmt(g.fiyat)} ₺</td><td style="padding:10px 8px;text-align:right">${fmt(g.deger)} ₺</td><td style="padding:10px 8px;text-align:right;color:#16a34a;font-weight:600">+${fmt(g.kar)} ₺</td><td style="padding:10px 8px;text-align:right;color:#16a34a;font-weight:700">%${fmt(g.karYuzde, 1)}</td></tr>`),
      ].join("");

      const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${secili.ticker} Tavan Raporu</title>
      <style>body{font-family:Arial,sans-serif;color:#222;margin:0;padding:32px}h1{font-size:18px;margin:0 0 4px}.meta{font-size:12px;color:#666;margin-bottom:24px}table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;padding:10px 8px;border-bottom:2px solid #ddd;color:#555;font-weight:600}th:not(:first-child){text-align:right}td{border-bottom:1px solid #eee}.note{font-size:11px;color:#999;margin-top:20px}.brand{font-size:11px;color:#bbb;margin-top:4px}</style>
      </head><body>
      <h1>${secili.ticker} — ${secili.sirketAdi}</h1>
      <div class="meta">10 Günlük Tavan Senaryosu &nbsp;|&nbsp; Arz Fiyatı: ${fmt(arsFiyati)} ₺ &nbsp;|&nbsp; ${lot} Lot &nbsp;|&nbsp; Maliyet: ${fmt(maliyet)} ₺ &nbsp;|&nbsp; ${tarih}</div>
      <table><thead><tr><th>Gün</th><th style="text-align:right">Hisse Fiyatı</th><th style="text-align:right">Toplam Değer</th><th style="text-align:right">Kâr (₺)</th><th style="text-align:right">Kâr (%)</th></tr></thead><tbody>${satirlar}</tbody></table>
      <div class="note">* Bu hesaplama her gün üst üste %10 tavan yapıldığı varsayımına dayanır. Bilgilendirme amaçlıdır.</div>
      <div class="brand">halkaarzlarim.com</div>
      </body></html>`;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: `${secili.ticker} Tavan Raporu` });
    } catch {
      Alert.alert("Hata", "Rapor oluşturulamadı, tekrar dene.");
    } finally {
      setKayitLoading(false);
    }
  }

  const filtreliArzlar = aramaStr
    ? arzlar.filter(a =>
        a.ticker?.toLowerCase().includes(aramaStr.toLowerCase()) ||
        a.sirketAdi?.toLowerCase().includes(aramaStr.toLowerCase())
      )
    : arzlar;

  return (
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Tavan Getiri Raporu</Text>
      </View>

      {loading ? (
        <View style={[s.flex1, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>
      ) : (
        <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>

          {/* Giriş kartı */}
          <View style={[s.card, { marginTop: 8, gap: 12 }]}>
            {/* Arz seçici */}
            <View>
              <Text style={[s.caption, { marginBottom: 6 }]}>Halka Arz Seç</Text>
              <TouchableOpacity
                onPress={() => setPicker(true)}
                style={[s.input, s.row, { justifyContent: "space-between" }]}
              >
                <Text style={{ color: secili ? colors.text : colors.dim, flex: 1, fontSize: 14 }} numberOfLines={1}>
                  {secili ? `${secili.ticker} — ${secili.sirketAdi}` : "Arz seçin..."}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.dim} />
              </TouchableOpacity>
            </View>

            {/* Lot sayısı */}
            <View>
              <Text style={[s.caption, { marginBottom: 6 }]}>Lot Sayısı</Text>
              <TextInput
                style={s.input}
                value={lotStr}
                onChangeText={setLotStr}
                keyboardType="number-pad"
                placeholder="100"
                placeholderTextColor={colors.dim}
              />
            </View>

            {/* Özet bilgiler */}
            {secili && (
              <View style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, gap: 4 }}>
                <View style={s.row}>
                  <Text style={s.caption}>Halka Arz Fiyatı: </Text>
                  <Text style={[s.caption, { color: colors.text, fontWeight: "600" }]}>₺{fmt(arsFiyati)}</Text>
                  <Text style={[s.caption, { marginHorizontal: 8 }]}>•</Text>
                  <Text style={s.caption}>Toplam Maliyet: </Text>
                  <Text style={[s.caption, { color: colors.text, fontWeight: "600" }]}>₺{fmt(maliyet)}</Text>
                </View>
                {secili.araciKurum && (
                  <Text style={s.caption} numberOfLines={1}>Aracı Kurum: <Text style={{ color: colors.muted }}>{secili.araciKurum}</Text></Text>
                )}
              </View>
            )}
          </View>

          {/* Rapor (ViewShot ile sarılı) */}
          <ViewShot ref={viewRef} options={{ format: "jpg", quality: 0.95 }}>
            <View style={[s.card, { marginTop: 14, backgroundColor: colors.card }]}>

              {/* Rapor başlığı */}
              <View style={[s.row, { justifyContent: "space-between", marginBottom: 12 }]}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <View style={[s.row, { gap: 6, marginBottom: 3 }]}>
                    <Ionicons name="trending-up" size={15} color={colors.green} />
                    <Text style={[s.body, { fontWeight: "700", fontSize: 14 }]} numberOfLines={2}>
                      {secili ? `${secili.ticker} — ${secili.sirketAdi}` : "–"}
                    </Text>
                  </View>
                  <Text style={[s.caption, { lineHeight: 16 }]}>
                    10 Günlük Tavan Senaryosu • Arz: ₺{fmt(arsFiyati)} • {lot} Lot • Maliyet: ₺{fmt(maliyet)}
                  </Text>
                  <Text style={[s.caption, { marginTop: 2, color: colors.dim }]}>Rapor Tarihi: {tarih}</Text>
                </View>
                <TouchableOpacity
                  onPress={handleKaydet}
                  disabled={kayitLoading || !secili}
                  style={{
                    backgroundColor: `${colors.amber}18`, borderRadius: 12,
                    borderWidth: 1, borderColor: `${colors.amber}40`,
                    paddingHorizontal: 10, paddingVertical: 8,
                    alignItems: "center", gap: 4, opacity: (!secili || kayitLoading) ? 0.5 : 1,
                  }}
                >
                  {kayitLoading
                    ? <ActivityIndicator size="small" color={colors.amber} />
                    : <Ionicons name="download" size={18} color={colors.amber} />
                  }
                  <Text style={{ fontSize: 10, fontWeight: "700", color: colors.amber }}>Kaydet</Text>
                </TouchableOpacity>
              </View>

              {/* Tablo başlığı */}
              <View style={[s.row, { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text style={[s.caption, { fontWeight: "700", flex: 1.2 }]}>Gün</Text>
                <Text style={[s.caption, { fontWeight: "700", flex: 1, textAlign: "right" }]}>Fiyat</Text>
                <Text style={[s.caption, { fontWeight: "700", flex: 1.2, textAlign: "right" }]}>Toplam</Text>
                <Text style={[s.caption, { fontWeight: "700", flex: 1, textAlign: "right" }]}>Kâr ₺</Text>
                <Text style={[s.caption, { fontWeight: "700", flex: 0.8, textAlign: "right" }]}>%</Text>
              </View>

              {/* Arz günü satırı */}
              <View style={[s.row, { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: `${colors.border}60` }]}>
                <Text style={[s.caption, { color: colors.muted, flex: 1.2 }]}>Arz Günü</Text>
                <Text style={[s.caption, { color: colors.text, fontWeight: "600", flex: 1, textAlign: "right" }]}>₺{fmt(arsFiyati)}</Text>
                <Text style={[s.caption, { color: colors.text, flex: 1.2, textAlign: "right" }]}>₺{fmt(maliyet)}</Text>
                <Text style={[s.caption, { color: colors.dim, flex: 1, textAlign: "right" }]}>–</Text>
                <Text style={[s.caption, { color: colors.dim, flex: 0.8, textAlign: "right" }]}>–</Text>
              </View>

              {/* Tavan satırları */}
              {gunler.map((g, i) => (
                <View
                  key={g.gun}
                  style={[
                    s.row,
                    {
                      paddingVertical: 10,
                      borderBottomWidth: i < 9 ? 1 : 0,
                      borderBottomColor: `${colors.border}60`,
                      backgroundColor: g.gun === 10 ? `${colors.amber}08` : "transparent",
                    },
                  ]}
                >
                  <Text style={[s.caption, { color: colors.muted, flex: 1.2 }]}>{g.gun}. Tavan</Text>
                  <Text style={[s.caption, { color: colors.text, fontWeight: "600", flex: 1, textAlign: "right" }]}>₺{fmt(g.fiyat)}</Text>
                  <Text style={[s.caption, { color: colors.text, flex: 1.2, textAlign: "right" }]}>₺{fmt(g.deger)}</Text>
                  <Text style={[s.caption, { color: colors.green, fontWeight: "600", flex: 1, textAlign: "right" }]}>+{fmt(g.kar)}</Text>
                  <Text style={[s.caption, { color: colors.green, fontWeight: "700", flex: 0.8, textAlign: "right" }]}>%{fmt(g.karYuzde, 1)}</Text>
                </View>
              ))}

              {/* Alt not */}
              <View style={{ paddingTop: 12, marginTop: 4, borderTopWidth: 1, borderTopColor: `${colors.border}60` }}>
                <Text style={[s.caption, { color: colors.dim, lineHeight: 16 }]}>
                  * Bu hesaplama her gün üst üste %10 tavan yapıldığı varsayımına dayanır. Gerçek piyasa koşulları farklılık gösterebilir. Bu rapor bilgilendirme amaçlıdır, yatırım tavsiyesi değildir.
                </Text>
                <Text style={[s.caption, { color: colors.dim, marginTop: 3 }]}>halkaarzlarim.com</Text>
              </View>
            </View>
          </ViewShot>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Arz Seçici Modal */}
      <Modal visible={picker} animationType="slide" transparent onRequestClose={() => setPicker(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.6)" }}>
          <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: colors.border, maxHeight: "80%" }}>
            <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, justifyContent: "space-between" }]}>
              <Text style={[s.body, { fontWeight: "700" }]}>Halka Arz Seç</Text>
              <TouchableOpacity onPress={() => setPicker(false)}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
              <View style={[s.row, { backgroundColor: colors.bg, borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border }]}>
                <Ionicons name="search" size={16} color={colors.dim} />
                <TextInput
                  style={{ flex: 1, color: colors.text, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14 }}
                  placeholder="Şirket veya sembol ara..."
                  placeholderTextColor={colors.dim}
                  value={aramaStr}
                  onChangeText={setAramaStr}
                  autoFocus
                />
              </View>
            </View>
            <FlatList
              data={filtreliArzlar}
              keyExtractor={a => a.slug}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { setSecili(item); setPicker(false); setAramaStr(""); }}
                  style={[s.row, { paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: `${colors.border}60`, gap: 10, backgroundColor: secili?.slug === item.slug ? `${colors.green}12` : "transparent" }]}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${colors.green}18`, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: colors.green, fontWeight: "700", fontSize: 11 }}>{item.ticker?.slice(0, 3)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.body, { fontSize: 14, fontWeight: "600" }]} numberOfLines={1}>{item.sirketAdi}</Text>
                    <Text style={s.caption}>{item.ticker} • ₺{fmt(item.arsFiyatiUst || item.arsFiyatiAlt || 0)}</Text>
                  </View>
                  {secili?.slug === item.slug && <Ionicons name="checkmark-circle" size={18} color={colors.green} />}
                </TouchableOpacity>
              )}
              style={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
