"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

interface AuthContextValue {
  user: User | null;
  isPremium: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isPremium: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      // Önceki Firestore dinleyicisini temizle
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }

      setUser(u);

      if (u) {
        // Session cookie yaz
        const token = await u.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        // Firestore'dan premium durumunu gerçek zamanlı dinle
        unsubFirestore = onSnapshot(
          doc(db, "users", u.uid),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              const premium: boolean = data?.premium === true;
              const bitisRaw = data?.premiumBitis;
              const bitis: Date | null = bitisRaw?.toDate?.() ?? null;
              const aktif = premium && (!bitis || bitis > new Date());
              setIsPremium(aktif);
            } else {
              setIsPremium(false);
            }
            setLoading(false);
          },
          () => {
            setIsPremium(false);
            setLoading(false);
          }
        );
      } else {
        setIsPremium(false);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
    setIsPremium(false);
  };

  return (
    <AuthContext.Provider value={{ user, isPremium, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
