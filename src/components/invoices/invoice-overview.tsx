import {
  AlertTriangle,
  FileCheck2,
  FileClock,
  FileText,
  Inbox,
  Send,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { ISSUED_INVOICES, RECEIVED_INVOICES } from "@/lib/invoice-data";
import { isOverdue } from "@/lib/types/invoice";
import { formatJPY } from "@/lib/utils";

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
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

  return (
    <div className="space-y-8">
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
