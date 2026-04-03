import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

// MCARD detay sayfası
await page.goto("https://halkarz.com/metropal-kurumsal-hizmetler-a-s/", {
  waitUntil: "domcontentloaded", timeout: 15000
});
await new Promise(r => setTimeout(r, 1500));

const detail = await page.evaluate(() => {
  const text = document.body.innerText;
  // Tablo içeriklerini al
  const tables = Array.from(document.querySelectorAll("table")).map(t => t.innerText.trim());
  // dl/dt/dd yapısı
  const dls = Array.from(document.querySelectorAll("dl")).map(dl => dl.innerText);
  // Spesifik class'lar
  const infoBoxes = Array.from(document.querySelectorAll(
    "[class*='info'], [class*='detail'], [class*='meta'], [class*='arz'], .post-content, .entry-content, article"
  )).map(el => ({ class: el.className?.slice(0, 50), text: el.innerText?.trim()?.slice(0, 400) }));

  // Logo URL'si
  const logo = document.querySelector(".slogo, .logo img, .company-logo img")?.src ||
               document.querySelector("img[class*='logo']")?.src || "";

  // Tüm label:value çiftleri
  const allText = text.slice(0, 5000);

  return { allText, tables, dls, infoBoxes, logo };
});

console.log("=== MCARD Detay Sayfası ===");
console.log(detail.allText);
console.log("\n=== Tablolar ===");
detail.tables.forEach((t, i) => console.log(`Tablo ${i}:`, t));
console.log("\n=== Info Boxes ===");
detail.infoBoxes.slice(0, 5).forEach(b => console.log(`[${b.class}]\n${b.text}\n---`));

// Şimdi aktif/yaklaşan bir arzı dene - NETCD
console.log("\n=== NETCD ===");
await page.goto("https://halkarz.com/netcad-yazilim-a-s/", {
  waitUntil: "domcontentloaded", timeout: 15000
});
await new Promise(r => setTimeout(r, 1500));
const netcd = await page.evaluate(() => document.body.innerText.slice(0, 3000));
console.log(netcd);

await browser.close();
