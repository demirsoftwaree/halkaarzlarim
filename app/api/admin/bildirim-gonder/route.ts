import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendPushToAll } from "@/lib/push-notifications";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { title, body, data } = await req.json();
  if (!title || !body) return NextResponse.json({ error: "Başlık ve mesaj zorunlu" }, { status: 400 });

  const result = await sendPushToAll(title, body, data);
  return NextResponse.json(result);
}
