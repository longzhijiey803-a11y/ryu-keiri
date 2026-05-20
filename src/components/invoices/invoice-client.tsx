"use client";

import * as React from "react";

import { useToast } from "@/components/ui";
import {
  ISSUED_INVOICES,
  RECEIVED_INVOICES,
  filterInvoices,
} from "@/lib/invoice-data";
import {
  ISSUED_STATUS_LABEL,
  PAYMENT_STATE_LABEL,
  RECEIVED_STATUS_LABEL,
  type Invoice,
  type InvoiceDirection,
  type InvoiceFilter,
  type InvoiceStatus,
  type IssuedStatus,
  type Payment,
  type PaymentState,
  type ReceivedStatus,
} from "@/lib/types/invoice";
import { InvoiceFilterBar } from "./invoice-filter-bar";
import { InvoiceTable } from "./invoice-table";
import { InvoiceDetailDrawer } from "./invoice-detail-drawer";

const DEFAULT_FILTER: InvoiceFilter = {
  query: "",
  status: "all",
  payment_state: "all",
  overdue_only: false,
};

export function InvoiceClient({
  direction,
}: {
  direction: InvoiceDirection;
}) {
  const [list, setList] = React.useState<Invoice[]>(
    direction === "issued" ? ISSUED_INVOICES : RECEIVED_INVOICES,
  );
  const [filter, setFilter] = React.useState<InvoiceFilter>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  // direction が変わったらデータとフィルタをリセット
  React.useEffect(() => {
    setList(direction === "issued" ? ISSUED_INVOICES : RECEIVED_INVOICES);
    setFilter(DEFAULT_FILTER);
    setSelectedId(null);
    setOpen(false);
  }, [direction]);

  const filtered = React.useMemo(
    () => filterInvoices(list, filter),
    [list, filter],
  );
  const selected = React.useMemo(
    () => list.find((i) => i.id === selectedId) ?? null,
    [list, selectedId],
  );

  const nowISO = () => new Date().toISOString();
  const statusLabel = (s: InvoiceStatus) =>
    direction === "issued"
      ? ISSUED_STATUS_LABEL[s as IssuedStatus]
      : RECEIVED_STATUS_LABEL[s as ReceivedStatus];

  const handleStatusChange = (id: string, status: InvoiceStatus) => {
    setList((prev) =>
      prev.map((i) =>
        i.id === id && i.status !== status
          ? { ...i, status, updated_at: nowISO() }
          : i,
      ),
    );
    toast({
      title:
        direction === "issued"
          ? "ステータスを更新しました"
          : "承認状態を更新しました",
      description: `${id} → ${statusLabel(status)}`,
      variant: "success",
    });
  };

  /** 請求書詳細から直接入金を記録する。残額が0なら自動で paid に。 */
  const handleAddPayment = (id: string, payment: Payment) => {
    setList((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const payments = [...i.payments, payment];
        const paid = payments.reduce((s, p) => s + p.amount, 0);
        const next: Invoice = {
          ...i,
          payments,
          updated_at: nowISO(),
          payment_state:
            paid >= i.total ? "paid" : paid > 0 ? "partial" : i.payment_state,
        };
        return next;
      }),
    );
  };

  const handlePaymentStateChange = (id: string, state: PaymentState) => {
    setList((prev) =>
      prev.map((i) =>
        i.id === id && i.payment_state !== state
          ? { ...i, payment_state: state, updated_at: nowISO() }
          : i,
      ),
    );
    toast({
      title:
        direction === "issued"
          ? "入金状態を更新しました"
          : "支払状態を更新しました",
      description: `${id} → ${PAYMENT_STATE_LABEL[state]}`,
      variant: "success",
    });
  };

  return (
    <>
      <InvoiceFilterBar
        direction={direction}
        filter={filter}
        onChange={setFilter}
        resultCount={filtered.length}
        total={list.length}
      />
      <InvoiceTable
        direction={direction}
        data={filtered}
        onRowClick={(i: Invoice) => {
          setSelectedId(i.id);
          setOpen(true);
        }}
        onStatusChange={handleStatusChange}
        onPaymentStateChange={handlePaymentStateChange}
      />
      <InvoiceDetailDrawer
        invoice={selected}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSelectedId(null);
        }}
        onAddPayment={handleAddPayment}
      />
    </>
  );
}
