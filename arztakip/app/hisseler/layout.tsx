import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BIST Hisseler — Borsa İstanbul Şirket Listesi",
  description:
    "Borsa İstanbul'da işlem gören tüm hisseleri ve KAP üyesi şirketleri listeleyin. Sektör filtresi, arama ve şirket bilgileri.",
  keywords: ["BIST hisseler", "Borsa İstanbul hisse", "KAP şirketler", "borsa şirket listesi", "hisse senedi"],
  openGraph: {
    title: "BIST Hisseler | HalkaArzlarım",
    description: "Borsa İstanbul'da işlem gören tüm hisseler ve KAP üyesi şirketler.",
    url: "https://www.halkaarzlarim.com/hisseler",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/hisseler" },
};

export default function HisselerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
