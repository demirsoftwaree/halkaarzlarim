import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

async function checkAdmin() {
  const jar = await cookies();
  const session = jar.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const listResult = await adminAuth.listUsers(500);

    const users = await Promise.all(
      listResult.users.map(async (u) => {
        const doc = await adminDb.doc(`users/${u.uid}`).get();
        const data = doc.data() || {};
        return {
          uid: u.uid,
          email: u.email || "",
          displayName: u.displayName || "",
          photoURL: u.photoURL || "",
          createdAt: u.metadata.creationTime,
          lastSignIn: u.metadata.lastSignInTime,
          premium: data.premium ?? false,
          premiumBitis: data.premiumBitis ?? null,
        };
      })
    );

    // En yeni kayıt üstte
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
