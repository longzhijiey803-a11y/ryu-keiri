"use client";

import * as React from "react";
import {
  type ColumnDef,
  type RowData,
  type SortingState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

// 列メタ: 右寄せ（金額など）を列定義側から指定可能にする
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "right" | "center";
    headerClassName?: string;
    cellClassName?: string;
  }
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  /** 空状態に表示する要素 */
  emptyState?: React.ReactNode;
  /** 行クリック（詳細ドロワーを開く想定 / §A-8） */
  onRowClick?: (row: TData) => void;
  /** 複数選択を有効化（一括操作の土台） */
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (state: RowSelectionState) => void;
  getRowId?: (row: TData, index: number) => string;
  /** テーブル上部のツールバー（検索/フィルタ/一括操作を差し込む） */
  toolbar?: React.ReactNode;
}

const alignClass = (a?: "left" | "right" | "center") =>
  a === "right" ? "text-right tabular" : a === "center" ? "text-center" : "text-left";

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  emptyState,
  onRowClick,
  enableRowSelection,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  toolbar,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalSelection, setInternalSelection] =
    React.useState<RowSelectionState>({});
  const selection = rowSelection ?? internalSelection;

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection: selection },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(selection) : updater;
      onRowSelectionChange?.(next);
      if (!rowSelection) setInternalSelection(next);
    },
    enableRowSelection,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const colCount = columns.length + (enableRowSelection ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      {toolbar ? (
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          {toolbar}
        </div>
      ) : null}

      <div className="overflow-auto scrollbar-thin">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted [&_th]:border-b [&_th]:border-border">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="h-table-head">
                {enableRowSelection && (
                  <th className="w-10 px-3">
                    <input
                      type="checkbox"
                      className="size-4 cursor-pointer accent-primary"
                      aria-label="すべて選択"
                      checked={table.getIsAllRowsSelected()}
                      ref={(el) => {
                        if (el)
                          el.indeterminate =
                            table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected();
                      }}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                  </th>
                )}
                {hg.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const sortable = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-3 font-medium text-muted-foreground",
                        alignClass(meta?.align),
                        meta?.headerClassName,
                      )}
                    >
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            "inline-flex items-center gap-1 hover:text-foreground",
                            meta?.align === "right" && "flex-row-reverse",
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="h-table-row border-t border-border">
                  {Array.from({ length: colCount }).map((__, j) => (
                    <td key={j} className="px-3">
                      <div className="h-3.5 w-full max-w-[160px] animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="p-0">
                  {emptyState ?? (
                    <div className="py-16 text-center text-sm text-muted-foreground">
                      データがありません
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={cn(
                    "h-table-row border-t border-border transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    row.getIsSelected() && "bg-primary/5",
                  )}
                >
                  {enableRowSelection && (
                    <td
                      className="w-10 px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="size-4 cursor-pointer accent-primary"
                        aria-label="行を選択"
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        onChange={row.getToggleSelectedHandler()}
                      />
                    </td>
                  )}
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-3 text-foreground",
                          alignClass(meta?.align),
                          meta?.cellClassName,
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
