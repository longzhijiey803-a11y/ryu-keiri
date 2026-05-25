"use client";

import {
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_LABEL,
  type Transaction,
  type TransactionStatus,
} from "@/lib/types/transaction";
import { groupByStatus } from "@/lib/transactions-data";
import { TransactionCard } from "./transaction-card";

/** 16案テーマ：カンバン列のヘッダ色（ステータス毎）。 */
const STATUS_HEADER: Record<TransactionStatus, string> = {
  draft: "bg-zinc-600",
  review: "bg-accent-indigo",
  approval: "bg-accent-amber",
  scheduled_payment: "bg-accent-rose",
  awaiting_deposit: "bg-accent-fuchsia",
  done: "bg-accent-emerald",
  rejected: "bg-zinc-700",
};

export function TransactionKanban({
  data,
  onCardClick,
  onStatusChange,
}: {
  data: Transaction[];
  onCardClick: (t: Transaction) => void;
  onStatusChange: (id: string, status: TransactionStatus) => void;
}) {
  const grouped = groupByStatus(data);

  return (
    <div className="overflow-x-auto scrollbar-thin pb-2">
      <div className="flex gap-4">
        {TRANSACTION_STATUSES.map((s: TransactionStatus) => {
          const items = grouped[s];
          return (
            <section
              key={s}
              className="flex w-[280px] shrink-0 flex-col overflow-hidden rounded-lg border border-border bg-muted/40 shadow-card"
            >
              <header
                className={`flex items-center justify-between px-3 py-2.5 text-white ${STATUS_HEADER[s]}`}
              >
                <span className="text-sm font-semibold">
                  {TRANSACTION_STATUS_LABEL[s]}
                </span>
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs font-medium">
                  {items.length}
                </span>
              </header>
              <div className="flex flex-1 flex-col gap-2 p-2">
                {items.length === 0 ? (
                  <p className="px-2 py-8 text-center text-xs text-muted-foreground/70">
                    なし
                  </p>
                ) : (
                  items.map((t) => (
                    <TransactionCard
                      key={t.id}
                      txn={t}
                      onClick={onCardClick}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
