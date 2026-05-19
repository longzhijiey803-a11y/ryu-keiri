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
  ISSUED_STATUSES,
  ISSUED_STATUS_LABEL,
  PAYMENT_STATES,
  PAYMENT_STATE_LABEL,
  RECEIVED_STATUSES,
  RECEIVED_STATUS_LABEL,
  type InvoiceDirection,
  type InvoiceFilter,
} from "@/lib/types/invoice";

export function InvoiceFilterBar({
  direction,
  filter,
  onChange,
  resultCount,
  total,
}: {
  direction: InvoiceDirection;
  filter: InvoiceFilter;
  onChange: (next: InvoiceFilter) => void;
  resultCount: number;
  total: number;
}) {
  const set = (patch: Partial<InvoiceFilter>) =>
    onChange({ ...filter, ...patch });
  const active =
    filter.query !== "" ||
    filter.status !== "all" ||
    filter.payment_state !== "all" ||
    filter.overdue_only;

  const statuses =
    direction === "issued" ? ISSUED_STATUSES : RECEIVED_STATUSES;
  const statusLabel = (s: string) =>
    direction === "issued"
      ? ISSUED_STATUS_LABEL[s as keyof typeof ISSUED_STATUS_LABEL]
      : RECEIVED_STATUS_LABEL[s as keyof typeof RECEIVED_STATUS_LABEL];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filter.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="番号・件名・取引先で検索"
          className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Select
        value={filter.status}
        onValueChange={(v) =>
          set({ status: v as InvoiceFilter["status"] })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての状態</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {statusLabel(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.payment_state}
        onValueChange={(v) =>
          set({ payment_state: v as InvoiceFilter["payment_state"] })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="入金/支払" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">入金/支払 すべて</SelectItem>
          {PAYMENT_STATES.map((s) => (
            <SelectItem key={s} value={s}>
              {PAYMENT_STATE_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="inline-flex h-input cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 accent-danger"
          checked={filter.overdue_only}
          onChange={(e) => set({ overdue_only: e.target.checked })}
        />
        期限超過のみ
      </label>

      {active && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({
              query: "",
              status: "all",
              payment_state: "all",
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
