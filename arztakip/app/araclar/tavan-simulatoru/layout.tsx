import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tavan Simülatörü — Halka Arz Kaç Gün Tavan Yapar?",
  description:
    "Halka arz kaç gün tavan yapar ve ne kadar kazandırır? Tavan simülatörü ile arz fiyatı ve lot sayısına göre her tavan günündeki kârını anında hesapla.",
  keywords: ["tavan simülatörü", "halka arz kaç gün tavan yapar", "halka arz tavan hesaplama", "halka arz tavan", "halka arz kazanç", "BIST tavan", "halka arz en fazla kaç tavan yapar"],
  openGraph: {
    title: "Tavan Simülatörü | HalkaArzlarım",
    description: "Halka arz tavan simülatörü — kaç tavan giderse ne kadar kazanırsın? Hemen hesapla.",
    url: "https://www.halkaarzlarim.com/araclar/tavan-simulatoru",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/araclar/tavan-simulatoru" },
};

export default function TavanSimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
