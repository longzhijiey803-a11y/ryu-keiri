"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { FileText, Image as ImageIcon, Link2, Search } from "lucide-react";

import {
  Avatar,
  DataTable,
  EditableStatus,
  EmptyState,
} from "@/components/ui";
import { formatISODate, formatJPY } from "@/lib/utils";
import {
  DOCUMENT_STATUSES,
  type Document,
  type DocumentStatus,
} from "@/lib/types/document";
import { DocumentStatusBadge, DocumentTypeBadge } from "./document-badges";

function buildColumns(
  onStatusChange: (id: string, s: DocumentStatus) => void,
): ColumnDef<Document, unknown>[] {
  return [
  {
    id: "file_name",
    header: "ファイル名",
    accessorFn: (d) => d.file_name,
    cell: ({ row }) => {
      const isImg = row.original.mime_type.startsWith("image/");
      return (
        <div className="flex items-center gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            {isImg ? (
              <ImageIcon className="size-3.5" />
            ) : (
              <FileText className="size-3.5" />
            )}
          </span>
          <span className="block max-w-[200px] truncate font-medium text-foreground">
            {row.original.file_name}
          </span>
        </div>
      );
    },
  },
  {
    id: "doc_type",
    header: "種別",
    accessorFn: (d) => d.doc_type,
    cell: ({ row }) => <DocumentTypeBadge type={row.original.doc_type} />,
  },
  {
    id: "partner_name",
    header: "取引先",
    accessorFn: (d) => d.partner_name ?? "",
    cell: ({ row }) => (
      <span className="block max-w-[160px] truncate text-foreground">
        {row.original.partner_name ?? "—"}
      </span>
    ),
  },
  {
    id: "amount",
    header: "金額",
    accessorFn: (d) => d.amount ?? -1,
    meta: { align: "right" },
    cell: ({ row }) =>
      row.original.amount != null ? (
        <span className="font-medium">
          {formatJPY(row.original.amount)}
        </span>
      ) : (
        <span className="text-muted-foreground/50">—</span>
      ),
  },
  {
    id: "transaction_date",
    header: "取引日",
    accessorFn: (d) => d.transaction_date ?? "",
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">
        {row.original.transaction_date
          ? formatISODate(row.original.transaction_date)
          : "—"}
      </span>
    ),
  },
  {
    id: "uploaded_at",
    header: "アップロード日",
    accessorFn: (d) => d.uploaded_at,
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">
        {formatISODate(row.original.uploaded_at)}
      </span>
    ),
  },
  {
    id: "related_transaction_id",
    header: "関連取引",
    accessorFn: (d) => d.related_transaction_id ?? "",
    cell: ({ row }) =>
      row.original.related_transaction_id ? (
        <span className="inline-flex items-center gap-1 tabular text-muted-foreground">
          <Link2 className="size-3.5" />
          {row.original.related_transaction_id}
        </span>
      ) : (
        <span className="text-muted-foreground/50">—</span>
      ),
  },
  {
    id: "related_journal_id",
    header: "関連仕訳",
    accessorFn: (d) => d.related_journal_id ?? "",
    cell: ({ row }) =>
      row.original.related_journal_id ? (
        <span className="inline-flex items-center gap-1 tabular text-muted-foreground">
          <Link2 className="size-3.5" />
          {row.original.related_journal_id}
        </span>
      ) : (
        <span className="text-muted-foreground/50">—</span>
      ),
  },
  {
    id: "status",
    header: "ステータス",
    accessorFn: (d) => d.status,
    cell: ({ row }) => (
      <EditableStatus<DocumentStatus>
        title="ステータスを変更"
        current={row.original.status}
        onChange={(v) => onStatusChange(row.original.id, v)}
        options={DOCUMENT_STATUSES.map((s) => ({
          value: s,
          render: <DocumentStatusBadge status={s} />,
        }))}
      />
    ),
  },
  {
    id: "uploaded_by",
    header: "登録者",
    accessorFn: (d) => d.uploaded_by.name,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Avatar name={row.original.uploaded_by.name} size="sm" />
        <span className="text-foreground">
          {row.original.uploaded_by.name}
        </span>
      </div>
    ),
  },
  ];
}

export function DocumentTable({
  data,
  onRowClick,
  onStatusChange,
}: {
  data: Document[];
  onRowClick: (d: Document) => void;
  onStatusChange: (id: string, status: DocumentStatus) => void;
}) {
  const columns = React.useMemo(
    () => buildColumns(onStatusChange),
    [onStatusChange],
  );
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(d) => d.id}
      onRowClick={onRowClick}
      emptyState={
        <EmptyState
          icon={Search}
          title="該当する証憑がありません"
          description="検索条件を変更するか、証憑をアップロードしてください。"
        />
      }
    />
  );
}
