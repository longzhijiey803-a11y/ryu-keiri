import { Clock, FileWarning, RotateCcw, Wallet } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { EXPENSE_CLAIMS } from "@/lib/expense-data";
import { claimIssues } from "@/lib/types/expense";
import { formatJPY } from "@/lib/utils";

export function ExpenseOverview() {
  const pendingApproval = EXPENSE_CLAIMS.filter(
    (c) => c.status === "pending_approval" || c.status === "submitted",
  );
  const returned = EXPENSE_CLAIMS.filter((c) => c.status === "returned");
  const scheduled = EXPENSE_CLAIMS.filter(
    (c) => c.status === "scheduled" || c.status === "approved",
  );
  const scheduledAmt = scheduled.reduce((s, c) => s + c.total, 0);
  const withIssues = EXPENSE_CLAIMS.filter(
    (c) => claimIssues(c).length > 0,
  );

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        label="承認待ち"
        value={`${pendingApproval.length} 件`}
        sub="申請中＋承認待ち"
        icon={Clock}
        tone="warning"
        href="/expenses/claims"
      />
      <KpiCard
        label="差戻し"
        value={`${returned.length} 件`}
        sub="要対応"
        icon={RotateCcw}
        tone="danger"
        href="/expenses/claims"
      />
      <KpiCard
        label="精算予定"
        value={`${scheduled.length} 件`}
        sub={formatJPY(scheduledAmt)}
        icon={Wallet}
        tone="primary"
        href="/expenses/claims"
      />
      <KpiCard
        label="不備あり"
        value={`${withIssues.length} 件`}
        sub="領収書・科目など"
        icon={FileWarning}
        tone="danger"
        href="/expenses/claims"
      />
    </div>
  );
}
