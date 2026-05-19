"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui";
import type { ARAPFilter } from "@/lib/types/ar-ap";

export function ArApFilterBar({
  filter,
  onChange,
  resultCount,
  total,
  overdueLabel,
}: {
  filter: ARAPFilter;
  onChange: (next: ARAPFilter) => void;
  resultCount: number;
  total: number;
  overdueLabel: string;
}) {
  const set = (patch: Partial<ARAPFilter>) =>
    onChange({ ...filter, ...patch });
  const active =
    filter.query !== "" || filter.only_outstanding || filter.overdue_only;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filter.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="請求書番号・取引先で検索"
          className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <label className="inline-flex h-input cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={filter.only_outstanding}
          onChange={(e) => set({ only_outstanding: e.target.checked })}
        />
        残あり のみ
      </label>

      <label className="inline-flex h-input cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 accent-danger"
          checked={filter.overdue_only}
          onChange={(e) => set({ overdue_only: e.target.checked })}
        />
        {overdueLabel}
      </label>

      {active && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              query: "",
              only_outstanding: false,
              overdue_only: false,
            })
          }
        >
          <X /> クリア
        </Button>
      )}

      <span className="ml-auto whitespace-nowrap text-sm text-muted-foreground">
        {resultCount} / {total} 件
      </span>
    </div>
  );
}
