/**
 * KAP Veri Yayın Servisleri — MKK API Portal entegrasyonu
 * Portal: https://apiportal.mkk.com.tr
 * Dev base: https://apigwdev.mkk.com.tr/api/vyk/
 * Auth: Basic (apiKey:apiSecret)
 *
 * NOT: Şu an geliştirme (sandbox) ortamı kullanılıyor.
 * Production erişimi için plan yükseltmesi gerekebilir.
 */

import { Agent, fetch as undiciFetch } from "undici";

const KAP_BASE = process.env.KAP_BASE_URL ?? "https://apigwdev.mkk.com.tr/api/vyk";
const kapAgent = new Agent({ connect: { rejectUnauthorized: false } });

function getBasicAuth(): string {
  const apiKey = process.env.MKK_API_KEY;
  const apiSecret = process.env.KAP_API_SECRET;
  if (!apiKey || !apiSecret) throw new Error("MKK API credentials eksik (.env.local)");
  return "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
}

async function kapFetch<T>(path: string): Promise<T> {
  const res = await undiciFetch(`${KAP_BASE}${path}`, {
    dispatcher: kapAgent,
    headers: {
      Authorization: getBasicAuth(),
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000), // 10sn timeout
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`KAP API ${path} → ${res.status}: ${txt.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface KapDisclosureSummary {
  disclosureIndex: string;
  disclosureType: string;
  disclosureClass: string;
  title: string;
  companyId?: string;
  fundId?: string;
  fundCode?: string;
  subReportIds?: string[];
  acceptedDataFileTypes?: string[];
}

export interface KapDisclosureDetail {
  disclosureIndex: string;
  senderTitle: string;
  disclosureType: string;
  disclosureClass: string;
  subject: { tr: string; en?: string };
  summary?: { tr: string; en?: string };
  period?: { tr: string; en?: string };
  time: string; // "DD.MM.YYYY HH:mm:ss"
  relatedStocks: string[];
  link: string;
  attachmentUrls?: string[];
}

export interface KapMember {
  id: string;
  title: string;
  stockCode: string;
  memberType: string;
  kfifUrl?: string;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

export async function getLastDisclosureIndex(): Promise<number> {
  const data = await kapFetch<{ lastDisclosureIndex: string }>("/lastDisclosureIndex");
  return parseInt(data.lastDisclosureIndex);
}

export async function getKapDisclosures(fromIndex: number): Promise<KapDisclosureSummary[]> {
  return kapFetch<KapDisclosureSummary[]>(`/disclosures?disclosureIndex=${fromIndex}`);
}

export async function getKapDisclosureDetail(id: number): Promise<KapDisclosureDetail> {
  return kapFetch<KapDisclosureDetail>(`/disclosureDetail/${id}?fileType=data`);
}

export async function getKapMembers(): Promise<KapMember[]> {
  const data = await kapFetch<KapMember[] | { members?: KapMember[] }>("/members");
  if (Array.isArray(data)) return data;
  return data.members ?? [];
}

// ── Yardımcı: Son N bildirimi getir (FON hariç, subject dahil) ─────────────

export async function getRecentDisclosuresWithDetail(
  count = 20,
  excludeTypes = ["FON"]
): Promise<KapDisclosureDetail[]> {
  const lastIdx = await getLastDisclosureIndex();

  // Daha fazla bildirimi al, FON'ları çıkardıktan sonra count kadar kalsın
  const summaries = await getKapDisclosures(lastIdx - count * 3);
  const filtered = summaries
    .filter(d => !excludeTypes.includes(d.disclosureType))
    .slice(0, count);

  const details = await Promise.all(
    filtered.map(d => getKapDisclosureDetail(parseInt(d.disclosureIndex)))
  );

  return details;
}
