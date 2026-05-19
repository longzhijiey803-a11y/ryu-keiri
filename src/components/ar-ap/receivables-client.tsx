"use client";

import * as React from "react";

import { Card, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { formatJPY } from "@/lib/utils";
import { RECEIVABLES, filterAR } from "@/lib/ar-ap-data";
import type { ARAPFilter, ReceivableRow } from "@/lib/types/ar-ap";
import {
  ISSUED_STATUS_LABEL,
  type IssuedStatus,
} from "@/lib/types/invoice";
import { ArApTabs } from "./arap-tabs";
import { ArApFilterBar } from "./arap-filter-bar";
import { ReceivablesTable } from "./arap-tables";

const DEFAULT_FILTER: ARAPFilter = {
  query: "",
  only_outstanding: false,
  overdue_only: false,
};

export function ReceivablesClient() {
  const { toast } = useToast();
  const [list, setList] = React.useState<ReceivableRow[]>(RECEIVABLES);
  const [filter, setFilter] = React.useState<ARAPFilter>(DEFAULT_FILTER);
  const data = React.useMemo(() => filterAR(list, filter), [list, filter]);
  const s = React.useMemo(
    () => ({
      count: list.length,
      outstanding: list.reduce((x, r) => x + r.outstanding, 0),
      overdue: list
        .filter((r) => r.overdue_days > 0)
        .reduce((x, r) => x + r.outstanding, 0),
    }),
    [list],
  );

  const handleStatusChange = (id: string, status: IssuedStatus) => {
    setList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    toast({
      title: "売掛ステータスを更新しました",
      description: `${id} → ${ISSUED_STATUS_LABEL[status]}`,
      variant: "success",
    });
  };

  return (
    <>
      <PageHeader
        title="売掛・買掛管理"
        description="発行請求書の入金状況を管理します（売掛）。"
      />
      <ArApTabs />

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">売掛 件数</p>
          <p className="tabular mt-1 text-xl font-bold text-foreground">
            {s.count} 件
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">未回収 合計</p>
          <p className="tabular mt-1 text-xl font-bold text-foreground">
            {formatJPY(s.outstanding)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">うち遅延</p>
          <p className="tabular mt-1 text-xl font-bold text-danger">
            {formatJPY(s.overdue)}
          </p>
        </Card>
      </div>

      <ArApFilterBar
        filter={filter}
        onChange={setFilter}
        resultCount={data.length}
        total={list.length}
        overdueLabel="遅延のみ"
      />

      <ReceivablesTable data={data} onStatusChange={handleStatusChange} />
    </>
  );
}
