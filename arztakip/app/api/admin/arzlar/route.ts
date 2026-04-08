import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { readYaklasanArzlar, addArzEntry } from "@/lib/admin-storage";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const arzlar = await readYaklasanArzlar();
  return NextResponse.json(arzlar);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const body = await req.json();
  const created = await addArzEntry(body);
  revalidatePath("/api/arzlar");
  revalidatePath("/");
  return NextResponse.json(created, { status: 201 });
}
