"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import { Send, Mail, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

const konular = [
  "Genel Soru",
  "Teknik Sorun",
  "Premium Üyelik",
  "Veri Hatası",
  "Reklam / İş Birliği",
  "Diğer",
];

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: "", email: "", konu: konular[0], mesaj: "" });
  const [durum, setDurum] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDurum("loading");
    try {
      const res = await fetch("/api/email/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDurum("success");
        setForm({ ad: "", email: "", konu: konular[0], mesaj: "" });
      } else {
        setDurum("error");
      }
    } catch {
      setDurum("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <TickerBar />
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Başlık */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">İletişim</h1>
            <p className="text-slate-400">Sorularınız, önerileriniz veya sorunlarınız için bize yazın.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Sol — bilgi kartları */}
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Mail size={15} className="text-emerald-400" />
                  </div>
                  <span className="text-white text-sm font-medium">E-posta</span>
                </div>
                <a href="mailto:destek@halkaarzlarim.com" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors break-all">
                  destek@halkaarzlarim.com
                </a>
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <MessageSquare size={15} className="text-blue-400" />
                  </div>
                  <span className="text-white text-sm font-medium">Yanıt Süresi</span>
                </div>
                <p className="text-slate-400 text-sm">Genellikle 1–2 iş günü içinde yanıt veririz.</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
                <p className="text-slate-500 text-xs leading-relaxed">
                  Veri hatası bildirimi için ilgili arzın adını ve hatalı bilgiyi belirtmeniz süreci hızlandırır.
                </p>
              </div>
            </div>

            {/* Sağ — form */}
            <div className="md:col-span-2">
              {durum === "success" ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
                  <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-white font-semibold text-lg mb-2">Mesajınız iletildi!</h2>
                  <p className="text-slate-400 text-sm mb-6">En kısa sürede size geri döneceğiz.</p>
                  <button
                    onClick={() => setDurum("idle")}
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Yeni mesaj gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 space-y-4">

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Ad Soyad</label>
                      <input
                        type="text"
                        name="ad"
                        value={form.ad}
                        onChange={handleChange}
                        required
                        placeholder="Adınız"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">E-posta</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="ornek@mail.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Konu</label>
                    <select
                      name="konu"
                      value={form.konu}
                      onChange={handleChange}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                    >
                      {konular.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Mesaj</label>
                    <textarea
                      name="mesaj"
                      value={form.mesaj}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Mesajınızı buraya yazın..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors resize-none"
                    />
                  </div>

                  {durum === "error" && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle size={15} />
                      Mesaj gönderilemedi. Lütfen tekrar deneyin veya destek@halkaarzlarim.com adresine yazın.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={durum === "loading"}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-white font-medium py-3 rounded-xl transition-colors text-sm"
                  >
                    {durum === "loading" ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    {durum === "loading" ? "Gönderiliyor..." : "Gönder"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
