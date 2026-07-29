import type { Arz } from "./types";

export interface PushPayload {
  title: string;
  body: string;
  data: Record<string, string>;
}

function fiyatStr(arz: Arz): string {
  if (!(arz.arsFiyatiAlt > 0 || arz.arsFiyatiUst > 0)) return "";
  return arz.arsFiyatiAlt === arz.arsFiyatiUst
    ? `${arz.arsFiyatiUst.toFixed(2)} ₺`
    : `${arz.arsFiyatiAlt.toFixed(2)}–${arz.arsFiyatiUst.toFixed(2)} ₺`;
}

/**
 * Tüm push bildirimleri bu şablonlardan üretilir — tek format, tek yerden yönetim.
 * `data.type` mobil uygulamanın bildirime dokununca nereye yönlendireceğine karar verdiği alan:
 *  - "arz"    → data.slug ile /arz/[slug] sayfasına gider
 *  - "duyuru" → Haberler sekmesine gider
 */
export const notificationTemplates = {
  yeniArz(arz: Arz): PushPayload {
    const fiyat = fiyatStr(arz);
    return {
      title: "🔔 Yeni Halka Arz",
      body: fiyat
        ? `${arz.sirketAdi} (${arz.ticker}) — ${fiyat}`
        : `${arz.sirketAdi} (${arz.ticker}) sisteme eklendi.`,
      data: { type: "arz", slug: arz.slug },
    };
  },

  arzSonuclariAciklandi(arz: Arz): PushPayload {
    return {
      title: "📊 Halka Arz Sonuçları Açıklandı",
      body: `${arz.sirketAdi} (${arz.ticker}) halka arz sonuçları belli oldu.`,
      data: { type: "arz", slug: arz.slug },
    };
  },

  islemGormeTarihiBelirlendi(arz: Arz): PushPayload {
    const tarih = arz.borsadaIslemGormeTarihi
      ? new Date(arz.borsadaIslemGormeTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })
      : "";
    return {
      title: "📈 BIST İşlem Tarihi Belirlendi",
      body: tarih
        ? `${arz.sirketAdi} (${arz.ticker}) ${tarih} tarihinde BIST'te işlem görmeye başlayacak.`
        : `${arz.sirketAdi} (${arz.ticker}) BIST işlem tarihi belirlendi.`,
      data: { type: "arz", slug: arz.slug },
    };
  },

  basvuruBasladi(arz: Arz): PushPayload {
    const fiyat = fiyatStr(arz);
    return {
      title: "📣 Halka Arz Başladı!",
      body: fiyat
        ? `${arz.sirketAdi} (${arz.ticker}) başvurusu açıldı — ${fiyat}`
        : `${arz.sirketAdi} (${arz.ticker}) başvurusu açıldı.`,
      data: { type: "arz", slug: arz.slug },
    };
  },

  duyuru(title: string, body: string): PushPayload {
    return { title, body, data: { type: "duyuru" } };
  },
};
