"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/arzlar");
    } else {
      setError("Şifre hatalı.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white mb-1">
            Arz<span className="text-emerald-400">Takip</span>
          </div>
          <p className="text-gray-400 text-sm">Admin Paneli</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111827] border border-white/10 rounded-2xl p-8 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0f1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Admin şifresi"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
