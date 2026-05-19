/**
 * 売掛・買掛 ドメイン型（DB未接続 / Supabase 移行前提）。
 * 請求管理（invoices）から導出するビュー型。発行=売掛 / 受領=買掛。
 */
import type { ID, ISODate } from "@/lib/types/transaction";
import type {
  IssuedStatus,
  PaymentState,
  ReceivedStatus,
} from "@/lib/types/invoice";

export interface ReceivableRow {
  id: ID;
  partner_name: string; // 請求先
  number: string; // 請求書番号
  total: number; // 請求金額
  paid: number; // 入金済額
  outstanding: number; // 未回収額
  due_date: ISODate; // 支払期限
  overdue_days: number; // 遅延日数
  status: IssuedStatus;
  payment_state: PaymentState;
  assignee_name: string; // 担当者
}

export interface PayableRow {
  id: ID;
  partner_name: string; // 支払先
  number: string; // 請求書番号
  total: number; // 請求金額
  paid: number; // 支払済額
  outstanding: number; // 未払額
  due_date: ISODate; // 支払期限
  due_in_days: number; // 期限までの日数（負=超過）
  payment_state: PaymentState; // ステータス（支払）
  approval_status: ReceivedStatus; // 承認状態
  assignee_name: string;
}

export interface ARAPFilter {
  query: string;
  only_outstanding: boolean;
  overdue_only: boolean;
}
