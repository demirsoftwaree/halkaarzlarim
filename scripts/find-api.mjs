import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

const apiCalls = [];

// Tüm API isteklerini yakala
page.on("request", req => {
  const url = req.url();
  if (url.includes("api") || url.includes("json") || url.includes("ipo") || url.includes("halka")) {
    apiCalls.push({ method: req.method(), url, type: req.resourceType() });
  }
});

page.on("response", async res => {
  const url = res.url();
  const ct = res.headers()["content-type"] || "";
  if (ct.includes("application/json") && (url.includes("api") || url.includes("ipo"))) {
    try {
      const body = await res.text();
      console.log("\n=== JSON RESPONSE ===");
      console.log("URL:", url);
      console.log("Body (ilk 500 karakter):", body.slice(0, 500));
    } catch {}
  }
});

console.log("halkaarz.info ana sayfa yükleniyor...");
await page.goto("https://www.halkaarz.info/tr/halka-arz-takvimi", {
  waitUntil: "networkidle0",
  timeout: 20000,
}).catch(e => console.log("Yükleme hatası:", e.message));

await new Promise(r => setTimeout(r, 3000));

console.log("\n=== TÜM API ÇAĞRILARI ===");
for (const c of apiCalls) {
  console.log(`${c.method} ${c.url}`);
}

await browser.close();
