/**
 * KAP üye şirketleri listesi
 * Kaynak: MKK API Portal — /members
 * In-memory cache: başarılı yanıt saklanır, API hatasında cache'den döner
 */

import { NextResponse } from "next/server";
import { getKapMembers, type KapMember } from "@/lib/kap-service";

export const revalidate = 86400; // 24 saat ISR cache

// Sunucu restart'a kadar yaşayan bellek cache'i
let memCache: { members: KapMember[]; at: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat

async function fetchWithTimeout(): Promise<KapMember[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000); // 12sn timeout

  try {
    const members = await getKapMembers();
    return members;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  // Cache geçerliyse hemen dön
  if (memCache && Date.now() - memCache.at < CACHE_TTL) {
    return NextResponse.json({ members: memCache.members, count: memCache.members.length, fromCache: true });
  }

  try {
    const members = await fetchWithTimeout();

    if (members.length > 0) {
      memCache = { members, at: Date.now() };
    }

    return NextResponse.json({ members, count: members.length });
  } catch (err) {
    console.error("KAP members hatası:", err);

    // Eski cache varsa yine de döndür
    if (memCache && memCache.members.length > 0) {
      return NextResponse.json({
        members: memCache.members,
        count: memCache.members.length,
        fromCache: true,
      });
    }

    return NextResponse.json({ members: [], count: 0, error: String(err) }, { status: 500 });
  }
}
