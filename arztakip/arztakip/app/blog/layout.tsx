import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Halka Arz Rehberi & Yatırım İpuçları",
  description:
    "Halka arz yatırımcıları için rehber yazılar. Tavan hesaplama, lot dağıtımı, halka arz stratejileri ve 2026 yatırım ipuçları.",
  keywords: ["halka arz blog", "halka arz rehberi", "halka arz nasıl yapılır", "tavan hesaplama", "lot dağıtımı"],
  openGraph: {
    title: "Blog | HalkaArzlarım",
    description: "Halka arz yatırımcıları için rehber yazılar ve stratejiler.",
    url: "https://www.halkaarzlarim.com/blog",
  },
  alternates: { canonical: "https://www.halkaarzlarim.com/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
