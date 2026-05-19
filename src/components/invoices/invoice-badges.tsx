import { cn } from "@/lib/utils";
import {
  ISSUED_STATUS_LABEL,
  PAYMENT_STATE_LABEL,
  RECEIVED_STATUS_LABEL,
  type InvoiceDirection,
  type InvoiceStatus,
  type IssuedStatus,
  type PaymentState,
  type ReceivedStatus,
} from "@/lib/types/invoice";

type Tone = "neutral" | "info" | "warning" | "success" | "danger";

const TONE_CLASS: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  info: { box: "bg-info/10 text-info", dot: "bg-info" },
  warning: { box: "bg-warning/10 text-warning", dot: "bg-warning" },
  success: { box: "bg-success/10 text-success", dot: "bg-success" },
  danger: { box: "bg-danger/10 text-danger", dot: "bg-danger" },
};

function Pill({
  tone,
  children,
  strike,
}: {
  tone: Tone;
  children: React.ReactNode;
  strike?: boolean;
}) {
  const c = TONE_CLASS[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        c.box,
        strike && "line-through",
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {children}
    </span>
  );
}

const ISSUED_TONE: Record<IssuedStatus, Tone> = {
  draft: "neutral",
  sent: "info",
  awaiting_payment: "warning",
  partially_paid: "warning",
  paid: "success",
  voided: "danger",
};
const RECEIVED_TONE: Record<ReceivedStatus, Tone> = {
  unconfirmed: "neutral",
  reviewing: "info",
  approval: "warning",
  approved: "success",
  scheduled_payment: "info",
  paid: "success",
  rejected: "danger",
};

export function InvoiceStatusBadge({
  direction,
  status,
}: {
  direction: InvoiceDirection;
  status: InvoiceStatus;
}) {
  if (direction === "issued") {
    const s = status as IssuedStatus;
    return (
      <Pill tone={ISSUED_TONE[s]} strike={s === "voided"}>
        {ISSUED_STATUS_LABEL[s]}
      </Pill>
    );
  }
  const s = status as ReceivedStatus;
  return (
    <Pill tone={RECEIVED_TONE[s]}>{RECEIVED_STATUS_LABEL[s]}</Pill>
  );
}

const PS_TONE: Record<PaymentState, Tone> = {
  unpaid: "warning",
  partial: "warning",
  scheduled: "info",
  paid: "success",
};
export function PaymentStateBadge({ state }: { state: PaymentState }) {
  return <Pill tone={PS_TONE[state]}>{PAYMENT_STATE_LABEL[state]}</Pill>;
}

export function OverdueBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
      期限超過
    </span>
  );
}
