import sharp from "sharp";
import { writeFileSync } from "fs";

// ─── SVG Tasarım ─────────────────────────────────────────────
// Arka plan: #0f172a (lacivert), ikon: #10b981 (yeşil)
// Yükselen çizgi grafik + ok ucu — minimal, bold, her boyutta tanınır

function makeIconSvg(size) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.14; // köşe radius

  // Grafik noktaları (normalized 0-1, origin top-left)
  const points = [
    [0.18, 0.72],
    [0.34, 0.55],
    [0.50, 0.62],
    [0.66, 0.40],
    [0.78, 0.24],
  ].map(([x, y]) => [x * s, y * s]);

  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  const stroke = Math.max(4, s * 0.055);
  const dotR  = Math.max(3, s * 0.036);

  // Ok ucu: son noktadan 42° yönünde
  const [ex, ey] = points[points.length - 1];
  const [px, py] = points[points.length - 2];
  const angle = Math.atan2(ey - py, ex - px);
  const arrowLen = s * 0.12;
  const a1 = angle + Math.PI * 0.75;
  const a2 = angle - Math.PI * 0.75;
  const ax1 = ex + Math.cos(a1) * arrowLen;
  const ay1 = ey + Math.sin(a1) * arrowLen;
  const ax2 = ex + Math.cos(a2) * arrowLen;
  const ay2 = ey + Math.sin(a2) * arrowLen;

  // Küçük "₺" sembolü alt sol köşede (büyük ikonlarda)
  const showText = size >= 512;
  const fontSize = s * 0.09;
  const textX = s * 0.175;
  const textY = s * 0.87;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${r}" fill="#0f172a"/>

  <!-- Izgara çizgileri (ince, ambient) -->
  ${[0.35, 0.55, 0.75].map(yv =>
    `<line x1="${s*0.12}" y1="${s*yv}" x2="${s*0.88}" y2="${s*yv}" stroke="#1e293b" stroke-width="${Math.max(1, s*0.008)}" stroke-dasharray="${s*0.02},${s*0.02}"/>`
  ).join("\n  ")}

  <!-- Gölge / alan altı -->
  <defs>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <polygon points="${polyline} ${s*0.78},${s*0.82} ${s*0.18},${s*0.82}"
    fill="url(#areaGrad)"/>

  <!-- Çizgi -->
  <polyline points="${polyline}"
    stroke="#10b981" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Ok ucu -->
  <line x1="${ax1}" y1="${ay1}" x2="${ex}" y2="${ey}" stroke="#10b981" stroke-width="${stroke}" stroke-linecap="round"/>
  <line x1="${ax2}" y1="${ay2}" x2="${ex}" y2="${ey}" stroke="#10b981" stroke-width="${stroke}" stroke-linecap="round"/>

  <!-- Noktalar -->
  ${points.map(([x, y], i) => {
    const isLast = i === points.length - 1;
    const fill = isLast ? "#10b981" : "#10b981";
    const glow = isLast ? `<circle cx="${x}" cy="${y}" r="${dotR*2.2}" fill="#10b981" opacity="0.18"/>` : "";
    return `${glow}<circle cx="${x}" cy="${y}" r="${dotR}" fill="${fill}" stroke="${isLast ? "#fff" : "none"}" stroke-width="${isLast ? s*0.012 : 0}"/>`;
  }).join("\n  ")}

  ${showText ? `<!-- HA metin (küçük, alt sol) -->
  <text x="${textX}" y="${textY}" font-family="Arial, sans-serif" font-weight="800"
    font-size="${fontSize}" fill="#10b981" letter-spacing="${fontSize * -0.02}">HA</text>` : ""}
</svg>`;
}

// Splash için: sadece grafik, transparan arka plan
function makeSplashSvg(size) {
  const s = size;
  const points = [
    [0.15, 0.78],
    [0.33, 0.56],
    [0.52, 0.64],
    [0.70, 0.38],
    [0.83, 0.20],
  ].map(([x, y]) => [x * s, y * s]);

  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  const stroke = Math.max(3, s * 0.065);
  const dotR  = Math.max(2, s * 0.042);

  const [ex, ey] = points[points.length - 1];
  const [px, py] = points[points.length - 2];
  const angle = Math.atan2(ey - py, ex - px);
  const arrowLen = s * 0.14;
  const a1 = angle + Math.PI * 0.75;
  const a2 = angle - Math.PI * 0.75;
  const ax1 = ex + Math.cos(a1) * arrowLen;
  const ay1 = ey + Math.sin(a1) * arrowLen;
  const ax2 = ex + Math.cos(a2) * arrowLen;
  const ay2 = ey + Math.sin(a2) * arrowLen;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <!-- transparan bg — splash rengi app.json'dan geliyor (#0f172a) -->

  <defs>
    <linearGradient id="splashGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <polygon points="${polyline} ${s*0.83},${s*0.85} ${s*0.15},${s*0.85}"
    fill="url(#splashGrad)"/>

  <polyline points="${polyline}"
    stroke="#10b981" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <line x1="${ax1}" y1="${ay1}" x2="${ex}" y2="${ey}" stroke="#10b981" stroke-width="${stroke}" stroke-linecap="round"/>
  <line x1="${ax2}" y1="${ay2}" x2="${ex}" y2="${ey}" stroke="#10b981" stroke-width="${stroke}" stroke-linecap="round"/>

  ${points.map(([x, y], i) => {
    const isLast = i === points.length - 1;
    const glow = isLast ? `<circle cx="${x}" cy="${y}" r="${dotR*2.4}" fill="#10b981" opacity="0.20"/>` : "";
    return `${glow}<circle cx="${x}" cy="${y}" r="${dotR}" fill="#10b981" ${isLast ? `stroke="#fff" stroke-width="${s*0.014}"` : ""}/>`;
  }).join("\n  ")}
</svg>`;
}

async function generate() {
  console.log("🎨 İkonlar üretiliyor...\n");

  // 1. icon.png — 1024×1024 (iOS + genel)
  const iconSvg = makeIconSvg(1024);
  await sharp(Buffer.from(iconSvg))
    .png()
    .toFile("assets/icon.png");
  console.log("✓ assets/icon.png         (1024×1024)");

  // 2. adaptive-icon.png — 1024×1024 (Android foreground)
  //    Arka plan app.json'da #0f172a olarak tanımlı
  //    Foreground: grafik ikon, küçük biraz scale edilmiş (safe zone için)
  const adaptiveSvg = makeIconSvg(1024);
  await sharp(Buffer.from(adaptiveSvg))
    .png()
    .toFile("assets/adaptive-icon.png");
  console.log("✓ assets/adaptive-icon.png (1024×1024)");

  // 3. splash-icon.png — 512×512 transparan bg (splash bg app.json'dan)
  const splashSvg = makeSplashSvg(512);
  await sharp(Buffer.from(splashSvg))
    .png()
    .toFile("assets/splash-icon.png");
  console.log("✓ assets/splash-icon.png  (512×512)");

  // 4. favicon.png — 48×48 (web)
  const faviconSvg = makeIconSvg(48);
  await sharp(Buffer.from(faviconSvg))
    .png()
    .toFile("assets/favicon.png");
  console.log("✓ assets/favicon.png      (48×48)");

  console.log("\n✅ Tüm ikonlar assets/ klasörüne kaydedildi.");
}

generate().catch(e => { console.error("Hata:", e.message); process.exit(1); });
