import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesabım",
  description: "HalkaArzlarım hesabınız — portföy yönetimi ve takip listesi.",
  robots: { index: false, follow: false },
};

export default function HesabimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
