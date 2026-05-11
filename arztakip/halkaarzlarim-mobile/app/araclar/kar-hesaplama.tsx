import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";

function fmt(n: number) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function KarHesaplama() {
  const router = useRouter();
  const [arzFiyat, setArzFiyat] = useState("50");
  const [satisFiyat, setSatisFiyat] = useState("60");
  const [lot, setLot] = useState("100");
  const [komisyon, setKomisyon] = useState("0.3");

  const a = parseFloat(arzFiyat) || 0;
  const ss = parseFloat(satisFiyat) || 0;
  const l = parseInt(lot) || 0;
  const k = parseFloat(komisyon) || 0;

  const yatirim = a * l;
  const gelir = ss * l;
  const kom = (gelir * k) / 100;
  const net = gelir - yatirim - kom;
  const yuzde = yatirim > 0 ? (net / yatirim) * 100 : 0;

  return (
    <SafeAreaView style={s.screen}>
      <View style={[s.row, { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.body, { fontWeight: "700", fontSize: 20 }]}>Kâr Hesaplama</Text>
      </View>

      <ScrollView style={[s.flex1, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>
        <View style={[s.card, { marginTop: 8 }]}>
          {[
            { label: "Arz Fiyatı (₺)", value: arzFiyat, set: setArzFiyat },
            { label: "Satış Fiyatı (₺)", value: satisFiyat, set: setSatisFiyat },
            { label: "Lot Sayısı", value: lot, set: setLot },
            { label: "Komisyon (%)", value: komisyon, set: setKomisyon },
          ].map(({ label, value, set }) => (
            <View key={label} style={{ marginBottom: 12 }}>
              <Text style={[s.caption, { marginBottom: 4 }]}>{label}</Text>
              <TextInput
                style={s.input}
                value={value}
                onChangeText={set}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.dim}
              />
            </View>
          ))}
        </View>

        <View style={{ marginTop: 16, gap: 12 }}>
          <View style={[s.card, s.row, { justifyContent: "space-between" }]}>
            <Text style={s.bodyMuted}>Toplam Yatırım</Text>
            <Text style={[s.body, { fontWeight: "700" }]}>₺{fmt(yatirim)}</Text>
          </View>
          <View style={[s.card, s.row, { justifyContent: "space-between" }]}>
            <Text style={s.bodyMuted}>Satış Geliri</Text>
            <Text style={[s.body, { fontWeight: "700" }]}>₺{fmt(gelir)}</Text>
          </View>
          <View style={[s.card, s.row, { justifyContent: "space-between" }]}>
            <Text style={s.bodyMuted}>Komisyon</Text>
            <Text style={{ color: colors.red, fontWeight: "700" }}>-₺{fmt(kom)}</Text>
          </View>
          <View style={[s.row, { justifyContent: "space-between", alignItems: "center", borderRadius: 16, padding: 16, borderWidth: 1, backgroundColor: net >= 0 ? `${colors.green}10` : `${colors.red}10`, borderColor: net >= 0 ? `${colors.green}30` : `${colors.red}30` }]}>
            <View>
              <Text style={s.caption}>Net Kâr</Text>
              <Text style={{ fontWeight: "700", fontSize: 24, color: net >= 0 ? colors.green : colors.red }}>
                {net >= 0 ? "+" : ""}₺{fmt(net)}
              </Text>
            </View>
            <Text style={{ fontWeight: "700", fontSize: 20, color: net >= 0 ? colors.green : colors.red }}>
              %{fmt(yuzde)}
            </Text>
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
