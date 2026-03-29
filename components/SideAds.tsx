"use client";

import { useAuth } from "@/lib/auth-context";

// AdSense client ID — canlıya alınca buraya yapıştır
const ADSENSE_CLIENT = ""; // örn: "ca-pub-XXXXXXXXXXXXXXXX"
// Sidebar slot ID — canlıya alınca doldur (160x600 wide skyscraper)
const SIDEBAR_SLOT_ID = ""; // örn: "1234567890"

function AdSlot() {
  if (!ADSENSE_CLIENT || !SIDEBAR_SLOT_ID) {
    return (
      <div className="w-[160px] h-[600px] flex items-center justify-center bg-slate-800/20 border border-dashed border-slate-700/40 rounded-xl text-slate-600 text-xs writing-mode-vertical">
        Reklam Alanı
      </div>
    );
  }

  return (
    <div className="w-[160px] h-[600px] overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: 160, height: 600 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={SIDEBAR_SLOT_ID}
        data-ad-format="fixed"
      />
    </div>
  );
}

export default function SideAds() {
  const { isPremium } = useAuth();
  if (isPremium) return null;

  return (
    <>
      {/* Sol sidebar reklam — sadece 2xl+ ekranlarda görünür */}
      <div className="hidden 2xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-10 items-center">
        <AdSlot />
      </div>
      {/* Sağ sidebar reklam — sadece 2xl+ ekranlarda görünür */}
      <div className="hidden 2xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-10 items-center">
        <AdSlot />
      </div>
    </>
  );
}
