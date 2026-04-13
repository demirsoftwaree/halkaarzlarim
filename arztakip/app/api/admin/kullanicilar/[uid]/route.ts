import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/email";
import { premiumHosgeldinEmail } from "@/lib/email-templates";

async function checkAdmin() {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

// Premium ver veya al
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { uid } = await params;
  const body = await req.json();
  const { premium, premiumBitis } = body as { premium: boolean; premiumBitis?: string | null };

  const bitisTimestamp = premiumBitis
    ? Timestamp.fromDate(new Date(premiumBitis))
    : null;

  await adminDb.doc(`users/${uid}`).set(
    { premium, premiumBitis: bitisTimestamp },
    { merge: true }
  );

  // Premium verildiğinde kullanıcıya mail gönder
  if (premium) {
    try {
      const user = await adminAuth.getUser(uid);
      if (user.email) {
        const isim = user.displayName || user.email.split("@")[0];
        await sendEmail({
          to: user.email,
          subject: "⭐ Premium Üyeliğin Aktif!",
          html: premiumHosgeldinEmail(isim),
        });
        console.log(`[premium] Mail gönderildi: ${user.email}`);
      }
    } catch (e) {
      console.error("[premium] Mail hatası:", e);
    }
  }

  return NextResponse.json({ ok: true });
}

// Kullanıcı sil
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { uid } = await params;
  const { adminAuth } = await import("@/lib/firebase-admin");
  await adminAuth.deleteUser(uid);
  await adminDb.doc(`users/${uid}`).delete();

  return NextResponse.json({ ok: true });
}
