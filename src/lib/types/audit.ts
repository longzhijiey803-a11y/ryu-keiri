/**
 * 監査ログ ドメイン型（DB未接続 / Supabase 移行前提）。
 * 想定テーブル: audit_logs（追記専用・改ざん不可ポリシーを RLS で担保）。
 */
import type { AppUser, ID, ISODateTime } from "@/lib/types/transaction";

export const AUDIT_ACTIONS = [
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "reconcile",
  "export",
  "login",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];
export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  create: "作成",
  update: "更新",
  delete: "削除",
  approve: "承認",
  reject: "差戻し/却下",
  reconcile: "消込",
  export: "エクスポート",
  login: "ログイン",
};

export interface AuditChange {
  field: string;
  before: string | null;
  after: string | null;
}

export interface AuditLog {
  id: ID;
  at: ISODateTime;
  user: AppUser;
  action: AuditAction;
  target: string; // 対象データ（例: 取引 TX-1042）
  changes: AuditChange[]; // 変更内容
  ip: string;
  detail: string | null;
}

export interface AuditFilter {
  query: string;
  action: AuditAction | "all";
}
