"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownLeft, ArrowUpRight, Link2, Search } from "lucide-react";

import { DataTable, EmptyState } from "@/components/ui";
import { cn, formatISODate, formatJPY } from "@/lib/utils";
import type { BankTxn } from "@/lib/types/bank";
import { ReconStatusBadge } from "./cash-badges";

const columns: ColumnDef<BankTxn, unknown>[] = [
  {
    id: "txn_date",
    header: "取引日",
    accessorFn: (t) => t.txn_date,
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">
        {formatISODate(row.original.txn_date)}
      </span>
    ),
  },
  {
    id: "dir",
    header: "区分",
    accessorFn: (t) => t.dir,
    cell: ({ row }) =>
      row.original.dir === "in" ? (
        <span className="inline-flex items-center gap-1 text-success">
          <ArrowDownLeft className="size-3.5" /> 入金
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-danger">
          <ArrowUpRight className="size-3.5" /> 出金
        </span>
      ),
  },
  {
    id: "description",
    header: "摘要",
    accessorFn: (t) => t.description,
    cell: ({ row }) => (
      <span className="block max-w-[220px] truncate text-foreground">
        {row.original.description}
      </span>
    ),
  },
  {
    id: "partner_guess",
    header: "取引先推定",
    accessorFn: (t) => t.partner_guess ?? "",
    cell: ({ row }) => (
      <span className="block max-w-[160px] truncate text-muted-foreground">
        {row.original.partner_guess ?? "—"}
      </span>
    ),
  },
  {
    id: "deposit",
    header: "入金額",
    accessorFn: (t) => t.deposit,
    meta: { align: "right" },
    cell: ({ row }) =>
      row.original.deposit > 0 ? (
        <span className="font-medium text-success">
          {formatJPY(row.original.deposit)}
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },
  {
    id: "withdrawal",
    header: "出金額",
    accessorFn: (t) => t.withdrawal,
    meta: { align: "right" },
    cell: ({ row }) =>
      row.original.withdrawal > 0 ? (
        <span className="font-medium text-danger">
          {formatJPY(row.original.withdrawal)}
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },
  {
    id: "balance",
    header: "残高",
    accessorFn: (t) => t.balance,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="tabular text-muted-foreground">
        {formatJPY(row.original.balance)}
      </span>
    ),
  },
  {
    id: "recon_status",
    header: "消込状態",
    accessorFn: (t) => t.recon_status,
    cell: ({ row }) => (
      <ReconStatusBadge status={row.original.recon_status} />
    ),
  },
  {
    id: "related_invoice_id",
    header: "関連請求書",
    accessorFn: (t) => t.related_invoice_id ?? "",
    cell: ({ row }) =>
      row.original.related_invoice_id ? (
        <span className="inline-flex items-center gap-1 tabular text-muted-foreground">
          <Link2 className="size-3.5" />
          {row.original.related_invoice_id}
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },
  {
    id: "related_transaction_id",
    header: "関連取引",
    accessorFn: (t) => t.related_transaction_id ?? "",
    cell: ({ row }) =>
      row.original.related_transaction_id ? (
        <span className="inline-flex items-center gap-1 tabular text-muted-foreground">
          <Link2 className="size-3.5" />
          {row.original.related_transaction_id}
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },
  {
    id: "memo",
    header: "メモ",
    accessorFn: (t) => t.memo ?? "",
    cell: ({ row }) => (
      <span
        className={cn(
          "block max-w-[160px] truncate text-muted-foreground",
          !row.original.memo && "text-muted-foreground/40",
        )}
      >
        {row.original.memo ?? "—"}
      </span>
    ),
  },
];

export function BankTxnTable({
  data,
  onRowClick,
}: {
  data: BankTxn[];
  onRowClick?: (t: BankTxn) => void;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(t) => t.id}
      onRowClick={onRowClick}
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する明細がありません"
          description="フィルタ条件を変更するか、CSVを取り込んでください。"
        />
      }
    />
  );
}
