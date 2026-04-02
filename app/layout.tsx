import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Halkaarzlarım.com — Halka Arzlarını Takip Et, Kazancını Hesapla",
  description: "Türkiye'deki bireysel halka arz yatırımcıları için tek durak platform. Halka arz takvimi, tavan simülatörü, lot hesaplama ve portföy yönetimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100">
        <AuthProvider>
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
