import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Üyelik — Gelişmiş Halka Arz Araçları",
  description:
    "HalkaArzlarım Premium ile tavan getiri raporu, portföy yönetimi ve öncelikli bildirimler. Aylık 49₺ veya yıllık 39₺/ay.",
  keywords: ["halka arz premium", "tavan raporu", "portföy yönetimi", "halka arz abonelik"],
  openGraph: {
    title: "Premium Üyelik | HalkaArzlarım",
    description: "Halka arz yatırımcıları için gelişmiş araçlar. Tavan raporu, portföy, öncelikli bildirimler.",
    url: "https://www.halkaarzlarim.com/premium",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/premium" },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
