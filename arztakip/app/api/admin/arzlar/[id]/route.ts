import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateArzEntry, deleteArzEntry, readYaklasanArzlar } from "@/lib/admin-storage";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendEmail } from "@/lib/email";
import { arzBasladiEmail } from "@/lib/email-templates";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

async function bildirimGonder(slug: string, sirketAdi: string, ticker: string, fiyat: string, talepBitis: string) {
  try {
    const snap = await adminDb.collection("watchlists").where("slug", "==", slug).get();
    if (snap.empty) return;

    const uids = [...new Set(snap.docs.map(d => d.data().uid).filter(Boolean) as string[])];

    for (const uid of uids) {
      try {
        const user = await adminAuth.getUser(uid);
        if (!user.email) continue;
        await sendEmail({
          to: user.email,
          subject: `🔔 ${ticker} Halka Arz Başvurusu Başladı!`,
          html: arzBasladiEmail(sirketAdi, ticker, fiyat, talepBitis, slug),
        });
        console.log(`[bildirim] Gönderildi: ${user.email} → ${ticker}`);
      } catch (e) {
        console.error(`[bildirim] Hata uid=${uid}:`, e);
      }
    }
  } catch (e) {
    console.error("[bildirim] Genel hata:", e);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  // Eski durumu al
  const eskiArzlar = await readYaklasanArzlar();
  const eskiArz = eskiArzlar.find(a => a.slug === id);
  const eskiDurum = eskiArz?.durum;

  const updated = await updateArzEntry(id, body);
  if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  revalidatePath("/api/arzlar");
  revalidatePath("/halka-arz/[slug]", "page");
  revalidatePath("/");

  // Durum "aktif" veya "basvuru-surecinde" olduysa bildirim gönder
  const yeniDurum = body.durum ?? updated.durum;
  if (
    (yeniDurum === "aktif" || yeniDurum === "basvuru-surecinde") &&
    eskiDurum !== yeniDurum
  ) {
    const fiyat = updated.arsFiyatiAlt > 0
      ? updated.arsFiyatiAlt === updated.arsFiyatiUst
        ? `${updated.arsFiyatiUst.toFixed(2)} ₺`
        : `${updated.arsFiyatiAlt.toFixed(2)}–${updated.arsFiyatiUst.toFixed(2)} ₺`
      : "Fiyat bekleniyor";

    bildirimGonder(
      updated.slug,
      updated.sirketAdi,
      updated.ticker,
      fiyat,
      updated.talepBitis ?? "–"
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await params;
  const ok = await deleteArzEntry(id);
  if (!ok) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidatePath("/api/arzlar");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
