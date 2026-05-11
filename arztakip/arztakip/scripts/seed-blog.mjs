import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    projectId: "arztakip-5c08b",
    clientEmail: "firebase-adminsdk-fbsvc@arztakip-5c08b.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDjRyyfiBIMZG+B\nzS4yTOIEuqUEQ1s52Or0Jm4J7R3OsDr69sfpx6pY//30xEL7IYtxDwjot6b1fILt\nrF8LVptHp8l2g6O+2VmVPr9rRrnspb1+rklfkD3TpxDcbOVa8M6scUEMlLFqNH2a\nMYitvTz9BoNclpZEFeDEskzswFohJkRKe4Tol2NtoLsO6Z69iNs0elui/+NCx+OM\n05bPTYgbU3YyZwr7GMJJC3DbqbJ/k3iYnH1gYLO2mtQMWhg8Be2I+Jz8oCV4Ss9i\nEnYTGG/P/DGAE/6+Muddb9WSZGlpdLYNbHaEv9LgykIp0mwSLb0N3y3xYRh+hGRZ\n58nULo9tAgMBAAECggEAJbT0QU949xderKFW7b91rCUvJYLrSrCjYnhRv1HYpSb1\n0hdJWY7nwzZNcuNw3WtWUB6XcsytZYMP0dDMP/xRbNT4hrIWY555z1oGtgyY4hsp\nUjAmOjWbHFdWY8upTaowD8oGacjtmlo1EHTxYSnJSY1gE+dj7M3YaanPO2Q6T89S\nZ7IwZp+2C0Lp0vMdAhEq+8YL+VbngeYLBaXNDLRjoHVVSH+1x5mDxrbFO+L/wDtv\nOErLBHWqMgF9+rnE6BgKv2V8QdMheaWLkkFm+k9vgjKmzMvb6IH8qXMS/XB+IfX5\nt3QbGuGZ6oHWcWnEp8Bb9cF36vZaRESUDpumOXZQwQKBgQD4u9IAy1M9SoT3AAwd\ngXVWH5Z8CwfdD6SWK9fBEiKEo8UbjixpzKbNMPQIEZ8k8+hb3OJOueS3dWURx2DA\ntfR1mIGbP3tKMQqlDROcrazs3bECyFQyhUi1KHdAgCb6GT/Z24OHtMPXEtENShNf\nS6XeyEtWMdMwRRhVDFe7VbnM3QKBgQDp6uVRJQ6Lu4l1O+5XFe4PK/yT3X+xCzGA\nYjZTpLHkfGg907HsYB4DHww6FbtDa/8h00uJ/01H9U9IEWrV1+8S2imlxDjEqED1\n8zcvk3ag+XKMjkuWuG9EFyt5rUUAsLaNGUNOqaMbkEriQA/metWqkLK3pZoTA4I7\nKX/Wnr8b0QKBgBIlOYu/SYJGJm8SfM/GOvYedc70yw0QcBRYfHPkS8pbXCzHcWwC\ndwSvFo5kIrUCaigRdB0EKLBNiyMB5YgJfhz6FDJsLiVacIlb69tZPC1HevtV+/Z3\njLdSjWiSMMW8A9Fz1yOWR1cwUznh9onULfSTrhNKrTpvP/gsX1YWSeitAoGASnU/\ny2WNTMNETPHnuwa7AU9SFcsywys59ZDNlDBfg8hp8gw5nXE2/G1cmfyi4CI3UxAM\nAoAmnFokg18v76PNcOXKzf44x7h6/Q8PKPC6mSDt6nm869wHZtgtOY0C4uZdJWq+\nNwLebX6vp3cW2JmO+70VdkmbUqQSRzy9eZaMZJECgYB4+1Wi4eVJxPPfF3SwwTDk\n40Yzbr+ckkZtFMZJFvHhE37LFH3krcbGPTnSxUbIcPZLkaOFY5J47a9NKLmF0mxr\n9TKUZvCWoBDJbBewVm1PvnqBSzbnTW8mvC7kr2uDklyBVhmDrCiPXezUOLsLuolf\nApZPgMZBqpZdvJAmAW6Obg==\n-----END PRIVATE KEY-----\n`.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

const yazilar = [
  {
    id: "halka-arz-nedir-2026-yatirimci-rehberi",
    baslik: "Halka Arz Nedir? 2026 Yatırımcı Rehberi",
    icerik: `Halka arz (IPO - Initial Public Offering), bir şirketin hisselerini ilk kez kamuya açık olarak satışa sunmasıdır. Bu süreçte şirket, büyüme sermayesi elde etmek amacıyla hisselerinin bir bölümünü bireysel ve kurumsal yatırımcılara satar.

## Halka Arz Nasıl Çalışır?

Halka arz süreci birkaç aşamadan oluşur:

- SPK'ya başvuru: Şirket, Sermaye Piyasası Kurulu'na izahname sunarak onay ister
- Fiyat belirleme: Aracı kurum ile birlikte halka arz fiyatı belirlenir
- Talep toplama: Yatırımcılar belirli bir süre içinde başvuru yapar
- Dağıtım: Toplanan talebe göre lotlar yatırımcılara dağıtılır
- Borsa kotasyonu: Hisse BIST'te işlem görmeye başlar

## Bireysel Yatırımcı Nasıl Katılır?

Halka arza katılmak için aracı kuruma başvurman yeterli. Banka veya yatırım platformundan "Halka Arz Başvurusu" yapabilirsin. Başvuru için yeterli bakiyeni uygun vadeli hesaplarda tutman gerekiyor.

## Neden Halka Arz Önemli?

Türkiye'de halka arz yatırımı son yıllarda oldukça popüler hale geldi. Bunun başlıca nedenleri:

- Tavan mekanizması: Yeni halka açılan hisseler ilk günlerde %10 tavan limitiyle işlem görür
- Düşük risk: İlk gün satış yapıldığında genellikle kayıp riski düşüktür
- Kolay erişim: Her yatırımcı katılabilir

## 2026'da Halka Arz Piyasası

2026 yılında Türkiye sermaye piyasaları oldukça hareketli. SPK verilerine göre onlarca şirket halka arz için başvuruda bulundu. Teknoloji, gayrimenkul ve enerji sektörleri öne çıkıyor.

HalkaArzlarım platformunda tüm aktif ve yaklaşan arzları takip edebilir, tavan simülatörü ile kazanç hesaplayabilirsin.`,
    sirket: "HalkaArzlarım",
    kategori: "blog",
    tarih: "2026-04-03",
    yayinda: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "halka-arzda-tavan-nedir-nasil-hesaplanir",
    baslik: "Halka Arzda Tavan Nedir? Nasıl Hesaplanır?",
    icerik: `Halka arz yatırımlarının en heyecan verici kısmı "tavan"dır. Peki tavan nedir ve nasıl hesaplanır?

## Tavan Nedir?

Borsa İstanbul'da yeni halka açılan hisseler, ilk seans ve sonrasında günlük %10 fiyat artış limiti (tavan) ile işlem görür. Bu limit normal hisseler için de geçerlidir ancak halka arzlarda "tavan gitmek" özel bir anlam taşır.

Tavan gitmek, hissenin gün içinde maksimum yükselişe ulaşması ve alıcı bulamaması anlamına gelir. Bu durumda hisseyi satmak mümkün olmaz — bu yatırımcı açısından olumludur çünkü değer artmaya devam eder.

## Tavan Nasıl Hesaplanır?

Formül basittir:

- 1. Tavan: Halka Arz Fiyatı × 1,10
- 2. Tavan: 1. Tavan × 1,10
- 3. Tavan: 2. Tavan × 1,10

## Örnek Hesaplama

Bir hisse 10 TL'den halka arz edilsin:

- 1. tavan: 11,00 TL (%10 kazanç)
- 2. tavan: 12,10 TL (%21 kazanç)
- 3. tavan: 13,31 TL (%33,1 kazanç)
- 5. tavan: 16,11 TL (%61,1 kazanç)
- 10. tavan: 25,94 TL (%159,4 kazanç)

## HalkaArzlarım Tavan Simülatörü

HalkaArzlarım'ın ücretsiz tavan simülatörü ile istediğin arz fiyatı ve lot sayısı için anında hesaplama yapabilirsin. Komisyon ve vergi dahil net kazancını da görebilirsin.`,
    sirket: "HalkaArzlarım",
    kategori: "blog",
    tarih: "2026-04-03",
    yayinda: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lot-dagitimi-nasil-yapilir-kapsamli-rehber",
    baslik: "Lot Dağıtımı Nasıl Yapılır? Kapsamlı Rehber",
    icerik: `Halka arza başvurdunuz, peki kaç lot düşeceğini biliyor musunuz? Lot dağıtımı yatırımcıların en çok merak ettiği konuların başında geliyor.

## Lot Nedir?

Borsa İstanbul'da hisseler "lot" birimi üzerinden işlem görür. 1 lot = 1 hisse senedi (nominal değer 1 TL). Halka arza başvururken minimum lot sayısı aracı kuruma göre değişebilir.

## Dağıtım Yöntemleri

### 1. Eşit Dağıtım

Bireysel yatırımcı havuzundaki toplam lot, başvuran kişi sayısına eşit olarak bölünür. Bu yöntemde ne kadar para yatırdığınız değil, kaç kişinin başvurduğu önemlidir.

- Örnek: 1.000.000 lot, 500.000 kişiye dağıtılacak → Herkes 2 lot alır

### 2. Oransal Dağıtım

Başvurulan tutar ile orantılı dağıtım yapılır. Daha fazla para yatıran daha fazla lot alır.

### 3. Karma Dağıtım

İlk olarak eşit dağıtım yapılır, kalan lotlar oransal olarak dağıtılır.

## Kaç Lot Düşeceğini Nasıl Hesaplarsın?

Basit formül:

Düşen Lot = Bireysel Havuz Lot Sayısı ÷ Başvuran Kişi Sayısı

## HalkaArzlarım Lot Hesaplayıcı

HalkaArzlarım'ın lot dağıtım hesaplayıcısı ile farklı senaryoları kolayca test edebilirsin. Toplam katılımcı sayısını ve havuz büyüklüğünü girerek tahmini lot sayını öğrenebilirsin.

## Pratik İpuçları

- Katılımcı sayısını SPK duyurularından ve finans sitelerinden takip et
- Popüler arzlarda düşen lot miktarı azalır — beklentini buna göre ayarla
- Küçük ölçekli arzlarda daha fazla lot düşebilir
- HalkaArzlarım üzerinden aktif arzları ve detaylarını anlık takip edebilirsin`,
    sirket: "HalkaArzlarım",
    kategori: "blog",
    tarih: "2026-04-03",
    yayinda: true,
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("Blog yazıları Firestore'a ekleniyor...");
  for (const yazi of yazilar) {
    await db.collection("haberler").doc(yazi.id).set(yazi, { merge: true });
    console.log(`✅ "${yazi.baslik}" eklendi`);
  }
  console.log("\nTamamlandı! 3 blog yazısı eklendi.");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
