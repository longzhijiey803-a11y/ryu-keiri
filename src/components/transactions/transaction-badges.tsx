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
 * 汎用 StatusBadge（docs/DESIGN.md §A-5 の13語彙固定）とは別物だが、
 * 同じトーン配色・ピル形状で見た目の一貫性を保つ。視認性重視。
 */
type Tone = "neutral" | "info" | "warning" | "success" | "danger";

const STATUS_TONE: Record<TransactionStatus, Tone> = {
  draft: "neutral",
  review: "info",
  approval: "warning",
  scheduled_payment: "info",
  awaiting_deposit: "warning",
  done: "success",
  rejected: "danger",
};

const TONE_CLASS: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  info: { box: "bg-info/10 text-info", dot: "bg-info" },
  warning: { box: "bg-warning/10 text-warning", dot: "bg-warning" },
  success: { box: "bg-success/10 text-success", dot: "bg-success" },
  danger: { box: "bg-danger/10 text-danger", dot: "bg-danger" },
};

export function TransactionStatusBadge({
  status,
  className,
}: {
  status: TransactionStatus;
  className?: string;
}) {
  const c = TONE_CLASS[STATUS_TONE[status]];
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
