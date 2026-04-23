// favicon.ico üretici — bir kez çalıştır: node arztakip/scripts/generate-favicon.mjs
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svgPath = path.join(__dirname, "../public/logo/halkaarzlarim-icon.svg");
const outPath = path.join(__dirname, "../public/favicon.ico");

const svg = fs.readFileSync(svgPath);

// 32x32 PNG → ICO (ICO formatı aslında PNG içerebilir)
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
const png16 = await sharp(svg).resize(16, 16).png().toBuffer();

// Basit ICO dosyası oluştur (tek 32x32 PNG entry)
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + count * dirEntrySize;

  let offset = dirSize;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type: ICO
  header.writeUInt16LE(count, 4); // count

  const dirEntries = pngBuffers.map((buf, i) => {
    const entry = Buffer.alloc(dirEntrySize);
    const size = i === 0 ? 32 : 16;
    entry.writeUInt8(size, 0);   // width (0 = 256)
    entry.writeUInt8(size, 1);   // height
    entry.writeUInt8(0, 2);      // color count
    entry.writeUInt8(0, 3);      // reserved
    entry.writeUInt16LE(1, 4);   // planes
    entry.writeUInt16LE(32, 6);  // bit count
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buf.length;
    return entry;
  });

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

const ico = buildIco([png32, png16]);
fs.writeFileSync(outPath, ico);
console.log("✅ favicon.ico oluşturuldu:", outPath);
