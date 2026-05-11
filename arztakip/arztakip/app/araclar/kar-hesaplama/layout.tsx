import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Net Kâr Hesaplayıcı — Komisyon Dahil Gerçek Kazanç",
  description:
    "Halka arz net kâr hesaplayıcı. Tavan sayısı, aracı kurum komisyonu ve vergi dahil gerçek net kazancını hesapla. BIST halka arz kâr simülasyonu.",
  keywords: ["kâr hesaplama", "halka arz net kazanç", "komisyon hesaplama", "halka arz getiri", "vergi hesaplama"],
  openGraph: {
    title: "Net Kâr Hesaplayıcı | HalkaArzlarım",
    description: "Komisyon ve vergi dahil gerçek halka arz net kârını hesapla.",
    url: "https://www.halkaarzlarim.com/araclar/kar-hesaplama",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/araclar/kar-hesaplama" },
};

export default function KarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
