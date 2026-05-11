import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

const apiCalls = [];

page.on("response", async res => {
  const url = res.url();
  const ct  = res.headers()["content-type"] || "";
  const status = res.status();
  if (ct.includes("json") || url.includes("api")) {
    try {
      const body = await res.text();
      apiCalls.push({ url, status, body: body.slice(0, 600) });
    } catch {}
  }
});

// KAP halka arz haberleri
console.log("KAP taranıyor...");
await page.goto("https://www.kap.org.tr/tr/bildirim-sorgu", {
  waitUntil: "networkidle0", timeout: 20000
}).catch(e => console.log("KAP hata:", e.message));
await new Promise(r => setTimeout(r, 3000));

// halkarz.com
console.log("halkarz.com taranıyor...");
await page.goto("https://halkarz.com", {
  waitUntil: "networkidle0", timeout: 20000
}).catch(e => console.log("halkarz hata:", e.message));
await new Promise(r => setTimeout(r, 3000));

console.log("\n=== JSON API'LER ===");
for (const c of apiCalls) {
  if (c.body.trim().startsWith("{") || c.body.trim().startsWith("[")) {
    console.log(`\nURL: ${c.url} [${c.status}]`);
    console.log(c.body.slice(0, 400));
  }
}

// halkarz.com sayfa içeriği
console.log("\n=== halkarz.com İÇERİĞİ (ÖRNEK) ===");
const content = await page.content();
// Halka arz isimlerini bul
const matches = content.match(/class="[^"]*title[^"]*"[^>]*>([^<]+)</g) || [];
matches.slice(0, 10).forEach(m => console.log(m));

await browser.close();
