"use client";
import { useState } from "react";
import Link from "next/link";
import { deleteUser, reauthenticateWithPopup, GoogleAuthProvider, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";

async function deleteUserData(uid: string) {
  const subcols = ["watchlist", "portfolio"];
  for (const sub of subcols) {
    const snap = await getDocs(collection(db, "users", uid, sub));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }
  await deleteDoc(doc(db, "users", uid));
}

export default function HesapSilPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<"idle" | "confirm" | "password" | "loading" | "done" | "error">("idle");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDelete() {
    if (!user) return;
    setStep("loading");
    try {
      await deleteUserData(user.uid);
      await deleteUser(user);
      setStep("done");
    } catch (e: any) {
      if (e.code === "auth/requires-recent-login") {
        setStep("password");
      } else {
        setErrorMsg(e.message || "Bir hata oluştu.");
        setStep("error");
      }
    }
  }

  async function handleReauth() {
    if (!user) return;
    setStep("loading");
    try {
      if (user.providerData[0]?.providerId === "google.com") {
        await reauthenticateWithPopup(user, new GoogleAuthProvider());
      } else {
        const cred = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, cred);
      }
      await deleteUserData(user.uid);
      await deleteUser(user);
      setStep("done");
    } catch (e: any) {
      setErrorMsg(e.message || "Kimlik doğrulama başarısız.");
      setStep("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1a]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {step === "done" ? (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 text-emerald-400" size={48} />
              <h1 className="text-xl font-bold text-white mb-2">Hesabınız silindi</h1>
              <p className="text-slate-400 text-sm mb-6">Tüm verileriniz kalıcı olarak kaldırıldı.</p>
              <Link href="/" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
                Ana sayfaya dön
              </Link>
            </div>
          ) : step === "password" ? (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
              <h1 className="text-xl font-bold text-white mb-2">Kimliğinizi doğrulayın</h1>
              <p className="text-slate-400 text-sm mb-6">Hesabınızı silmek için şifrenizi girin.</p>
              {user?.providerData[0]?.providerId === "google.com" ? (
                <button onClick={handleReauth} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition-colors">
                  Google ile doğrula
                </button>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="Şifreniz"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none mb-4"
                  />
                  <button onClick={handleReauth} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">
                    Hesabı kalıcı olarak sil
                  </button>
                </>
              )}
            </div>
          ) : step === "error" ? (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center">
              <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
              <h1 className="text-xl font-bold text-white mb-2">Hata oluştu</h1>
              <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
              <button onClick={() => setStep("idle")} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
                Tekrar dene
              </button>
            </div>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-red-500/10 rounded-xl">
                  <Trash2 className="text-red-400" size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Hesabı Sil</h1>
                  <p className="text-slate-400 text-sm">Verileriniz kalıcı olarak kaldırılır</p>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm font-medium mb-1">Bu işlem geri alınamaz</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Hesabınız, portföyünüz, takip listeniz ve tüm kişisel verileriniz kalıcı olarak silinir.
                </p>
              </div>
              {!user ? (
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-4">Hesabınızı silmek için önce giriş yapmalısınız.</p>
                  <Link href="/giris" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
                    Giriş yap
                  </Link>
                </div>
              ) : step === "confirm" ? (
                <div className="space-y-3">
                  <p className="text-slate-300 text-sm text-center mb-2">Emin misiniz? Bu işlem geri alınamaz.</p>
                  <button onClick={handleDelete} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors">
                    Evet, hesabımı kalıcı olarak sil
                  </button>
                  <button onClick={() => setStep("idle")} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-xl transition-colors">
                    Vazgeç
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setStep("confirm")}
                  disabled={step === "loading"}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {step === "loading" ? "İşleniyor..." : "Hesabımı sil"}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
