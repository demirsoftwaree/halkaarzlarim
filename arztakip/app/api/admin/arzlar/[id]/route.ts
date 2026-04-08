import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { updateArzEntry, deleteArzEntry } from "@/lib/admin-storage";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get("admin_session")?.value;
  return !!session && session === process.env.ADMIN_PASSWORD;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await updateArzEntry(id, body);
  if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidatePath("/api/arzlar");
  revalidatePath("/halka-arz/[slug]", "page");
  revalidatePath("/");
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
