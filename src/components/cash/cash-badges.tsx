import { cn } from "@/lib/utils";
import {
  ACCOUNT_STATUS_LABEL,
  RECON_STATUS_LABEL,
  type AccountStatus,
  type ReconStatus,
} from "@/lib/types/bank";

type Tone = "neutral" | "info" | "warning" | "success" | "danger";
const TONE: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  info: { box: "bg-info/10 text-info", dot: "bg-info" },
  warning: { box: "bg-warning/10 text-warning", dot: "bg-warning" },
  success: { box: "bg-success/10 text-success", dot: "bg-success" },
  danger: { box: "bg-danger/10 text-danger", dot: "bg-danger" },
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

const RECON_TONE: Record<ReconStatus, Tone> = {
  unreconciled: "warning",
  candidate: "info",
  reconciled: "success",
  discrepancy: "danger",
  pending: "neutral",
};
export function ReconStatusBadge({ status }: { status: ReconStatus }) {
  return (
    <Pill tone={RECON_TONE[status]} label={RECON_STATUS_LABEL[status]} />
  );
}

const ACC_TONE: Record<AccountStatus, Tone> = {
  active: "success",
  syncing: "info",
  error: "danger",
  closed: "neutral",
};
export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <Pill tone={ACC_TONE[status]} label={ACCOUNT_STATUS_LABEL[status]} />
  );
}
