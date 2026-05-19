/**
 * 入出金管理・消込 ドメイン型（DB未接続 / Supabase 移行前提）。
 * 想定テーブル: bank_accounts / bank_transactions（reconciliation は
 *   bank_transactions の状態＋ FK で表現）。銀行API/CSVは将来連携。
 */
import type { ID, ISODate, ISODateTime } from "@/lib/types/transaction";

export const ACCOUNT_TYPES = ["ordinary", "current", "savings"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];
export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  ordinary: "普通",
  current: "当座",
  savings: "貯蓄",
};

export const ACCOUNT_STATUSES = [
  "active",
  "syncing",
  "error",
  "closed",
] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
export const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
  active: "連携中",
  syncing: "同期中",
  error: "エラー",
  closed: "解約",
};

export interface BankAccount {
  id: ID;
  name: string; // 口座名
  bank_name: string; // 金融機関
  branch: string; // 支店
  account_type: AccountType;
  last4: string; // 口座番号下4桁
  balance: number;
  last_synced_at: ISODateTime | null; // 最終同期日時
  status: AccountStatus;
}

export const RECON_STATUSES = [
  "unreconciled",
  "candidate",
  "reconciled",
  "discrepancy",
  "pending",
] as const;
export type ReconStatus = (typeof RECON_STATUSES)[number];
export const RECON_STATUS_LABEL: Record<ReconStatus, string> = {
  unreconciled: "未消込",
  candidate: "候補あり",
  reconciled: "消込済み",
  discrepancy: "差異あり",
  pending: "確認待ち",
};

export type BankTxnDir = "in" | "out";

export interface BankTxn {
  id: ID;
  account_id: ID;
  txn_date: ISODate;
  dir: BankTxnDir;
  description: string; // 摘要
  partner_guess: string | null; // 取引先推定
  deposit: number; // 入金額（dir=out のとき 0）
  withdrawal: number; // 出金額（dir=in のとき 0）
  balance: number; // 残高
  recon_status: ReconStatus;
  related_invoice_id: ID | null;
  related_transaction_id: ID | null;
  memo: string | null;
}

export interface BankTxnFilter {
  query: string;
  account_id: ID | "all";
  recon_status: ReconStatus | "all";
  dir: BankTxnDir | "all";
}

/** 入出金額（符号なし） */
export function txnAmount(t: BankTxn): number {
  return t.dir === "in" ? t.deposit : t.withdrawal;
}
