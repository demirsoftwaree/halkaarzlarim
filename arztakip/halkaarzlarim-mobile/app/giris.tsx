import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function Giris() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [gizle, setGizle] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (!id_token) { Alert.alert("Hata", "Google token alınamadı."); return; }
      setGoogleLoading(true);
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace("/(tabs)/hesabim"))
        .catch(() => Alert.alert("Hata", "Google ile giriş başarısız."))
        .finally(() => setGoogleLoading(false));
    } else if (response?.type === "error") {
      Alert.alert("Hata", "Google ile giriş iptal edildi.");
    }
  }, [response]);

  async function handleGiris() {
    if (!email || !sifre) return Alert.alert("Hata", "E-posta ve şifre gerekli.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, sifre);
      router.replace("/(tabs)/hesabim");
    } catch {
      Alert.alert("Giriş Başarısız", "E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.flex1}>
        <View style={[s.flex1, { paddingHorizontal: 24, justifyContent: "center" }]}>
          <TouchableOpacity onPress={() => router.back()} style={{ position: "absolute", top: 16, left: 0 }}>
            <Ionicons name="arrow-back" size={24} color={colors.muted} />
          </TouchableOpacity>

          <View style={[s.center, { marginBottom: 40 }]}>
            <View style={[s.iconBox, { width: 64, height: 64, borderRadius: 20, marginBottom: 16 }]}>
              <Ionicons name="trending-up" size={32} color={colors.green} />
            </View>
            <Text style={[s.title, { fontSize: 28 }]}>Giriş Yap</Text>
            <Text style={[s.bodyMuted, { marginTop: 8 }]}>HalkaArzlarım hesabına giriş yap</Text>
          </View>

          {/* Google ile Giriş */}
          <TouchableOpacity
            onPress={() => promptAsync()}
            disabled={!request || googleLoading}
            style={{
              flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
              backgroundColor: "#fff", borderRadius: 14, paddingVertical: 13,
              marginBottom: 16, opacity: (!request || googleLoading) ? 0.6 : 1,
            }}
          >
            {googleLoading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <>
                {/* Google G logosu */}
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#4285F4", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "900", fontSize: 12, lineHeight: 14 }}>G</Text>
                </View>
                <Text style={{ color: "#111", fontWeight: "700", fontSize: 15 }}>Google ile Giriş Yap</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Ayırıcı */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text style={{ color: colors.dim, fontSize: 12 }}>veya</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          {/* E-posta / Şifre */}
          <View style={{ gap: 12 }}>
            <View>
              <Text style={[s.caption, { marginBottom: 4 }]}>E-posta</Text>
              <TextInput
                style={s.input}
                value={email} onChangeText={setEmail}
                keyboardType="email-address" autoCapitalize="none"
                placeholder="ornek@email.com" placeholderTextColor={colors.dim}
              />
            </View>
            <View>
              <Text style={[s.caption, { marginBottom: 4 }]}>Şifre</Text>
              <View style={[s.row, { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16 }]}>
                <TextInput
                  style={[s.flex1, { color: colors.text, paddingVertical: 12 }]}
                  value={sifre} onChangeText={setSifre}
                  secureTextEntry={gizle} placeholder="••••••••" placeholderTextColor={colors.dim}
                />
                <TouchableOpacity onPress={() => setGizle(!gizle)}>
                  <Ionicons name={gizle ? "eye-off" : "eye"} size={20} color={colors.dim} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={handleGiris} disabled={loading} style={[s.btn, { marginTop: 24 }]}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Giriş Yap</Text>}
          </TouchableOpacity>

          <View style={[s.row, { justifyContent: "center", marginTop: 24, gap: 4 }]}>
            <Text style={s.bodyMuted}>Hesabın yok mu?</Text>
            <TouchableOpacity onPress={() => router.push("/kayit")}>
              <Text style={{ color: colors.green, fontWeight: "600" }}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
