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
import { BANK_ACCOUNTS } from "@/lib/bank-data";
import {
  RECON_STATUSES,
  RECON_STATUS_LABEL,
  type BankTxnFilter,
} from "@/lib/types/bank";

export function BankTxnFilterBar({
  filter,
  onChange,
  resultCount,
  total,
}: {
  filter: BankTxnFilter;
  onChange: (next: BankTxnFilter) => void;
  resultCount: number;
  total: number;
}) {
  const set = (patch: Partial<BankTxnFilter>) =>
    onChange({ ...filter, ...patch });
  const active =
    filter.query !== "" ||
    filter.account_id !== "all" ||
    filter.recon_status !== "all" ||
    filter.dir !== "all";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filter.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="摘要・取引先推定で検索"
          className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Select
        value={filter.account_id}
        onValueChange={(v) => set({ account_id: v })}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="口座" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての口座</SelectItem>
          {BANK_ACCOUNTS.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filter.dir}
        onValueChange={(v) => set({ dir: v as BankTxnFilter["dir"] })}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="区分" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">入出金 すべて</SelectItem>
          <SelectItem value="in">入金</SelectItem>
          <SelectItem value="out">出金</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.recon_status}
        onValueChange={(v) =>
          set({ recon_status: v as BankTxnFilter["recon_status"] })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="消込状態" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">消込 すべて</SelectItem>
          {RECON_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {RECON_STATUS_LABEL[s]}
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
              account_id: "all",
              recon_status: "all",
              dir: "all",
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
