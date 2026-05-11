export type ArzDurum = "aktif" | "yaklasan" | "tamamlandi" | "ertelendi" | "basvuru-surecinde";

export interface OzetBolum {
  baslik: string;
  icerik: string; // \n ile satır ayırt edilir
}

export interface TahsisatGrubu {
  grup: string;   // "Yurt İçi Bireysel", "Yüksek Başvurulu", vb.
  kisi: number;
  lot: number;
  oran: number;   // % olarak
}

export interface Arz {
  id: string;
  ticker: string;
  sirketAdi: string;
  logo?: string;
  slug: string;
  durum: ArzDurum;
  sektor: string;

  // Talep / borsaya giriş tarihleri
  talepBaslangic: string;
  talepBitis: string;
  borsadaIslemGormeTarihi?: string;

  // Fiyat
  arsFiyatiAlt: number;
  arsFiyatiUst: number;

  // Arz detayları
  lotBuyuklugu: number;
  araciKurum: string;
  toplamArzLot: number;
  bireyselPayYuzde: number;
  piyasaDegeri?: number;

  // Genişletilmiş alanlar (halkarz.com benzeri şablon)
  pazar?: string;                      // Ana Pazar / Yıldız Pazar / Gelişen İşletmeler
  dagitimYontemi?: string;             // Eşit Dağıtım / Orantılı
  fiiliDolasimdakiPay?: number;        // Lot cinsinden
  fiiliDolasimdakiPayOrani?: number;   // % cinsinden
  halkaAciklik?: number;               // % (örn: 25.11)
  halkaArzIskontosu?: number;          // % (örn: 20)
  halkaArzBuyklugu?: string;           // "3.7 Milyar TL" serbest metin
  sirketHakkinda?: string;             // Uzun açıklama metni
  ozetBolumler?: OzetBolum[];          // Esnek bölümler (Halka Arz Şekli, Fonun Kullanımı vb.)
  tahsisatSonuclari?: TahsisatGrubu[]; // Halka arz dağıtım sonuçları
  tavanSayisi?: number;                // Üst üste kaç tavan yaptı (gerçek veri, admin girer)

  // Bağlantılar
  kapLinki: string;
  aciklama: string;
}

export interface Haber {
  id: string;
  baslik: string;
  ozet: string;
  gorsel?: string;
  slug: string;
  yayinTarihi: string;
  kategori: string;
  ilgiliArzId?: string;
}
