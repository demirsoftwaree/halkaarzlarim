import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

function fmtN(n: number) {
  return n.toLocaleString("tr-TR");
}

function kisBasiHesapla(lot: number, kisi: number): number {
  if (!kisi || !lot) return 0;
  return Math.floor(lot / kisi);
}

const SENARYOLAR = [
  { key: "iyimser",  label: "İyimser",  carpan: 0.5, bg: `${colors.green}18`, border: `${colors.green}35`, labelColor: colors.green },
  { key: "baz",      label: "Baz",      carpan: 1,   bg: `${colors.blue}18`,  border: `${colors.blue}35`,  labelColor: colors.blue },
  { key: "kotumser", label: "Kötümser", carpan: 2,   bg: "#be185d18",         border: "#be185d35",         labelColor: "#f472b6" },
];

export default function LotDagitim() {
  const router = useRouter();
  const [lotStr, setLotStr] = useState("1000000");
  const [kisiStr, setKisiStr] = useState("300000");

  const lot  = parseInt(lotStr.replace(/\D/g, "")) || 0;
  const kisi = parseInt(kisiStr.replace(/\D/g, "")) || 0;
  const kisBasi = kisBasiHesapla(lot, kisi);

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Lot Dağıtım Hesaplayıcı</Text>
      </View>

      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>

        {/* Giriş kartı */}
        <View style={[s.card, { marginTop: 8, gap: 14 }]}>
          <Text style={[s.caption, { marginBottom: 2 }]}>Kaç kişi başvurursa kaç lot düşer?</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[s.caption, { marginBottom: 6 }]}>Dağıtılacak Lot</Text>
              <TextInput
                style={s.input}
                value={lotStr}
                onChangeText={setLotStr}
                keyboardType="number-pad"
                placeholder="1000000"
                placeholderTextColor={colors.dim}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.caption, { marginBottom: 6 }]}>Başvuran Kişi</Text>
              <TextInput
                style={s.input}
                value={kisiStr}
                onChangeText={setKisiStr}
                keyboardType="number-pad"
                placeholder="300000"
                placeholderTextColor={colors.dim}
              />
            </View>
          </View>
        </View>

        {/* Sonuç kartı */}
        <View style={[s.card, { marginTop: 14 }]}>
          <Text style={[s.body, { fontWeight: "700", marginBottom: 16 }]}>Sonuç</Text>
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={s.caption}>Dağıtılacak Lot</Text>
              <Text style={[s.body, { fontWeight: "800", fontSize: 20, marginTop: 2 }]}>{fmtN(lot)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.caption}>Başvuran Kişi</Text>
              <Text style={[s.body, { fontWeight: "800", fontSize: 20, marginTop: 2 }]}>{fmtN(kisi)}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: colors.border, marginBottom: 14 }} />
          <Text style={s.caption}>Kişi Başı Düşen Lot</Text>
          <Text style={[{
            fontWeight: "800", fontSize: 34, marginTop: 4,
            color: kisBasi >= 3 ? colors.green : kisBasi >= 1 ? colors.amber : colors.red,
          }]}>
            {kisBasi > 0 ? `${fmtN(kisBasi)} lot` : "0 lot"}
          </Text>
          {kisBasi === 0 && kisi > 0 && lot > 0 && (
            <Text style={[s.caption, { marginTop: 4, color: colors.red }]}>Başvuran sayısı lot sayısından fazla — herkes alamaz.</Text>
          )}
        </View>

        {/* Senaryo tablosu */}
        <Text style={[s.body, { fontWeight: "700", marginTop: 24, marginBottom: 12 }]}>Senaryo Tablosu</Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 32 }}>
          {SENARYOLAR.map(({ key, label, carpan, bg, border, labelColor }) => {
            const senKisi  = Math.round(kisi * carpan);
            const senBasi  = kisBasiHesapla(lot, senKisi);
            return (
              <View key={key} style={{ flex: 1, backgroundColor: bg, borderRadius: 16, borderWidth: 1, borderColor: border, padding: 14 }}>
                <Text style={{ color: labelColor, fontWeight: "800", fontSize: 15, marginBottom: 12 }}>{label}</Text>
                <Text style={[s.caption, { marginBottom: 2 }]}>Başvuran</Text>
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 13, marginBottom: 10 }}>{fmtN(senKisi)} kişi</Text>
                <Text style={[s.caption, { marginBottom: 2 }]}>Kişi başı</Text>
                <Text style={{ color: labelColor, fontWeight: "800", fontSize: 18 }}>{senBasi} lot</Text>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
