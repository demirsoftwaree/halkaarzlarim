import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "HalkaArzlarım ile iletişime geçin. Soru, öneri ve iş birliği talepleriniz için bize ulaşın.",
  openGraph: {
    title: "İletişim | HalkaArzlarım",
    description: "HalkaArzlarım iletişim formu — soru ve önerileriniz için.",
    url: "https://www.halkaarzlarim.com/iletisim",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/iletisim" },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
