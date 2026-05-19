/**
 * 仕訳帳 ドメイン型（DB未接続 / Supabase 移行前提・複式簿記）。
 *
 * Supabase 対応:
 * - 想定テーブル: journal_entries / journal_lines / accounts /
 *   sub_accounts / attachments / app_users。
 * - `journal_lines.entry_id` が `journal_entries.id` への FK。
 * - 文字列リテラル union は Postgres enum / check に対応。
 * - 金額は税込・整数（円）。借方合計＝貸方合計を不変条件とする。
 * - 日付/日時は ISO 文字列。
 * 税区分は取引管理と共通（src/lib/types/transaction.ts を再利用）。
 */
import type {
  AppUser,
  Attachment,
  ID,
  ISODate,
  ISODateTime,
  TaxCategory,
} from "@/lib/types/transaction";

export type { TaxCategory };

/* ── 仕訳ステータス ─────────────────────── */
export const JOURNAL_ENTRY_STATUSES = [
  "draft",
  "review",
  "confirmed",
  "revised",
  "voided",
] as const;
export type JournalEntryStatus = (typeof JOURNAL_ENTRY_STATUSES)[number];
export const JOURNAL_ENTRY_STATUS_LABEL: Record<JournalEntryStatus, string> = {
  draft: "下書き",
  review: "確認待ち",
  confirmed: "確定",
  revised: "修正済み",
  voided: "取消",
};

/* ── 勘定科目マスタ ─────────────────────── */
export const ACCOUNT_CATEGORIES = [
  "asset",
  "liability",
  "equity",
  "revenue",
  "expense",
] as const;
export type AccountCategory = (typeof ACCOUNT_CATEGORIES)[number];
export const ACCOUNT_CATEGORY_LABEL: Record<AccountCategory, string> = {
  asset: "資産",
  liability: "負債",
  equity: "純資産",
  revenue: "収益",
  expense: "費用",
};

export interface Account {
  code: string; // 勘定科目コード（例: 4000）
  name: string; // 売上高
  category: AccountCategory;
  sub_accounts: string[]; // 補助科目
}

/* ── 仕訳明細 ───────────────────────────── */
export type JournalSide = "debit" | "credit";

export interface JournalLine {
  id: ID;
  side: JournalSide;
  account_code: string;
  account_name: string;
  sub_account: string | null;
  amount: number; // 税込・整数
  tax_category: TaxCategory;
  tax_amount: number; // 消費税額（内訳・整数）
  department: string | null;
  project: string | null;
}

/* ── 仕訳（伝票） ───────────────────────── */
export interface JournalEntry {
  id: ID; // 仕訳番号（例: JV-1207）
  entry_date: ISODate; // 仕訳日
  description: string; // 摘要
  status: JournalEntryStatus;
  lines: JournalLine[];
  /** 借方合計／貸方合計（不変条件: 一致） */
  debit_total: number;
  credit_total: number;
  related_transaction_id: ID | null;
  related_transaction_name: string | null;
  attachments: Attachment[];
  memo: string | null;
  created_by: AppUser;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/* ── 一覧フィルタ ───────────────────────── */
export interface JournalFilter {
  query: string;
  status: JournalEntryStatus | "all";
  department: string | "all";
  project: string | "all";
}

/* ── 作成フォーム入力（保存前ドラフト） ───── */
export interface JournalLineDraft {
  side: JournalSide;
  account_code: string;
  sub_account: string | null;
  amount: number;
  tax_category: TaxCategory;
  tax_amount: number;
  department: string | null;
  project: string | null;
}
export interface JournalDraft {
  entry_date: ISODate;
  description: string;
  related_transaction_id: ID | null;
  memo: string | null;
  lines: JournalLineDraft[];
  attachment_names: string[];
}

/* ── 自動仕訳候補（ルール/AI想定・現状ダミー） ── */
export interface JournalSuggestion {
  id: ID;
  side: JournalSide;
  account_code: string;
  account_name: string;
  tax_category: TaxCategory;
  /** 0–100 */
  confidence: number;
  /** 推定根拠（摘要キーワード・過去仕訳など） */
  rationale: string;
}

/* ── 集計ヘルパ ─────────────────────────── */
export function sumSide(lines: { side: JournalSide; amount: number }[], side: JournalSide) {
  return lines
    .filter((l) => l.side === side)
    .reduce((s, l) => s + (Number.isFinite(l.amount) ? l.amount : 0), 0);
}
export function isBalanced(lines: { side: JournalSide; amount: number }[]) {
  const d = sumSide(lines, "debit");
  const c = sumSide(lines, "credit");
  return d > 0 && d === c;
}
