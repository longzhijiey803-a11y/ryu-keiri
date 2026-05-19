"use client";

import { Search, X } from "lucide-react";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  DOCUMENT_STATUSES,
  DOCUMENT_STATUS_LABEL,
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABEL,
  type DocumentFilter,
} from "@/lib/types/document";

/**
 * 電子帳簿保存法を意識した検索（日付・金額・取引先＋種別・登録番号）。
 */
export function DocumentFilterBar({
  filter,
  onChange,
  resultCount,
  total,
}: {
  filter: DocumentFilter;
  onChange: (next: DocumentFilter) => void;
  resultCount: number;
  total: number;
}) {
  const set = (patch: Partial<DocumentFilter>) =>
    onChange({ ...filter, ...patch });
  const active =
    filter.query !== "" ||
    filter.doc_type !== "all" ||
    filter.status !== "all" ||
    filter.date_from !== "" ||
    filter.date_to !== "" ||
    filter.amount_min !== "" ||
    filter.amount_max !== "" ||
    filter.unlinked_only;

  const num =
    "h-input w-[110px] rounded-md border border-border bg-background px-2 text-right tabular text-sm text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring";
  const date =
    "h-input rounded-md border border-border bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="mb-4 space-y-2 rounded-lg border border-border bg-surface p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filter.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="ファイル名・取引先・登録番号で検索"
            className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Select
          value={filter.doc_type}
          onValueChange={(v) =>
            set({ doc_type: v as DocumentFilter["doc_type"] })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="種別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての種別</SelectItem>
            {DOCUMENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {DOCUMENT_TYPE_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.status}
          onValueChange={(v) =>
            set({ status: v as DocumentFilter["status"] })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての状態</SelectItem>
            {DOCUMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {DOCUMENT_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="inline-flex h-input cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground">
          <input
            type="checkbox"
            className="size-4 accent-danger"
            checked={filter.unlinked_only}
            onChange={(e) => set({ unlinked_only: e.target.checked })}
          />
          未紐づけのみ
        </label>

        {active && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                query: "",
                doc_type: "all",
                status: "all",
                date_from: "",
                date_to: "",
                amount_min: "",
                amount_max: "",
                unlinked_only: false,
              })
            }
          >
            <X /> クリア
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>取引日</span>
        <input
          type="date"
          value={filter.date_from}
          onChange={(e) => set({ date_from: e.target.value })}
          className={date}
        />
        <span>〜</span>
        <input
          type="date"
          value={filter.date_to}
          onChange={(e) => set({ date_to: e.target.value })}
          className={date}
        />
        <span className="ml-3">金額</span>
        <input
          inputMode="numeric"
          placeholder="下限"
          value={filter.amount_min}
          onChange={(e) => set({ amount_min: e.target.value })}
          className={num}
        />
        <span>〜</span>
        <input
          inputMode="numeric"
          placeholder="上限"
          value={filter.amount_max}
          onChange={(e) => set({ amount_max: e.target.value })}
          className={num}
        />
        <span className="ml-auto whitespace-nowrap">
          {resultCount} / {total} 件
        </span>
      </div>
    </div>
  );
}
