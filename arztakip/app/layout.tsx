import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import ChatWidget from "@/components/ChatWidget";

const BASE_URL = "https://www.halkaarzlarim.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "HalkaArzlarım — Halka Arz Takibi, Tavan Simülatörü & Portföy",
    template: "%s | HalkaArzlarım",
  },
  description:
    "Türkiye'nin halka arz takip platformu. Aktif arzlar, tavan simülatörü, lot hesaplama, net kâr hesaplama ve AI destekli halka arz asistanı.",
  keywords: [
    "halka arz",
    "halka arz takip",
    "halka arz takvimi",
    "tavan simülatörü",
    "lot hesaplama",
    "kâr hesaplama",
    "BIST halka arz",
    "SPK",
    "borsa yatırım",
    "halka arz portföy",
    "halka arz asistanı",
  ],
  authors: [{ name: "HalkaArzlarım", url: BASE_URL }],
  creator: "HalkaArzlarım",
  publisher: "HalkaArzlarım",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: BASE_URL,
    siteName: "HalkaArzlarım",
    title: "HalkaArzlarım — Halka Arz Takibi & Yatırım Araçları",
    description:
      "Türkiye'nin halka arz takip platformu. Aktif arzlar, tavan simülatörü, lot hesaplama ve AI destekli yatırım asistanı.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "HalkaArzlarım" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HalkaArzlarım — Halka Arz Takibi",
    description: "Türkiye'nin halka arz takip platformu. Tavan simülatörü, lot hesaplama, portföy yönetimi.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2543281289393255" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2543281289393255"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100">
        <AuthProvider>
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
