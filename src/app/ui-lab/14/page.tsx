import { activities, alerts, changePct, closing, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

export default function Page() {
  return (
    <VariantShell n="14" title="1 枚カード集約" sub="ロングカード 1 枚に全部を区切って並べる">
      <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <header className="border-b border-border bg-muted/40 px-6 py-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">本日のサマリ</p>
          <h2 className="mt-0.5 text-lg font-bold text-foreground">2026年5月 / 月次進捗 {closing.progress}%</h2>
        </header>

        <section className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {[
            { label: "現預金残高", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), good: true },
            { label: "今月売上", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), good: true },
            { label: "今月経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), good: false },
            { label: "利益概算", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), good: true },
          ].map((k) => (
            <div key={k.label} className="px-5 py-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-1 tabular text-lg font-semibold text-foreground">{fmt(k.value)}</p>
              <Delta pct={k.pct} goodWhenUp={k.good} />
            </div>
          ))}
        </section>

        <section className="border-t border-border px-6 py-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">注意が必要な項目</h3>
          <ul className="space-y-2">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className={
                  a.severity === "danger" ? "mt-1 size-1.5 shrink-0 rounded-full bg-danger" :
                  a.severity === "warning" ? "mt-1 size-1.5 shrink-0 rounded-full bg-warning" :
                  "mt-1 size-1.5 shrink-0 rounded-full bg-info"
                } />
                <span className="text-foreground">{a.label}</span>
                <span className="ml-auto truncate text-xs text-muted-foreground">{a.message}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border px-6 py-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">最近の操作</h3>
          <ul className="space-y-1.5 text-sm">
            {activities.slice(0, 4).map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="tabular text-xs text-muted-foreground">{a.time}</span>
                <span className="text-foreground">{a.user}</span>
                <span className="truncate text-muted-foreground">— {a.action}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </VariantShell>
  );
}
