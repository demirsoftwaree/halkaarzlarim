import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lot Dağıtım Hesaplayıcı — Kaç Lot Düşer?",
  description:
    "Halka arz lot dağıtım hesaplayıcı. Toplam başvuru ve lot sayısına göre kaç lot düşeceğini hesapla. Oransal ve eşit dağıtım senaryoları.",
  keywords: ["lot hesaplama", "halka arz lot", "lot dağıtım", "kaç lot düşer", "halka arz başvuru"],
  openGraph: {
    title: "Lot Dağıtım Hesaplayıcı | HalkaArzlarım",
    description: "Halka arz lot hesaplayıcı — kaç kişi başvurursa kaç lot düşer? Anında hesapla.",
    url: "https://www.halkaarzlarim.com/araclar/lot-hesaplama",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/araclar/lot-hesaplama" },
};

export default function LotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
