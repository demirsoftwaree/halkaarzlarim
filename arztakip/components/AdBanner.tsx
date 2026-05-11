"use client";

import { useAuth } from "@/lib/auth-context";

interface AdBannerProps {
  slot: "horizontal" | "square" | "rectangle";
  className?: string;
}

// AdSense client ID — canlıya alınca buraya yapıştır
const ADSENSE_CLIENT = ""; // örn: "ca-pub-XXXXXXXXXXXXXXXX"
// Her slot için AdSense slot ID — canlıya alınca doldur
const SLOT_IDS: Record<AdBannerProps["slot"], string> = {
  horizontal: "",   // 728x90 leaderboard
  square: "",       // 300x250 rectangle
  rectangle: "",    // 320x100 banner
};

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const { isPremium } = useAuth();

  // Premium kullanıcıya reklam gösterme
  if (isPremium) return null;

  // AdSense henüz yapılandırılmamış — gizle
  if (!ADSENSE_CLIENT || !SLOT_IDS[slot]) {
    return null;
  }

  // AdSense aktif olduğunda bu kısım devreye girer
  const wrapperClass = slot === "horizontal" ? `overflow-hidden 2xl:hidden ${className}` : `overflow-hidden ${className}`;
  return (
    <div className={wrapperClass}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={SLOT_IDS[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
