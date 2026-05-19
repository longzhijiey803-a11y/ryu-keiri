"use client";

import * as React from "react";

import { useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { EXPENSE_CLAIMS } from "@/lib/expense-data";
import { applyApprovalAction, addClaimComment } from "@/lib/claim-actions";
import { CURRENT_USER, CURRENT_USER_ID } from "@/lib/current-user";
import type {
  ExpenseClaim,
  ExpensePayState,
  ExpenseStatus,
} from "@/lib/types/expense";
import {
  EXPENSE_PAY_STATE_LABEL,
  EXPENSE_STATUS_LABEL,
} from "@/lib/types/expense";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { ExpenseDetailDrawer } from "@/components/expenses/expense-detail-drawer";
import { WorkflowNav } from "./workflow-nav";

type Seg = "all" | "my_pending" | "my_requests";

export function ApprovalsClient() {
  const { toast } = useToast();
  const [list, setList] = React.useState<ExpenseClaim[]>(EXPENSE_CLAIMS);
  const [seg, setSeg] = React.useState<Seg>("my_pending");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const hasPending = (c: ExpenseClaim) =>
    c.approvals.some((s) => s.status === "pending");
  const hasMyPending = (c: ExpenseClaim) =>
    c.approvals.some(
      (s) => s.status === "pending" && s.approver.id === CURRENT_USER_ID,
    );

  const counts = {
    all: list.filter(hasPending).length,
    my_pending: list.filter(hasMyPending).length,
    my_requests: list.filter((c) => c.applicant_id === CURRENT_USER_ID)
      .length,
  };

  const data = React.useMemo(() => {
    if (seg === "all") return list.filter(hasPending);
    if (seg === "my_pending") return list.filter(hasMyPending);
    return list.filter((c) => c.applicant_id === CURRENT_USER_ID);
  }, [list, seg]);

  const selected = list.find((c) => c.id === selectedId) ?? null;

  const nowISO = () => new Date().toISOString();
  const handleStatusChange = (id: string, status: ExpenseStatus) => {
    setList((prev) =>
      prev.map((c) =>
        c.id === id && c.status !== status
          ? { ...c, status, updated_at: nowISO() }
          : c,
      ),
    );
    toast({
      title: "承認状態を更新しました",
      description: `${id} → ${EXPENSE_STATUS_LABEL[status]}`,
      variant: "success",
    });
  };
  const handlePayStateChange = (id: string, state: ExpensePayState) => {
    setList((prev) =>
      prev.map((c) =>
        c.id === id && c.pay_state !== state
          ? { ...c, pay_state: state, updated_at: nowISO() }
          : c,
      ),
    );
    toast({
      title: "支払状態を更新しました",
      description: `${id} → ${EXPENSE_PAY_STATE_LABEL[state]}`,
      variant: "success",
    });
  };

  const SEGMENTS: { key: Seg; label: string }[] = [
    { key: "all", label: "承認一覧" },
    { key: "my_pending", label: "自分の承認待ち" },
    { key: "my_requests", label: "自分の申請" },
  ];

  return (
    <>
      <PageHeader
        title="承認ワークフロー"
        description={`${CURRENT_USER.name} としてログイン中。承認・差戻し・却下を行います。`}
      />
      <WorkflowNav />

      <div className="mb-4 inline-flex items-center rounded-md border border-border bg-muted p-1">
        {SEGMENTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSeg(s.key)}
            aria-pressed={seg === s.key}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
              seg === s.key
                ? "bg-surface text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
            <span
              className={cn(
                "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs",
                seg === s.key
                  ? "bg-primary/10 text-primary"
                  : "bg-surface text-muted-foreground",
              )}
            >
              {counts[s.key]}
            </span>
          </button>
        ))}
      </div>

      <ExpenseTable
        data={data}
        onRowClick={(c) => {
          setSelectedId(c.id);
          setOpen(true);
        }}
        onStatusChange={handleStatusChange}
        onPayStateChange={handlePayStateChange}
      />

      <ExpenseDetailDrawer
        claim={selected}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSelectedId(null);
        }}
        onAction={(id, kind, comment) => {
          setList((prev) => applyApprovalAction(prev, id, kind, comment));
          toast({
            title:
              kind === "approve"
                ? "承認しました"
                : kind === "return"
                  ? "差戻しました"
                  : "却下しました",
            description: id,
            variant: kind === "approve" ? "success" : "warning",
          });
        }}
        onComment={(id, body) =>
          setList((prev) => addClaimComment(prev, id, body))
        }
      />
    </>
  );
}
