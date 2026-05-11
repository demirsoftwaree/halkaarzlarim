import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { sendEmail } from "@/lib/email";
import { premiumHosgeldinEmail } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decoded.uid);

    if (!user.email) {
      return NextResponse.json({ error: "Email bulunamadı" }, { status: 400 });
    }

    const isim = user.displayName?.split(" ")[0] ?? "";
    const result = await sendEmail({
      to: user.email,
      subject: "⭐ Premium Üyeliğin Aktif!",
      html: premiumHosgeldinEmail(isim),
    });

    if (!result.success) {
      console.error("[email/premium-hosgeldin] Gönderilemedi:", result.error);
      return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
    }

    console.log(`[email/premium-hosgeldin] Gönderildi: ${user.email}`);
    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    console.error("[email/premium-hosgeldin] Sunucu hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
