import { adminDb, adminMessaging } from "@/lib/firebase-admin";

export async function sendPushToAll(title: string, body: string, data?: Record<string, string>) {
  const snap = await adminDb.collection("push_tokens").get();
  const tokens: string[] = snap.docs.map((d) => d.data().token as string).filter(Boolean);

  if (tokens.length === 0) return { sent: 0 };

  let sent = 0;
  // FCM sendEachForMulticast max 500 token per batch
  for (let i = 0; i < tokens.length; i += 500) {
    const chunk = tokens.slice(i, i + 500);
    const response = await adminMessaging.sendEachForMulticast({
      tokens: chunk,
      notification: { title, body },
      data: data ?? {},
      android: {
        notification: {
          sound: "default",
          channelId: "default",
          priority: "high",
        },
        priority: "high",
      },
      apns: {
        payload: {
          aps: { sound: "default", contentAvailable: true },
        },
      },
    });
    sent += response.successCount;
  }

  return { sent };
}
