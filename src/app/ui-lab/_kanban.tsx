import { CalendarClock, LayoutGrid, Paperclip, Plus, Table } from "lucide-react";

import { TRANSACTIONS, groupByStatus } from "@/lib/transactions-data";
import {
  TRANSACTION_KIND_DIRECTION,
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_LABEL,
  type Transaction,
  type TransactionStatus,
} from "@/lib/types/transaction";
import { cn, formatISODate, formatJPY } from "@/lib/utils";

/** ui-lab 用：操作なし・閲覧専用の取引カンバン。 */
export function KanbanPreview() {
  const grouped = groupByStatus(TRANSACTIONS);
  const visible: TransactionStatus[] = [
    "draft",
    "review",
    "approval",
    "scheduled_payment",
  ];

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">取引管理</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            売上・仕入・経費・支払・入金など、会社のお金に関わる取引を一元管理します。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-border bg-surface p-0.5">
            <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-muted-foreground">
              <Table className="size-3.5" /> テーブル
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-sm font-medium text-foreground">
              <LayoutGrid className="size-3.5" /> カンバン
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
            <Plus className="size-4" /> 新規取引
          </span>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        取引名・取引先・取引番号で検索
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4">
          {TRANSACTION_STATUSES.filter((s) => visible.includes(s)).map((s) => {
            const items = grouped[s];
            return (
              <section
                key={s}
                className="flex w-[280px] shrink-0 flex-col rounded-lg border border-border bg-muted/40"
              >
                <header className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-sm font-semibold text-foreground">
                    {TRANSACTION_STATUS_LABEL[s]}
                  </span>
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-surface px-1.5 text-xs text-muted-foreground">
                    {items.length}
                  </span>
                </header>
                <div className="flex flex-1 flex-col gap-2 p-2 pt-0">
                  {items.length === 0 ? (
                    <p className="px-2 py-8 text-center text-xs text-muted-foreground/70">
                      なし
                    </p>
                  ) : (
                    items.slice(0, 4).map((t) => <Card key={t.id} txn={t} />)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Card({ txn }: { txn: Transaction }) {
  const dir = TRANSACTION_KIND_DIRECTION[txn.kind];
  const amount = dir === "outflow" ? -txn.amount : txn.amount;
  return (
    <div className="rounded-lg border border-border bg-surface p-3 shadow-card">
      <p className="line-clamp-2 text-sm font-medium text-foreground">{txn.name}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{txn.partner.name}</p>
      <p
        className={cn(
          "mt-2 tabular text-base font-semibold",
          dir === "outflow" ? "text-danger" : "text-foreground",
        )}
      >
        {formatJPY(amount)}
      </p>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-2 py-0.5">
          ● {TRANSACTION_STATUS_LABEL[txn.status]}
        </span>
        <div className="flex items-center gap-2">
          {txn.attachments.length > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <Paperclip className="size-3" />
              {txn.attachments.length}
            </span>
          )}
          {txn.due_date && (
            <span className="inline-flex items-center gap-0.5 tabular">
              <CalendarClock className="size-3" />
              {formatISODate(txn.due_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
