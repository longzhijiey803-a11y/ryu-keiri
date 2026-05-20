/**
 * 経費精算 ドメイン型（DB未接続 / Supabase 移行前提）。
 * 想定テーブル: expense_claims / expense_lines / approval_steps /
 *   attachments / comments / app_users。
 * 取引先・担当者・証憑・承認・税区分は取引管理の型を再利用。
 */
import type {
  ApprovalStep,
  AppUser,
  Attachment,
  HistoryEvent,
  ID,
  ISODate,
  ISODateTime,
  TaxCategory,
  TransactionComment,
} from "@/lib/types/transaction";

export const EXPENSE_STATUSES = [
  "draft",
  "submitted",
  "pending_approval",
  "returned",
  "approved",
  "scheduled",
  "settled",
  "rejected",
] as const;
export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];
export const EXPENSE_STATUS_LABEL: Record<ExpenseStatus, string> = {
  draft: "下書き",
  submitted: "申請中",
  pending_approval: "承認待ち",
  returned: "差戻し",
  approved: "承認済み",
  scheduled: "精算予定",
  settled: "精算済み",
  rejected: "却下",
};

export const EXPENSE_PAY_STATES = ["unpaid", "scheduled", "settled"] as const;
export type ExpensePayState = (typeof EXPENSE_PAY_STATES)[number];
export const EXPENSE_PAY_STATE_LABEL: Record<ExpensePayState, string> = {
  unpaid: "未精算",
  scheduled: "精算予定",
  settled: "精算済み",
};

export interface ExpenseLine {
  id: ID;
  used_on: ISODate; // 利用日
  payee: string; // 支払先
  amount: number; // 税込
  tax_category: TaxCategory;
  account_hint: string; // 勘定科目候補（コード/名称の文字列・将来は科目FK）
  note: string | null;
}

export interface ExpenseClaim {
  id: ID; // 申請番号（例: EXP-1042）
  subject: string; // 件名
  applicant: AppUser; // 申請者
  applicant_id: ID;
  department: string;
  claim_date: ISODate; // 申請日
  /** 承認期限（社内SLA: 申請日 + 5営業日想定） */
  approval_due_date: ISODate;
  /** 精算期限（承認後の振込期日。月次の精算スケジュール想定） */
  settlement_due_date: ISODate;
  status: ExpenseStatus;
  pay_state: ExpensePayState;
  lines: ExpenseLine[];
  total: number;
  receipts: Attachment[]; // 領収書
  approvals: ApprovalStep[];
  comments: TransactionComment[];
  history: HistoryEvent[];
  memo: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ExpenseFilter {
  query: string;
  status: ExpenseStatus | "all";
  department: string | "all";
}

/** 不備チェック（不備がある申請は警告表示） */
export function claimIssues(c: ExpenseClaim): string[] {
  const issues: string[] = [];
  if (c.lines.length === 0) issues.push("経費明細がありません");
  if (c.total <= 0) issues.push("合計金額が 0 円です");
  if (c.receipts.length === 0) issues.push("領収書が添付されていません");
  if (c.lines.some((l) => !l.account_hint.trim()))
    issues.push("勘定科目候補が未設定の明細があります");
  return issues;
}

export interface ExpenseLineDraft {
  used_on: ISODate;
  payee: string;
  amount: number;
  tax_category: TaxCategory;
  account_hint: string;
  note: string | null;
}
export interface ExpenseDraft {
  subject: string;
  applicant_id: ID;
  department: string;
  claim_date: ISODate;
  memo: string | null;
  lines: ExpenseLineDraft[];
  receipt_names: string[];
}
