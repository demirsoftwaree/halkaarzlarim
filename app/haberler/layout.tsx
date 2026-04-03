import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haberler & Duyurular",
  description:
    "Halka arz, borsa ve sermaye piyasası haberleri. KAP ve SPK duyuruları, şirket haberleri ve genel kurul bildirimlerini takip edin.",
  keywords: ["halka arz haberleri", "KAP duyuru", "SPK duyuru", "borsa haberleri", "sermaye piyasası", "genel kurul"],
  openGraph: {
    title: "Haberler & Duyurular | HalkaArzlarım",
    description: "KAP ve SPK duyuruları, halka arz haberleri ve borsa gelişmeleri.",
    url: "https://www.halkaarzlarim.com/haberler",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/haberler" },
};

export default function HaberlerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
