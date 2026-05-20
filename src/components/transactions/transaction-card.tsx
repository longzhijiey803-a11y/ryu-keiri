"use client";

import { CalendarClock, Paperclip } from "lucide-react";

import { Avatar } from "@/components/ui";
import { cn, daysBetweenISO, formatISODate, formatJPY } from "@/lib/utils";
import {
  TRANSACTION_KIND_DIRECTION,
  type Transaction,
} from "@/lib/types/transaction";
import { TODAY } from "@/lib/types/invoice";
import {
  TransactionKindBadge,
  TransactionStatusBadge,
} from "./transaction-badges";

export function TransactionCard({
  txn,
  onClick,
}: {
  txn: Transaction;
  onClick: (t: Transaction) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(txn)}
      className="w-full rounded-lg border border-border bg-surface p-3 text-left shadow-card transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-medium text-foreground">
          {txn.name}
        </p>
        <TransactionKindBadge kind={txn.kind} />
      </div>

      <p className="mt-1 truncate text-xs text-muted-foreground">
        {txn.partner.name}
      </p>

      <p
        className={cn(
          "mt-2 tabular text-base font-semibold",
          TRANSACTION_KIND_DIRECTION[txn.kind] === "outflow"
            ? "text-danger"
            : "text-foreground",
        )}
      >
        {formatJPY(
          TRANSACTION_KIND_DIRECTION[txn.kind] === "outflow"
            ? -txn.amount
            : txn.amount,
        )}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <TransactionStatusBadge status={txn.status} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {txn.attachments.length > 0 && (
            <span className="inline-flex items-center gap-0.5">
              <Paperclip className="size-3.5" />
              {txn.attachments.length}
            </span>
          )}
          {txn.due_date && (() => {
            const diff = daysBetweenISO(TODAY, txn.due_date);
            const open = txn.status !== "done";
            const danger = open && diff <= 3;
            return (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 tabular",
                  danger && "font-medium text-danger",
                )}
              >
                <CalendarClock className="size-3.5" />
                {formatISODate(txn.due_date)}
              </span>
            );
          })()}
          <Avatar name={txn.assignee.name} size="sm" />
        </div>
      </div>
    </button>
  );
}
