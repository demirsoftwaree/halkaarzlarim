import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

// Önce MCARD detay sayfasını bul
await page.goto("https://halkarz.com/mcard/", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {});
await new Promise(r => setTimeout(r, 1500));
const mcard = await page.evaluate(() => document.body.innerText.slice(0, 4000));
console.log("=== MCARD sayfası ===");
console.log(mcard);

// HTML yapısını gör
const structure = await page.evaluate(() => {
  // Tablolar, dt/dd, dl yapısı ara
  const tables = Array.from(document.querySelectorAll("table")).map(t => t.outerHTML.slice(0, 1000));
  const defs = Array.from(document.querySelectorAll("dl, .info-box, .detail, [class*='detail'], [class*='info']")).map(d => ({
    class: d.className?.slice(0, 40),
    text: d.innerText?.slice(0, 300)
  }));
  const headers = Array.from(document.querySelectorAll("h1, h2, h3")).map(h => h.innerText.trim());
  const spans = Array.from(document.querySelectorAll("span, td, th")).map(s => s.innerText.trim()).filter(t => t.length > 0 && t.length < 100);
  return { tables, defs, headers, spans: spans.slice(0, 50) };
});
console.log("\n=== YAPI ===");
console.log("Tablo sayısı:", structure.tables.length);
console.log("Headers:", structure.headers);
console.log("Spans:", structure.spans);
console.log("Defs:", JSON.stringify(structure.defs, null, 2).slice(0, 1500));

await browser.close();
