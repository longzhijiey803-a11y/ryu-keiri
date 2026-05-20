"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button, useToast } from "@/components/ui";
import { EXPENSE_CLAIMS, filterClaims } from "@/lib/expense-data";
import { USERS } from "@/lib/transactions-data";
import { addDaysISO } from "@/lib/utils";
import { applyApprovalAction, addClaimComment } from "@/lib/claim-actions";
import type {
  ExpenseClaim,
  ExpenseDraft,
  ExpenseFilter,
  ExpensePayState,
  ExpenseStatus,
} from "@/lib/types/expense";
import {
  EXPENSE_PAY_STATE_LABEL,
  EXPENSE_STATUS_LABEL,
} from "@/lib/types/expense";
import { ExpenseFilterBar } from "./expense-filter-bar";
import { ExpenseTable } from "./expense-table";
import { ExpenseDetailDrawer } from "./expense-detail-drawer";
import { ExpenseCreateDrawer } from "./expense-create-drawer";

const DEFAULT_FILTER: ExpenseFilter = {
  query: "",
  status: "all",
  department: "all",
};

export function ExpensesClient() {
  const { toast } = useToast();
  const [list, setList] = React.useState<ExpenseClaim[]>(EXPENSE_CLAIMS);
  const [filter, setFilter] = React.useState<ExpenseFilter>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = React.useMemo(
    () => filterClaims(list, filter),
    [list, filter],
  );
  const selected = React.useMemo(
    () => list.find((c) => c.id === selectedId) ?? null,
    [list, selectedId],
  );

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

  const handleCreate = (d: ExpenseDraft) => {
    const now = new Date().toISOString();
    const applicant =
      USERS.find((u) => u.id === d.applicant_id) ?? USERS[0];
    const head = USERS[2]; // 山田 部長
    let ls = 0;
    const lines = d.lines.map((l) => ({ ...l, id: `EL-N${++ls}` }));
    const claim: ExpenseClaim = {
      id: `EXP-${1042 + list.length + 1}`,
      subject: d.subject,
      applicant,
      applicant_id: applicant.id,
      department: d.department,
      claim_date: d.claim_date,
      approval_due_date: addDaysISO(d.claim_date, 7),
      settlement_due_date: addDaysISO(d.claim_date, 14),
      status: "submitted",
      pay_state: "unpaid",
      lines,
      total: lines.reduce((s, l) => s + (Number(l.amount) || 0), 0),
      receipts: d.receipt_names.map((name, i) => ({
        id: `ER-N${i + 1}`,
        file_name: name,
        mime_type: "application/octet-stream",
        size_bytes: 0,
        uploaded_at: now,
        uploaded_by: applicant.name,
      })),
      approvals: [
        {
          id: `EA-N${now}`,
          order: 1,
          approver: head,
          role: "部門長",
          status: "pending",
          acted_at: null,
          comment: null,
        },
      ],
      comments: [],
      history: [
        {
          id: `EH-N${now}`,
          actor: applicant,
          action: "経費を申請",
          at: now,
          detail: null,
        },
      ],
      memo: d.memo,
      created_at: now,
      updated_at: now,
    };
    setList((prev) => [claim, ...prev]);
    setCreateOpen(false);
    toast({
      title: "経費を申請しました",
      description: `${claim.id} ・ ${claim.subject}`,
      variant: "success",
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> 新規経費申請
        </Button>
      </div>

      <ExpenseFilterBar
        filter={filter}
        onChange={setFilter}
        resultCount={filtered.length}
        total={list.length}
      />

      <ExpenseTable
        data={filtered}
        onRowClick={(c) => {
          setSelectedId(c.id);
          setDetailOpen(true);
        }}
        onStatusChange={handleStatusChange}
        onPayStateChange={handlePayStateChange}
      />

      <ExpenseDetailDrawer
        claim={selected}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
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

      <ExpenseCreateDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </>
  );
}
