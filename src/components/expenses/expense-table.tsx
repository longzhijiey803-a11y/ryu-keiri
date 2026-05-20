"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Paperclip, Search } from "lucide-react";

import {
  Avatar,
  DataTable,
  DueCell,
  EditableStatus,
  EmptyState,
} from "@/components/ui";
import { formatISODate, formatJPY } from "@/lib/utils";
import { TODAY } from "@/lib/types/invoice";
import {
  EXPENSE_PAY_STATES,
  EXPENSE_STATUSES,
  claimIssues,
  type ExpenseClaim,
  type ExpensePayState,
  type ExpenseStatus,
} from "@/lib/types/expense";
import {
  ExpensePayStateBadge,
  ExpenseStatusBadge,
} from "./expense-badges";

function buildColumns(
  onStatusChange: (id: string, s: ExpenseStatus) => void,
  onPayStateChange: (id: string, s: ExpensePayState) => void,
): ColumnDef<ExpenseClaim, unknown>[] {
  return [
    {
      id: "id",
      header: "申請番号",
      accessorFn: (c) => c.id,
      cell: ({ row }) => {
        const issues = claimIssues(row.original);
        return (
          <span className="inline-flex items-center gap-1.5 tabular font-medium text-foreground">
            {row.original.id}
            {issues.length > 0 && (
              <AlertTriangle
                className="size-3.5 text-danger"
                aria-label="不備あり"
              />
            )}
          </span>
        );
      },
    },
    {
      id: "applicant",
      header: "申請者",
      accessorFn: (c) => c.applicant.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={row.original.applicant.name} size="sm" />
          <span className="text-foreground">
            {row.original.applicant.name}
          </span>
        </div>
      ),
    },
    {
      id: "subject",
      header: "件名",
      accessorFn: (c) => c.subject,
      cell: ({ row }) => (
        <span className="block max-w-[220px] truncate text-foreground">
          {row.original.subject}
        </span>
      ),
    },
    {
      id: "total",
      header: "合計金額",
      accessorFn: (c) => c.total,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="font-medium">{formatJPY(row.original.total)}</span>
      ),
    },
    {
      id: "claim_date",
      header: "申請日",
      accessorFn: (c) => c.claim_date,
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-muted-foreground">
          {formatISODate(row.original.claim_date)}
        </span>
      ),
    },
    {
      id: "approval_due_date",
      header: "承認期限",
      accessorFn: (c) => c.approval_due_date,
      cell: ({ row }) => {
        const c = row.original;
        const done =
          c.status === "approved" ||
          c.status === "scheduled" ||
          c.status === "settled" ||
          c.status === "rejected";
        return (
          <DueCell
            due={c.approval_due_date}
            today={TODAY}
            done={done}
            doneLabel="承認済"
          />
        );
      },
    },
    {
      id: "settlement_due_date",
      header: "精算期限",
      accessorFn: (c) => c.settlement_due_date,
      cell: ({ row }) => {
        const c = row.original;
        const done = c.pay_state === "settled";
        return (
          <DueCell
            due={c.settlement_due_date}
            today={TODAY}
            done={done}
            doneLabel="精算済"
          />
        );
      },
    },
    {
      id: "status",
      header: "承認状態",
      accessorFn: (c) => c.status,
      cell: ({ row }) => (
        <EditableStatus<ExpenseStatus>
          title="承認状態を変更"
          current={row.original.status}
          onChange={(v) => onStatusChange(row.original.id, v)}
          options={EXPENSE_STATUSES.map((s) => ({
            value: s,
            render: <ExpenseStatusBadge status={s} />,
          }))}
        />
      ),
    },
    {
      id: "pay_state",
      header: "支払状態",
      accessorFn: (c) => c.pay_state,
      cell: ({ row }) => (
        <EditableStatus<ExpensePayState>
          title="支払状態を変更"
          current={row.original.pay_state}
          onChange={(v) => onPayStateChange(row.original.id, v)}
          options={EXPENSE_PAY_STATES.map((s) => ({
            value: s,
            render: <ExpensePayStateBadge state={s} />,
          }))}
        />
      ),
    },
    {
      id: "receipts",
      header: "領収書",
      accessorFn: (c) => c.receipts.length,
      cell: ({ row }) =>
        row.original.receipts.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Paperclip className="size-3.5" />
            {row.original.receipts.length}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-danger">
            <AlertTriangle className="size-3.5" />
            なし
          </span>
        ),
    },
    {
      id: "department",
      header: "部門",
      accessorFn: (c) => c.department,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {row.original.department}
        </span>
      ),
    },
    {
      id: "updated_at",
      header: "最終更新",
      accessorFn: (c) => c.updated_at,
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-muted-foreground">
          {formatISODate(row.original.updated_at)}
        </span>
      ),
    },
  ];
}

export function ExpenseTable({
  data,
  onRowClick,
  onStatusChange,
  onPayStateChange,
}: {
  data: ExpenseClaim[];
  onRowClick: (c: ExpenseClaim) => void;
  onStatusChange: (id: string, status: ExpenseStatus) => void;
  onPayStateChange: (id: string, state: ExpensePayState) => void;
}) {
  const columns = React.useMemo(
    () => buildColumns(onStatusChange, onPayStateChange),
    [onStatusChange, onPayStateChange],
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(c) => c.id}
      onRowClick={onRowClick}
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する申請がありません"
          description="フィルタ条件を変更するか、新規申請を作成してください。"
        />
      }
    />
  );
}
