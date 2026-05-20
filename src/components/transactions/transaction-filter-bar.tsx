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
import { USERS } from "@/lib/transactions-data";
import {
  TRANSACTION_KINDS,
  TRANSACTION_KIND_LABEL,
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_LABEL,
  type TransactionFilter,
} from "@/lib/types/transaction";

export function TransactionFilterBar({
  filter,
  onChange,
  resultCount,
  total,
}: {
  filter: TransactionFilter;
  onChange: (next: TransactionFilter) => void;
  resultCount: number;
  total: number;
}) {
  const set = (patch: Partial<TransactionFilter>) =>
    onChange({ ...filter, ...patch });

  const active =
    filter.query !== "" ||
    filter.kind !== "all" ||
    filter.status !== "all" ||
    filter.assignee_id !== "all";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filter.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="取引名・取引先・取引番号で検索"
          className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Select
        value={filter.kind}
        onValueChange={(v) =>
          set({ kind: v as TransactionFilter["kind"] })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="取引区分" />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          <SelectItem value="all">すべての区分</SelectItem>
          {TRANSACTION_KINDS.map((k) => (
            <SelectItem key={k} value={k}>
              {TRANSACTION_KIND_LABEL[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.status}
        onValueChange={(v) =>
          set({ status: v as TransactionFilter["status"] })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての状態</SelectItem>
          {TRANSACTION_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {TRANSACTION_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.assignee_id}
        onValueChange={(v) => set({ assignee_id: v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="担当者" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての担当</SelectItem>
          {USERS.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {active && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              query: "",
              kind: "all",
              status: "all",
              assignee_id: "all",
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
