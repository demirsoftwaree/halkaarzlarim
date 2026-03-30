/**
 * SPK duyuru PDF proxy — base64'ü çözüp PDF olarak sunar
 */

import { NextResponse } from "next/server";
import { Agent, fetch as undiciFetch } from "undici";

const spkAgent = new Agent({ connect: { rejectUnauthorized: true } });

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const res = await undiciFetch(
      `https://ws.spk.gov.tr/CompanyData/api/OzelDurumAciklamalari/${id}`,
      { dispatcher: spkAgent, headers: { Accept: "application/json" } }
    );

    if (!res.ok) throw new Error(`SPK ${res.status}`);

    const data = await res.json() as { fileData?: string; mimeType?: string; subject?: string };

    if (!data.fileData) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
    }

    const buffer = Buffer.from(data.fileData, "base64");
    const mime = data.mimeType ?? "application/pdf";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `inline; filename="spk-duyuru-${id}.pdf"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("SPK duyuru hatası:", err);
    return NextResponse.json({ error: "Belge yüklenemedi" }, { status: 500 });
  }
}
