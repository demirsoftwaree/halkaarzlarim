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

const genisletilmisYazilar = [
  {
    id: "halka-arz-nedir-2026-yatirimci-rehberi",
    baslik: "Halka Arz Nedir? 2026 Yatırımcı Rehberi",
    icerik: `Halka arz (IPO — Initial Public Offering), bir şirketin hisselerini ilk kez kamuya açık olarak satışa sunmasıdır. Bu süreçte şirket, büyüme sermayesi elde etmek amacıyla hisselerinin bir bölümünü bireysel ve kurumsal yatırımcılara satar ve Borsa İstanbul'a (BIST) kote olur.

## Halka Arz Nedir? Kısa Tanım

Bir şirket halka arz yaptığında iki şey olur: birincisi yeni hisseler ihraç ederek sermaye toplar, ikincisi mevcut ortaklar ellerindeki hisselerin bir kısmını kamuya satar. Türkiye'de bu süreç Sermaye Piyasası Kurulu (SPK) denetiminde gerçekleşir.

IPO kavramı ile halka arz aynı anlama gelir. IPO İngilizce bir kısaltma (Initial Public Offering), halka arz ise Türkçe karşılığıdır.

## Halka Arz Nasıl Çalışır?

Halka arz süreci şu aşamalardan oluşur:

- SPK'ya başvuru: Şirket, Sermaye Piyasası Kurulu'na izahname sunarak onay ister
- Fiyat belirleme: Aracı kurum ile birlikte halka arz fiyatı belirlenir
- Talep toplama: Yatırımcılar belirli bir süre (genellikle 3–7 iş günü) içinde başvuru yapar
- Dağıtım: Toplanan talebe göre lotlar yatırımcılara eşit veya oransal olarak dağıtılır
- Borsa kotasyonu: Hisse BIST'te işlem görmeye başlar

## Bireysel Yatırımcı Nasıl Katılır?

Halka arza katılmak için yetkili bir aracı kurumda yatırım hesabı açman yeterlidir. Garanti BBVA, İş Bankası, Yapı Kredi, Akbank gibi büyük bankalar ve online platformlar (Midas, Işık Menkul vb.) başvuru imkânı sunar. Talep toplama döneminde banka uygulamasından lot miktarını belirleyerek başvurursun.

Başvuru yaptığında, talep ettiğin lot sayısı × arz fiyatı kadar tutar hesabında bloke edilir. Dağıtım sonucunda almaya hak kazandığın lotlar hesabına aktarılır, kalan tutar iade edilir.

## Lot Nedir, Dağıtım Nasıl Yapılır?

Türk borsasında 1 lot = 1 hisse senedi olup nominal değeri 1 TL'dir. Bireysel yatırımcı havuzunda genellikle eşit dağıtım uygulanır: toplam lot miktarı başvuran kişi sayısına bölünerek dağıtılır. Bu nedenle talep yoğun olduğunda az lot almak kaçınılmazdır.

Lot dağıtımı hesaplaması için HalkaArzlarım'ın Lot Dağıtım Hesaplayıcı aracını kullanabilirsin.

## Neden Halka Arz Önemli?

Türkiye'de halka arz yatırımı son yıllarda oldukça popüler hale geldi. Bunun başlıca nedenleri:

- Tavan mekanizması: Yeni halka açılan hisseler ilk işlem günlerinde bileşik %10 tavan limitiyle yükselir
- Düşük kayıp riski: Birinci gün satış yapıldığında genellikle kayıp riski düşüktür
- Kolay erişim: Her bireysel yatırımcı banka uygulamasından dakikalar içinde başvurabilir
- Şeffaflık: SPK denetimi ve izahname zorunluluğu şeffaflığı artırır

## Halka Arzın Riskleri

Her yatırım gibi halka arzların da riskleri vardır:

- Fiyat düşme riski: Tüm arzlar tavan yapmaz; piyasa koşulları bozuk olduğunda arz fiyatının altına inebilir
- Likidite riski: Talep süresince para bloke kalır, başka yatırımlara aktarılamaz
- Az lot alma riski: Popüler arzlarda çok sayıda başvuru olur ve lot miktarı azalır
- Şirket riski: İzahname dikkatle okunmalı; mali tablo ve büyüme planları değerlendirilmelidir

## 2026'da Halka Arz Piyasası

2026 yılında Türkiye sermaye piyasaları oldukça hareketli. SPK verilerine göre teknoloji, gayrimenkul, enerji ve sağlık sektörlerinden onlarca şirket halka arz için başvuruda bulundu. 2024 yılındaki 53 IPO rekoru yaklaşık seviyelerde seyretmektedir.

HalkaArzlarım platformunda tüm aktif ve yaklaşan arzları takip edebilir, tavan simülatörü ile kazanç hesaplayabilir ve ücretsiz bildirim alabilirsin.

## Sık Sorulan Sorular

### Halka arza katılmak için minimum ne kadar para gerekli?

Minimum 1 lot × arz fiyatı kadar para gereklidir. Örneğin arz fiyatı 80 TL olan bir hisse için 80 TL yeterlidir. Ancak dağıtım sonucunda bu tek lotu alma garantisi yoktur.

### Halka arzda kaç lot alınabilir?

Bu büyük ölçüde talep miktarına bağlıdır. Eşit dağıtımda toplam lot / başvuran kişi formülüyle hesaplanır. Lot Dağıtım Hesaplayıcı ile tahmin yapabilirsin.

### Birden fazla bankadan başvuru yapılabilir mi?

Evet, birden fazla aracı kurumdan başvuru yapılabilir. Her başvuru ayrı değerlendirilir.`,
    kategori: "blog",
    tarih: "2026-04-03",
    yayinda: true,
    guncellendi: new Date().toISOString(),
  },
  {
    id: "halka-arzda-tavan-nedir-nasil-hesaplanir",
    baslik: "Halka Arzda Tavan Nedir? Nasıl Hesaplanır?",
    icerik: `Halka arz yatırımlarının en heyecan verici kısmı "tavan"dır. Peki tavan nedir, nasıl hesaplanır ve halka arzlarda kaç gün sürer? Bu rehberde her şeyi bulabilirsin.

## Tavan Nedir?

Borsa İstanbul'da (BIST) her hissenin gün içinde ulaşabileceği maksimum fiyat artışı sınırına "tavan" denir. Bu sınır, bir önceki işlem gününün kapanış fiyatının %10 üstündedir.

Hisse bu sınıra ulaştığında ve piyasada satıcı bulunamadığında "tavan yapıyor" ya da "tavanda kaldı" denir. Bu yatırımcı için olumlu bir durumdur: elinde hisse varsa değeri artmaya devam eder.

## Halka Arzda Tavan Neden Özel?

Yeni halka açılan (IPO) hisseler borsaya girdiğinde piyasa gerçek değerini keşfetmeye çalışır. Halka arz fiyatı gerçek değerin altında kalmışsa hisse günlerce tavan yaparak yükselir. Bu sürece "fiyat keşfi" denir.

Normal bir hisse için tavan nadir görülürken, halka arz olan hisselerde arka arkaya birden fazla tavan görülmesi sıradan bir durumdur.

## Tavan Nasıl Hesaplanır?

Formül basittir:

Tavan Fiyatı = Önceki Kapanış × 1,10

İlk tavan için baz fiyat, halka arz fiyatıdır. Her tavan bileşik olarak çalışır.

## Örnek Hesaplama

Bir hisse 10 TL'den halka arz edilsin:

- 1. tavan: 11,00 TL (+%10,0 kazanç)
- 2. tavan: 12,10 TL (+%21,0 kazanç)
- 3. tavan: 13,31 TL (+%33,1 kazanç)
- 5. tavan: 16,11 TL (+%61,1 kazanç)
- 7. tavan: 19,49 TL (+%94,9 kazanç)
- 10. tavan: 25,94 TL (+%159,4 kazanç)

Görüldüğü gibi 10 tavan yapan bir hisse, arz fiyatının 2,59 katına çıkar ve yatırımcıya %159 brüt getiri sağlar.

## Halka Arz Kaç Gün Tavan Yapar?

Kesin bir sayı yoktur. Şirkete olan talebe, piyasa koşullarına ve sektöre bağlıdır. Tarihsel verilere bakıldığında:

- Düşük talep gören arzlar: 1–2 tavan
- Ortalama talep: 3–5 tavan
- Yüksek talep: 7–10+ tavan

Geçmiş arzların tavan gün sayısını görmek için HalkaArzlarım'ın Geçmiş Tavan Performansı sayfasını inceleyebilirsin.

## Ne Zaman Satmalı?

Bu tamamen kişisel bir yatırım kararıdır. Yatırımcılar farklı stratejiler izler:

- İlk günde satış: Minimum risk, minimum getiri
- 3. tavanda satış: Orta yol (%33 brüt)
- Tavan serisi bitince satış: Maksimum getiri ama risk de artar
- Uzun vadeli tutma: Şirkete inandıysan yıllarca tutabilirsin

Tavan simülatörüyle her senaryo için net kârını hesaplayabilirsin. Komisyon ve stopaj da göz önünde bulundurulmalıdır.

## HalkaArzlarım Tavan Simülatörü

HalkaArzlarım'ın ücretsiz tavan simülatörü ile istediğin arz fiyatı ve lot sayısı için anında hesaplama yapabilirsin. 1'den 10 tavana kadar her senaryonun brüt kârını görebilirsin.

## Tavan ile İlgili Riskler

- Tavan yapamama riski: Düşük taleple arz olan bir hisse hiç tavan yapmayabilir
- Alıcı bulamama: Tavan yapan hisseyi satmak zordur çünkü herkes satmak yerine beklemeye çalışır
- Komisyon maliyeti: Her satış işleminde aracı kuruma komisyon ödenir, hesaplamaya dahil etmeli

## Sık Sorulan Sorular

### Halka arz tavan sona erince ne olur?

Fiyat keşfi tamamlandığında hisse "değerine" ulaşır. Artık normal hisse gibi işlem görür; piyasa koşullarına göre yükselir ya da düşer.

### Tavan yapan hisse satılabilir mi?

Teknik olarak satış emri girebilirsin ancak o gün alıcı çıkmayabilir. Satış gerçekleşmezse emir iptal olur.

### Tavan ile taban arasındaki fark nedir?

Tavan günlük maksimum artış (+%10), taban ise günlük maksimum düşüş (-%10) sınırıdır.`,
    kategori: "blog",
    tarih: "2026-04-03",
    yayinda: true,
    guncellendi: new Date().toISOString(),
  },
  {
    id: "lot-dagitimi-nasil-yapilir-kapsamli-rehber",
    baslik: "Lot Dağıtımı Nasıl Yapılır? Kapsamlı Rehber",
    icerik: `Halka arza başvurdunuz, peki kaç lot düşeceğini biliyor musunuz? Lot dağıtımı yatırımcıların en çok merak ettiği konuların başında geliyor. Bu rehberde lot nedir, dağıtım nasıl yapılır ve ne kadar lot alabilirsiniz sorularını yanıtlıyoruz.

## Lot Nedir?

Borsa İstanbul'da hisseler "lot" birimi üzerinden işlem görür. Türkiye'de 1 lot = 1 hisse senedi eşittir ve nominal değeri 1 TL'dir. Halka arza başvururken talep ettiğiniz lot sayısını seçersiniz.

Önemli: Türkiye'de bazı eski mevzuat metinlerinde 100 lot = 1 hisse diye geçse de 2019'da yapılan değişiklikle standart lot büyüklüğü 1 hisse olarak belirlenmiştir.

## Dağıtım Yöntemleri

### 1. Eşit Dağıtım (En Yaygın)

Bireysel yatırımcı havuzundaki toplam lot, başvuran kişi sayısına eşit olarak bölünür. Bu yöntemde ne kadar para yatırdığınız değil, kaç kişinin başvurduğu önemlidir.

Formül: Kişi Başına Lot = Bireysel Havuz / Toplam Başvuran

Örnek: 2.000.000 lot havuz, 500.000 kişi başvurmuş → Herkes 4 lot alır

### 2. Oransal Dağıtım

Başvurulan tutar ile orantılı dağıtım yapılır. Daha fazla para yatıran daha fazla lot alır. Kurumsal yatırımcı havuzunda genellikle bu yöntem kullanılır.

### 3. Karma Dağıtım

İlk olarak eşit dağıtım yapılır, kalan lotlar oransal olarak dağıtılır. Bazı arzlar bu yöntemi tercih eder.

## Kaç Lot Düşeceğini Nasıl Hesaplarsın?

Eşit dağıtım için temel formül:

Kişi Başına Lot = Bireysel Havuz Lot Sayısı ÷ Başvuran Kişi Sayısı

Ancak bu hesaplamayı yapabilmek için başvuran kişi sayısını bilmek gerekir. Talep toplama sona erdiğinde şirket ve SPK başvuru sayısını açıklar.

HalkaArzlarım'ın Lot Dağıtım Hesaplayıcısı ile farklı katılımcı senaryoları için anlık simülasyon yapabilirsin.

## Bireysel Havuz Nedir?

Halka arz lotlarının tamamı tek bir havuza gitmez. Genellikle aşağıdaki şekilde bölünür:

- Bireysel yatırımcı havuzu: Bireysel hesaplardan gelen talepler
- Kurumsal yatırımcı havuzu: Fon, sigorta, banka gibi kurumsal talepler
- Yurt dışı havuzu: Yabancı kurumsal yatırımcılar

Bireysel yatırımcılar yalnızca bireysel havuzdaki lotlara katılır.

## Çoklu Başvuru Stratejisi

Birden fazla aracı kurumdan başvuru yapılabilir. Bu nedenle bazı yatırımcılar 5–10 farklı bankadan başvurarak toplam başvuru sayısını artırmaya çalışır.

Bu stratejinin avantajı her başvurunun ayrı değerlendirilmesidir. Dezavantajı ise birden fazla hesapta nakit blokelenmesidir.

## Dağıtım Sonuçları Ne Zaman Açıklanır?

Talep toplama süresinin bitmesinden genellikle 1–3 iş günü sonra dağıtım sonuçları açıklanır. Şirket ve SPK resmi duyuru yapar. Lotlar dağıtım günü ya da ertesi gün hesaplara aktarılır.

## Pratik İpuçları

- Katılımcı sayısını takip et: SPK duyuruları ve finans siteleri talep toplama süresince güncelleme yapar
- Popüler arzlarda beklenti düşük tut: Yüksek talep = az lot
- Küçük ölçekli arzları değerlendir: Daha az başvuru olur, daha fazla lot düşebilir
- Lot hesaplayıcı kullan: HalkaArzlarım üzerinden farklı senaryoları simüle et

## Sık Sorulan Sorular

### Talep ettiğimden fazla lot alabilir miyim?

Hayır. Talep ettiğinden fazlası dağıtılmaz. Eğer katılımcı sayısı az ve havuz büyükse talep ettiğinin tamamını alabilirsin.

### Hiç lot alamazsam param ne olur?

Bloke edilen tutar 1–2 iş günü içinde hesabına iade edilir.

### Dağıtım adaletsiz midir?

Eşit dağıtım sistemi her başvuran kişiye aynı fırsatı tanır. Büyük yatırımcılar için bireysel havuzda avantaj yoktur; bu nedenle sistem bireysel yatırımcı dostudur.

### Lotların hesabıma ne zaman gelir?

Kotasyon günü ya da bir önceki gün akşam hesaplara aktarılır. Borsa işlem saatleri içinde hisseni satabilirsin.`,
    kategori: "blog",
    tarih: "2026-04-03",
    yayinda: true,
    guncellendi: new Date().toISOString(),
  },
];

async function expand() {
  console.log("Blog yazıları genişletiliyor...");
  for (const yazi of genisletilmisYazilar) {
    const { id, ...data } = yazi;
    await db.collection("haberler").doc(id).set(data, { merge: true });
    const kelimeSayisi = data.icerik.split(/\s+/).length;
    console.log(`✅ "${data.baslik}" güncellendi — ~${kelimeSayisi} kelime`);
  }
  console.log("\nTamamlandı!");
  process.exit(0);
}

expand().catch((err) => { console.error(err); process.exit(1); });
