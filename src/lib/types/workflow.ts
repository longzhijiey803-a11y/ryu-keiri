/**
 * 承認ワークフロー ドメイン型（DB未接続 / Supabase 移行前提）。
 * 承認ルールは設定UIのスケルトン。想定テーブル: approval_rules /
 *   approval_amount_tiers / approval_department_rules / approval_role_rules。
 */
import type { ID } from "@/lib/types/transaction";
import type { ApprovalStep } from "@/lib/types/transaction";
import type { ExpenseClaim } from "@/lib/types/expense";

export type ApproverRole = "manager" | "department_head" | "executive" | "accounting";
export const APPROVER_ROLE_LABEL: Record<ApproverRole, string> = {
  manager: "マネージャー",
  department_head: "部門長",
  executive: "役員",
  accounting: "経理",
};

/** 金額別承認の閾値（min_amount 以上で approver_role の承認が必要） */
export interface AmountTier {
  id: ID;
  min_amount: number;
  approver_role: ApproverRole;
}
/** 部門別承認 */
export interface DepartmentRule {
  id: ID;
  department: string;
  approver_role: ApproverRole;
}
/** 役職別承認（その役職が単独で承認できる上限額） */
export interface RoleRule {
  id: ID;
  role: ApproverRole;
  can_approve_up_to: number;
}

export interface ApprovalRuleSet {
  amount_tiers: AmountTier[];
  department_rules: DepartmentRule[];
  role_rules: RoleRule[];
  require_accounting_check: boolean; // 経理確認の有無
  final_approver: ApproverRole; // 最終承認者
}

/** 承認タスク（申請 × 承認ステップ） */
export interface ApprovalTask {
  claim: ExpenseClaim;
  step: ApprovalStep;
}

export type ApprovalActionKind = "approve" | "return" | "reject";
export const APPROVAL_ACTION_LABEL: Record<ApprovalActionKind, string> = {
  approve: "承認する",
  return: "差戻す",
  reject: "却下する",
};
