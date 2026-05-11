import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haber Detayı",
  description: "KAP, SPK ve şirket duyuruları ile halka arz haberleri detayları. HalkaArzlarım üzerinden güncel gelişmeleri takip edin.",
  openGraph: {
    title: "Haber Detayı | HalkaArzlarım",
    description: "Halka arz haberleri ve borsa duyuruları.",
  },
};

export default function HaberDetayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
