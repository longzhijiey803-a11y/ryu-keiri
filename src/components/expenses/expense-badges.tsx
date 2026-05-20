import { cn } from "@/lib/utils";
import {
  EXPENSE_PAY_STATE_LABEL,
  EXPENSE_STATUS_LABEL,
  type ExpensePayState,
  type ExpenseStatus,
} from "@/lib/types/expense";

type Tone = "neutral" | "info" | "warning" | "success" | "danger";
const TONE: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  info: { box: "bg-info/10 text-info", dot: "bg-info" },
  warning: { box: "bg-warning/10 text-warning", dot: "bg-warning" },
  success: { box: "bg-success/10 text-success", dot: "bg-success" },
  danger: { box: "bg-danger/10 text-danger", dot: "bg-danger" },
};
const STATUS_TONE: Record<ExpenseStatus, Tone> = {
  draft: "neutral",
  submitted: "info",
  pending_approval: "warning",
  returned: "danger",
  approved: "success",
  scheduled: "info",
  settled: "success",
  rejected: "danger",
};
const PAY_TONE: Record<ExpensePayState, Tone> = {
  unpaid: "warning",
  scheduled: "info",
  settled: "success",
};

function Pill({ tone, label }: { tone: Tone; label: string }) {
  const c = TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        c.box,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {label}
    </span>
  );
}

export function ExpenseStatusBadge({ status }: { status: ExpenseStatus }) {
  return (
    <Pill tone={STATUS_TONE[status]} label={EXPENSE_STATUS_LABEL[status]} />
  );
}
export function ExpensePayStateBadge({
  state,
}: {
  state: ExpensePayState;
}) {
  return <Pill tone={PAY_TONE[state]} label={EXPENSE_PAY_STATE_LABEL[state]} />;
}
