import { alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

const ITEMS = [
  { label: "現預金", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), goodWhenUp: true },
  { label: "売上", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), goodWhenUp: true },
  { label: "経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), goodWhenUp: false },
  { label: "利益", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), goodWhenUp: true },
];

export default function Page() {
  return (
    <VariantShell n="03" title="数値先行・罫線レス" sub="特大数字とラベルのみ。カードや影は使わない">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it, i) => (
          <div
            key={it.label}
            className={
              i % 4 === 0
                ? "p-4"
                : "border-l border-border/60 p-4 first:border-0 lg:border-l"
            }
          >
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.label}</p>
            <p className="mt-2 tabular text-4xl font-light tracking-tight text-foreground">
              {fmt(it.value, { compact: true })}
            </p>
            <Delta pct={it.pct} goodWhenUp={it.goodWhenUp} className="mt-1" />
          </div>
        ))}
      </div>

      <hr className="my-8 border-border" />

      <section>
        <h2 className="text-[11px] uppercase tracking-wider text-muted-foreground">
          アラート
        </h2>
        <ul className="mt-3 space-y-2">
          {alerts.map((a) => (
            <li key={a.id} className="text-sm">
              <span className="text-foreground">{a.label}</span>
              <span className="ml-2 text-muted-foreground">— {a.message}</span>
            </li>
          ))}
        </ul>
      </section>
    </VariantShell>
  );
}
