import Purchases, { type CustomerInfo, type PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const PRODUCT_IDS = {
  monthly: "monthly",
  yearly:  "yearly",
} as const;

export const ENTITLEMENT_PREMIUM = "premium";

// TODO: RevenueCat hesabından aldığın Android API anahtarını buraya yapıştır
const RC_ANDROID_KEY = "test_KhCAyljVWzKgzKjnTfkbVJCwvCL";
// iOS için şimdilik Android key kullanılıyor (iOS build yoksa sorun değil)
const RC_IOS_KEY     = RC_ANDROID_KEY;

export function initPurchases(userId?: string) {
  const apiKey = Platform.OS === "ios" ? RC_IOS_KEY : RC_ANDROID_KEY;
  Purchases.configure({ apiKey });
  if (userId) Purchases.logIn(userId).catch(() => {});
}

export async function getOfferings() {
  try {
    const res = await Purchases.getOfferings();
    return res.current;
  } catch { return null; }
}

export async function purchasePackage(
  pkg: PurchasesPackage,
  userId: string
): Promise<"ok" | "cancelled" | "error"> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    if (isPremiumActive(customerInfo)) {
      await setDoc(doc(db, "users", userId), {
        premium: true,
        premiumBitis: null,
        premiumKaynak: "google_play",
        premiumGuncelleme: serverTimestamp(),
      }, { merge: true });
      return "ok";
    }
    return "error";
  } catch (e: any) {
    if (e?.userCancelled) return "cancelled";
    return "error";
  }
}

export async function restorePurchases(userId: string): Promise<boolean> {
  try {
    const info = await Purchases.restorePurchases();
    if (isPremiumActive(info)) {
      await setDoc(doc(db, "users", userId), {
        premium: true,
        premiumKaynak: "google_play_restored",
        premiumGuncelleme: serverTimestamp(),
      }, { merge: true });
      return true;
    }
    return false;
  } catch { return false; }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try { return await Purchases.getCustomerInfo(); }
  catch { return null; }
}

export function isPremiumActive(info: CustomerInfo): boolean {
  return info.entitlements.active[ENTITLEMENT_PREMIUM] !== undefined;
}
