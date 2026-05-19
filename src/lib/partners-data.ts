/**
 * 取引先マスタ ビュー（DB未接続）。
 * 基本は transactions-data の PARTNERS。区分・残高・取引件数は
 * 請求/売掛買掛/取引から導出（実接続時は集計クエリへ）。
 */
import { PARTNERS, TRANSACTIONS } from "@/lib/transactions-data";
import { ISSUED_INVOICES, RECEIVED_INVOICES } from "@/lib/invoice-data";
import { RECEIVABLES, PAYABLES } from "@/lib/ar-ap-data";

export const PARTNER_KINDS = [
  "customer",
  "supplier",
  "both",
  "unclassified",
] as const;
export type PartnerKind = (typeof PARTNER_KINDS)[number];
export const PARTNER_KIND_LABEL: Record<PartnerKind, string> = {
  customer: "得意先",
  supplier: "仕入先",
  both: "得意先・仕入先",
  unclassified: "未分類",
};

export interface PartnerRecord {
  id: string;
  name: string;
  registration_number: string | null;
  kind: PartnerKind;
  ar_outstanding: number; // 売掛残
  ap_outstanding: number; // 買掛残
  txn_count: number; // 関連取引件数
  active: boolean;
}

function kindOf(id: string): PartnerKind {
  const hasIssued = ISSUED_INVOICES.some((i) => i.partner_id === id);
  const hasReceived = RECEIVED_INVOICES.some((i) => i.partner_id === id);
  if (hasIssued && hasReceived) return "both";
  if (hasIssued) return "customer";
  if (hasReceived) return "supplier";
  return "unclassified";
}

export const PARTNER_RECORDS: PartnerRecord[] = PARTNERS.map((p) => ({
  id: p.id,
  name: p.name,
  registration_number: p.registration_number,
  kind: kindOf(p.id),
  ar_outstanding: RECEIVABLES.filter(
    (r) => r.partner_name === p.name,
  ).reduce((s, r) => s + r.outstanding, 0),
  ap_outstanding: PAYABLES.filter(
    (r) => r.partner_name === p.name,
  ).reduce((s, r) => s + r.outstanding, 0),
  txn_count: TRANSACTIONS.filter((t) => t.partner_id === p.id).length,
  active: true,
}));

export interface PartnerFilter {
  query: string;
  kind: PartnerKind | "all";
  only_no_regno: boolean;
}

export function filterPartners(
  list: PartnerRecord[],
  f: PartnerFilter,
): PartnerRecord[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((p) => {
    if (f.kind !== "all" && p.kind !== f.kind) return false;
    if (f.only_no_regno && p.registration_number) return false;
    if (
      q &&
      !`${p.id} ${p.name} ${p.registration_number ?? ""}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    return true;
  });
}

export interface PartnerDraft {
  name: string;
  kind: PartnerKind;
  registration_number: string | null;
  note: string | null;
}

/** その取引先に関連する請求書（発行/受領）の簡易リスト */
export function partnerInvoices(id: string) {
  return [...ISSUED_INVOICES, ...RECEIVED_INVOICES]
    .filter((i) => i.partner_id === id)
    .map((i) => ({
      id: i.id,
      number: i.number,
      direction: i.direction,
      subject: i.subject,
      total: i.total,
      due_date: i.due_date,
    }));
}
