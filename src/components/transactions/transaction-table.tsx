"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Paperclip, Search } from "lucide-react";

import {
  Avatar,
  Badge,
  DataTable,
  EditableStatus,
  EmptyState,
} from "@/components/ui";
import { formatISODate, formatJPY } from "@/lib/utils";
import {
  JOURNAL_STATUSES,
  JOURNAL_STATUS_LABEL,
  TRANSACTION_STATUSES,
  type JournalStatus,
  type Transaction,
  type TransactionStatus,
} from "@/lib/types/transaction";
import {
  TransactionKindBadge,
  TransactionStatusBadge,
} from "./transaction-badges";

function journalBadgeVariant(s: JournalStatus) {
  return s === "posted" ? "success" : s === "draft" ? "info" : "neutral";
}

function buildColumns(
  onStatusChange: (id: string, s: TransactionStatus) => void,
  onJournalStatusChange: (id: string, s: JournalStatus) => void,
): ColumnDef<Transaction, unknown>[] {
  return [
    {
      id: "name",
      header: "取引名",
      accessorFn: (t) => t.name,
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p className="truncate font-medium text-foreground">
            {row.original.name}
          </p>
          <p className="tabular text-xs text-muted-foreground">
            {row.original.id}
          </p>
        </div>
      ),
    },
    {
      id: "kind",
      header: "取引区分",
      accessorFn: (t) => t.kind,
      cell: ({ row }) => <TransactionKindBadge kind={row.original.kind} />,
    },
    {
      id: "partner",
      header: "取引先",
      accessorFn: (t) => t.partner.name,
      cell: ({ row }) => (
        <span className="block max-w-[200px] truncate text-foreground">
          {row.original.partner.name}
        </span>
      ),
    },
    {
      id: "amount",
      header: "金額",
      accessorFn: (t) => t.amount,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="font-medium">{formatJPY(row.original.amount)}</span>
      ),
    },
    {
      id: "status",
      header: "ステータス",
      accessorFn: (t) => t.status,
      cell: ({ row }) => (
        <EditableStatus<TransactionStatus>
          title="ステータスを変更"
          current={row.original.status}
          onChange={(v) => onStatusChange(row.original.id, v)}
          options={TRANSACTION_STATUSES.map((s) => ({
            value: s,
            render: <TransactionStatusBadge status={s} />,
          }))}
        />
      ),
    },
    {
      id: "transaction_date",
      header: "取引日",
      accessorFn: (t) => t.transaction_date,
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-muted-foreground">
          {formatISODate(row.original.transaction_date)}
        </span>
      ),
    },
    {
      id: "due_date",
      header: "支払/入金期日",
      accessorFn: (t) => t.due_date ?? "",
      cell: ({ row }) =>
        row.original.due_date ? (
          <span className="tabular whitespace-nowrap text-muted-foreground">
            {formatISODate(row.original.due_date)}
          </span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        ),
    },
    {
      id: "assignee",
      header: "担当者",
      accessorFn: (t) => t.assignee.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={row.original.assignee.name} size="sm" />
          <span className="text-foreground">
            {row.original.assignee.name}
          </span>
        </div>
      ),
    },
    {
      id: "attachments",
      header: "証憑",
      accessorFn: (t) => t.attachments.length,
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
    {
      id: "journal_status",
      header: "仕訳状態",
      accessorFn: (t) => t.journal_status,
      cell: ({ row }) => (
        <EditableStatus<JournalStatus>
          title="仕訳状態を変更"
          current={row.original.journal_status}
          onChange={(v) => onJournalStatusChange(row.original.id, v)}
          options={JOURNAL_STATUSES.map((s) => ({
            value: s,
            render: (
              <Badge variant={journalBadgeVariant(s)}>
                {JOURNAL_STATUS_LABEL[s]}
              </Badge>
            ),
          }))}
        />
      ),
    },
    {
      id: "updated_at",
      header: "最終更新",
      accessorFn: (t) => t.updated_at,
      cell: ({ row }) => (
        <span className="tabular whitespace-nowrap text-muted-foreground">
          {formatISODate(row.original.updated_at)}
        </span>
      ),
    },
  ];
}

export function TransactionTable({
  data,
  onRowClick,
  onStatusChange,
  onJournalStatusChange,
}: {
  data: Transaction[];
  onRowClick: (t: Transaction) => void;
  onStatusChange: (id: string, status: TransactionStatus) => void;
  onJournalStatusChange: (id: string, status: JournalStatus) => void;
}) {
  const columns = React.useMemo(
    () => buildColumns(onStatusChange, onJournalStatusChange),
    [onStatusChange, onJournalStatusChange],
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(t) => t.id}
      onRowClick={onRowClick}
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する取引がありません"
          description="フィルタ条件を変更するか、新規取引を作成してください。"
        />
      }
    />
  );
}
