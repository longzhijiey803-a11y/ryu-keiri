import { activities, alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

const ITEMS = [
  { label: "現預金残高", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), goodWhenUp: true },
  { label: "今月売上", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), goodWhenUp: true },
  { label: "今月経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), goodWhenUp: false },
  { label: "利益概算", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), goodWhenUp: true },
];

export default function Page() {
  return (
    <VariantShell n="01" title="標準・コンパクト" sub="KPI 4枚 + アラート / アクティビティ">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.label} className="rounded-lg border border-border bg-surface p-4">
            <p className="text-xs text-muted-foreground">{it.label}</p>
            <p className="mt-1 tabular text-xl font-semibold text-foreground">{fmt(it.value)}</p>
            <div className="mt-1.5">
              <Delta pct={it.pct} goodWhenUp={it.goodWhenUp} />
              <span className="ml-1 text-xs text-muted-foreground">前月比</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">アラート</h2>
          <ul className="divide-y divide-border">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-start gap-2 px-4 py-3 text-sm">
                <span className={
                  a.severity === "danger" ? "mt-1 size-1.5 shrink-0 rounded-full bg-danger" :
                  a.severity === "warning" ? "mt-1 size-1.5 shrink-0 rounded-full bg-warning" :
                  "mt-1 size-1.5 shrink-0 rounded-full bg-info"
                } />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{a.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-surface">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">アクティビティ</h2>
          <ul className="divide-y divide-border">
            {activities.map((a) => (
              <li key={a.id} className="px-4 py-3 text-sm">
                <p className="text-foreground">{a.action}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.user} ・ {a.time}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </VariantShell>
  );
}
