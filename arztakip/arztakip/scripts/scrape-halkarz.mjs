import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

// Önce yapıyı anlamak için ana sayfayı gez
console.log("halkarz.com ana sayfa...");
await page.goto("https://halkarz.com", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(e => console.log("hata:", e.message));

const html = await page.content();
// Script taglarını, css'i vs kaldır
const clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                  .replace(/<[^>]+>/g, " ")
                  .replace(/\s+/g, " ")
                  .slice(0, 3000);
console.log("Ana sayfa text:", clean);

// Halka arz listesi URL'lerini bul
const links = await page.evaluate(() => {
  const anchors = Array.from(document.querySelectorAll("a"));
  return anchors
    .map(a => ({ href: a.href, text: a.textContent.trim().slice(0, 60) }))
    .filter(a => a.href && (
      a.href.includes("halka-arz") ||
      a.href.includes("ipo") ||
      a.text.match(/[A-Z]{3,5}[.\s]/)
    ))
    .slice(0, 30);
});
console.log("\nBulunan linkler:", JSON.stringify(links, null, 2));

await browser.close();
