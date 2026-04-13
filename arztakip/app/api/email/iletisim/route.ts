import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { ad, email, konu, mesaj } = await req.json();

    if (!ad || !email || !mesaj) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
    }

    const result = await sendEmail({
      to: "destek@halkaarzlarim.com",
      subject: `[İletişim] ${konu ?? "Genel Soru"} — ${ad}`,
      html: `
        <!DOCTYPE html>
        <html lang="tr">
        <body style="margin:0;padding:24px;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:600px;background:#1e293b;border:1px solid #334155;border-radius:16px;padding:28px;">
            <h2 style="color:white;font-size:18px;margin:0 0 20px 0;">📬 Yeni İletişim Mesajı</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ["Ad Soyad", ad],
                ["E-posta", `<a href="mailto:${email}" style="color:#10b981;">${email}</a>`],
                ["Konu", konu ?? "–"],
              ].map(([label, value]) => `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #334155;width:120px;">
                    <span style="color:#64748b;font-size:13px;">${label}</span>
                  </td>
                  <td style="padding:8px 0 8px 16px;border-bottom:1px solid #334155;">
                    <span style="color:white;font-size:14px;">${value}</span>
                  </td>
                </tr>`).join("")}
            </table>
            <div style="margin-top:20px;">
              <div style="color:#64748b;font-size:13px;margin-bottom:8px;">Mesaj</div>
              <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px;color:#cbd5e1;font-size:14px;line-height:1.7;white-space:pre-wrap;">${mesaj}</div>
            </div>
            <div style="margin-top:20px;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(konu ?? 'İletişim')}"
                style="display:inline-block;background:#10b981;color:white;font-weight:600;font-size:13px;padding:10px 20px;border-radius:10px;text-decoration:none;">
                Yanıtla →
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (!result.success) {
      console.error("[email/iletisim] Gönderilemedi:", result.error);
      return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
    }

    console.log(`[email/iletisim] Yeni mesaj: ${email} — ${konu}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[email/iletisim] Sunucu hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
