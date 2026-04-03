import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../../screenshots");

const pages = [
  { name: "01-anasayfa-desktop", url: "http://localhost:3000", w: 1280, h: 900 },
  { name: "02-anasayfa-mobile", url: "http://localhost:3000", w: 390, h: 844 },
  { name: "03-mobile-menu-kapali", url: "http://localhost:3000", w: 390, h: 200 },
  { name: "04-halka-arzlar", url: "http://localhost:3000/halka-arzlar", w: 1280, h: 900 },
  { name: "05-arz-detay", url: "http://localhost:3000/halka-arz/metropal-kurumsal-hizmetler", w: 1280, h: 900 },
  { name: "06-tavan-simulatoru", url: "http://localhost:3000/araclar/tavan-simulatoru", w: 1280, h: 900 },
  { name: "07-lot-hesaplama", url: "http://localhost:3000/araclar/lot-hesaplama", w: 1280, h: 900 },
  { name: "08-kar-hesaplama", url: "http://localhost:3000/araclar/kar-hesaplama", w: 1280, h: 900 },
  { name: "09-maliyet-hesaplama", url: "http://localhost:3000/araclar/maliyet-hesaplama", w: 1280, h: 900 },
  { name: "10-haberler", url: "http://localhost:3000/haberler", w: 1280, h: 900 },
  { name: "11-premium", url: "http://localhost:3000/premium", w: 1280, h: 900 },
];

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

for (const pg of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: pg.w, height: pg.h, deviceScaleFactor: 1 });
  await page.goto(pg.url, { waitUntil: "networkidle0", timeout: 15000 });

  // Mobile menu click testi
  if (pg.name === "03-mobile-menu-kapali") {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    // Butona tıkla
    const btn = await page.$("nav button[aria-label]");
    if (btn) {
      await btn.click();
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: `${outDir}/03-mobile-menu-ACIK.png`, fullPage: false });
      console.log("✓ 03-mobile-menu-ACIK.png — buton ÇALIŞIYOR");
    } else {
      await page.screenshot({ path: `${outDir}/03-mobile-menu-BUTON-YOK.png`, fullPage: false });
      console.log("✗ 03-mobile-menu-BUTON-YOK — aria-label bulunamadı");
    }
    await page.close();
    continue;
  }

  await page.screenshot({ path: `${outDir}/${pg.name}.png`, fullPage: pg.w === 1280 });
  console.log(`✓ ${pg.name}.png`);
  await page.close();
}

await browser.close();
console.log("\nTüm ekran görüntüleri screenshots/ klasörüne kaydedildi.");
