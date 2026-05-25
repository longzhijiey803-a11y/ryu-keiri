import { alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

const SUB = [
  { label: "現預金残高", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), goodWhenUp: true },
  { label: "今月経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), goodWhenUp: false },
  { label: "利益概算", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), goodWhenUp: true },
];

export default function Page() {
  const salesPct = changePct(kpis.monthSales, kpis.prevMonthSales);
  return (
    <VariantShell n="02" title="ヒーロー＋小カード" sub="今月売上を主役に据え、補助 KPI を 3 枚で並べる">
      <section className="rounded-xl border border-border bg-gradient-to-br from-primary/[0.08] to-transparent p-8">
        <p className="text-sm font-medium text-muted-foreground">今月売上</p>
        <p className="mt-2 tabular text-5xl font-bold tracking-tight text-foreground">
          {fmt(kpis.monthSales)}
        </p>
        <div className="mt-3 flex items-baseline gap-3">
          <Delta pct={salesPct} goodWhenUp className="text-sm" />
          <span className="text-sm text-muted-foreground">
            前月 {fmt(kpis.prevMonthSales)}
          </span>
        </div>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {SUB.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 tabular text-lg font-semibold text-foreground">{fmt(s.value)}</p>
            <Delta pct={s.pct} goodWhenUp={s.goodWhenUp} />
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">優先アラート</h2>
        <ul className="space-y-2">
          {alerts.slice(0, 3).map((a) => (
            <li key={a.id} className="flex items-baseline gap-2 text-sm">
              <span className={
                a.severity === "danger" ? "tabular text-xs font-semibold text-danger" :
                a.severity === "warning" ? "tabular text-xs font-semibold text-warning" :
                "tabular text-xs font-semibold text-info"
              }>
                ●
              </span>
              <span className="font-medium text-foreground">{a.label}</span>
              <span className="ml-auto truncate text-xs text-muted-foreground">{a.message}</span>
            </li>
          ))}
        </ul>
      </section>
    </VariantShell>
  );
}
