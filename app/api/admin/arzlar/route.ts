import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readYaklasanArzlar, addArzEntry } from "@/lib/admin-storage";
import { sendPushToAll } from "@/lib/push-notifications";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  return NextResponse.json(readYaklasanArzlar());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const body = await req.json();
  const created = addArzEntry(body);

  sendPushToAll(
    "🔔 Yeni Halka Arz",
    `${created.sirketAdi} (${created.ticker}) halka arzı eklendi!`,
    { slug: created.slug, type: "yeni_arz" }
  ).catch(() => {});

  return NextResponse.json(created, { status: 201 });
}
