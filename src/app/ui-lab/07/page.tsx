import { activities, alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

const KPI = [
  { label: "現預金残高", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), goodWhenUp: true },
  { label: "今月売上", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), goodWhenUp: true },
  { label: "今月経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), goodWhenUp: false },
  { label: "利益概算", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), goodWhenUp: true },
];

export default function Page() {
  return (
    <VariantShell n="07" title="2 カラム" sub="左に KPI 縦並び、右にアクティビティ＆アラート">
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <section className="space-y-2">
          {KPI.map((k) => (
            <div
              key={k.label}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="mt-0.5 tabular text-xl font-semibold text-foreground">{fmt(k.value)}</p>
              </div>
              <Delta pct={k.pct} goodWhenUp={k.goodWhenUp} className="text-sm" />
            </div>
          ))}
        </section>

        <aside className="rounded-lg border border-border bg-surface">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">フィード</h2>
          <ul className="divide-y divide-border">
            {[...alerts.slice(0, 2).map((a) => ({ id: a.id, kind: "alert" as const, ...a })), ...activities.map((a) => ({ id: a.id, kind: "act" as const, label: a.action, sub: `${a.user} ・ ${a.time}` }))].map((it) => (
              <li key={it.id} className="flex items-start gap-2 px-4 py-3 text-sm">
                <span className={
                  it.kind === "alert" ? "mt-1 size-1.5 shrink-0 rounded-full bg-danger" :
                  "mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground/40"
                } />
                <div className="min-w-0">
                  <p className="text-foreground">{"label" in it ? it.label : ""}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {"message" in it ? it.message : "sub" in it ? it.sub : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </VariantShell>
  );
}
