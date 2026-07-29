import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halka Arz Takvimi 2026 — Aktif ve Yaklaşan IPO Listesi",
  description:
    "2026 Türkiye halka arz takvimi ve listesi. SPK verilerine göre aktif arzlar, yaklaşan IPO'lar, talep tarihleri ve fiyat aralıkları. Canlı güncellenen halka arz listesi.",
  keywords: [
    "halka arz takvimi",
    "halka arz listesi",
    "2026 halka arz",
    "aktif halka arz",
    "yaklaşan halka arz",
    "halka arz takvim",
    "ipo takvimi",
    "SPK halka arz",
    "BIST halka arz",
    "yeni halka arzlar",
  ],
  openGraph: {
    title: "Halka Arz Takvimi 2026 — Aktif ve Yaklaşan IPO Listesi | HalkaArzlarım",
    description: "2026 Türkiye halka arz takvimi. Aktif arzlar, yaklaşan IPO'lar, talep tarihleri ve fiyat aralıkları — canlı güncellenen liste.",
    url: "https://www.halkaarzlarim.com/halka-arzlar",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/halka-arzlar" },
};

export default function HalkaArzlarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
