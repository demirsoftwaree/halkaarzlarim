const BASE = "https://www.halkaarzlarim.com";

const wrapper = (icerik: string) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Logo / Header -->
        <tr>
          <td style="padding:0 0 24px 0;text-align:center;">
            <div style="display:inline-block;background:#10b981;border-radius:14px;padding:10px 14px;">
              <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">📈 HalkaArzlarım</span>
            </div>
          </td>
        </tr>
        <!-- İçerik -->
        <tr>
          <td style="background:#1e293b;border-radius:20px;padding:32px;border:1px solid #334155;">
            ${icerik}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 0 0 0;text-align:center;">
            <p style="color:#475569;font-size:12px;margin:0;">
              Bu maili aldığınız için <a href="${BASE}" style="color:#10b981;text-decoration:none;">halkaarzlarim.com</a>'a kayıtlısınız.<br/>
              <a href="${BASE}/hesabim" style="color:#475569;">Bildirim tercihlerini yönet</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Hoş Geldin ─────────────────────────────────────────────────────────────
export function hosgeldinEmail(isim: string) {
  return wrapper(`
    <h1 style="color:white;font-size:22px;font-weight:700;margin:0 0 8px 0;">
      Hoş geldin, ${isim || "Yatırımcı"}! 🎉
    </h1>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
      HalkaArzlarım'a katıldığın için teşekkürler. Artık Türkiye'nin tüm halka arzlarını
      tek yerden takip edebilir, tavan simülatörü ve lot hesaplama araçlarından yararlanabilirsin.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
      ${[
        ["📅", "Aktif Arzlar", "Şu an devam eden halka arzları gör", "/halka-arzlar"],
        ["📊", "Tavan Simülatörü", "Kaç tavan giderse kaç ₺ kazanırsın?", "/araclar/tavan-simulatoru"],
        ["⭐", "Takip Listem", "Beğendiğin arzları kaydet", "/hesabim/takip-listem"],
      ].map(([icon, baslik, aciklama, href]) => `
        <tr>
          <td style="padding:8px 0;">
            <a href="${BASE}${href}" style="display:block;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:14px 16px;text-decoration:none;">
              <span style="font-size:18px;">${icon}</span>
              <span style="color:white;font-weight:600;font-size:14px;margin-left:8px;">${baslik}</span>
              <span style="color:#64748b;font-size:13px;display:block;margin-top:2px;margin-left:30px;">${aciklama}</span>
            </a>
          </td>
        </tr>`).join("")}
    </table>
    <a href="${BASE}" style="display:inline-block;background:#10b981;color:white;font-weight:600;font-size:14px;padding:12px 28px;border-radius:12px;text-decoration:none;">
      Hemen Başla →
    </a>
  `);
}

// ── Arz Başladı Bildirimi ───────────────────────────────────────────────────
export function arzBasladiEmail(sirketAdi: string, ticker: string, fiyat: string, talepBitis: string, slug: string) {
  return wrapper(`
    <div style="background:#10b981;border-radius:8px;padding:6px 12px;display:inline-block;margin:0 0 20px 0;">
      <span style="color:white;font-size:12px;font-weight:600;">🔔 TAKİP BİLDİRİMİ</span>
    </div>
    <h1 style="color:white;font-size:20px;font-weight:700;margin:0 0 8px 0;">
      ${sirketAdi} (${ticker}) Başvurusu Başladı!
    </h1>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
      Takip listenize eklediğiniz <strong style="color:white;">${ticker}</strong> halka arzı
      başvuruya açıldı. Son başvuru tarihi: <strong style="color:#f59e0b;">${talepBitis}</strong>
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border:1px solid #334155;border-radius:12px;margin:0 0 24px 0;">
      <tr>
        <td style="padding:16px 20px;border-right:1px solid #334155;">
          <div style="color:#64748b;font-size:11px;margin-bottom:4px;">ARZ FİYATI</div>
          <div style="color:#10b981;font-weight:700;font-size:18px;">${fiyat}</div>
        </td>
        <td style="padding:16px 20px;border-right:1px solid #334155;">
          <div style="color:#64748b;font-size:11px;margin-bottom:4px;">SON BAŞVURU</div>
          <div style="color:white;font-weight:700;font-size:18px;">${talepBitis}</div>
        </td>
        <td style="padding:16px 20px;">
          <div style="color:#64748b;font-size:11px;margin-bottom:4px;">SİMÜLATÖR</div>
          <a href="${BASE}/araclar/tavan-simulatoru" style="color:#10b981;font-weight:600;font-size:13px;text-decoration:none;">Hesapla →</a>
        </td>
      </tr>
    </table>
    <a href="${BASE}/halka-arz/${slug}" style="display:inline-block;background:#10b981;color:white;font-weight:600;font-size:14px;padding:12px 28px;border-radius:12px;text-decoration:none;">
      Arza Git →
    </a>
  `);
}

// ── Premium Hoş Geldin ──────────────────────────────────────────────────────
export function premiumHosgeldinEmail(isim: string) {
  return wrapper(`
    <div style="background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:8px;padding:6px 12px;display:inline-block;margin:0 0 20px 0;">
      <span style="color:white;font-size:12px;font-weight:600;">⭐ PREMIUM ÜYE</span>
    </div>
    <h1 style="color:white;font-size:22px;font-weight:700;margin:0 0 8px 0;">
      Premium'a geçtiğin için teşekkürler, ${isim || "Yatırımcı"}!
    </h1>
    <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
      Artık tüm premium özelliklere erişimin var. Geçmiş tavan performansları,
      tavan getiri raporları ve sınırsız takip listesi seni bekliyor.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
      ${[
        ["🥇", "Geçmiş Tavan Performansı", "Hangi arz kaç tavan yaptı?", "/araclar/tavan-performansi"],
        ["📄", "Tavan Getiri Raporu", "PDF rapor indir", "/araclar/tavan-raporu"],
        ["⭐", "Sınırsız Takip", "İstediğin kadar arz takip et", "/hesabim/takip-listem"],
      ].map(([icon, baslik, aciklama, href]) => `
        <tr>
          <td style="padding:8px 0;">
            <a href="${BASE}${href}" style="display:block;background:#0f172a;border:1px solid #d97706;border-radius:12px;padding:14px 16px;text-decoration:none;">
              <span style="font-size:18px;">${icon}</span>
              <span style="color:#f59e0b;font-weight:600;font-size:14px;margin-left:8px;">${baslik}</span>
              <span style="color:#64748b;font-size:13px;display:block;margin-top:2px;margin-left:30px;">${aciklama}</span>
            </a>
          </td>
        </tr>`).join("")}
    </table>
    <a href="${BASE}/hesabim/portfoy" style="display:inline-block;background:#f59e0b;color:#1e293b;font-weight:700;font-size:14px;padding:12px 28px;border-radius:12px;text-decoration:none;">
      Premium'u Kullan →
    </a>
  `);
}
