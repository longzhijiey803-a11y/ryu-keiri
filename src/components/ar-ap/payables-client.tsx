"use client";

import * as React from "react";

import { Card, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { formatJPY } from "@/lib/utils";
import { PAYABLES, filterAP } from "@/lib/ar-ap-data";
import type { ARAPFilter, PayableRow } from "@/lib/types/ar-ap";
import {
  PAYMENT_STATE_LABEL,
  RECEIVED_STATUS_LABEL,
  type PaymentState,
  type ReceivedStatus,
} from "@/lib/types/invoice";
import { ArApTabs } from "./arap-tabs";
import { ArApFilterBar } from "./arap-filter-bar";
import { PayablesTable } from "./arap-tables";

const DEFAULT_FILTER: ARAPFilter = {
  query: "",
  only_outstanding: false,
  overdue_only: false,
};

export function PayablesClient() {
  const { toast } = useToast();
  const [list, setList] = React.useState<PayableRow[]>(PAYABLES);
  const [filter, setFilter] = React.useState<ARAPFilter>(DEFAULT_FILTER);
  const data = React.useMemo(() => filterAP(list, filter), [list, filter]);
  const s = React.useMemo(
    () => ({
      count: list.length,
      outstanding: list.reduce((x, r) => x + r.outstanding, 0),
      dueSoon: list
        .filter(
          (r) =>
            r.outstanding > 0 && r.due_in_days >= 0 && r.due_in_days <= 7,
        )
        .reduce((x, r) => x + r.outstanding, 0),
    }),
    [list],
  );

  const handlePayStateChange = (id: string, state: PaymentState) => {
    setList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, payment_state: state } : r)),
    );
    toast({
      title: "支払ステータスを更新しました",
      description: `${id} → ${PAYMENT_STATE_LABEL[state]}`,
      variant: "success",
    });
  };
  const handleApprovalChange = (id: string, status: ReceivedStatus) => {
    setList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approval_status: status } : r)),
    );
    toast({
      title: "承認状態を更新しました",
      description: `${id} → ${RECEIVED_STATUS_LABEL[status]}`,
      variant: "success",
    });
  };

  return (
    <>
      <PageHeader
        title="売掛・買掛管理"
        description="受領請求書の支払状況を管理します（買掛）。"
      />
      <ArApTabs />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">買掛 件数</p>
          <p className="tabular mt-1 text-xl font-bold text-foreground">
            {s.count} 件
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">未払 合計</p>
          <p className="tabular mt-1 text-xl font-bold text-foreground">
            {formatJPY(s.outstanding)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">7日以内 支払</p>
          <p className="tabular mt-1 text-xl font-bold text-warning">
            {formatJPY(s.dueSoon)}
          </p>
        </Card>
      </div>

      <ArApFilterBar
        filter={filter}
        onChange={setFilter}
        resultCount={data.length}
        total={list.length}
        overdueLabel="支払期限超過のみ"
      />

      <PayablesTable
        data={data}
        onPayStateChange={handlePayStateChange}
        onApprovalChange={handleApprovalChange}
      />
    </>
  );
}
