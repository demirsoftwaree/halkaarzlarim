/**
 * HalkaArzlarım — Resmi logo SVG'sinden uygulama ikonları üretir.
 * Çalıştır: node generate-icons.mjs
 */
import sharp from "sharp";

// ─── Gerçek logo SVG'si (web sitesiyle birebir aynı) ──────────
// Yeşil gradyan yuvarlak kare + beyaz TrendingUp oku
function makeLogoSvg(size) {
  const s = size;
  // Orijinal viewBox: 0 0 100 100 — proportional scale
  const scale = s / 100;
  const pad = s * 0.04; // kenar boşluğu

  const rx = s * 0.22; // köşe yuvarlaklığı (orijinalde rx=24 / 100 = 0.24)

  // İkon içindeki polyline'lar orijinal koordinatları scale edecek
  const sc = (v) => v * scale;

  // Glow filtre blur miktarı
  const blur = s * 0.06;
  const shadowY = s * 0.03;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" fill="none">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${shadowY}" stdDeviation="${blur}"
        flood-color="#10b981" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Arka plan: yeşil gradyan yuvarlak kare -->
  <rect x="${pad}" y="${pad}" width="${s - pad*2}" height="${s - pad*2}"
    rx="${rx}" fill="url(#g)" filter="url(#glow)"/>

  <!-- TrendingUp oku: orijinal koordinatlar × scale -->
  <!-- Ana çizgi: 14,72 → 32,50 → 46,62 → 78,26 -->
  <polyline
    points="${sc(14)},${sc(72)} ${sc(32)},${sc(50)} ${sc(46)},${sc(62)} ${sc(78)},${sc(26)}"
    stroke="white" stroke-width="${sc(7.5)}"
    stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Ok ucu: 62,26 → 78,26 → 78,42 -->
  <polyline
    points="${sc(62)},${sc(26)} ${sc(78)},${sc(26)} ${sc(78)},${sc(42)}"
    stroke="white" stroke-width="${sc(7.5)}"
    stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;
}

// Splash için: logonun kendisi (arka plan yoktur, splash bg app.json'dan #0f172a gelir)
function makeSplashSvg(size) {
  // Splash: logonun beyaz bir versiyonu ya da küçük yerleştirilmiş logosu
  // Logo ortaya oranlı şekilde — padding ile
  const s = size;
  const pad = s * 0.08;
  const inner = s - pad * 2;
  const scale = inner / 100;
  const sc = (v) => pad + v * scale;
  const rx = inner * 0.22;
  const blur = inner * 0.06;
  const shadowY = inner * 0.03;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" fill="none">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="${shadowY}" stdDeviation="${blur}"
        flood-color="#10b981" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}"
    rx="${rx}" fill="url(#g)" filter="url(#glow)"/>

  <polyline
    points="${sc(14)},${sc(72)} ${sc(32)},${sc(50)} ${sc(46)},${sc(62)} ${sc(78)},${sc(26)}"
    stroke="white" stroke-width="${scale * 7.5}"
    stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <polyline
    points="${sc(62)},${sc(26)} ${sc(78)},${sc(26)} ${sc(78)},${sc(42)}"
    stroke="white" stroke-width="${scale * 7.5}"
    stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;
}

async function generate() {
  console.log("🎨 HalkaArzlarım ikonları üretiliyor...\n");

  await sharp(Buffer.from(makeLogoSvg(1024))).png().toFile("assets/icon.png");
  console.log("✓ assets/icon.png          (1024×1024) — iOS + genel");

  await sharp(Buffer.from(makeLogoSvg(1024))).png().toFile("assets/adaptive-icon.png");
  console.log("✓ assets/adaptive-icon.png (1024×1024) — Android adaptive");

  await sharp(Buffer.from(makeSplashSvg(512))).png().toFile("assets/splash-icon.png");
  console.log("✓ assets/splash-icon.png   (512×512)   — Splash ekranı");

  await sharp(Buffer.from(makeLogoSvg(48))).png().toFile("assets/favicon.png");
  console.log("✓ assets/favicon.png       (48×48)     — Web favicon\n");

  console.log("✅ Tüm ikonlar assets/ klasörüne kaydedildi.");
}

generate().catch(e => { console.error("Hata:", e.message); process.exit(1); });
