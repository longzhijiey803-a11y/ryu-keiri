/**
 * 売掛・買掛ビュー（請求管理から導出）。型は src/lib/types/ar-ap.ts。
 */
import { ISSUED_INVOICES, RECEIVED_INVOICES } from "@/lib/invoice-data";
import { TODAY } from "@/lib/types/invoice";
import type { ARAPFilter, PayableRow, ReceivableRow } from "@/lib/types/ar-ap";
import { daysBetweenISO } from "@/lib/utils";

const paidOf = (payments: { amount: number }[]) =>
  payments.reduce((s, p) => s + p.amount, 0);

export const RECEIVABLES: ReceivableRow[] = ISSUED_INVOICES.filter(
  (i) => i.status !== "draft" && i.status !== "voided",
).map((i) => {
  const paid = paidOf(i.payments);
  const outstanding = Math.max(0, i.total - paid);
  const overdue = daysBetweenISO(i.due_date, TODAY);
  return {
    id: i.id,
    partner_name: i.partner.name,
    number: i.number,
    total: i.total,
    paid,
    outstanding,
    due_date: i.due_date,
    overdue_days: outstanding > 0 && overdue > 0 ? overdue : 0,
    status: i.status as ReceivableRow["status"],
    payment_state: i.payment_state,
    assignee_name: i.assignee.name,
  };
});

export const PAYABLES: PayableRow[] = RECEIVED_INVOICES.filter(
  (i) => i.status !== "rejected",
).map((i) => {
  const paid = paidOf(i.payments);
  const outstanding = Math.max(0, i.total - paid);
  return {
    id: i.id,
    partner_name: i.partner.name,
    number: i.number,
    total: i.total,
    paid,
    outstanding,
    due_date: i.due_date,
    due_in_days: daysBetweenISO(TODAY, i.due_date),
    payment_state: i.payment_state,
    approval_status: i.status as PayableRow["approval_status"],
    assignee_name: i.assignee.name,
  };
});

export function filterAR(
  list: ReceivableRow[],
  f: ARAPFilter,
): ReceivableRow[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((r) => {
    if (f.only_outstanding && r.outstanding <= 0) return false;
    if (f.overdue_only && r.overdue_days <= 0) return false;
    if (q && !`${r.number} ${r.partner_name}`.toLowerCase().includes(q))
      return false;
    return true;
  });
}

export function filterAP(list: PayableRow[], f: ARAPFilter): PayableRow[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((r) => {
    if (f.only_outstanding && r.outstanding <= 0) return false;
    if (f.overdue_only && !(r.outstanding > 0 && r.due_in_days < 0))
      return false;
    if (q && !`${r.number} ${r.partner_name}`.toLowerCase().includes(q))
      return false;
    return true;
  });
}

/** AR/AP サマリ */
export function arSummary() {
  const outstanding = RECEIVABLES.reduce((s, r) => s + r.outstanding, 0);
  const overdue = RECEIVABLES.filter((r) => r.overdue_days > 0).reduce(
    (s, r) => s + r.outstanding,
    0,
  );
  return { outstanding, overdue, count: RECEIVABLES.length };
}
export function apSummary() {
  const outstanding = PAYABLES.reduce((s, r) => s + r.outstanding, 0);
  const dueSoon = PAYABLES.filter(
    (r) => r.outstanding > 0 && r.due_in_days >= 0 && r.due_in_days <= 7,
  ).reduce((s, r) => s + r.outstanding, 0);
  return { outstanding, dueSoon, count: PAYABLES.length };
}
