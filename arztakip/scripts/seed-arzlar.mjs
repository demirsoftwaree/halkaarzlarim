import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = initializeApp({
  credential: cert({
    projectId: "arztakip-5c08b",
    clientEmail: "firebase-adminsdk-fbsvc@arztakip-5c08b.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDjRyyfiBIMZG+B\nzS4yTOIEuqUEQ1s52Or0Jm4J7R3OsDr69sfpx6pY//30xEL7IYtxDwjot6b1fILt\nrF8LVptHp8l2g6O+2VmVPr9rRrnspb1+rklfkD3TpxDcbOVa8M6scUEMlLFqNH2a\nMYitvTz9BoNclpZEFeDEskzswFohJkRKe4Tol2NtoLsO6Z69iNs0elui/+NCx+OM\n05bPTYgbU3YyZwr7GMJJC3DbqbJ/k3iYnH1gYLO2mtQMWhg8Be2I+Jz8oCV4Ss9i\nEnYTGG/P/DGAE/6+Muddb9WSZGlpdLYNbHaEv9LgykIp0mwSLb0N3y3xYRh+hGRZ\n58nULo9tAgMBAAECggEAJbT0QU949xderKFW7b91rCUvJYLrSrCjYnhRv1HYpSb1\n0hdJWY7nwzZNcuNw3WtWUB6XcsytZYMP0dDMP/xRbNT4hrIWY555z1oGtgyY4hsp\nUjAmOjWbHFdWY8upTaowD8oGacjtmlo1EHTxYSnJSY1gE+dj7M3YaanPO2Q6T89S\nZ7IwZp+2C0Lp0vMdAhEq+8YL+VbngeYLBaXNDLRjoHVVSH+1x5mDxrbFO+L/wDtv\nOErLBHWqMgF9+rnE6BgKv2V8QdMheaWLkkFm+k9vgjKmzMvb6IH8qXMS/XB+IfX5\nt3QbGuGZ6oHWcWnEp8Bb9cF36vZaRESUDpumOXZQwQKBgQD4u9IAy1M9SoT3AAwd\ngXVWH5Z8CwfdD6SWK9fBEiKEo8UbjixpzKbNMPQIEZ8k8+hb3OJOueS3dWURx2DA\ntfR1mIGbP3tKMQqlDROcrazs3bECyFQyhUi1KHdAgCb6GT/Z24OHtMPXEtENShNf\nS6XeyEtWMdMwRRhVDFe7VbnM3QKBgQDp6uVRJQ6Lu4l1O+5XFe4PK/yT3X+xCzGA\nYjZTpLHkfGg907HsYB4DHww6FbtDa/8h00uJ/01H9U9IEWrV1+8S2imlxDjEqED1\n8zcvk3ag+XKMjkuWuG9EFyt5rUUAsLaNGUNOqaMbkEriQA/metWqkLK3pZoTA4I7\nKX/Wnr8b0QKBgBIlOYu/SYJGJm8SfM/GOvYedc70yw0QcBRYfHPkS8pbXCzHcWwC\ndwSvFo5kIrUCaigRdB0EKLBNiyMB5YgJfhz6FDJsLiVacIlb69tZPC1HevtV+/Z3\njLdSjWiSMMW8A9Fz1yOWR1cwUznh9onULfSTrhNKrTpvP/gsX1YWSeitAoGASnU/\ny2WNTMNETPHnuwa7AU9SFcsywys59ZDNlDBfg8hp8gw5nXE2/G1cmfyi4CI3UxAM\nAoAmnFokg18v76PNcOXKzf44x7h6/Q8PKPC6mSDt6nm869wHZtgtOY0C4uZdJWq+\nNwLebX6vp3cW2JmO+70VdkmbUqQSRzy9eZaMZJECgYB4+1Wi4eVJxPPfF3SwwTDk\n40Yzbr+ckkZtFMZJFvHhE37LFH3krcbGPTnSxUbIcPZLkaOFY5J47a9NKLmF0mxr\n9TKUZvCWoBDJbBewVm1PvnqBSzbnTW8mvC7kr2uDklyBVhmDrCiPXezUOLsLuolf\nApZPgMZBqpZdvJAmAW6Obg==\n-----END PRIVATE KEY-----\n`.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);
const dataPath = join(__dirname, "../data/yaklasan-arzlar.json");
const arzlar = JSON.parse(readFileSync(dataPath, "utf-8"));

async function seed() {
  console.log(`${arzlar.length} arz Firestore'a aktarılıyor...`);
  for (const arz of arzlar) {
    await db.collection("arzlar-manuel").doc(arz.slug).set(arz);
    console.log(`✅ ${arz.ticker} — ${arz.sirketAdi}`);
  }
  console.log("Tamamlandı!");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
