import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { readYaklasanArzlar } from "@/lib/admin-storage";
import { yaklasanArzlar } from "@/lib/yaklasan-arzlar";

export async function GET() {
  try {
    // Kullanıcı istatistikleri
    const listResult = await adminAuth.listUsers(1000);
    const users = listResult.users;
    const toplamKullanici = users.length;

    const now = new Date();
    const premiumKullanici = users.filter((u) => {
      const claims = u.customClaims;
      return claims?.premium === true;
    }).length;

    // Firestore'dan premium sayısı (customClaims yoksa users koleksiyonundan bak)
    let premiumFirestore = 0;
    try {
      const snap = await adminDb
        .collection("users")
        .where("premium", "==", true)
        .get();
      premiumFirestore = snap.docs.filter((d) => {
        const bitis = d.data().premiumBitis?.toDate?.();
        return !bitis || bitis > now;
      }).length;
    } catch {
      premiumFirestore = premiumKullanici;
    }

    // Son 5 kayıt
    const sonKayitlar = [...users]
      .sort((a, b) => {
        const ta = a.metadata.creationTime ? new Date(a.metadata.creationTime).getTime() : 0;
        const tb = b.metadata.creationTime ? new Date(b.metadata.creationTime).getTime() : 0;
        return tb - ta;
      })
      .slice(0, 5)
      .map((u) => ({
        uid: u.uid,
        email: u.email ?? "(email yok)",
        createdAt: u.metadata.creationTime ?? "",
      }));

    // Haber istatistikleri
    let toplamHaber = 0;
    let yayindaHaber = 0;
    try {
      const haberSnap = await adminDb.collection("haberler").get();
      toplamHaber = haberSnap.size;
      yayindaHaber = haberSnap.docs.filter((d) => d.data().yayinda === true).length;
    } catch {
      // Firestore erişim hatası — sıfır bırak
    }

    // Aktif arz sayısı
    const jsonArzlar = readYaklasanArzlar();
    const tumArzlar = [...jsonArzlar, ...yaklasanArzlar];
    const aktifArzlar = tumArzlar.filter(
      (a) => a.durum === "yaklasan" || a.durum === "aktif"
    ).length;

    // Son 3 arz
    const sonArzlar = tumArzlar.slice(0, 3).map((a) => ({
      slug: a.slug,
      sirketAdi: a.sirketAdi,
      durum: a.durum,
      talepBaslangic: a.talepBaslangic ?? null,
      talepBitis: a.talepBitis ?? null,
      arsFiyatiUst: a.arsFiyatiUst,
    }));

    return NextResponse.json({
      toplamKullanici,
      premiumKullanici: premiumFirestore || premiumKullanici,
      toplamHaber,
      yayindaHaber,
      aktifArzlar,
      sonKayitlar,
      sonArzlar,
    });
  } catch (err) {
    console.error("Stats API hatası:", err);
    return NextResponse.json({ error: "İstatistikler alınamadı" }, { status: 500 });
  }
}
