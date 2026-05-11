"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { TrendingUp } from "lucide-react";

const googleProvider = new GoogleAuthProvider();

export default function GirisPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"giris" | "kayit">("giris");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Zaten giriş yapmışsa anasayfaya yönlendir
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "giris") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
      }
      router.push("/");
    } catch (err: unknown) {
      const msg = (err as { code?: string })?.code;
      if (msg === "auth/user-not-found" || msg === "auth/wrong-password" || msg === "auth/invalid-credential") {
        setError("E-posta veya şifre hatalı.");
      } else if (msg === "auth/email-already-in-use") {
        setError("Bu e-posta zaten kullanımda.");
      } else if (msg === "auth/weak-password") {
        setError("Şifre en az 6 karakter olmalı.");
      } else {
        setError("Bir hata oluştu, tekrar dene.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/");
    } catch (err: unknown) {
      console.error("Google giriş hatası:", err);
      const code = (err as { code?: string })?.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        // Kullanıcı kapattı, hata gösterme
      } else if (code === "auth/popup-blocked") {
        setError("Tarayıcı popup'ı engelledi. Adres çubuğunda izin ver.");
      } else {
        setError(`Giriş başarısız: ${code ?? "bilinmeyen hata"}`);
      }
      setLoading(false);
    }
  }

  // Auth yükleniyorsa veya kullanıcı var, ekran gösterme
  if (authLoading || user) {
    return <div className="min-h-screen bg-[#0a0f1a]" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl text-white">
            Arz<span className="text-emerald-400">Takip</span>
          </span>
        </Link>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-7">
          {/* Tab */}
          <div className="flex bg-slate-900/60 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab("giris"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "giris" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setTab("kayit"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === "kayit" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Üye Ol
            </button>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-slate-600 text-slate-200 py-2.5 rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium mb-5 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google ile {tab === "giris" ? "Giriş Yap" : "Üye Ol"}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">veya</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "kayit" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Adınız"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              {loading ? "Lütfen bekle..." : tab === "giris" ? "Giriş Yap" : "Üye Ol"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Üye olarak{" "}
          <Link href="/gizlilik" className="text-slate-500 hover:text-slate-400">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
