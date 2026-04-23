import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../../screenshots");

const pages = [
  { name: "01-anasayfa-desktop",       url: "http://localhost:3000",                              w: 1280, h: 900 },
  { name: "02-anasayfa-mobile",        url: "http://localhost:3000",                              w: 390,  h: 844 },
  { name: "03-mobile-menu-acik",       url: "http://localhost:3000",                              w: 390,  h: 844, mobileMenu: true },
  { name: "04-halka-arzlar",           url: "http://localhost:3000/halka-arzlar",                 w: 1280, h: 900 },
  { name: "05-arz-detay",              url: "http://localhost:3000/halka-arz/aagyo",                      w: 1280, h: 900 },
  { name: "06-hisseler",               url: "http://localhost:3000/hisseler",                     w: 1280, h: 900 },
  { name: "07-haberler",               url: "http://localhost:3000/haberler",                     w: 1280, h: 900 },
  { name: "08-premium",                url: "http://localhost:3000/premium",                      w: 1280, h: 900 },
  { name: "09-tavan-simulatoru",       url: "http://localhost:3000/araclar/tavan-simulatoru",     w: 1280, h: 900 },
  { name: "10-lot-hesaplama",          url: "http://localhost:3000/araclar/lot-hesaplama",        w: 1280, h: 900 },
  { name: "11-kar-hesaplama",          url: "http://localhost:3000/araclar/kar-hesaplama",        w: 1280, h: 900 },
  { name: "12-tavan-raporu",           url: "http://localhost:3000/araclar/tavan-raporu",         w: 1280, h: 900 },
  { name: "13-tavan-performansi",      url: "http://localhost:3000/araclar/tavan-performansi",    w: 1280, h: 900 },
  { name: "14-giris",                  url: "http://localhost:3000/giris",                        w: 1280, h: 900 },
  { name: "15-premium-mobile",         url: "http://localhost:3000/premium",                      w: 390,  h: 844 },
  { name: "16-haberler-mobile",        url: "http://localhost:3000/haberler",                     w: 390,  h: 844 },
  // Yeni SEO sayfaları
  { name: "17-takvim-mobile",          url: "http://localhost:3000/halka-arzlar",                  w: 390,  h: 844 },
  { name: "18-takip-listem-mobile",    url: "http://localhost:3000/hesabim/takip-listem",           w: 390,  h: 844 },
  { name: "19-portfoy-mobile",         url: "http://localhost:3000/hesabim/portfoy",               w: 390,  h: 844 },
  { name: "20-tavan-mobile",           url: "http://localhost:3000/araclar/tavan-simulatoru",      w: 390,  h: 844 },
  { name: "21-chatbot-mobile",         url: "http://localhost:3000",                               w: 390,  h: 844 },
  // SSS video için
  { name: "22-sss-desktop",            url: "http://localhost:3000/sss",                           w: 1280, h: 900 },
  { name: "23-sss-mobile",             url: "http://localhost:3000/sss",                           w: 390,  h: 844 },
  { name: "24-ipo-nedir-desktop",      url: "http://localhost:3000/ipo-nedir",                     w: 1280, h: 900 },
  { name: "25-ipo-nedir-mobile",       url: "http://localhost:3000/ipo-nedir",                     w: 390,  h: 844 },
  { name: "26-nasil-yapilir-desktop",  url: "http://localhost:3000/halka-arz-nasil-yapilir",       w: 1280, h: 900 },
  { name: "27-nasil-yapilir-mobile",   url: "http://localhost:3000/halka-arz-nasil-yapilir",       w: 390,  h: 844 },
  { name: "28-tavan-nedir-desktop",    url: "http://localhost:3000/tavan-nedir",                   w: 1280, h: 900 },
  { name: "29-tavan-nedir-mobile",     url: "http://localhost:3000/tavan-nedir",                   w: 390,  h: 844 },
  { name: "30-istatistikler-desktop",  url: "http://localhost:3000/istatistikler",                 w: 1280, h: 900 },
];

// Eski ekran görüntülerini temizle
const files = fs.readdirSync(outDir);
for (const f of files) {
  if (f.endsWith(".png")) {
    fs.unlinkSync(path.join(outDir, f));
  }
}
console.log("🗑  Eski görseller silindi.\n");

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

for (const pg of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: pg.w, height: pg.h, deviceScaleFactor: 2 });
  await page.goto(pg.url, { waitUntil: "networkidle2", timeout: 45000 });

  if (pg.mobileMenu) {
    const btn = await page.$("nav button[aria-label]");
    if (btn) {
      await btn.click();
      await new Promise(r => setTimeout(r, 500));
    }
    await page.screenshot({ path: `${outDir}/${pg.name}.png`, fullPage: false });
  } else {
    const fullPage = pg.w === 1280;
    await page.screenshot({ path: `${outDir}/${pg.name}.png`, fullPage });
  }

  console.log(`✓ ${pg.name}.png`);
  await page.close();
}

await browser.close();
console.log("\n✅ Tüm ekran görüntüleri screenshots/ klasörüne kaydedildi.");
