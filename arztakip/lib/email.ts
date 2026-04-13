import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Domain doğrulandıktan sonra "bildirim@halkaarzlarim.com" yap
const FROM = "HalkaArzlarım <onboarding@resend.dev>";

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
