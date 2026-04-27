import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

function fmt(n: number) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TavanSimulatoru() {
  const router = useRouter();
  const [arsFiyati, setArsFiyati] = useState("80");
  const [adet, setAdet] = useState("10");
  const [tavanSayisi, setTavanSayisi] = useState(5);

  const fiyat = parseFloat(arsFiyati) || 0;
  const hisseSayisi = parseInt(adet) || 0;
  const alimMaliyeti = fiyat * hisseSayisi;

  const tavanlar = Array.from({ length: tavanSayisi }, (_, i) => {
    const gun = i + 1;
    const tavanFiyat = fiyat * Math.pow(1.1, gun);
    const toplamDeger = tavanFiyat * hisseSayisi;
    const brutKar = toplamDeger - alimMaliyeti;
    const roi = alimMaliyeti > 0 ? (brutKar / alimMaliyeti) * 100 : 0;
    return { gun, tavanFiyat, toplamDeger, brutKar, roi };
  });

  const sonTavan = tavanlar[tavanSayisi - 1];

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Tavan Simülatörü</Text>
          <Text style={s.caption}>BIST %10 günlük tavan limiti üzerinden hesaplama</Text>
        </View>
      </View>

      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>

        {/* Bilgi notu */}
        <View style={{ marginTop: 8, marginBottom: 16, backgroundColor: `${colors.blue}08`, borderWidth: 1, borderColor: `${colors.blue}25`, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
            <Text style={{ color: colors.blue, fontWeight: "600" }}>Nasıl çalışır?</Text>
            {" "}Arz fiyatını ve aldığın hisse adedini gir; her tavan günündeki brüt kârını gör.
          </Text>
        </View>

        {/* Input kartı */}
        <View style={[s.card, { marginBottom: 16 }]}>
          <Text style={[s.body, { fontWeight: "700", marginBottom: 16 }]}>Parametreler</Text>

          {/* İki kolon input */}
          <View style={[s.row, { gap: 12, marginBottom: 16 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[s.caption, { marginBottom: 6 }]}>Halka Arz Fiyatı (₺)</Text>
              <TextInput
                style={s.input}
                value={arsFiyati}
                onChangeText={setArsFiyati}
                keyboardType="decimal-pad"
                placeholder="80.00"
                placeholderTextColor={colors.dim}
              />
              <Text style={[s.caption, { marginTop: 4, fontSize: 10 }]}>Hisse başına fiyat</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.caption, { marginBottom: 6 }]}>Aldığın Hisse Adedi</Text>
              <TextInput
                style={s.input}
                value={adet}
                onChangeText={setAdet}
                keyboardType="number-pad"
                placeholder="10"
                placeholderTextColor={colors.dim}
              />
              <Text style={[s.caption, { marginTop: 4, fontSize: 10 }]}>
                {fiyat > 0 && hisseSayisi > 0
                  ? <Text style={{ color: colors.muted }}>Maliyet: ₺{fmt(alimMaliyeti)}</Text>
                  : "Lot = hisse adedi"}
              </Text>
            </View>
          </View>

          {/* Tavan seçici */}
          <View>
            <View style={[s.row, { justifyContent: "space-between", marginBottom: 10 }]}>
              <Text style={s.caption}>Kaç tavana kadar hesaplayalım?</Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.green }}>{tavanSayisi} tavan</Text>
            </View>
            <View style={[s.row, { gap: 6 }]}>
              {Array.from({ length: 10 }, (_, i) => {
                const n = i + 1;
                const aktif = n <= tavanSayisi;
                return (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setTavanSayisi(n)}
                    style={{
                      flex: 1, height: 32, borderRadius: 8,
                      backgroundColor: aktif ? colors.green : colors.border,
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "700", color: aktif ? "#fff" : colors.dim }}>{n}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Özet kartlar */}
        {alimMaliyeti > 0 && (
          <View style={[s.row, { gap: 10, marginBottom: 16 }]}>
            <View style={[s.card, { flex: 1, padding: 12, alignItems: "center" }]}>
              <Text style={[s.caption, { marginBottom: 4, textAlign: "center" }]}>Toplam Maliyetin</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.text }}>₺{fmt(alimMaliyeti)}</Text>
              <Text style={[s.caption, { fontSize: 10, marginTop: 2 }]}>{hisseSayisi} hisse × ₺{fmt(fiyat)}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: `${colors.green}10`, borderRadius: 16, borderWidth: 1, borderColor: `${colors.green}25`, padding: 12, alignItems: "center" }}>
              <Text style={[s.caption, { marginBottom: 4, textAlign: "center" }]}>{tavanSayisi}. Tavanda Kâr</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.green }}>+₺{fmt(sonTavan?.brutKar ?? 0)}</Text>
              <Text style={[s.caption, { fontSize: 10, marginTop: 2, color: colors.green }]}>brüt kâr</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: `${colors.blue}10`, borderRadius: 16, borderWidth: 1, borderColor: `${colors.blue}25`, padding: 12, alignItems: "center" }}>
              <Text style={[s.caption, { marginBottom: 4, textAlign: "center" }]}>{tavanSayisi}. Tavan ROI</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.blue }}>%{(sonTavan?.roi ?? 0).toFixed(1)}</Text>
              <Text style={[s.caption, { fontSize: 10, marginTop: 2 }]}>getiri</Text>
            </View>
          </View>
        )}

        {/* Tablo */}
        {alimMaliyeti > 0 && (
          <View style={[s.card, { padding: 0, overflow: "hidden", marginBottom: 12 }]}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={[s.body, { fontWeight: "700" }]}>Tavan Tavan Kâr Tablosu</Text>
              <Text style={[s.caption, { marginTop: 2 }]}>Her satır: o gün tavan fiyatından satarsan ne kazanırsın?</Text>
            </View>

            {/* Tablo başlığı */}
            <View style={[s.row, { backgroundColor: "rgba(51,65,85,0.4)", paddingHorizontal: 16, paddingVertical: 8 }]}>
              <Text style={[s.caption, { fontWeight: "700", width: 56 }]}>Tavan</Text>
              <Text style={[s.caption, { fontWeight: "700", flex: 1, textAlign: "right" }]}>Hisse Fiyatı</Text>
              <Text style={[s.caption, { fontWeight: "700", width: 80, textAlign: "right" }]}>Port. Değer</Text>
              <Text style={[s.caption, { fontWeight: "700", width: 72, textAlign: "right", color: colors.green }]}>Brüt Kâr</Text>
            </View>

            {tavanlar.map(({ gun, tavanFiyat, toplamDeger, brutKar, roi }) => {
              const renk = gun <= 3 ? colors.green : gun <= 6 ? colors.amber : "#ec4899";
              return (
                <View key={gun} style={[s.row, { paddingHorizontal: 16, paddingVertical: 11, borderTopWidth: 1, borderTopColor: "rgba(51,65,85,0.4)" }]}>
                  <View style={{ width: 56, flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: `${renk}20`, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: renk }}>{gun}</Text>
                    </View>
                    <Text style={{ fontSize: 10, color: colors.dim }}>%{(Math.pow(1.1, gun) * 100 - 100).toFixed(0)}</Text>
                  </View>
                  <Text style={[s.caption, { flex: 1, color: colors.text, textAlign: "right", fontWeight: "500" }]}>₺{fmt(tavanFiyat)}</Text>
                  <Text style={[s.caption, { width: 80, textAlign: "right" }]}>₺{fmt(toplamDeger)}</Text>
                  <Text style={{ width: 72, textAlign: "right", fontSize: 12, fontWeight: "700", color: colors.green }}>+₺{fmt(brutKar)}</Text>
                </View>
              );
            })}
          </View>
        )}

        <Text style={[s.caption, { textAlign: "center", marginBottom: 32, lineHeight: 18 }]}>
          ⚠️ Brüt kâr gösterilmektedir. Komisyon ve stopaj dahil değildir. Yatırım tavsiyesi değildir.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
