/**
 * 承認ワークフロー ダミーデータ／導出ヘルパ（DB未接続）。
 * 承認タスクは経費申請の承認ステップから導出する。
 */
import type { ExpenseClaim } from "@/lib/types/expense";
import type { ApprovalRuleSet, ApprovalTask } from "@/lib/types/workflow";

export { DEPARTMENTS } from "@/lib/transactions-data";

/** 承認ルール設定の初期値（設定UIのスケルトン） */
export const DEFAULT_RULE_SET: ApprovalRuleSet = {
  amount_tiers: [
    { id: "AT-1", min_amount: 0, approver_role: "manager" },
    { id: "AT-2", min_amount: 30_000, approver_role: "department_head" },
    { id: "AT-3", min_amount: 100_000, approver_role: "executive" },
  ],
  department_rules: [
    { id: "DR-1", department: "営業部", approver_role: "department_head" },
    { id: "DR-2", department: "開発部", approver_role: "department_head" },
  ],
  role_rules: [
    { id: "RR-1", role: "manager", can_approve_up_to: 30_000 },
    { id: "RR-2", role: "department_head", can_approve_up_to: 100_000 },
    { id: "RR-3", role: "executive", can_approve_up_to: 100_000_000 },
  ],
  require_accounting_check: true,
  final_approver: "accounting",
};

/** 全承認待ちタスク（pending ステップを展開） */
export function pendingApprovalTasks(
  claims: ExpenseClaim[],
): ApprovalTask[] {
  const tasks: ApprovalTask[] = [];
  for (const claim of claims) {
    for (const step of claim.approvals) {
      if (step.status === "pending") tasks.push({ claim, step });
    }
  }
  return tasks;
}

export function myPendingTasks(
  claims: ExpenseClaim[],
  userId: string,
): ApprovalTask[] {
  return pendingApprovalTasks(claims).filter(
    (t) => t.step.approver.id === userId,
  );
}

export function myRequests(
  claims: ExpenseClaim[],
  userId: string,
): ExpenseClaim[] {
  return claims.filter((c) => c.applicant_id === userId);
}
