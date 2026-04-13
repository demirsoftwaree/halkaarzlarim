import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendEmail } from "@/lib/email";
import { arzBasladiEmail } from "@/lib/email-templates";

// Admin-only: Arz başvuruya açıldığında takip eden tüm kullanıcılara mail gönder
export async function POST(req: NextRequest) {
  try {
    // Admin kontrolü
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userDoc.data()?.admin) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const { slug, sirketAdi, ticker, fiyat, talepBitis } = await req.json();
    if (!slug || !sirketAdi || !ticker) {
      return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
    }

    // Bu arzı takip eden kullanıcıları bul
    const snap = await adminDb
      .collection("watchlists")
      .where("slug", "==", slug)
      .get();

    if (snap.empty) {
      return NextResponse.json({ success: true, sent: 0, message: "Takipçi yok" });
    }

    const uids = snap.docs.map((d) => d.data().uid).filter(Boolean) as string[];
    const uniqueUids = [...new Set(uids)];

    // Her kullanıcının emailini al ve mail gönder
    let sent = 0;
    let failed = 0;

    for (const uid of uniqueUids) {
      try {
        const user = await adminAuth.getUser(uid);
        if (!user.email) continue;

        const result = await sendEmail({
          to: user.email,
          subject: `🔔 ${ticker} Halka Arz Başvurusu Başladı!`,
          html: arzBasladiEmail(sirketAdi, ticker, fiyat ?? "–", talepBitis ?? "–", slug),
        });

        if (result.success) {
          sent++;
          console.log(`[email/arz-basladi] Gönderildi: ${user.email}`);
        } else {
          failed++;
          console.error(`[email/arz-basladi] Hata: ${user.email}`, result.error);
        }
      } catch (err) {
        failed++;
        console.error(`[email/arz-basladi] UID hatası: ${uid}`, err);
      }
    }

    return NextResponse.json({ success: true, sent, failed, total: uniqueUids.length });
  } catch (err) {
    console.error("[email/arz-basladi] Sunucu hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
