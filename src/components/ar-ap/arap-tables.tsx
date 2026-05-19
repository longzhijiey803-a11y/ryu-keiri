"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { DataTable, EditableStatus, EmptyState } from "@/components/ui";
import { formatISODate, formatJPY } from "@/lib/utils";
import type { PayableRow, ReceivableRow } from "@/lib/types/ar-ap";
import {
  ISSUED_STATUSES,
  PAYMENT_STATES,
  RECEIVED_STATUSES,
  type IssuedStatus,
  type PaymentState,
  type ReceivedStatus,
} from "@/lib/types/invoice";
import {
  InvoiceStatusBadge,
  PaymentStateBadge,
} from "@/components/invoices/invoice-badges";
import { DueBadge, OverdueBadge } from "./arap-badges";

function arColumns(
  onStatusChange: (id: string, s: IssuedStatus) => void,
): ColumnDef<ReceivableRow, unknown>[] {
  return [
    {
      id: "partner",
      header: "請求先",
      accessorFn: (r) => r.partner_name,
      cell: ({ row }) => (
        <span className="block max-w-[180px] truncate font-medium text-foreground">
          {row.original.partner_name}
        </span>
      ),
    },
    {
      id: "number",
      header: "請求書番号",
      accessorFn: (r) => r.number,
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-foreground">
          {row.original.number}
        </span>
      ),
    },
    {
      id: "total",
      header: "請求金額",
      accessorFn: (r) => r.total,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="font-medium">{formatJPY(row.original.total)}</span>
      ),
    },
    {
      id: "paid",
      header: "入金済額",
      accessorFn: (r) => r.paid,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatJPY(row.original.paid)}
        </span>
      ),
    },
    {
      id: "outstanding",
      header: "未回収額",
      accessorFn: (r) => r.outstanding,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span
          className={
            row.original.outstanding > 0
              ? "font-medium text-danger"
              : "text-muted-foreground"
          }
        >
          {formatJPY(row.original.outstanding)}
        </span>
      ),
    },
    {
      id: "due_date",
      header: "支払期限",
      accessorFn: (r) => r.due_date,
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-muted-foreground">
          {formatISODate(row.original.due_date)}
        </span>
      ),
    },
    {
      id: "overdue",
      header: "遅延日数",
      accessorFn: (r) => r.overdue_days,
      cell: ({ row }) => <OverdueBadge days={row.original.overdue_days} />,
    },
    {
      id: "status",
      header: "ステータス",
      accessorFn: (r) => r.status,
      cell: ({ row }) => (
        <EditableStatus<IssuedStatus>
          title="ステータスを変更"
          current={row.original.status}
          onChange={(v) => onStatusChange(row.original.id, v)}
          options={ISSUED_STATUSES.map((s) => ({
            value: s,
            render: <InvoiceStatusBadge direction="issued" status={s} />,
          }))}
        />
      ),
    },
    {
      id: "assignee",
      header: "担当者",
      accessorFn: (r) => r.assignee_name,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {row.original.assignee_name}
        </span>
      ),
    },
  ];
}

function apColumns(
  onPayStateChange: (id: string, s: PaymentState) => void,
  onApprovalChange: (id: string, s: ReceivedStatus) => void,
): ColumnDef<PayableRow, unknown>[] {
  return [
    {
      id: "partner",
      header: "支払先",
      accessorFn: (r) => r.partner_name,
      cell: ({ row }) => (
        <span className="block max-w-[180px] truncate font-medium text-foreground">
          {row.original.partner_name}
        </span>
      ),
    },
    {
      id: "number",
      header: "請求書番号",
      accessorFn: (r) => r.number,
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-foreground">
          {row.original.number}
        </span>
      ),
    },
    {
      id: "total",
      header: "請求金額",
      accessorFn: (r) => r.total,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="font-medium">{formatJPY(row.original.total)}</span>
      ),
    },
    {
      id: "paid",
      header: "支払済額",
      accessorFn: (r) => r.paid,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatJPY(row.original.paid)}
        </span>
      ),
    },
    {
      id: "outstanding",
      header: "未払額",
      accessorFn: (r) => r.outstanding,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span
          className={
            row.original.outstanding > 0
              ? "font-medium text-danger"
              : "text-muted-foreground"
          }
        >
          {formatJPY(row.original.outstanding)}
        </span>
      ),
    },
    {
      id: "due_date",
      header: "支払期限",
      accessorFn: (r) => r.due_date,
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className="tabular text-muted-foreground">
            {formatISODate(row.original.due_date)}
          </span>
          <DueBadge days={row.original.due_in_days} />
        </span>
      ),
    },
    {
      id: "payment_state",
      header: "ステータス",
      accessorFn: (r) => r.payment_state,
      cell: ({ row }) => (
        <EditableStatus<PaymentState>
          title="支払ステータスを変更"
          current={row.original.payment_state}
          onChange={(v) => onPayStateChange(row.original.id, v)}
          options={PAYMENT_STATES.map((s) => ({
            value: s,
            render: <PaymentStateBadge state={s} />,
          }))}
        />
      ),
    },
    {
      id: "approval_status",
      header: "承認状態",
      accessorFn: (r) => r.approval_status,
      cell: ({ row }) => (
        <EditableStatus<ReceivedStatus>
          title="承認状態を変更"
          current={row.original.approval_status}
          onChange={(v) => onApprovalChange(row.original.id, v)}
          options={RECEIVED_STATUSES.map((s) => ({
            value: s,
            render: <InvoiceStatusBadge direction="received" status={s} />,
          }))}
        />
      ),
    },
  ];
}

export function ReceivablesTable({
  data,
  onStatusChange,
}: {
  data: ReceivableRow[];
  onStatusChange: (id: string, status: IssuedStatus) => void;
}) {
  const columns = React.useMemo(
    () => arColumns(onStatusChange),
    [onStatusChange],
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する売掛がありません"
          description="フィルタ条件を変更してください。"
        />
      }
    />
  );
}

export function PayablesTable({
  data,
  onPayStateChange,
  onApprovalChange,
}: {
  data: PayableRow[];
  onPayStateChange: (id: string, state: PaymentState) => void;
  onApprovalChange: (id: string, status: ReceivedStatus) => void;
}) {
  const columns = React.useMemo(
    () => apColumns(onPayStateChange, onApprovalChange),
    [onPayStateChange, onApprovalChange],
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する買掛がありません"
          description="フィルタ条件を変更してください。"
        />
      }
    />
  );
}
