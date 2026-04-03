# 📱 ArzTakip.com — Tam Proje Planı (A'dan Z'ye)

> **Marka:** ArzTakip.com  
> **Versiyon:** 2.0 (Final)  
> **Tarih:** Mart 2026  
> **Platform:** Web (Responsive) → Mobil App (Faz 2)

---

## 1. VİZYON & MARKA

### 1.1 Proje Özeti
Türkiye'deki bireysel halka arz yatırımcıları için **tek durak platform**.  
Rakip halkarz.com yalnızca bilgi sunarken; ArzTakip.com **aksiyona dönüştürür**:  
takip et → hesapla → karar ver → portföyünü yönet.

### 1.2 Marka Kimliği
| Öge | Detay |
|---|---|
| **Site adı** | ArzTakip.com |
| **Slogan** | "Halka Arzı Takip Et, Kazancını Hesapla." |
| **Ton** | Profesyonel, güvenilir, sade |
| **Tema** | Finans temalı, koyu mavi + yeşil aksanlar |
| **Domain** | arztakip.com |

### 1.3 Hedef Kitle
- Bireysel halka arz yatırımcıları (25–55 yaş)
- BIST'i takip eden, lot/tavan hesabı yapan kullanıcılar
- Twitter/X, Telegram, WhatsApp yatırım gruplarında aktif kişiler

---

## 2. ÖZELLİK LİSTESİ

### 2.1 Ücretsiz (Free Tier) — Herkese Açık
| Özellik | Detay |
|---|---|
| Halka Arz Takvimi | Tüm aktif, yaklaşan, tamamlanan arzlar |
| Şirket Detay Sayfası | Fiyat bandı, tarihler, aracı kurum, sektör, KAP linki |
| Tavan Simülatörü | Kaç tavan = kaç TL hesabı |
| Lot Dağıtım Hesaplayıcı | Kaç kişi yazılırsa kaç lot düşer |
| Net Kâr Hesaplayıcı | Komisyon dahil net kazanç |
| Talep Maliyeti Hesaplayıcı | Bloke tutar + fırsat maliyeti |
| Haberler & Duyurular | Güncel halka arz haberleri |
| BIST Endeks Widget | XU100, XU030, XHARZ canlı ticker |
| Google Reklamları | Ücretsiz kullanıcılara gösterilir |

### 2.2 Premium Tier — Ücretli
| Özellik | Detay |
|---|---|
| ⭐ Halka Arzlarım | Kişisel takip listesi (watchlist) |
| ⭐ Başvuru İşaretleme | Hangi arzlara başvurduğunu kaydet |
| ⭐ Not Ekleme | Her arza özel not (aracı kurum, lot adedi vb.) |
| ⭐ Portföy Özeti | Ne kadar yatırdım, ne kadar kazandım |
| ⭐ E-posta Bildirimleri | Yeni arz, yaklaşan son gün uyarıları |
| ⭐ Reklamsız Deneyim | AdSense reklamları gizlenir |
| ⭐ Geçmiş Arşiv & İstatistik | Tamamlanan arzların performans analizi |

---

## 3. SAYFA MİMARİSİ (Sitemap)

```
arztakip.com/
│
├── /                            → Ana Sayfa
├── /halka-arzlar                → Tüm Arzlar (filtreli liste)
├── /halka-arz/[slug]            → Şirket Detay Sayfası
│
├── /araclar                     → Araçlar Hub
│   ├── /araclar/tavan-simulatoru
│   ├── /araclar/lot-hesaplama
│   ├── /araclar/kar-hesaplama
│   └── /araclar/maliyet-hesaplama
│
├── /haberler                    → Haberler Listesi
├── /haberler/[slug]             → Haber Detay
│
├── /premium                     → Premium Satış Sayfası
│
├── /hesabim                     → Kullanıcı Profili [GİRİŞ GEREKLİ]
│   ├── /hesabim/arzlarim        → Halka Arzlarım [PREMİUM]
│   ├── /hesabim/portfoy         → Portföy Özeti [PREMİUM]
│   └── /hesabim/bildirimler     → Bildirim Ayarları [PREMİUM]
│
├── /admin                       → Admin Paneli [ADMIN]
│   ├── /admin/arzlar
│   ├── /admin/haberler
│   └── /admin/kullanicilar
│
├── /hakkimizda
├── /iletisim
├── /gizlilik-politikasi
├── /kullanim-kosullari
└── /cerez-politikasi
```

---

## 4. SAYFA DETAYLARI

### 4.1 Ana Sayfa `/`
Bölümler (yukarıdan aşağıya):
1. **Sticky Navbar** — Logo | Takvim | Araçlar | Haberler | Premium | Giriş Yap
2. **BIST Ticker Bar** — XU100, XU030, XHARZ sürekli kayan şerit
3. **Hero Section** — Başlık + slogan + 2 CTA butonu (Takvimi Gör / Araçları Dene)
4. **Aktif Arzlar Grid** — Kart listesi (logo, ticker, tarih, fiyat bandı, durum badge)
5. **Yaklaşan Arzlar** — Sayaç (kaç gün kaldı) ile birlikte
6. **4 Araç Kartı** — Kısa açıklama + "Hesapla" butonu
7. **Son Haberler** — 3 kart
8. **Premium CTA Banner** — "Halka Arzlarım özelliğini ücretsiz deneyin"
9. **Footer**

### 4.2 Şirket Detay Sayfası `/halka-arz/[slug]`
```
┌─────────────────────────────────────────┐
│  [LOGO]  MCARD                          │
│  Metropal Kurumsal Hizmetler A.Ş.       │
│  ● AKTİF  |  Teknoloji  |  BIST        │
├─────────────────────────────────────────┤
│  Talep Tarihleri:  2–4 Mart 2026        │
│  Fiyat Bandı:      8.50 ₺ – 10.00 ₺    │
│  Lot Büyüklüğü:    100 hisse            │
│  Aracı Kurum:      Garanti BBVA         │
│  Toplam Arz:       5.000.000 lot        │
│  Bireysel Pay:     %50                  │
├─────────────────────────────────────────┤
│  [Hızlı Tavan Hesapla]  ← inline araç  │
├─────────────────────────────────────────┤
│  Şirket Hakkında: ...                   │
│  KAP Linki: →                           │
├─────────────────────────────────────────┤
│  ⭐ [Takip Listeme Ekle] ← Premium      │
│  ✅ [Başvurdum olarak işaretle]         │
│  📝 [Not ekle]                          │
└─────────────────────────────────────────┘
```

### 4.3 Halka Arzlarım `/hesabim/arzlarim` (Premium)
- Kullanıcının takip ettiği tüm arzlar
- Her satırda: Logo | Ticker | Tarih | Başvurdum? | Lot | Not | Kâr/Zarar
- Üstte özet widget: Toplam yatırım / Tahmini toplam kâr
- Filtreleme: Aktif / Tamamlandı / Bekleyen
- Export: CSV olarak indir (v2)

---

## 5. HESAPLAMA ARAÇLARI (Tam Mantık)

### 5.1 Tavan Simülatörü

**Girdiler:**
- Arz fiyatı (₺) — ör. `10.00`
- Lot başına hisse sayısı — varsayılan `100`, değiştirilebilir
- Kaç lot? — ör. `1`
- Kaç tavan? — slider `1–10`

**Formül:**
```
BIST tavan limiti = %10 (günlük)
Tavan N sonrası fiyat = Arz Fiyatı × (1.10)^N

Toplam değer     = Tavan Fiyatı × Lot × Hisse/Lot
Alım maliyeti    = Arz Fiyatı × Lot × Hisse/Lot
Brüt kâr         = Toplam Değer − Alım Maliyeti
ROI %            = (Brüt Kâr / Alım Maliyeti) × 100
```

**Çıktılar:**
- Günlük tavan tablosu (1. gün → N. gün fiyat + değer)
- Toplam brüt kâr (₺)
- ROI (%)
- ⚠️ "Bu hesaplama tahminidir, yatırım tavsiyesi değildir."

---

### 5.2 Lot Dağıtım Hesaplayıcı

**Girdiler:**
- Toplam arz lot adedi — ör. `1.000.000`
- Bireysel yatırımcı payı (%) — ör. `50`
- Tahmini talep eden kişi sayısı — ör. `300.000`
- Kişi başı talep lot — ör. `1`

**Formül:**
```
Bireysel havuz    = Toplam Lot × (Bireysel Pay / 100)
Toplam talep lot  = Kişi Sayısı × Kişi Başı Lot
Oran              = Bireysel Havuz / Toplam Talep Lot

Kişi başı düşen  = Bireysel Havuz / Kişi Sayısı
  → Tam sayıya yuvarla (aşağı)
  → 0 ise: "Her X kişiden 1'i lot alabilir"
```

**Çıktılar:**
- Kişi başına düşen lot (tam sayı)
- "Her X kişiden 1'i lot alır" senaryosu
- 3 senaryo tablosu: İyimser / Baz / Kötümser talep

---

### 5.3 Net Kâr Hesaplayıcı

**Girdiler:**
- Arz fiyatı (₺)
- Lot sayısı
- Hisse/lot
- Satış fiyatı (₺) — manuel veya tavan simülatöründen otomatik çek
- Aracı kurum komisyonu (%) — ör. `0.2`

**Formül:**
```
Alım maliyeti   = Arz Fiyatı × Lot × Hisse
Satış geliri    = Satış Fiyatı × Lot × Hisse
Komisyon        = Satış Geliri × (Komisyon / 100)
Net kâr         = Satış Geliri − Alım Maliyeti − Komisyon
ROI %           = (Net Kâr / Alım Maliyeti) × 100
```

**Çıktılar:**
- Net kâr (₺)
- ROI (%)
- Komisyon tutarı
- Özet kart (alım / satış / komisyon / net)

---

### 5.4 Talep Maliyeti Hesaplayıcı

**Girdiler:**
- Arz fiyatı (₺)
- Talep edilecek lot
- Hisse/lot
- Bloke süre (gün) — talep toplama süresi, ör. `3`
- Günlük repo/faiz oranı (%) — ör. `0.12` (yıllık %45 → günlük ~0.123%)

**Formül:**
```
Bloke tutar       = Arz Fiyatı × Lot × Hisse
Fırsat maliyeti   = Bloke Tutar × (Günlük Faiz / 100) × Gün
Net maliyet       = Fırsat Maliyeti (bloke paranın getiri kaybı)
```

**Çıktılar:**
- Bloke edilecek toplam ₺
- Fırsat maliyeti (₺)
- "Bu para X gün bloke kalır" özeti
- Tavsiye: "X₺ kazanç için Y₺ fırsat maliyetine değer mi?"

---

## 6. TEKNOLOJİ YIĞINI (Tech Stack)

### 6.1 Web (Faz 1)

| Katman | Teknoloji | Versiyon | Neden? |
|---|---|---|---|
| **Framework** | Next.js | 14+ (App Router) | SSR/SSG, SEO, dosya tabanlı routing |
| **Dil** | TypeScript | 5+ | Tip güvenliği |
| **Stil** | Tailwind CSS | 3+ | Hızlı, responsive, utility-first |
| **UI Bileşenler** | shadcn/ui | latest | Hazır, erişilebilir, özelleştirilebilir |
| **Grafik/Chart** | Recharts | latest | Tavan tablosu grafikleri |
| **Animasyon** | Framer Motion | latest | Geçiş animasyonları |
| **Form** | React Hook Form | latest | Araç formları |
| **Validasyon** | Zod | latest | Input doğrulama |
| **State** | Zustand | latest | Global state (auth, premium) |
| **SEO** | next-seo | latest | Meta tag yönetimi |

### 6.2 Backend & Altyapı

| Katman | Teknoloji | Neden? |
|---|---|---|
| **Auth** | Firebase Authentication | Google ile giriş, oturum |
| **Veritabanı** | Firestore | Gerçek zamanlı, NoSQL, esnek |
| **Depolama** | Firebase Storage | Logo görselleri |
| **Sunucusuz Fonksiyon** | Firebase Cloud Functions | Webhook, bildirim, abonelik |
| **Deploy** | Vercel | Next.js ile mükemmel, CDN, edge |
| **E-posta** | SendGrid (ücretsiz tier) | Bildirim e-postaları |

### 6.3 Ödeme

| Teknoloji | Neden? |
|---|---|
| **İyzico** | Türkiye'de en yaygın, TL destekli, abonelik API var |
| Alternatif | Stripe (uluslararası açılım için v3'te) |

### 6.4 Mobil — Faz 2

| Teknoloji | Neden? |
|---|---|
| **React Native (Expo)** | Web ile aynı ekosistem (React), tek kod tabanı |
| **Expo Router** | Next.js'e benzer dosya tabanlı routing |
| **Firebase SDK** | Web ile aynı backend, sıfır değişiklik |
| **Expo Notifications** | Push bildirimleri (iOS + Android) |
| **React Native Paper** | UI bileşen kütüphanesi |

> **Not:** Web kodu component bazında yazılırsa, Faz 2'de iş mantığı (hesaplama fonksiyonları, Firebase çağrıları) doğrudan React Native'e taşınır. Sadece UI katmanı yeniden yazılır.

### 6.5 Analytics & Reklam

| Araç | Kullanım |
|---|---|
| Google Analytics 4 | Kullanıcı davranışı, dönüşüm |
| Google Search Console | SEO takip |
| Google AdSense | Reklam geliri (ücretsiz kullanıcılar) |
| Hotjar (opsiyonel) | Isı haritası, UX iyileştirme |

---

## 7. VERİTABANI YAPISI (Firestore Schema)

### Collection: `arzlar`
```json
{
  "id": "mcard-metropal-2026",
  "ticker": "MCARD",
  "sirketAdi": "Metropal Kurumsal Hizmetler A.Ş.",
  "logo": "https://storage.../mcard.jpg",
  "slug": "metropal-kurumsal-hizmetler",
  "durum": "aktif",
  "durumSecenekleri": ["aktif","yaklasan","tamamlandi","ertelendi","basvuru-surecinde"],
  "sektor": "Teknoloji",
  "talepBaslangic": "2026-03-02",
  "talepBitis": "2026-03-04",
  "arsFiyatiAlt": 8.50,
  "arsFiyatiUst": 10.00,
  "lotBuyuklugu": 100,
  "araciKurum": "Garanti BBVA Yatırım",
  "toplamArzLot": 5000000,
  "bireyselpayYuzde": 50,
  "kapLinki": "https://kap.org.tr/...",
  "aciklama": "Şirket hakkında kısa açıklama...",
  "piyasaDegeri": 500000000,
  "olusturmaTarihi": "Timestamp",
  "guncellenmeTarihi": "Timestamp"
}
```

### Collection: `kullanicilar`
```json
{
  "uid": "firebase-uid-xyz",
  "email": "kullanici@gmail.com",
  "displayName": "Ahmet Yılmaz",
  "photoURL": "https://...",
  "premium": true,
  "premiumBaslangic": "Timestamp",
  "premiumBitis": "Timestamp",
  "premiumPlan": "yillik",
  "iyzicoMusteriId": "iy-xxx",
  "olusturmaTarihi": "Timestamp"
}
```

### SubCollection: `kullanicilar/{uid}/watchlist`
```json
{
  "arzId": "mcard-metropal-2026",
  "ticker": "MCARD",
  "basvurdum": true,
  "lot": 2,
  "arsFiyati": 10.00,
  "yatirimTutari": 2000.00,
  "not": "Garanti üzerinden başvurdum, 2 lot",
  "durum": "bekliyorum",
  "durumSecenekleri": ["takip","bekliyorum","tamamlandi","iptal"],
  "eklenmeTarihi": "Timestamp",
  "guncellemeTarihi": "Timestamp"
}
```

### Collection: `haberler`
```json
{
  "id": "haber-slug-2026",
  "baslik": "MCARD halka arz tarihleri açıklandı",
  "ozet": "Metropal 2–4 Mart tarihleri arasında...",
  "icerik": "## Markdown içerik...",
  "gorsel": "https://...",
  "slug": "mcard-halka-arz-tarihleri",
  "yayinTarihi": "Timestamp",
  "kategori": "halka-arz",
  "ilgiliArzId": "mcard-metropal-2026"
}
```

---

## 8. PROJE KLASÖR YAPISI

```
arztakip/
├── app/                              ← Next.js App Router
│   ├── (public)/                     ← Herkese açık sayfalar
│   │   ├── page.tsx                  ← Ana sayfa
│   │   ├── halka-arzlar/
│   │   │   ├── page.tsx              ← Tüm arzlar listesi
│   │   │   └── [slug]/
│   │   │       └── page.tsx          ← Şirket detay
│   │   ├── araclar/
│   │   │   ├── page.tsx              ← Araçlar hub
│   │   │   ├── tavan-simulatoru/page.tsx
│   │   │   ├── lot-hesaplama/page.tsx
│   │   │   ├── kar-hesaplama/page.tsx
│   │   │   └── maliyet-hesaplama/page.tsx
│   │   ├── haberler/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── premium/page.tsx
│   │
│   ├── (auth)/                       ← Giriş gerektiren sayfalar
│   │   └── hesabim/
│   │       ├── page.tsx              ← Profil
│   │       ├── arzlarim/page.tsx     ← Halka Arzlarım ⭐
│   │       ├── portfoy/page.tsx      ← Portföy özeti ⭐
│   │       └── bildirimler/page.tsx  ← Bildirimler ⭐
│   │
│   ├── (admin)/                      ← Sadece admin
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── arzlar/
│   │       │   ├── page.tsx
│   │       │   ├── yeni/page.tsx
│   │       │   └── [id]/duzenle/page.tsx
│   │       ├── haberler/page.tsx
│   │       └── kullanicilar/page.tsx
│   │
│   ├── api/
│   │   ├── webhook/
│   │   │   └── iyzico/route.ts       ← Ödeme webhook
│   │   └── revalidate/route.ts       ← ISR revalidation
│   │
│   ├── layout.tsx                    ← Root layout
│   ├── globals.css
│   └── sitemap.ts                    ← Otomatik sitemap
│
├── components/
│   ├── ui/                           ← shadcn bileşenleri
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── EndeksTicker.tsx          ← BIST kayan şerit
│   │   └── MobilMenu.tsx
│   ├── arz/
│   │   ├── ArzKarti.tsx              ← Liste kartı
│   │   ├── ArzListesi.tsx            ← Grid liste
│   │   ├── ArzDetay.tsx              ← Detay sayfası
│   │   ├── ArzDurumBadge.tsx         ← Renkli durum etiketi
│   │   └── ArzFiltrele.tsx           ← Filtre paneli
│   ├── araclar/
│   │   ├── TavanSimulatoru.tsx
│   │   ├── LotHesaplama.tsx
│   │   ├── KarHesaplama.tsx
│   │   └── MaliyetHesaplama.tsx
│   ├── hesabim/
│   │   ├── ArzlarimListesi.tsx
│   │   ├── WatchlistButon.tsx
│   │   ├── BasvurduIsaretle.tsx
│   │   ├── NotEkle.tsx
│   │   └── PortfoyOzeti.tsx
│   └── common/
│       ├── PremiumGate.tsx           ← Premium kısıt overlay
│       ├── ReklamAlani.tsx           ← AdSense wrapper
│       ├── YuklemeIskeleti.tsx       ← Loading skeleton
│       └── PaylasBitonu.tsx          ← Sosyal paylaşım
│
├── lib/
│   ├── firebase.ts                   ← Firebase başlatma
│   ├── firestore/
│   │   ├── arzlar.ts                 ← getArzlar, getArzBySlug...
│   │   ├── kullanicilar.ts           ← getKullanici, setPremium...
│   │   └── watchlist.ts              ← addToWatchlist, removeFrom...
│   ├── hesaplamalar/
│   │   ├── tavan.ts                  ← tavanHesapla()
│   │   ├── lot.ts                    ← lotDagitimHesapla()
│   │   ├── kar.ts                    ← netKarHesapla()
│   │   └── maliyet.ts                ← talepMaliyetiHesapla()
│   ├── iyzico.ts                     ← Ödeme entegrasyonu
│   └── utils.ts                      ← Yardımcı fonksiyonlar
│
├── hooks/
│   ├── useAuth.ts                    ← Firebase auth hook
│   ├── usePremium.ts                 ← Premium kontrol
│   └── useWatchlist.ts               ← Watchlist CRUD
│
├── types/
│   ├── arz.ts
│   ├── kullanici.ts
│   └── watchlist.ts
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png                  ← Open Graph görseli
│   └── icons/                        ← PWA ikonları
│
├── .env.local                        ← Gizli anahtarlar
├── .env.example                      ← Örnek env şablonu
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 9. KURULUM ADIMLARI (Adım Adım)

### Adım 1: Proje Oluştur
```bash
npx create-next-app@latest arztakip \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd arztakip
```

### Adım 2: Bağımlılıkları Kur
```bash
# UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge input label tabs

# Paketler
npm install firebase recharts framer-motion
npm install react-hook-form zod @hookform/resolvers
npm install zustand next-seo
npm install date-fns                  # Tarih formatlama
npm install lucide-react              # İkonlar
```

### Adım 3: Firebase Kurulumu
1. [console.firebase.google.com](https://console.firebase.google.com) → "Proje Oluştur" → "ArzTakip"
2. **Authentication** → Sign-in method → Google → Etkinleştir
3. **Firestore** → Create database → Production mode → `europe-west1` bölgesi
4. **Storage** → Başlat
5. **Project Settings** → Web uygulaması ekle → Config'i kopyala

### Adım 4: Ortam Değişkenleri
```env
# .env.local

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=arztakip.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=arztakip
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=arztakip.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# İyzico
IYZICO_API_KEY=sandbox-xxx
IYZICO_SECRET_KEY=sandbox-xxx
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Site
NEXT_PUBLIC_SITE_URL=https://arztakip.com
NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxx

# Admin
ADMIN_EMAIL=admin@arztakip.com
```

### Adım 5: Firestore Güvenlik Kuralları
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Arzlar: herkes okur, sadece admin yazar
    match /arzlar/{arzId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true;
    }

    // Haberler: herkes okur, sadece admin yazar
    match /haberler/{haberId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true;
    }

    // Kullanıcı: kendi verisini okur/yazar
    match /kullanicilar/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // Watchlist: kullanıcı kendi listesini yönetir
    match /kullanicilar/{userId}/watchlist/{itemId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

### Adım 6: Vercel Deploy
```bash
# Vercel CLI kur
npm i -g vercel

# Giriş yap
vercel login

# Deploy et
vercel --prod
```
→ Vercel dashboard → Settings → Environment Variables → `.env.local` içeriğini ekle

### Adım 7: Domain Bağla
1. [namecheap.com](https://namecheap.com) veya [isimtescil.net](https://isimtescil.net) → `arztakip.com` satın al
2. Vercel dashboard → Domains → `arztakip.com` ekle
3. DNS kayıtlarını Vercel'in gösterdiği gibi ayarla
4. SSL otomatik aktif olur (Let's Encrypt)

---

## 10. RESPONSIVE (MOBİL UYUMLU) TASARIM

Mobil uygulama yapmadan önce web sitesi tam mobil uyumlu olacak:

### Breakpoint Stratejisi (Tailwind)
```
sm:  640px  → Büyük telefon
md:  768px  → Tablet
lg:  1024px → Küçük laptop
xl:  1280px → Masaüstü
```

### Mobil Öncelikli Kurallar
| Bileşen | Mobil | Tablet | Masaüstü |
|---|---|---|---|
| Arz kartları | Tek sütun | 2 sütun | 3 sütun |
| Navbar | Hamburger menü | Hamburger | Tam menü |
| Araçlar | Dikey yerleşim | Dikey | Yan yana |
| Tablo | Yatay scroll | Normal | Normal |
| Endeks ticker | Gizli | Göster | Göster |

### PWA (Progressive Web App)
Web sitesi telefona "uygulama gibi" kurulabilir olacak:
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})
module.exports = withPWA({ /* config */ })
```
- Ana ekrana ekle butonu
- Offline çalışma (hesaplama araçları)
- Push bildirimleri (ileride)

---

## 11. PARA KAZANMA MODELİ

### 11.1 Premium Abonelik Fiyatlandırması
| Plan | Fiyat | Açıklama |
|---|---|---|
| **Ücretsiz** | 0 ₺ | Takvim + Araçlar + Haberler |
| **Premium Aylık** | 49 ₺/ay | Tüm özellikler + reklamsız |
| **Premium Yıllık** | 399 ₺/yıl | Aylık 33.25 ₺ — %32 tasarruf |

### 11.2 Ödeme Akışı
```
Kullanıcı "Premium'a Geç" → /premium sayfası
→ Plan seç (aylık/yıllık)
→ İyzico ödeme formu
→ Ödeme onayı
→ Firebase webhook → kullanici.premium = true
→ /hesabim/arzlarim sayfasına yönlendir
```

### 11.3 Google AdSense Yerleşimi
| Konum | Reklam Tipi | Hedef |
|---|---|---|
| Ana sayfa — arz listesi arası | In-feed native | Yüksek CTR |
| Şirket detay — altı | Display banner | Görünürlük |
| Araçlar sayfası — üst | Responsive display | Trafik |
| Haberler — içerik arası | In-article | Engagement |

> Premium kullanıcılara tüm reklamlar gizlenir.

### 11.4 Gelir Projeksiyonu
| Ay | Kullanıcı | Premium | AdSense | Toplam |
|---|---|---|---|---|
| 1–2 | 500 | 0 | 200 ₺ | 200 ₺ |
| 3 | 2.000 | 20 kişi × 49 ₺ = 980 ₺ | 600 ₺ | 1.580 ₺ |
| 6 | 8.000 | 100 × 49 ₺ = 4.900 ₺ | 2.500 ₺ | 7.400 ₺ |
| 12 | 25.000 | 300 × 49 ₺ = 14.700 ₺ | 6.000 ₺ | 20.700 ₺ |

---

## 12. SEO STRATEJİSİ

### 12.1 Teknik SEO
- **SSG** (`generateStaticParams`) — tüm arz sayfaları derleme anında üretilir
- **ISR** (Incremental Static Regeneration) — her 1 saatte otomatik güncelleme
- **Sitemap** — `next-sitemap` ile otomatik
- **Robots.txt** — `/admin`, `/api` dizinleri hariç tut
- **Open Graph** — her sayfa için özel og:image (dinamik)
- **Schema.org** — `FinancialProduct`, `Article`, `BreadcrumbList` markup

### 12.2 Hedef Anahtar Kelimeler
| Kelime | Tahmini Hacim | Sayfa |
|---|---|---|
| halka arz takvimi | ⬆️ Yüksek | / |
| halka arz tavan hesaplama | ⬆️ Orta | /araclar/tavan-simulatoru |
| halka arz lot hesaplama | ⬆️ Orta | /araclar/lot-hesaplama |
| [ticker] halka arz | ➡️ Düşük-Orta | /halka-arz/[slug] |
| halka arz nasıl yapılır | ⬆️ Orta | Blog/haberler |
| BIST halka arz 2026 | ➡️ Orta | / + haberler |

### 12.3 Büyüme Kanalları
1. **Twitter/X** — Her yeni arzi paylaş, araç sonuçlarını görsel kart olarak paylaş
2. **Telegram & WhatsApp grupları** — Yatırım gruplarında araçları organik tanıt
3. **YouTube** — "Halka arz tavan nasıl hesaplanır" kısa videolar → site trafiği
4. **Ekşi Sözlük / Şikayetvar** — Araçları organik yerlerde mention et
5. **Google Ads** — İlk 3 ay küçük bütçe ile anahtar kelime reklamı

---

## 13. TASARIM SİSTEMİ

### 13.1 Renk Paleti
```css
/* Ana renkler */
--color-primary:       #0F4C81;   /* Koyu mavi — ana marka */
--color-primary-hover: #1A6BB5;
--color-accent:        #00A878;   /* Yeşil — kazanç/pozitif */
--color-danger:        #E63946;   /* Kırmızı — kayıp/negatif */

/* Arka plan & yüzeyler */
--color-bg:            #F8FAFC;
--color-surface:       #FFFFFF;
--color-surface-2:     #F1F5F9;
--color-border:        #E2E8F0;

/* Metin */
--color-text-primary:  #0F172A;
--color-text-secondary:#64748B;
--color-text-muted:    #94A3B8;

/* Durum badge renkleri */
--aktif:               #00A878;   /* Yeşil */
--yaklasan:            #F59E0B;   /* Turuncu */
--tamamlandi:          #64748B;   /* Gri */
--ertelendi:           #E63946;   /* Kırmızı */
--basvuru-surecinde:   #8B5CF6;   /* Mor */
```

### 13.2 Tipografi
```css
/* Başlıklar & gövde */
font-family: 'Inter', system-ui, sans-serif;

/* Para/sayı değerleri (araçlarda) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### 13.3 Bileşen Standartları
| Bileşen | Tailwind sınıfları |
|---|---|
| Kart | `rounded-xl border border-border bg-surface shadow-sm` |
| Buton (primary) | `bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-hover` |
| Buton (ghost) | `border border-border rounded-lg px-4 py-2 hover:bg-surface-2` |
| Badge | `rounded-full px-2 py-0.5 text-xs font-medium` |
| Input | `border border-border rounded-lg px-3 py-2 focus:ring-2 ring-primary` |

---

## 14. PERFORMANS HEDEFLERİ

| Metrik | Hedef | Strateji |
|---|---|---|
| Lighthouse Performance | > 90 | SSG + image optimization |
| LCP | < 2.5s | Next/Image, önbellek |
| CLS | < 0.1 | Sabit boyutlu görseller |
| TTI | < 3.5s | Code splitting |
| JS Bundle (first load) | < 150KB | Tree shaking, lazy import |

---

## 15. MALİYET ANALİZİ

### Aylık Giderler
| Kalem | Fiyat |
|---|---|
| Vercel (Hobby — ücretsiz başla) | 0 ₺ |
| Firebase Spark (ücretsiz tier, ilk aylar) | 0 ₺ |
| Firebase Blaze (kullanım büyüyünce) | ~100–300 ₺/ay |
| Domain (arztakip.com yıllık ÷ 12) | ~60 ₺/ay |
| SendGrid (ücretsiz 100 e-posta/gün) | 0 ₺ |
| **Toplam (başlangıç)** | **~60–360 ₺/ay** |

### Başlangıç Yatırımı (Tek Seferlik)
| Kalem | Tahmini Maliyet |
|---|---|
| Domain (1 yıl) | ~700 ₺ |
| Logo & marka tasarımı | 500–2.000 ₺ |
| Geliştirici (MVP, dışarıya verilirse) | 20.000–50.000 ₺ |
| Google Ads başlangıç bütçesi | 1.000–3.000 ₺ |

---

## 16. YASAL UYUMLULUK

### 16.1 Zorunlu Sayfalar
- `/gizlilik-politikasi` — KVKK uyumlu (Google ile giriş zorunlu kılar)
- `/kullanim-kosullari` — "Yatırım tavsiyesi değildir" notu
- `/cerez-politikasi` — AdSense için GDPR/KVKK uyumu
- Cookie consent banner — İlk ziyarette göster

### 16.2 Önemli Uyarılar
```
⚠️ Tüm hesaplama araçlarına şu notu ekle:
"Bu hesaplamalar yalnızca tahmini niteliktedir.
Yatırım tavsiyesi değildir. Gerçek değerler farklılık
gösterebilir. Yatırım kararlarınızı profesyonel danışmanınıza
danışarak alınız."
```

### 16.3 SPK Durumu
- ArzTakip.com sadece bilgi ve araç sunuyor → SPK lisansı **gerekmez**
- Yatırım tavsiyesi verilmiyor → Mevzuat kapsamı dışında
- Premium abonelik bir "araç/yazılım hizmeti" → normal e-ticaret kuralları geçerli

---

## 17. GELİŞTİRME ROADMAP

### 🟢 Faz 1 — MVP Web (0–6 Hafta)
- [ ] Proje kurulumu (Next.js + Firebase + Tailwind)
- [ ] Temel layout (Navbar, Footer, EndeksTicker)
- [ ] Ana sayfa
- [ ] Halka arz takvimi + filtreler
- [ ] Şirket detay sayfası
- [ ] 4 hesaplama aracı
- [ ] Google ile giriş (Firebase Auth)
- [ ] Responsive tasarım (mobil uyumlu)
- [ ] Temel SEO + sitemap
- [ ] Vercel deploy + domain bağlama

### 🔵 Faz 2 — Premium (7–12 Hafta)
- [ ] Premium satış sayfası
- [ ] İyzico ödeme entegrasyonu
- [ ] PremiumGate bileşeni
- [ ] Halka Arzlarım sayfası (watchlist, notlar, başvuru işareti)
- [ ] Portföy özeti
- [ ] E-posta bildirimleri (Firebase Functions + SendGrid)
- [ ] Google AdSense entegrasyonu
- [ ] Admin paneli (arz ve haber yönetimi)
- [ ] PWA desteği (ana ekrana ekle)

### 🟡 Faz 3 — Büyüme (13–20 Hafta)
- [ ] Push bildirimleri
- [ ] KAP veri entegrasyonu (scraping veya API)
- [ ] Dinamik og:image (her arz için)
- [ ] Araç sonuçlarını paylaş butonu (Twitter/WhatsApp)
- [ ] Geçmiş arz arşivi + istatistikler
- [ ] Haber sistemi
- [ ] SEO içerik genişletme

### 🟠 Faz 4 — Mobil App (21–30 Hafta)
- [ ] React Native (Expo) projesi kur
- [ ] Shared logic taşı (hesaplamalar, Firebase)
- [ ] iOS + Android UI
- [ ] Push bildirimleri (Expo Notifications)
- [ ] App Store + Google Play başvurusu
- [ ] TestFlight / Beta dağıtımı
- [ ] Canlı yayın

### 🔴 Faz 5 — Ölçekleme (30+ Hafta)
- [ ] Affiliate link yönetimi (aracı kurum yönlendirme)
- [ ] API planı (3. parti geliştiriciler)
- [ ] AI destekli arz analizi
- [ ] Çoklu dil (EN)

---

## 18. TEST STRATEJİSİ

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Hesaplama fonksiyonlarını test et
# lib/hesaplamalar/tavan.test.ts
describe('tavanHesapla', () => {
  it('1 tavan sonrası fiyatı doğru hesaplar', () => {
    expect(tavanSonrasiFiyat(10, 1)).toBeCloseTo(11.00)
  })
  it('3 tavan sonrası fiyatı doğru hesaplar', () => {
    expect(tavanSonrasiFiyat(10, 3)).toBeCloseTo(13.31)
  })
  it('5 tavan sonrası fiyatı doğru hesaplar', () => {
    expect(tavanSonrasiFiyat(10, 5)).toBeCloseTo(16.11)
  })
})
```

---

## 19. BAŞARININ KRİTİK NOKTALARI

1. **Veri kalitesi ve hızı** — Yeni bir arz açıklandığında saatler içinde sitede olmalı. Yanlış tarih/fiyat güveni yıkar.
2. **Araçların doğruluğu** — Özellikle tavan simülatörü BIST kurallarını (ilk seansta %10 tavan) doğru yansıtmalı.
3. **Hız** — Araçlar anlık hesaplamalı, sayfa yüklenmesi < 2 saniye.
4. **SEO önceliği** — "Halka arz tavan hesaplama" Google'da ilk sayfaya girmek en büyük büyüme motorudur.
5. **Topluluk** — Twitter/X'te aktif ol; araç sonuçlarını paylaşılabilir görsel kart olarak sun.
6. **Premium değeri** — "Halka Arzlarım" retention için kritik; kullanıcıyı platforma bağlar.
7. **Mobil uyumluluk** — Yatırımcıların %70'i telefondan erişir; her piksel mobilde test edilmeli.

---

## 20. FAYDALIREFERANSLAR

| Kaynak | URL |
|---|---|
| Next.js Docs | https://nextjs.org/docs |
| Firebase Docs | https://firebase.google.com/docs |
| shadcn/ui | https://ui.shadcn.com |
| Tailwind CSS | https://tailwindcss.com/docs |
| İyzico Geliştirici | https://dev.iyzipay.com |
| Vercel Docs | https://vercel.com/docs |
| Expo (Faz 4) | https://expo.dev/docs |
| KAP (veri kaynağı) | https://kap.org.tr |
| BIST Tavan Kuralları | https://www.borsaistanbul.com |
| Google AdSense | https://adsense.google.com |
| KVKK | https://kvkk.gov.tr |

---

> ⚠️ **Yasal Not:** Bu doküman teknik bir proje planıdır.  
> İçerdiği gelir tahminleri tahmini niteliktedir, garanti vermez.  
> Hesaplama araçları yatırım tavsiyesi değildir.

---

**Site:** ArzTakip.com  
**Son güncelleme:** Mart 2026 | **Versiyon:** 2.0 Final
