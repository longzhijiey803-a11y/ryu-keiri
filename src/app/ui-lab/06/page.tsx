import { activities, grossProfit, kpis, payments, receipts } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

const STRIP = [
  { label: "現預金残高", value: fmt(kpis.cashBalance) },
  { label: "今月売上", value: fmt(kpis.monthSales) },
  { label: "今月経費", value: fmt(kpis.monthExpenses) },
  { label: "利益概算", value: fmt(grossProfit) },
];

type Row = { kind: "支払" | "入金"; partner: string; due: string; amount: number; status: string };

const ROWS: Row[] = [
  ...payments.map((p) => ({ kind: "支払" as const, partner: p.partner, due: p.dueDate, amount: p.amount, status: p.status })),
  ...receipts.map((r) => ({ kind: "入金" as const, partner: r.partner, due: r.dueDate, amount: r.amount, status: r.status })),
].sort((a, b) => a.due.localeCompare(b.due));

export default function Page() {
  return (
    <VariantShell n="06" title="テーブル中心" sub="KPI は上部に薄く、メインは要対応テーブル">
      <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-md border border-border bg-surface px-4 py-3">
        {STRIP.map((s) => (
          <div key={s.label}>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="tabular text-base font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-md border border-border bg-surface">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">
            近日の支払・入金予定（{ROWS.length} 件）
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">区分</th>
                <th className="px-4 py-2 text-left font-medium">期日</th>
                <th className="px-4 py-2 text-left font-medium">取引先</th>
                <th className="px-4 py-2 text-right font-medium">金額</th>
                <th className="px-4 py-2 text-left font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2">
                    <span className={
                      r.kind === "支払" ? "rounded bg-warning/10 px-1.5 py-0.5 text-xs text-warning" :
                      "rounded bg-success/10 px-1.5 py-0.5 text-xs text-success"
                    }>{r.kind}</span>
                  </td>
                  <td className="px-4 py-2 tabular">{r.due}</td>
                  <td className="px-4 py-2">{r.partner}</td>
                  <td className="px-4 py-2 text-right tabular">{fmt(r.amount)}</td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-md border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold">最近のアクティビティ</h2>
          <ul className="space-y-2 text-sm">
            {activities.map((a) => (
              <li key={a.id}>
                <p className="text-foreground">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.user} ・ {a.time}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </VariantShell>
  );
}
