"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function BildirimPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [result, setResult] = useState("");

  async function handleSend() {
    if (!title.trim() || !body.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/bildirim-gonder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`${data.sent} cihaza gönderildi.`);
        setStatus("ok");
        setTitle("");
        setBody("");
      } else {
        setResult(data.error ?? "Hata oluştu.");
        setStatus("error");
      }
    } catch {
      setResult("Bağlantı hatası.");
      setStatus("error");
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Bildirim Gönder</h1>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Başlık</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ör. Yeni Halka Arz!"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Mesaj</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="ör. XYZ A.Ş. halka arzı başladı, hemen incele!"
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={status === "loading" || !title.trim() || !body.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            {status === "loading" ? "Gönderiliyor..." : "Tüm Kullanıcılara Gönder"}
          </button>

          {status === "ok" && (
            <p className="text-emerald-400 text-sm text-center">{result}</p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-sm text-center">{result}</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
