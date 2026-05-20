import {
  AlertTriangle,
  CalendarClock,
  FileCheck2,
  FileClock,
  FileText,
  Inbox,
  Send,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { ISSUED_INVOICES, RECEIVED_INVOICES } from "@/lib/invoice-data";
import { TODAY, isOverdue, type Invoice } from "@/lib/types/invoice";
import { daysBetweenISO, formatISODate, formatJPY } from "@/lib/utils";

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

function nextUpcoming(list: Invoice[]): Invoice | null {
  return (
    [...list].sort((a, b) => a.due_date.localeCompare(b.due_date))[0] ?? null
  );
}

function dueLabel(due: string): string {
  const d = daysBetweenISO(TODAY, due);
  if (d < 0) return `${Math.abs(d)}日超過`;
  if (d === 0) return "本日まで";
  return `あと${d}日`;
}

export function InvoiceOverview() {
  const issuedDraft = ISSUED_INVOICES.filter((i) => i.status === "draft");
  const issuedAwaiting = ISSUED_INVOICES.filter(
    (i) => i.status === "awaiting_payment" || i.status === "partially_paid",
  );
  const issuedOverdue = ISSUED_INVOICES.filter(isOverdue);
  const issuedOverdueAmt = issuedOverdue.reduce((s, i) => s + i.total, 0);
  const issuedPaid = ISSUED_INVOICES.filter((i) => i.status === "paid");

  const recvUnconfirmed = RECEIVED_INVOICES.filter(
    (i) => i.status === "unconfirmed",
  );
  const recvApproval = RECEIVED_INVOICES.filter(
    (i) => i.status === "approval",
  );
  const recvScheduled = RECEIVED_INVOICES.filter(
    (i) => i.status === "scheduled_payment",
  );
  const recvOverdue = RECEIVED_INVOICES.filter(isOverdue);

  const nextDeposit = nextUpcoming(
    ISSUED_INVOICES.filter((i) => i.payment_state !== "paid"),
  );
  const nextPayment = nextUpcoming(
    RECEIVED_INVOICES.filter((i) => i.payment_state !== "paid"),
  );

  return (
    <div className="space-y-8">
      <section>
        <GroupLabel>直近の期限</GroupLabel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <KpiCard
            label="次の入金期限（発行）"
            value={
              nextDeposit
                ? `${formatISODate(nextDeposit.due_date)} ・ ${dueLabel(nextDeposit.due_date)}`
                : "—"
            }
            sub={
              nextDeposit
                ? `${nextDeposit.partner.name} ・ ${formatJPY(nextDeposit.total)}`
                : "入金待ち案件なし"
            }
            icon={CalendarClock}
            tone={
              nextDeposit && nextDeposit.due_date < TODAY ? "danger" : "primary"
            }
            href="/invoices/issued"
          />
          <KpiCard
            label="次の支払期限（受領）"
            value={
              nextPayment
                ? `${formatISODate(nextPayment.due_date)} ・ ${dueLabel(nextPayment.due_date)}`
                : "—"
            }
            sub={
              nextPayment
                ? `${nextPayment.partner.name} ・ ${formatJPY(nextPayment.total)}`
                : "支払案件なし"
            }
            icon={CalendarClock}
            tone={
              nextPayment && nextPayment.due_date < TODAY ? "danger" : "primary"
            }
            href="/invoices/received"
          />
        </div>
      </section>

      <section>
        <GroupLabel>発行請求書</GroupLabel>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="未送付（下書き）"
            value={`${issuedDraft.length} 件`}
            icon={FileText}
            tone="warning"
            href="/invoices/issued"
          />
          <KpiCard
            label="入金待ち"
            value={`${issuedAwaiting.length} 件`}
            icon={Send}
            tone="primary"
            href="/invoices/issued"
          />
          <KpiCard
            label="支払期限超過"
            value={`${issuedOverdue.length} 件`}
            sub={formatJPY(issuedOverdueAmt)}
            icon={AlertTriangle}
            tone="danger"
            href="/invoices/issued"
          />
          <KpiCard
            label="入金済み"
            value={`${issuedPaid.length} 件`}
            icon={FileCheck2}
            href="/invoices/issued"
          />
        </div>
      </section>

      <section>
        <GroupLabel>受領請求書</GroupLabel>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="未確認"
            value={`${recvUnconfirmed.length} 件`}
            icon={Inbox}
            tone="warning"
            href="/invoices/received"
          />
          <KpiCard
            label="承認待ち"
            value={`${recvApproval.length} 件`}
            icon={FileClock}
            tone="warning"
            href="/invoices/received"
          />
          <KpiCard
            label="支払予定"
            value={`${recvScheduled.length} 件`}
            icon={Send}
            tone="primary"
            href="/invoices/received"
          />
          <KpiCard
            label="支払期限超過"
            value={`${recvOverdue.length} 件`}
            icon={AlertTriangle}
            tone="danger"
            href="/invoices/received"
          />
        </div>
      </section>
    </div>
  );
}
