import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halka Arz Listesi & Takvimi",
  description:
    "Türkiye'deki tüm halka arzları takip edin. Aktif, yaklaşan ve tamamlanan arzlar, başvuru tarihleri, fiyat aralıkları ve SPK verileri.",
  keywords: ["halka arz listesi", "halka arz takvimi", "aktif halka arz", "yaklaşan halka arz", "SPK halka arz", "BIST"],
  openGraph: {
    title: "Halka Arz Listesi & Takvimi | HalkaArzlarım",
    description: "Türkiye'deki tüm aktif, yaklaşan ve tamamlanan halka arzları tek sayfada takip edin.",
    url: "https://www.halkaarzlarim.com/halka-arzlar",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/halka-arzlar" },
};

export default function HalkaArzlarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
