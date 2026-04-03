import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "HalkaArzlarım hesabınıza giriş yapın. Google veya e-posta ile giriş.",
  robots: { index: false, follow: false },
};

export default function GirisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
