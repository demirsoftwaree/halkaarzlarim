import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tavan Simülatörü — Halka Arz Tavan Kazancı Hesapla",
  description:
    "Halka arz tavan simülatörü ile kaç tavan giderse ne kadar kazanırsın hesapla. Arz fiyatı ve lot sayısına göre anında tavan getiri tablosu.",
  keywords: ["tavan simülatörü", "halka arz tavan", "tavan hesaplama", "halka arz kazanç", "BIST tavan"],
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
