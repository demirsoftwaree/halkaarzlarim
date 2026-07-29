import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hisse Tavan Hesaplama — Halka Arz Tavan Simülatörü",
  description:
    "Ücretsiz hisse tavan hesaplama aracı. Halka arz kaç gün tavan yapar, ne kadar kazanırsın? Arz fiyatı ve lot sayısına göre anında tavan getiri tablosu.",
  keywords: [
    "hisse tavan hesaplama",
    "tavan simülatörü",
    "halka arz kaç gün tavan yapar",
    "halka arz tavan hesaplama",
    "tavan hesaplama",
    "halka arz tavan",
    "halka arz kazanç hesaplama",
    "BIST tavan",
  ],
  openGraph: {
    title: "Hisse Tavan Hesaplama — Halka Arz Tavan Simülatörü | HalkaArzlarım",
    description: "Halka arz kaç gün tavan yapar, ne kadar kazanırsın? Ücretsiz tavan hesaplama aracı.",
    url: "https://www.halkaarzlarim.com/araclar/tavan-simulatoru",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/araclar/tavan-simulatoru" },
};

export default function TavanSimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
