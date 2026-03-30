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
  await page.goto(pg.url, { waitUntil: "networkidle0", timeout: 20000 });

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
