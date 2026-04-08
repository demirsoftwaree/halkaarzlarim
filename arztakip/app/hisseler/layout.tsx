import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halka Arz Şirketleri — SPK Kayıtlı Şirket Listesi",
  description:
    "Türkiye'de halka arz yapan tüm şirketlerin listesi. Aktif, yaklaşan ve tamamlanan halka arzlar, sektör ve durum filtreleri.",
  keywords: ["halka arz şirketleri", "SPK şirketler", "BIST halka arz", "halka arz listesi", "hisse senedi"],
  openGraph: {
    title: "Halka Arz Şirketleri | HalkaArzlarım",
    description: "Türkiye'de halka arz yapan tüm şirketler. Aktif, yaklaşan ve tamamlanan arzlar.",
    url: "https://www.halkaarzlarim.com/hisseler",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/hisseler" },
};

export default function HisselerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
