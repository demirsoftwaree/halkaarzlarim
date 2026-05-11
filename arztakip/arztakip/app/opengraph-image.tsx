import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HalkaArzlarım — Türkiye'nin Halka Arz Takip Platformu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0f1a 0%, #0f1f35 50%, #0a1628 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Arka plan halka efekti */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "1px solid rgba(16,185,129,0.15)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 800,
            height: 800,
            borderRadius: "50%",
            border: "1px solid rgba(16,185,129,0.08)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        {/* Logo ikonu */}
        <div
          style={{
            width: 80,
            height: 80,
            background: "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            fontSize: 40,
          }}
        >
          📈
        </div>

        {/* Başlık */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: -1,
            marginBottom: 16,
          }}
        >
          HalkaArzlarım
        </div>

        {/* Slogan */}
        <div
          style={{
            fontSize: 26,
            color: "#10b981",
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Türkiye&apos;nin Halka Arz Takip Platformu
        </div>

        {/* Özellik tagları */}
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          {["Tavan Simülatörü", "Lot Hesaplama", "AI Asistan", "Portföy Takibi"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 999,
                padding: "8px 18px",
                color: "#6ee7b7",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            color: "rgba(148,163,184,0.7)",
            fontSize: 18,
          }}
        >
          www.halkaarzlarim.com
        </div>
      </div>
    ),
    size
  );
}
