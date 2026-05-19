"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Paperclip, Search } from "lucide-react";

import {
  Avatar,
  DataTable,
  EditableStatus,
  EmptyState,
} from "@/components/ui";
import { cn, formatISODate, formatJPY } from "@/lib/utils";
import {
  ISSUED_STATUSES,
  PAYMENT_STATES,
  RECEIVED_STATUSES,
  isOverdue,
  type Invoice,
  type InvoiceDirection,
  type InvoiceStatus,
  type PaymentState,
} from "@/lib/types/invoice";
import {
  InvoiceStatusBadge,
  OverdueBadge,
  PaymentStateBadge,
} from "./invoice-badges";

function DueCell({ inv }: { inv: Invoice }) {
  const od = isOverdue(inv);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap tabular",
        od ? "font-medium text-danger" : "text-muted-foreground",
      )}
    >
      {formatISODate(inv.due_date)}
      {od && <OverdueBadge />}
    </span>
  );
}

const subjectCol: ColumnDef<Invoice, unknown> = {
  id: "subject",
  header: "件名",
  accessorFn: (i) => i.subject,
  cell: ({ row }) => (
    <span className="block max-w-[220px] truncate text-foreground">
      {row.original.subject}
    </span>
  ),
};
const amountCol: ColumnDef<Invoice, unknown> = {
  id: "total",
  header: "請求金額",
  accessorFn: (i) => i.total,
  meta: { align: "right" },
  cell: ({ row }) => (
    <span className="font-medium">{formatJPY(row.original.total)}</span>
  ),
};
const taxCol: ColumnDef<Invoice, unknown> = {
  id: "tax",
  header: "消費税",
  accessorFn: (i) => i.tax,
  meta: { align: "right" },
  cell: ({ row }) => (
    <span className="text-muted-foreground">
      {formatJPY(row.original.tax)}
    </span>
  ),
};
const assigneeCol: ColumnDef<Invoice, unknown> = {
  id: "assignee",
  header: "担当者",
  accessorFn: (i) => i.assignee.name,
  cell: ({ row }) => (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Avatar name={row.original.assignee.name} size="sm" />
      <span className="text-foreground">{row.original.assignee.name}</span>
    </div>
  ),
};

function statusCol(
  direction: InvoiceDirection,
  onChange: (id: string, s: InvoiceStatus) => void,
): ColumnDef<Invoice, unknown> {
  const statuses =
    direction === "issued" ? ISSUED_STATUSES : RECEIVED_STATUSES;
  return {
    id: "status",
    header: direction === "issued" ? "ステータス" : "承認状態",
    accessorFn: (i) => i.status,
    cell: ({ row }) => (
      <EditableStatus<InvoiceStatus>
        title={direction === "issued" ? "ステータスを変更" : "承認状態を変更"}
        current={row.original.status}
        onChange={(v) => onChange(row.original.id, v)}
        options={(statuses as readonly InvoiceStatus[]).map((s) => ({
          value: s,
          render: <InvoiceStatusBadge direction={direction} status={s} />,
        }))}
      />
    ),
  };
}

function payStateCol(
  direction: InvoiceDirection,
  onChange: (id: string, s: PaymentState) => void,
): ColumnDef<Invoice, unknown> {
  return {
    id: "payment_state",
    header: direction === "issued" ? "入金状態" : "支払状態",
    accessorFn: (i) => i.payment_state,
    cell: ({ row }) => (
      <EditableStatus<PaymentState>
        title={direction === "issued" ? "入金状態を変更" : "支払状態を変更"}
        current={row.original.payment_state}
        onChange={(v) => onChange(row.original.id, v)}
        options={PAYMENT_STATES.map((s) => ({
          value: s,
          render: <PaymentStateBadge state={s} />,
        }))}
      />
    ),
  };
}

function columnsFor(
  direction: InvoiceDirection,
  onStatusChange: (id: string, s: InvoiceStatus) => void,
  onPaymentStateChange: (id: string, s: PaymentState) => void,
): ColumnDef<Invoice, unknown>[] {
  if (direction === "issued") {
    return [
      {
        id: "number",
        header: "請求書番号",
        accessorFn: (i) => i.number,
        cell: ({ row }) => (
          <span className="tabular whitespace-nowrap font-medium text-foreground">
            {row.original.number}
          </span>
        ),
      },
      {
        id: "partner",
        header: "請求先",
        accessorFn: (i) => i.partner.name,
        cell: ({ row }) => (
          <span className="block max-w-[180px] truncate text-foreground">
            {row.original.partner.name}
          </span>
        ),
      },
      subjectCol,
      amountCol,
      taxCol,
      {
        id: "issue_date",
        header: "発行日",
        accessorFn: (i) => i.issue_date ?? "",
        cell: ({ row }) => (
          <span className="tabular whitespace-nowrap text-muted-foreground">
            {row.original.issue_date
              ? formatISODate(row.original.issue_date)
              : "—"}
          </span>
        ),
      },
      {
        id: "due_date",
        header: "支払期限",
        accessorFn: (i) => i.due_date,
        cell: ({ row }) => <DueCell inv={row.original} />,
      },
      statusCol("issued", onStatusChange),
      payStateCol("issued", onPaymentStateChange),
      assigneeCol,
    ];
  }
  return [
    {
      id: "receipt_date",
      header: "受領日",
      accessorFn: (i) => i.receipt_date ?? "",
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-muted-foreground">
          {row.original.receipt_date
            ? formatISODate(row.original.receipt_date)
            : "—"}
        </span>
      ),
    },
    {
      id: "partner",
      header: "請求元",
      accessorFn: (i) => i.partner.name,
      cell: ({ row }) => (
        <span className="block max-w-[180px] truncate text-foreground">
          {row.original.partner.name}
        </span>
      ),
    },
    subjectCol,
    amountCol,
    taxCol,
    {
      id: "due_date",
      header: "支払期限",
      accessorFn: (i) => i.due_date,
      cell: ({ row }) => <DueCell inv={row.original} />,
    },
    statusCol("received", onStatusChange),
    payStateCol("received", onPaymentStateChange),
    {
      id: "attachments",
      header: "証憑",
      accessorFn: (i) => i.attachments.length,
      cell: ({ row }) =>
        row.original.attachments.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Paperclip className="size-3.5" />
            {row.original.attachments.length}
          </span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        ),
    },
    assigneeCol,
  ];
}

export function InvoiceTable({
  direction,
  data,
  onRowClick,
  onStatusChange,
  onPaymentStateChange,
}: {
  direction: InvoiceDirection;
  data: Invoice[];
  onRowClick: (i: Invoice) => void;
  onStatusChange: (id: string, status: InvoiceStatus) => void;
  onPaymentStateChange: (id: string, state: PaymentState) => void;
}) {
  const columns = React.useMemo(
    () => columnsFor(direction, onStatusChange, onPaymentStateChange),
    [direction, onStatusChange, onPaymentStateChange],
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(i) => i.id}
      onRowClick={onRowClick}
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する請求書がありません"
          description="フィルタ条件を変更してください。"
        />
      }
    />
  );
}
