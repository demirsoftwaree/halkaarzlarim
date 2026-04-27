import { View, Text } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { colors } from "@/lib/styles";

/**
 * Ücretsiz kullanıcılara reklam gösterir.
 * Gerçek AdMob entegrasyonu EAS Build sonrası yapılacak:
 *   npm install react-native-google-mobile-ads
 *   BannerAd ile değiştirilecek
 */
export default function AdBanner({ style }: { style?: object }) {
  const { isPremium } = useAuth();
  if (isPremium) return null;

  return (
    <View style={[{
      marginHorizontal: 16,
      marginVertical: 8,
      height: 60,
      backgroundColor: colors.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    }, style]}>
      <Text style={{ fontSize: 9, color: colors.dim, letterSpacing: 0.5, textTransform: "uppercase" }}>
        Reklam
      </Text>
      <Text style={{ fontSize: 10, color: colors.dim }}>
        Reklamsız kullanmak için Premium'a geç →
      </Text>
    </View>
  );
}
