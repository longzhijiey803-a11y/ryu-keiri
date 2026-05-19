/**
 * 取引管理 ドメイン型（DB未接続 / Supabase 移行前提）。
 *
 * Supabase へ接続する際の対応:
 * - `*_id` は外部キー（uuid）。ネストした `partner` / `assignee` 等は
 *   PostgREST の埋め込み（`select=*,partner:partners(*)`）で取得する想定。
 * - 文字列リテラル union は Postgres の enum もしくは check 制約に対応。
 * - 日付・時刻は ISO 文字列（Supabase の timestamptz/date がそのまま入る）。
 * - 金額は税込の整数（円）。小数は扱わない。
 * 想定テーブル: transactions / partners / app_users / attachments /
 *   journal_entries / journal_lines / approval_steps / comments / audit_logs
 */

export type ID = string; // uuid
export type ISODate = string; // "2026-05-12"
export type ISODateTime = string; // "2026-05-12T10:42:00+09:00"

/* ── 取引区分 ───────────────────────────── */
export const TRANSACTION_KINDS = [
  "sales",
  "purchase",
  "expense",
  "payment",
  "deposit",
  "transfer",
] as const;
export type TransactionKind = (typeof TRANSACTION_KINDS)[number];
export const TRANSACTION_KIND_LABEL: Record<TransactionKind, string> = {
  sales: "売上請求",
  purchase: "仕入",
  expense: "経費",
  payment: "支払",
  deposit: "入金",
  transfer: "振替",
};

/* ── 取引ステータス（カンバンのステージと一致） ── */
export const TRANSACTION_STATUSES = [
  "draft",
  "review",
  "approval",
  "scheduled_payment",
  "awaiting_deposit",
  "done",
  "rejected",
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
  draft: "下書き",
  review: "確認待ち",
  approval: "承認待ち",
  scheduled_payment: "支払予定",
  awaiting_deposit: "入金待ち",
  done: "完了",
  rejected: "差戻し",
};

/* ── 仕訳状態 ───────────────────────────── */
export const JOURNAL_STATUSES = ["unposted", "draft", "posted"] as const;
export type JournalStatus = (typeof JOURNAL_STATUSES)[number];
export const JOURNAL_STATUS_LABEL: Record<JournalStatus, string> = {
  unposted: "未仕訳",
  draft: "仕訳ドラフト",
  posted: "記帳済",
};

/* ── 税区分（インボイス対応を意識） ──────── */
export const TAX_CATEGORIES = [
  "taxable_10",
  "taxable_8",
  "tax_free",
  "non_taxable",
  "tax_exempt",
] as const;
export type TaxCategory = (typeof TAX_CATEGORIES)[number];
export const TAX_CATEGORY_LABEL: Record<TaxCategory, string> = {
  taxable_10: "課税 10%",
  taxable_8: "課税 8%（軽減）",
  tax_free: "免税",
  non_taxable: "不課税",
  tax_exempt: "非課税",
};

/* ── 関連エンティティ ───────────────────── */
export interface Partner {
  id: ID;
  name: string;
  /** 適格請求書発行事業者の登録番号（電帳法/インボイス意識・任意） */
  registration_number: string | null;
}

export interface AppUser {
  id: ID;
  name: string;
  email: string;
}

export interface Attachment {
  id: ID;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_at: ISODateTime;
  uploaded_by: string;
}

export type JournalSide = "debit" | "credit";
export interface JournalLine {
  id: ID;
  side: JournalSide;
  account_code: string;
  account_name: string;
  tax_category: TaxCategory;
  amount: number;
}
export interface JournalEntry {
  id: ID;
  status: JournalStatus;
  entry_date: ISODate;
  lines: JournalLine[];
}

export type ApprovalStepStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "skipped";
export interface ApprovalStep {
  id: ID;
  order: number;
  approver: AppUser;
  role: string;
  status: ApprovalStepStatus;
  acted_at: ISODateTime | null;
  comment: string | null;
}

export interface TransactionComment {
  id: ID;
  author: AppUser;
  body: string;
  created_at: ISODateTime;
}

export interface HistoryEvent {
  id: ID;
  actor: AppUser;
  action: string;
  at: ISODateTime;
  detail: string | null;
}

/* ── 取引（中核オブジェクト / docs/DESIGN.md §A-2） ── */
export interface Transaction {
  id: ID;
  /** 表示名（例: 5月分 受託開発 請求） */
  name: string;
  kind: TransactionKind;
  status: TransactionStatus;

  partner_id: ID;
  partner: Partner;

  /** 税込金額（円・整数） */
  amount: number;
  tax_category: TaxCategory;

  transaction_date: ISODate;
  /** 支払期日 / 入金期日（区分により意味が変わる・任意） */
  due_date: ISODate | null;

  assignee_id: ID;
  assignee: AppUser;

  department: string | null;
  project: string | null;
  memo: string | null;

  attachments: Attachment[];
  journal: JournalEntry | null;
  journal_status: JournalStatus;
  approvals: ApprovalStep[];
  comments: TransactionComment[];
  history: HistoryEvent[];

  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/* ── 一覧フィルタ ───────────────────────── */
export interface TransactionFilter {
  query: string;
  kind: TransactionKind | "all";
  status: TransactionStatus | "all";
  assignee_id: ID | "all";
}

/* ── 作成フォーム入力（DB保存前のドラフト） ── */
export interface TransactionDraft {
  name: string;
  kind: TransactionKind;
  partner_id: ID;
  amount: number;
  tax_category: TaxCategory;
  transaction_date: ISODate;
  due_date: ISODate | null;
  assignee_id: ID;
  department: string | null;
  project: string | null;
  memo: string | null;
  attachment_names: string[];
}
