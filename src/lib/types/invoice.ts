/**
 * 請求管理 ドメイン型（DB未接続 / Supabase 移行前提）。
 * 発行（issued）と受領（received）を direction で区別する。
 *
 * Supabase 対応:
 * - 想定テーブル: invoices / invoice_lines / payments / approval_steps /
 *   attachments / app_users / partners。
 * - `*_id` は FK。ネストは PostgREST 埋め込み想定。enum は Postgres enum/check。
 * - 金額は整数（円）。total = subtotal + tax。
 * 取引先・担当者・証憑・承認・税区分は取引管理の型を再利用。
 */
import type {
  AppUser,
  Attachment,
  ApprovalStep,
  HistoryEvent,
  ID,
  ISODate,
  ISODateTime,
  Partner,
  TaxCategory,
} from "@/lib/types/transaction";

export type InvoiceDirection = "issued" | "received";

/* 発行請求書ステータス */
export const ISSUED_STATUSES = [
  "draft",
  "sent",
  "awaiting_payment",
  "partially_paid",
  "paid",
  "voided",
] as const;
export type IssuedStatus = (typeof ISSUED_STATUSES)[number];
export const ISSUED_STATUS_LABEL: Record<IssuedStatus, string> = {
  draft: "下書き",
  sent: "送付済み",
  awaiting_payment: "入金待ち",
  partially_paid: "一部入金",
  paid: "入金済み",
  voided: "取消",
};

/* 受領請求書ステータス（承認状態） */
export const RECEIVED_STATUSES = [
  "unconfirmed",
  "reviewing",
  "approval",
  "approved",
  "scheduled_payment",
  "paid",
  "rejected",
] as const;
export type ReceivedStatus = (typeof RECEIVED_STATUSES)[number];
export const RECEIVED_STATUS_LABEL: Record<ReceivedStatus, string> = {
  unconfirmed: "未確認",
  reviewing: "確認中",
  approval: "承認待ち",
  approved: "承認済み",
  scheduled_payment: "支払予定",
  paid: "支払済み",
  rejected: "差戻し",
};

export type InvoiceStatus = IssuedStatus | ReceivedStatus;

/* 入金 / 支払 状態 */
export const PAYMENT_STATES = [
  "unpaid",
  "partial",
  "scheduled",
  "paid",
] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];
export const PAYMENT_STATE_LABEL: Record<PaymentState, string> = {
  unpaid: "未入金/未払",
  partial: "一部入金",
  scheduled: "支払予定",
  paid: "消込済み",
};

export interface InvoiceLine {
  id: ID;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number; // 税抜小計
  tax_category: TaxCategory;
}

export interface Payment {
  id: ID;
  date: ISODate;
  amount: number;
  method: string; // 振込 / 口座引落 など
  note: string | null;
}

export interface Invoice {
  id: ID;
  direction: InvoiceDirection;
  /** 請求書番号（発行=自社採番 / 受領=先方番号） */
  number: string;
  partner_id: ID;
  partner: Partner; // 請求先(issued) / 請求元(received)
  subject: string;

  issue_date: ISODate | null; // 発行日（issued）
  receipt_date: ISODate | null; // 受領日（received）
  due_date: ISODate; // 支払期限

  subtotal: number;
  tax: number; // 消費税
  total: number; // 請求金額（税込）

  status: InvoiceStatus;
  payment_state: PaymentState; // 入金状態 / 支払状態

  lines: InvoiceLine[];
  payments: Payment[];
  attachments: Attachment[];
  approvals: ApprovalStep[];
  history: HistoryEvent[];

  related_transaction_id: ID | null;
  related_journal_id: ID | null;

  assignee: AppUser;
  memo: string | null;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface InvoiceFilter {
  query: string;
  status: InvoiceStatus | "all";
  payment_state: PaymentState | "all";
  overdue_only: boolean;
}

/** 支払期限超過判定（基準日は固定の「本日」= ダミー） */
export const TODAY: ISODate = "2026-05-19";
export function isOverdue(inv: Invoice): boolean {
  if (inv.payment_state === "paid") return false;
  return inv.due_date < TODAY;
}
