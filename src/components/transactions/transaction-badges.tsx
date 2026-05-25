import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import {
  TRANSACTION_KIND_LABEL,
  TRANSACTION_STATUS_LABEL,
  type TransactionKind,
  type TransactionStatus,
} from "@/lib/types/transaction";

/**
 * 取引ステータスバッジ。取引の7ステージ（「完了」を含む）専用。
 * 16案テーマ：カンバン列ヘッダ色と完全一致させる（draft=zinc / review=indigo /
 * approval=amber / scheduled_payment=rose / awaiting_deposit=fuchsia /
 * done=emerald / rejected=zinc-darker）。
 */
const STATUS_CLASS: Record<
  TransactionStatus,
  { box: string; dot: string }
> = {
  draft: {
    box: "bg-zinc-600/15 text-zinc-700 dark:text-zinc-300",
    dot: "bg-zinc-600",
  },
  review: {
    box: "bg-accent-indigo/15 text-accent-indigo",
    dot: "bg-accent-indigo",
  },
  approval: {
    box: "bg-accent-amber/15 text-accent-amber",
    dot: "bg-accent-amber",
  },
  scheduled_payment: {
    box: "bg-accent-rose/15 text-accent-rose",
    dot: "bg-accent-rose",
  },
  awaiting_deposit: {
    box: "bg-accent-fuchsia/15 text-accent-fuchsia",
    dot: "bg-accent-fuchsia",
  },
  done: {
    box: "bg-accent-emerald/15 text-accent-emerald",
    dot: "bg-accent-emerald",
  },
  rejected: {
    box: "bg-zinc-700/15 text-zinc-700 dark:text-zinc-300",
    dot: "bg-zinc-700",
  },
};

export function TransactionStatusBadge({
  status,
  className,
}: {
  status: TransactionStatus;
  className?: string;
}) {
  const c = STATUS_CLASS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        c.box,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {TRANSACTION_STATUS_LABEL[status]}
    </span>
  );
}

export function TransactionKindBadge({ kind }: { kind: TransactionKind }) {
  return <Badge variant="outline">{TRANSACTION_KIND_LABEL[kind]}</Badge>;
}
