/**
 * 証憑管理ダミーデータ（DB未接続）。型は src/lib/types/document.ts。
 * 種別・ステータスを網羅し、未紐づけ証憑を複数含む。OCR はダミー。
 */
import type { Document, DocumentFilter } from "@/lib/types/document";
import { isUnlinked } from "@/lib/types/document";
import { USERS } from "@/lib/transactions-data";

const U = Object.fromEntries(USERS.map((u) => [u.id, u]));

export const DOCUMENTS: Document[] = [
  {
    id: "DOC-1042",
    file_name: "請求書_INV-2042.pdf",
    mime_type: "application/pdf",
    size_bytes: 184_320,
    storage_path: "documents/2026/05/DOC-1042.pdf",
    doc_type: "invoice",
    status: "linked",
    partner_name: "株式会社サンプル商事",
    amount: 2_860_000,
    transaction_date: "2026-05-12",
    registration_number: "T1234567890123",
    uploaded_at: "2026-05-12T10:42:00+09:00",
    uploaded_by: U.u1,
    related_transaction_id: "TX-1042",
    related_journal_id: "JV-1207",
    ocr: { status: "done", partner_name: "株式会社サンプル商事", total: 2_860_000, tax: 260_000, issue_date: "2026-05-12", registration_number: "T1234567890123", confidence: 96 },
    memo: null,
  },
  {
    id: "DOC-1041",
    file_name: "請求書_cloud_202605.pdf",
    mime_type: "application/pdf",
    size_bytes: 73_400,
    storage_path: "documents/2026/05/DOC-1041.pdf",
    doc_type: "invoice",
    status: "reviewing",
    partner_name: "クラウドサービス株式会社",
    amount: 132_000,
    transaction_date: "2026-05-11",
    registration_number: null,
    uploaded_at: "2026-05-11T14:20:00+09:00",
    uploaded_by: U.u1,
    related_transaction_id: "TX-1041",
    related_journal_id: null,
    ocr: { status: "done", partner_name: "クラウドサービス（株）", total: 132_000, tax: 12_000, issue_date: "2026-05-10", registration_number: null, confidence: 82 },
    memo: "登録番号がOCRで読めず。要確認。",
  },
  {
    id: "DOC-1039",
    file_name: "領収書_taxi.jpg",
    mime_type: "image/jpeg",
    size_bytes: 421_900,
    storage_path: "documents/2026/05/DOC-1039.jpg",
    doc_type: "receipt",
    status: "unlinked",
    partner_name: null,
    amount: 8_640,
    transaction_date: "2026-05-09",
    registration_number: null,
    uploaded_at: "2026-05-09T18:02:00+09:00",
    uploaded_by: U.u2,
    related_transaction_id: null,
    related_journal_id: null,
    ocr: { status: "done", partner_name: "個人名（要確認）", total: 8_640, tax: 786, issue_date: "2026-05-09", registration_number: null, confidence: 61 },
    memo: "宛名が個人名。取引に未紐づけ。",
  },
  {
    id: "DOC-1037",
    file_name: "賃貸借契約書_2026.pdf",
    mime_type: "application/pdf",
    size_bytes: 612_800,
    storage_path: "documents/2026/04/DOC-1037.pdf",
    doc_type: "contract",
    status: "archived",
    partner_name: "オフィス賃貸株式会社",
    amount: null,
    transaction_date: "2026-04-01",
    registration_number: "T5556667778889",
    uploaded_at: "2026-04-01T09:00:00+09:00",
    uploaded_by: U.u1,
    related_transaction_id: "TX-1037",
    related_journal_id: null,
    ocr: { status: "none", partner_name: null, total: null, tax: null, issue_date: null, registration_number: null, confidence: null },
    memo: "原本は別途保管。",
  },
  {
    id: "DOC-1031",
    file_name: "注文書_kitawa_0504.pdf",
    mime_type: "application/pdf",
    size_bytes: 98_700,
    storage_path: "documents/2026/05/DOC-1031.pdf",
    doc_type: "purchase_order",
    status: "linked",
    partner_name: "北和工業株式会社",
    amount: 712_800,
    transaction_date: "2026-05-04",
    registration_number: "T9998887776665",
    uploaded_at: "2026-05-04T15:50:00+09:00",
    uploaded_by: U.u4,
    related_transaction_id: "TX-1001",
    related_journal_id: "JV-1070",
    ocr: { status: "done", partner_name: "北和工業株式会社", total: 712_800, tax: 64_800, issue_date: "2026-05-04", registration_number: "T9998887776665", confidence: 90 },
    memo: null,
  },
  {
    id: "DOC-1028",
    file_name: "納品書_oozora_0501.pdf",
    mime_type: "application/pdf",
    size_bytes: 121_300,
    storage_path: "documents/2026/05/DOC-1028.pdf",
    doc_type: "delivery_note",
    status: "linked",
    partner_name: "株式会社オオゾラ",
    amount: 540_000,
    transaction_date: "2026-05-01",
    registration_number: "T2233445566778",
    uploaded_at: "2026-05-01T10:05:00+09:00",
    uploaded_by: U.u1,
    related_transaction_id: "TX-1028",
    related_journal_id: "JV-1180",
    ocr: { status: "done", partner_name: "株式会社オオゾラ", total: 540_000, tax: 49_091, issue_date: "2026-05-01", registration_number: "T2233445566778", confidence: 93 },
    memo: null,
  },
  {
    id: "DOC-1024",
    file_name: "領収書_amazon_0507.pdf",
    mime_type: "application/pdf",
    size_bytes: 54_200,
    storage_path: "documents/2026/05/DOC-1024.pdf",
    doc_type: "receipt",
    status: "unlinked",
    partner_name: "ネット通販",
    amount: 64_800,
    transaction_date: "2026-05-07",
    registration_number: "T1112223334445",
    uploaded_at: "2026-05-07T12:10:00+09:00",
    uploaded_by: U.u4,
    related_transaction_id: null,
    related_journal_id: null,
    ocr: { status: "done", partner_name: "ネット通販", total: 64_800, tax: 5_891, issue_date: "2026-05-07", registration_number: "T1112223334445", confidence: 88 },
    memo: "取引に未紐づけ。",
  },
  {
    id: "DOC-1018",
    file_name: "請求書_kitawa_cons.pdf",
    mime_type: "application/pdf",
    size_bytes: 88_700,
    storage_path: "documents/2026/05/DOC-1018.pdf",
    doc_type: "invoice",
    status: "linked",
    partner_name: "北和工業株式会社",
    amount: 220_000,
    transaction_date: "2026-05-06",
    registration_number: "T9998887776665",
    uploaded_at: "2026-05-06T09:00:00+09:00",
    uploaded_by: U.u1,
    related_transaction_id: "TX-1018",
    related_journal_id: "JV-1085",
    ocr: { status: "done", partner_name: "北和工業株式会社", total: 220_000, tax: 20_000, issue_date: "2026-05-06", registration_number: "T9998887776665", confidence: 91 },
    memo: null,
  },
  {
    id: "DOC-1099",
    file_name: "スキャン_unknown_0517.jpg",
    mime_type: "image/jpeg",
    size_bytes: 980_400,
    storage_path: "documents/2026/05/DOC-1099.jpg",
    doc_type: "other",
    status: "unlinked",
    partner_name: null,
    amount: null,
    transaction_date: null,
    registration_number: null,
    uploaded_at: "2026-05-17T19:30:00+09:00",
    uploaded_by: U.u2,
    related_transaction_id: null,
    related_journal_id: null,
    ocr: { status: "pending", partner_name: null, total: null, tax: null, issue_date: null, registration_number: null, confidence: null },
    memo: "種別・取引先不明。OCR待ち。",
  },
  {
    id: "DOC-1008",
    file_name: "請求書_tel_0418.pdf",
    mime_type: "application/pdf",
    size_bytes: 64_100,
    storage_path: "documents/2026/04/DOC-1008.pdf",
    doc_type: "invoice",
    status: "archived",
    partner_name: "東京電力エナジー",
    amount: 23_650,
    transaction_date: "2026-04-18",
    registration_number: null,
    uploaded_at: "2026-04-19T10:00:00+09:00",
    uploaded_by: U.u4,
    related_transaction_id: "TX-1008",
    related_journal_id: "JV-1120",
    ocr: { status: "done", partner_name: "東京電力エナジー", total: 23_650, tax: 2_150, issue_date: "2026-04-18", registration_number: null, confidence: 79 },
    memo: null,
  },
];

export function findDocument(id: string): Document | undefined {
  return DOCUMENTS.find((d) => d.id === id);
}

export function filterDocuments(
  list: Document[],
  f: DocumentFilter,
): Document[] {
  const q = f.query.trim().toLowerCase();
  const min = f.amount_min ? Number(f.amount_min) : null;
  const max = f.amount_max ? Number(f.amount_max) : null;
  return list.filter((d) => {
    if (f.doc_type !== "all" && d.doc_type !== f.doc_type) return false;
    if (f.status !== "all" && d.status !== f.status) return false;
    if (f.unlinked_only && !isUnlinked(d)) return false;
    if (f.date_from && (!d.transaction_date || d.transaction_date < f.date_from))
      return false;
    if (f.date_to && (!d.transaction_date || d.transaction_date > f.date_to))
      return false;
    if (min !== null && (d.amount ?? -1) < min) return false;
    if (max !== null && (d.amount ?? Number.MAX_SAFE_INTEGER) > max)
      return false;
    if (q) {
      const hay =
        `${d.id} ${d.file_name} ${d.partner_name ?? ""} ${d.registration_number ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const UNLINKED_COUNT = DOCUMENTS.filter(isUnlinked).length;
