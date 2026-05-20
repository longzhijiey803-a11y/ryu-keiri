"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Paperclip, Search } from "lucide-react";

import {
  Avatar,
  Button,
  DataTable,
  EditableStatus,
  EmptyState,
} from "@/components/ui";
import { formatISODate, formatJPY } from "@/lib/utils";
import { ACCOUNTS, lineSummary, primaryValue } from "@/lib/journal-data";
import {
  JOURNAL_ENTRY_STATUSES,
  type JournalEntry,
  type JournalEntryStatus,
  type JournalSide,
} from "@/lib/types/journal";
import { TAX_CATEGORY_LABEL } from "@/lib/types/transaction";
import { JournalStatusBadge } from "./journal-badges";
import { AccountPicker } from "./account-picker";

/**
 * 借方/貸方 の代表行（先頭行）を「AIピッカー」で表示する。
 * - AI推測フラグの付いた明細は「AI推測: 〜」+ 斜体 + 下点線
 * - クリックで勘定科目セレクトを開いて修正できる
 */
function AccountCell({
  entry,
  side,
  onAccountChange,
}: {
  entry: JournalEntry;
  side: JournalSide;
  onAccountChange: (entryId: string, lineId: string, code: string) => void;
}) {
  const lines = entry.lines.filter((l) => l.side === side);
  const head = lines[0];
  if (!head) {
    return <span className="text-muted-foreground/50">—</span>;
  }
  return (
    <AccountPicker
      current={head.account_name}
      accounts={ACCOUNTS}
      aiPredicted={!!head.ai_predicted}
      extraCount={lines.length - 1}
      onChange={(code) => onAccountChange(entry.id, head.id, code)}
    />
  );
}

function buildColumns(
  onStatusChange: (id: string, s: JournalEntryStatus) => void,
  onAccountChange: (entryId: string, lineId: string, code: string) => void,
  onConfirm: (entryId: string) => void,
): ColumnDef<JournalEntry, unknown>[] {
  return [
  {
    id: "entry_date",
    header: "仕訳日",
    accessorFn: (e) => e.entry_date,
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">
        {formatISODate(row.original.entry_date)}
      </span>
    ),
  },
  {
    id: "id",
    header: "仕訳番号",
    accessorFn: (e) => e.id,
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap font-medium text-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "description",
    header: "摘要",
    accessorFn: (e) => e.description,
    cell: ({ row }) => (
      <span className="block max-w-[240px] truncate text-foreground">
        {row.original.description}
      </span>
    ),
  },
  {
    id: "debit_account",
    header: "借方勘定科目",
    accessorFn: (e) => lineSummary(e.lines, "debit").label,
    cell: ({ row }) => (
      <AccountCell
        entry={row.original}
        side="debit"
        onAccountChange={onAccountChange}
      />
    ),
  },
  {
    id: "debit_total",
    header: "借方金額",
    accessorFn: (e) => e.debit_total,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-medium">{formatJPY(row.original.debit_total)}</span>
    ),
  },
  {
    id: "credit_account",
    header: "貸方勘定科目",
    accessorFn: (e) => lineSummary(e.lines, "credit").label,
    cell: ({ row }) => (
      <AccountCell
        entry={row.original}
        side="credit"
        onAccountChange={onAccountChange}
      />
    ),
  },
  {
    id: "credit_total",
    header: "貸方金額",
    accessorFn: (e) => e.credit_total,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-medium">
        {formatJPY(row.original.credit_total)}
      </span>
    ),
  },
  {
    id: "tax",
    header: "税区分",
    accessorFn: (e) => e.lines[0]?.tax_category ?? "",
    cell: ({ row }) => {
      const cats = Array.from(
        new Set(row.original.lines.map((l) => l.tax_category)),
      );
      return (
        <span className="whitespace-nowrap text-muted-foreground">
          {cats.length === 1
            ? TAX_CATEGORY_LABEL[cats[0]]
            : `複数（${cats.length}）`}
        </span>
      );
    },
  },
  {
    id: "department",
    header: "部門",
    accessorFn: (e) => primaryValue(e.lines, "department"),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {primaryValue(row.original.lines, "department")}
      </span>
    ),
  },
  {
    id: "project",
    header: "プロジェクト",
    accessorFn: (e) => primaryValue(e.lines, "project"),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {primaryValue(row.original.lines, "project")}
      </span>
    ),
  },
  {
    id: "attachments",
    header: "証憑",
    accessorFn: (e) => e.attachments.length,
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
    id: "status",
    header: "ステータス",
    accessorFn: (e) => e.status,
    cell: ({ row }) => (
      <EditableStatus<JournalEntryStatus>
        title="ステータスを変更"
        current={row.original.status}
        onChange={(v) => onStatusChange(row.original.id, v)}
        options={JOURNAL_ENTRY_STATUSES.map((s) => ({
          value: s,
          render: <JournalStatusBadge status={s} />,
        }))}
      />
    ),
  },
  {
    id: "created_by",
    header: "作成者",
    accessorFn: (e) => e.created_by.name,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Avatar name={row.original.created_by.name} size="sm" />
        <span className="text-foreground">
          {row.original.created_by.name}
        </span>
      </div>
    ),
  },
  {
    id: "updated_at",
    header: "最終更新",
    accessorFn: (e) => e.updated_at,
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">
        {formatISODate(row.original.updated_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    meta: { align: "right" },
    cell: ({ row }) =>
      row.original.status === "ai_predicted" ? (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onConfirm(row.original.id)}
            title="この AI 推測仕訳を確定する"
          >
            <Check /> 確定
          </Button>
        </div>
      ) : null,
  },
  ];
}

export function JournalTable({
  data,
  onRowClick,
  onStatusChange,
  onAccountChange,
  onConfirm,
}: {
  data: JournalEntry[];
  onRowClick: (e: JournalEntry) => void;
  onStatusChange: (id: string, status: JournalEntryStatus) => void;
  onAccountChange: (entryId: string, lineId: string, code: string) => void;
  onConfirm: (entryId: string) => void;
}) {
  const columns = React.useMemo(
    () => buildColumns(onStatusChange, onAccountChange, onConfirm),
    [onStatusChange, onAccountChange, onConfirm],
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(e) => e.id}
      onRowClick={onRowClick}
      rowClassName={(e) =>
        e.status === "ai_predicted"
          ? "bg-amber-50 hover:bg-amber-100/70"
          : undefined
      }
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する仕訳がありません"
          description="フィルタ条件を変えるか、新規仕訳を作成してください。"
        />
      }
    />
  );
}
