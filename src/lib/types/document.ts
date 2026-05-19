/**
 * 証憑管理 ドメイン型（DB未接続 / Supabase 移行前提）。
 * 電子帳簿保存法を意識し、検索要件（日付・金額・取引先）を満たすメタデータを保持。
 *
 * Supabase 対応:
 * - 想定テーブル: documents（Storage のオブジェクトキー = storage_path）。
 * - OCR 結果は将来の外部連携を想定し ocr フィールドを構造化（現状ダミー）。
 * - 訂正削除履歴・操作履歴は将来 audit_logs と関連付け。
 */
import type {
  AppUser,
  ID,
  ISODate,
  ISODateTime,
} from "@/lib/types/transaction";

export const DOCUMENT_TYPES = [
  "receipt",
  "invoice",
  "contract",
  "purchase_order",
  "delivery_note",
  "other",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  receipt: "領収書",
  invoice: "請求書",
  contract: "契約書",
  purchase_order: "注文書",
  delivery_note: "納品書",
  other: "その他",
};

export const DOCUMENT_STATUSES = [
  "unlinked",
  "reviewing",
  "linked",
  "archived",
] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];
export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  unlinked: "未紐づけ",
  reviewing: "確認中",
  linked: "紐づけ済",
  archived: "保管済",
};

/** OCR 読み取り結果（将来連携・現状はダミー/プレースホルダー） */
export interface OcrResult {
  status: "none" | "pending" | "done";
  partner_name: string | null;
  total: number | null;
  tax: number | null;
  issue_date: ISODate | null;
  registration_number: string | null;
  confidence: number | null; // 0-100
}

export interface Document {
  id: ID;
  file_name: string;
  mime_type: string; // application/pdf, image/jpeg ...
  size_bytes: number;
  storage_path: string; // Supabase Storage のキー想定

  doc_type: DocumentType;
  status: DocumentStatus;

  /* 電帳法 検索要件 */
  partner_name: string | null;
  amount: number | null;
  transaction_date: ISODate | null;
  registration_number: string | null; // 適格請求書発行事業者の登録番号

  uploaded_at: ISODateTime;
  uploaded_by: AppUser;

  related_transaction_id: ID | null;
  related_journal_id: ID | null;

  ocr: OcrResult;
  memo: string | null;
}

export interface DocumentFilter {
  query: string;
  doc_type: DocumentType | "all";
  status: DocumentStatus | "all";
  date_from: string;
  date_to: string;
  amount_min: string;
  amount_max: string;
  unlinked_only: boolean;
}

export function isUnlinked(d: Document): boolean {
  return (
    d.status === "unlinked" &&
    !d.related_transaction_id &&
    !d.related_journal_id
  );
}
