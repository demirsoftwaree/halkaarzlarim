/**
 * Google Play IAP stub — Expo Go'da çalışmak için mock implementasyon.
 *
 * YAYINA GEÇİŞ ADIMLARI:
 * 1. `npm install react-native-purchases --legacy-peer-deps`
 * 2. Google Play Console'da premium_monthly / premium_yearly ürünlerini oluştur
 * 3. RevenueCat hesabı aç, Android API anahtarını al
 * 4. RC_ANDROID_KEY ve RC_IOS_KEY'i doldur
 * 5. Bu dosyanın altındaki gerçek implementasyonu stub'ın yerine geçir
 * 6. `eas build --platform android` ile APK üret
 */

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const PRODUCT_IDS = {
  monthly: "premium_monthly",
  yearly:  "premium_yearly",
} as const;

export const ENTITLEMENT_PREMIUM = "premium";

// Expo Go'da no-op — EAS Build'de gerçek RevenueCat başlatılır
export function initPurchases(_userId?: string) {}

// Ürünler yayın öncesi dönemde boş döner
export async function getOfferings() {
  return null;
}

export async function purchasePackage(
  _pkg: any,
  _userId: string
): Promise<"ok" | "cancelled" | "error"> {
  return "error";
}

export async function restorePurchases(_userId: string): Promise<boolean> {
  return false;
}

export async function getCustomerInfo() {
  return null;
}

export function isPremiumActive(_info: any): boolean {
  return false;
}

/* ─────────────────────────────────────────────────────────────
   GERÇEK İMPLEMENTASYON — yayın öncesi aşağıyı aktif et
   (yukarıdaki stub fonksiyonları silinecek)
─────────────────────────────────────────────────────────────
import Purchases, { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import { Platform } from "react-native";

const RC_ANDROID_KEY = "YOUR_REVENUECAT_ANDROID_API_KEY";
const RC_IOS_KEY     = "YOUR_REVENUECAT_IOS_API_KEY";

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
        premium: true, premiumKaynak: "google_play_restored",
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
─────────────────────────────────────────────────────────────── */
