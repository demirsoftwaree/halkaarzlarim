import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { hosgeldinEmail } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const { email, isim } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email gerekli" }, { status: 400 });
    }

    const result = await sendEmail({
      to: email,
      subject: "HalkaArzlarım'a Hoş Geldin! 🎉",
      html: hosgeldinEmail(isim ?? ""),
    });

    if (!result.success) {
      return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
