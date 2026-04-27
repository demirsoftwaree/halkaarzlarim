import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { initPurchases } from "./purchases";

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
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }
      setUser(u);
      initPurchases(u?.uid);

      if (u) {
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
