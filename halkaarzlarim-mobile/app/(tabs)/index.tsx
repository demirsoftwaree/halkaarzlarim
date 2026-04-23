import { useEffect, useRef, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, RefreshControl,
  ActivityIndicator, Image, Animated, Easing, TextInput,
  KeyboardAvoidingView, Platform, Modal, FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, s } from "@/lib/styles";

// ─── Types ───────────────────────────────────────────────────
interface Arz {
  id: string; slug: string; sirketAdi: string; ticker: string;
  arsFiyatiAlt: number; arsFiyatiUst: number; durum: string;
  talepBaslangic?: string; talepBitis?: string; logo?: string;
}
interface TickerItem { symbol: string; value: string; change: string; positive: boolean; }
interface ChatMsg { role: "user" | "assistant"; content: string; }

const API_ARZLAR = "https://halkaarzlarim.com/api/arzlar";
const API_TICKER = "https://halkaarzlarim.com/api/ticker";
const API_CHAT   = "https://halkaarzlarim.com/api/chat";

const PLACEHOLDER_TICKER: TickerItem[] = [
  { symbol: "BIST 30",  value: "…", change: "", positive: true },
  { symbol: "BIST 100", value: "…", change: "", positive: true },
  { symbol: "USD/TRY",  value: "…", change: "", positive: true },
  { symbol: "EUR/TRY",  value: "…", change: "", positive: true },
  { symbol: "GBP/TRY",  value: "…", change: "", positive: true },
  { symbol: "ALTIN/gr", value: "…", change: "", positive: true },
];

// ─── TickerBant ───────────────────────────────────────────────
function TickerBant() {
  const [items, setItems] = useState<TickerItem[]>(PLACEHOLDER_TICKER);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ITEM_W = 160;
  const total = items.length * 2 * ITEM_W;

  useEffect(() => {
    fetch(API_TICKER)
      .then(r => r.json())
      .then(d => { if (d.ticker?.length) setItems(d.ticker); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollX.setValue(0);
    const dist = items.length * ITEM_W;
    const anim = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -dist,
        duration: (dist / 55) * 1000, // sabit 55px/s
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [items]);

  const doubled = [...items, ...items];

  return (
    <View style={{ height: 36, backgroundColor: "#0f172a", borderBottomWidth: 1, borderBottomColor: colors.border, overflow: "hidden" }}>
      <Animated.View style={{ flexDirection: "row", transform: [{ translateX: scrollX }] }}>
        {doubled.map((item, i) => (
          <View key={i} style={{ width: ITEM_W, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, height: 36 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.muted }}>{item.symbol}</Text>
            <Text style={{ fontSize: 11, fontWeight: "500", color: colors.text }}>{item.value}</Text>
            {item.change ? (
              <Text style={{ fontSize: 10, fontWeight: "700", color: item.positive ? colors.green : colors.red }}>{item.change}</Text>
            ) : null}
            <Text style={{ color: colors.border, marginLeft: 2 }}>|</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

// ─── ARZ AI Chat ──────────────────────────────────────────────
function ChatModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Merhaba! Ben ARZ AI. Halka arz, lot dağıtımı, SPK mevzuatı veya BIST hakkında sorularını yanıtlayabilirim. Ne öğrenmek istersin?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && messages.length > 1) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, visible]);

  function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // React Native'de ReadableStream güvenilmez — XHR ile streaming
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_CHAT);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onprogress = () => {
      const chunk = xhr.responseText;
      setMessages(prev => {
        const upd = [...prev];
        upd[upd.length - 1] = { role: "assistant", content: chunk };
        return upd;
      });
      flatRef.current?.scrollToEnd({ animated: false });
    };
    xhr.onload = () => {
      if (xhr.status !== 200) {
        setMessages(prev => {
          const upd = [...prev];
          upd[upd.length - 1] = { role: "assistant", content: "Yanıt alınamadı, tekrar dene." };
          return upd;
        });
      }
      setLoading(false);
    };
    xhr.onerror = () => {
      setMessages(prev => {
        const upd = [...prev];
        upd[upd.length - 1] = { role: "assistant", content: "Bağlantı hatası, tekrar dene." };
        return upd;
      });
      setLoading(false);
    };
    xhr.send(JSON.stringify({ messages: next }));
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={{ backgroundColor: "#0f172a", borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: colors.border, maxHeight: 560, paddingBottom: insets.bottom }}>
            {/* Header */}
            <View style={[s.row, { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 }]}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: `${colors.green}20`, borderWidth: 1, borderColor: `${colors.green}40`, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="sparkles" size={16} color={colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.body, { fontWeight: "700" }]}>ARZ AI</Text>
                <Text style={s.caption}>Halka arz asistanı</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatRef}
              data={messages}
              keyExtractor={(_, i) => String(i)}
              style={{ maxHeight: 360, paddingHorizontal: 16, paddingTop: 12 }}
              onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => (
                <View style={{ flexDirection: item.role === "user" ? "row-reverse" : "row", gap: 8, marginBottom: 12 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: item.role === "assistant" ? `${colors.green}20` : `${colors.blue}20`, borderWidth: 1, borderColor: item.role === "assistant" ? `${colors.green}40` : `${colors.blue}40` }}>
                    <Ionicons name={item.role === "assistant" ? "sparkles" : "person"} size={13} color={item.role === "assistant" ? colors.green : colors.blue} />
                  </View>
                  <View style={{ maxWidth: "78%", backgroundColor: item.role === "assistant" ? colors.card : `${colors.green}25`, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderTopLeftRadius: item.role === "assistant" ? 4 : 16, borderTopRightRadius: item.role === "user" ? 4 : 16 }}>
                    {item.content ? (
                      <Text style={{ fontSize: 13, color: item.role === "assistant" ? colors.text : colors.text, lineHeight: 20 }}>{item.content}</Text>
                    ) : (
                      <ActivityIndicator size="small" color={colors.green} />
                    )}
                  </View>
                </View>
              )}
            />

            {/* Input */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
              <View style={[s.row, { gap: 8 }]}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Halka arz hakkında sor..."
                  placeholderTextColor={colors.dim}
                  style={{ flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: colors.text }}
                  onSubmitEditing={send}
                  returnKeyType="send"
                  editable={!loading}
                />
                <TouchableOpacity onPress={send} disabled={loading || !input.trim()}
                  style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: loading || !input.trim() ? colors.border : colors.green, alignItems: "center", justifyContent: "center" }}>
                  {loading
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Ionicons name="send" size={18} color="#fff" />}
                </TouchableOpacity>
              </View>
              <Text style={[s.caption, { textAlign: "center", marginTop: 8, fontSize: 10 }]}>Yatırım tavsiyesi değildir. Bilgi amaçlıdır.</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── ArzIcon ──────────────────────────────────────────────────
function ArzIcon({ logo, ticker }: { logo?: string; ticker: string }) {
  const [err, setErr] = useState(false);
  if (logo && !err) {
    return (
      <View style={[s.iconBox, { overflow: "hidden" }]}>
        <Image source={{ uri: logo }} style={{ width: 40, height: 40, borderRadius: 10 }} onError={() => setErr(true)} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={s.iconBox}>
      <Text style={{ color: colors.green, fontWeight: "700", fontSize: 13 }}>{ticker?.slice(0, 2)}</Text>
    </View>
  );
}

// ─── ArzKart ──────────────────────────────────────────────────
function ArzKart({ arz, onPress }: { arz: Arz; onPress: () => void }) {
  const isAktif = arz.durum === "aktif";
  const fiyat = arz.arsFiyatiAlt || arz.arsFiyatiUst
    ? arz.arsFiyatiAlt === arz.arsFiyatiUst ? `₺${arz.arsFiyatiUst}` : `₺${arz.arsFiyatiAlt} – ₺${arz.arsFiyatiUst}`
    : "";
  return (
    <TouchableOpacity onPress={onPress} style={[s.card, s.mb3]}>
      <View style={[s.row, { justifyContent: "space-between", marginBottom: fiyat ? 8 : 0 }]}>
        <View style={[s.row, s.gap3, { flex: 1 }]}>
          <ArzIcon logo={arz.logo} ticker={arz.ticker} />
          <View style={{ flex: 1 }}>
            <Text style={s.body} numberOfLines={1}>{arz.sirketAdi}</Text>
            <Text style={s.caption}>{arz.ticker}</Text>
          </View>
        </View>
        <View style={[s.badge, !isAktif && { backgroundColor: colors.border }]}>
          <Text style={[s.badgeText, !isAktif && { color: colors.muted }]}>{isAktif ? "Aktif" : arz.durum}</Text>
        </View>
      </View>
      {fiyat ? (
        <View style={[s.row, { justifyContent: "space-between" }]}>
          <Text style={s.caption}>Fiyat Aralığı</Text>
          <Text style={[s.caption, { color: colors.text }]}>{fiyat}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

// ─── Ana Sayfa ────────────────────────────────────────────────
export default function AnaSayfa() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aktif, setAktif] = useState<Arz[]>([]);
  const [son, setSon] = useState<Arz[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  async function fetchData() {
    try {
      const res = await fetch(API_ARZLAR);
      const json = await res.json();
      const SIRALAMA: Record<string, number> = { aktif: 0, yaklasan: 1, "basvuru-surecinde": 1, tamamlandi: 2, ertelendi: 3 };
      const all: Arz[] = (json.arzlar || [])
        .map((a: any) => ({ ...a, id: a.id || a.slug }))
        .sort((a: Arz, b: Arz) => {
          const sd = (SIRALAMA[a.durum] ?? 9) - (SIRALAMA[b.durum] ?? 9);
          if (sd !== 0) return sd;
          return (b.talepBitis || "").localeCompare(a.talepBitis || "");
        });
      setAktif(all.filter(a => a.durum === "aktif"));
      setSon(all.filter(a => a.durum !== "aktif").slice(0, 8));
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }

  useEffect(() => { fetchData(); }, []);

  if (loading) return <View style={[s.screen, s.center]}><ActivityIndicator color={colors.green} size="large" /></View>;

  return (
    <View style={[s.screen, { position: "relative" }]}>
      {/* Ticker şeridi */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#0f172a" }}>
        <TickerBant />
      </SafeAreaView>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.green} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {/* Badge */}
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: `${colors.green}40`, backgroundColor: `${colors.green}10` }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: aktif.length > 0 ? colors.green : colors.muted }} />
              <Text style={{ fontSize: 12, color: aktif.length > 0 ? colors.green : colors.muted, fontWeight: "600" }}>
                {aktif.length > 0 ? `Şu an ${aktif.length} aktif halka arz var` : "Şu an aktif halka arz yok"}
              </Text>
            </View>
          </View>

          {/* Başlık */}
          <Text style={{ fontSize: 26, fontWeight: "800", color: colors.text, lineHeight: 34 }}>
            Halka Arzı Takip Et,{"\n"}
            <Text style={{ color: colors.green }}>Kazancını Hesapla.</Text>
          </Text>
          <Text style={[s.bodyMuted, { marginTop: 10, lineHeight: 22 }]}>
            Takvim, tavan simülatörü ve lot hesaplama araçları — hepsi bir arada.
          </Text>

          {/* Butonlar */}
          <View style={[s.row, { gap: 10, marginTop: 20 }]}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/arzlar")}
              style={{ flex: 1, backgroundColor: colors.green, paddingVertical: 13, borderRadius: 14, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Takvimi Gör →</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(tabs)/araclar")}
              style={{ flex: 1, backgroundColor: colors.card, paddingVertical: 13, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>Araçları Dene</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Aktif Halka Arzlar */}
        <View style={[s.px4, { marginTop: 24 }]}>
          <View style={[s.row, { justifyContent: "space-between", marginBottom: 12 }]}>
            <Text style={s.heading}>Aktif Halka Arzlar</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/arzlar")}>
              <Text style={{ color: colors.green, fontSize: 14 }}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          {aktif.length === 0 ? (
            <View style={[s.card, s.center, { paddingVertical: 32 }]}>
              <Ionicons name="time-outline" size={32} color={colors.dim} />
              <Text style={[s.bodyMuted, { marginTop: 8, textAlign: "center" }]}>Şu an aktif halka arz yok.</Text>
            </View>
          ) : aktif.map(a => <ArzKart key={a.id} arz={a} onPress={() => router.push(`/arz/${a.slug}`)} />)}
        </View>

        {/* Son Halka Arzlar */}
        <View style={[s.px4, { marginTop: 24, marginBottom: 100 }]}>
          <View style={[s.row, { justifyContent: "space-between", marginBottom: 12 }]}>
            <Text style={s.heading}>Son Halka Arzlar</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/arzlar")}>
              <Text style={{ color: colors.green, fontSize: 14 }}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          {son.map(a => <ArzKart key={a.id} arz={a} onPress={() => router.push(`/arz/${a.slug}`)} />)}
        </View>
      </ScrollView>

      {/* Yapay Zekaya Sor butonu */}
      <TouchableOpacity
        onPress={() => setChatOpen(true)}
        style={{
          position: "absolute",
          bottom: 12,
          right: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: colors.green,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 999,
          shadowColor: colors.green,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="sparkles" size={18} color="#fff" />
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Yapay Zekaya Sor</Text>
      </TouchableOpacity>

      <ChatModal visible={chatOpen} onClose={() => setChatOpen(false)} />
    </View>
  );
}
