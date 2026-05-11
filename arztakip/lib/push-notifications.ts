import { adminDb } from "@/lib/firebase-admin";

export async function sendPushToAll(title: string, body: string, data?: Record<string, string>) {
  const snap = await adminDb.collection("push_tokens").get();
  const tokens: string[] = snap.docs.map((d) => d.data().token).filter(Boolean);

  if (tokens.length === 0) return { sent: 0 };

  const chunks: string[][] = [];
  for (let i = 0; i < tokens.length; i += 100) {
    chunks.push(tokens.slice(i, i + 100));
  }

  let sent = 0;
  for (const chunk of chunks) {
    const messages = chunk.map((to) => ({ to, title, body, data: data ?? {}, sound: "default" }));
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(messages),
    });
    if (res.ok) sent += chunk.length;
  }

  return { sent };
}
