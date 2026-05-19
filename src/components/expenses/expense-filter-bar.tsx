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
import { DEPARTMENTS } from "@/lib/workflow-data";
import {
  EXPENSE_STATUSES,
  EXPENSE_STATUS_LABEL,
  type ExpenseFilter,
} from "@/lib/types/expense";

export function ExpenseFilterBar({
  filter,
  onChange,
  resultCount,
  total,
}: {
  filter: ExpenseFilter;
  onChange: (next: ExpenseFilter) => void;
  resultCount: number;
  total: number;
}) {
  const set = (patch: Partial<ExpenseFilter>) =>
    onChange({ ...filter, ...patch });
  const active =
    filter.query !== "" ||
    filter.status !== "all" ||
    filter.department !== "all";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filter.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="申請番号・件名・申請者で検索"
          className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Select
        value={filter.status}
        onValueChange={(v) =>
          set({ status: v as ExpenseFilter["status"] })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="承認状態" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての状態</SelectItem>
          {EXPENSE_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {EXPENSE_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.department}
        onValueChange={(v) => set({ department: v })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="部門" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての部門</SelectItem>
          {DEPARTMENTS.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {active && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({ query: "", status: "all", department: "all" })
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
