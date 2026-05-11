import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yatırım Araçları",
  description:
    "Halka arz yatırımcıları için ücretsiz hesaplama araçları. Tavan simülatörü, lot dağıtım hesaplayıcı, net kâr hesaplama ve tavan getiri raporu.",
  keywords: ["tavan simülatörü", "lot hesaplama", "kâr hesaplama", "halka arz hesaplama", "yatırım aracı"],
  openGraph: {
    title: "Yatırım Araçları | HalkaArzlarım",
    description: "Halka arz için tavan simülatörü, lot hesaplama, net kâr hesaplama ve daha fazlası.",
    url: "https://www.halkaarzlarim.com/araclar",
  },
};

export default function AraclarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
