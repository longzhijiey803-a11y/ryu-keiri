"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { Button, Card, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { cn, formatJPY } from "@/lib/utils";
import {
  AP_AGING,
  AR_AGING,
  BS_ASSETS,
  BS_LIAB_EQUITY,
  CF,
  PL,
  type AgingRow,
  type ReportLine,
  deptPnl,
  expenseBreakdown,
} from "@/lib/reports-data";

type Key =
  | "pl"
  | "bs"
  | "cf"
  | "ar_aging"
  | "ap_aging"
  | "dept"
  | "trend"
  | "expense";

const TABS: { key: Key; label: string }[] = [
  { key: "pl", label: "損益計算書(PL)" },
  { key: "bs", label: "貸借対照表(BS)" },
  { key: "cf", label: "キャッシュフロー" },
  { key: "ar_aging", label: "売掛金年齢表" },
  { key: "ap_aging", label: "買掛金年齢表" },
  { key: "dept", label: "部門別収支" },
  { key: "trend", label: "月次推移" },
  { key: "expense", label: "経費分析" },
];

function LineTable({ lines }: { lines: ReportLine[] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {lines.map((l) => (
          <tr
            key={l.label}
            className={cn(
              "border-b border-border last:border-0",
              l.emphasis && "bg-muted/40",
            )}
          >
            <td
              className={cn(
                "px-4 py-2.5",
                l.emphasis
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {l.label}
            </td>
            <td
              className={cn(
                "px-4 py-2.5 text-right tabular",
                l.emphasis ? "font-semibold" : "",
                l.amount < 0 ? "text-danger" : "text-foreground",
              )}
            >
              {formatJPY(l.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AgingTable({ rows }: { rows: AgingRow[] }) {
  const cols = [
    ["未到来", "not_due"],
    ["1-30日", "d1_30"],
    ["31-60日", "d31_60"],
    ["61-90日", "d61_90"],
    ["90日超", "d90_over"],
  ] as const;
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/15 bg-accent-amber text-xs font-semibold text-white [&_th]:!text-white">
            <th className="px-4 py-2.5 text-left font-medium">取引先</th>
            {cols.map(([l]) => (
              <th key={l} className="px-3 py-2.5 text-right font-medium">
                {l}
              </th>
            ))}
            <th className="px-4 py-2.5 text-right font-medium">合計</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.partner}
              className="border-b border-border last:border-0"
            >
              <td className="px-4 py-2.5 text-foreground">{r.partner}</td>
              {cols.map(([, k]) => (
                <td
                  key={k}
                  className={cn(
                    "px-3 py-2.5 text-right tabular",
                    (k === "d61_90" || k === "d90_over") && r[k] > 0
                      ? "text-danger"
                      : "text-muted-foreground",
                  )}
                >
                  {r[k] ? formatJPY(r[k]) : "—"}
                </td>
              ))}
              <td className="px-4 py-2.5 text-right tabular font-medium">
                {formatJPY(r.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReportsClient() {
  const { toast } = useToast();
  const [tab, setTab] = React.useState<Key>("pl");
  const depts = deptPnl();
  const exp = expenseBreakdown();
  const expMax = Math.max(...exp.map((e) => e.amount), 1);

  return (
    <>
      <PageHeader
        title="レポート"
        description="財務諸表・年齢表・部門別収支・月次推移・経費分析。"
        actions={
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "エクスポートは未実装です",
                description: "CSV/PDF出力はバックエンド接続後に実装します。",
                variant: "warning",
              })
            }
          >
            <Download /> エクスポート
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "relative -mb-px h-9 px-3 text-sm font-medium transition-colors",
              "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full",
              tab === t.key
                ? "text-foreground after:bg-primary"
                : "text-muted-foreground hover:text-foreground after:bg-transparent",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pl" && (
        <Card>
          <LineTable lines={PL} />
        </Card>
      )}
      {tab === "bs" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="border-b border-border px-4 py-2.5 text-sm font-semibold">
              資産の部
            </div>
            <LineTable lines={BS_ASSETS} />
          </Card>
          <Card>
            <div className="border-b border-border px-4 py-2.5 text-sm font-semibold">
              負債・純資産の部
            </div>
            <LineTable lines={BS_LIAB_EQUITY} />
          </Card>
        </div>
      )}
      {tab === "cf" && (
        <Card>
          <LineTable lines={CF} />
        </Card>
      )}
      {tab === "ar_aging" && (
        <Card>
          <AgingTable rows={AR_AGING} />
        </Card>
      )}
      {tab === "ap_aging" && (
        <Card>
          <AgingTable rows={AP_AGING} />
        </Card>
      )}
      {tab === "dept" && (
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/15 bg-accent-amber text-xs font-semibold text-white [&_th]:!text-white">
                <th className="px-4 py-2.5 text-left font-medium">部門</th>
                <th className="px-4 py-2.5 text-right font-medium">収益</th>
                <th className="px-4 py-2.5 text-right font-medium">費用</th>
                <th className="px-4 py-2.5 text-right font-medium">差引</th>
              </tr>
            </thead>
            <tbody>
              {depts.map((d) => (
                <tr
                  key={d.department}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-2.5 text-foreground">
                    {d.department}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular text-muted-foreground">
                    {formatJPY(d.revenue)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular text-muted-foreground">
                    {formatJPY(d.expense)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-right tabular font-medium",
                      d.revenue - d.expense < 0
                        ? "text-danger"
                        : "text-foreground",
                    )}
                  >
                    {formatJPY(d.revenue - d.expense)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "trend" && (
        <Card>
          <div className="border-b border-border px-5 py-3 text-sm font-semibold">
            売上・経費 月次推移
          </div>
          <TrendChart />
        </Card>
      )}
      {tab === "expense" && (
        <Card className="p-5">
          <ul className="space-y-3">
            {exp.map((e) => (
              <li key={e.account}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-foreground">{e.account}</span>
                  <span className="tabular font-medium text-foreground">
                    {formatJPY(e.amount)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(e.amount / expMax) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
