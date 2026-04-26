import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "@/lib/styles";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function Kayit() {
  const router = useRouter();
  const [ad, setAd] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
        .then(async ({ user }) => {
          // Firestore'da yoksa oluştur (merge: true → mevcut veriyi silmez)
          await setDoc(doc(db, "users", user.uid), {
            email: user.email ?? "",
            ad: user.displayName ?? "",
            premium: false,
            olusturmaTarihi: new Date(),
          }, { merge: true });
          router.replace("/(tabs)/hesabim");
        })
        .catch(() => Alert.alert("Hata", "Google ile kayıt başarısız."))
        .finally(() => setGoogleLoading(false));
    } else if (response?.type === "error") {
      Alert.alert("Hata", "Google ile giriş iptal edildi.");
    }
  }, [response]);

  async function handleKayit() {
    if (!ad || !email || !sifre) return Alert.alert("Hata", "Tüm alanları doldur.");
    if (sifre.length < 6) return Alert.alert("Hata", "Şifre en az 6 karakter olmalı.");
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, sifre);
      await updateProfile(user, { displayName: ad });
      await setDoc(doc(db, "users", user.uid), { email, ad, premium: false, olusturmaTarihi: new Date() });
      router.replace("/(tabs)/hesabim");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") Alert.alert("Hata", "Bu e-posta zaten kayıtlı.");
      else Alert.alert("Kayıt Başarısız", "Bir hata oluştu. Tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={s.flex1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={[s.flex1, { paddingHorizontal: 24, justifyContent: "center", paddingVertical: 48 }]}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 32 }}>
              <Ionicons name="arrow-back" size={24} color={colors.muted} />
            </TouchableOpacity>

            <Text style={[s.title, { fontSize: 28, marginBottom: 8 }]}>Kayıt Ol</Text>
            <Text style={[s.bodyMuted, { marginBottom: 32 }]}>Ücretsiz hesap oluştur</Text>

            {/* Google ile Kayıt */}
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
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#4285F4", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "900", fontSize: 12, lineHeight: 14 }}>G</Text>
                  </View>
                  <Text style={{ color: "#111", fontWeight: "700", fontSize: 15 }}>Google ile Devam Et</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Ayırıcı */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 10 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text style={{ color: colors.dim, fontSize: 12 }}>veya e-posta ile</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            <View style={{ gap: 12 }}>
              {[
                { label: "Ad Soyad", value: ad, set: setAd, placeholder: "Adın Soyadın", type: "default" as const },
                { label: "E-posta", value: email, set: setEmail, placeholder: "ornek@email.com", type: "email-address" as const },
              ].map(({ label, value, set, placeholder, type }) => (
                <View key={label}>
                  <Text style={[s.caption, { marginBottom: 4 }]}>{label}</Text>
                  <TextInput
                    style={s.input}
                    value={value} onChangeText={set} keyboardType={type}
                    autoCapitalize={type === "email-address" ? "none" : "words"}
                    placeholder={placeholder} placeholderTextColor={colors.dim}
                  />
                </View>
              ))}
              <View>
                <Text style={[s.caption, { marginBottom: 4 }]}>Şifre</Text>
                <TextInput
                  style={s.input}
                  value={sifre} onChangeText={setSifre} secureTextEntry
                  placeholder="En az 6 karakter" placeholderTextColor={colors.dim}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleKayit} disabled={loading} style={[s.btn, { marginTop: 24 }]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Kayıt Ol</Text>}
            </TouchableOpacity>

            <View style={[s.row, { justifyContent: "center", marginTop: 24, gap: 4 }]}>
              <Text style={s.bodyMuted}>Zaten hesabın var mı?</Text>
              <TouchableOpacity onPress={() => router.push("/giris")}>
                <Text style={{ color: colors.green, fontWeight: "600" }}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
