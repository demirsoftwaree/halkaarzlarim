import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "HalkaArzlarım <bildirim@halkaarzlarim.com>";

export type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend hatası:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[email] Gönderilemedi:", err);
    return { success: false, error: err };
  }
}

// Toplu gönderim — tek API isteğiyle max 100 mail (Resend batch limiti)
export async function sendBatchEmail(
  emails: string[],
  subject: string,
  html: string,
) {
  if (emails.length === 0) return { success: true, count: 0 };
  try {
    // Resend batch: max 100 per call
    const chunks: string[][] = [];
    for (let i = 0; i < emails.length; i += 100) {
      chunks.push(emails.slice(i, i + 100));
    }

    let toplam = 0;
    for (const chunk of chunks) {
      const batch = chunk.map(to => ({ from: FROM, to, subject, html }));
      const { data, error } = await resend.batch.send(batch);
      if (error) {
        console.error("[batch] Resend hatası:", error);
      } else {
        toplam += data?.data?.length ?? chunk.length;
      }
    }

    return { success: true, count: toplam };
  } catch (err) {
    console.error("[batch] Gönderilemedi:", err);
    return { success: false, error: err };
  }
}
