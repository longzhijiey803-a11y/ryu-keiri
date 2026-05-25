import { activities, alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

const KPI = [
  { label: "cash_balance", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), good: true },
  { label: "month_sales", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), good: true },
  { label: "month_expenses", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), good: false },
  { label: "gross_profit", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), good: true },
];

export default function Page() {
  return (
    <VariantShell n="11" title="ダーク・ターミナル風" sub="黒背景 + 等幅。CLI で覗くようなトーン">
      <div className="rounded-lg bg-zinc-950 p-6 font-mono text-sm text-emerald-300">
        <p className="mb-4 text-emerald-500">$ ryukeiri --summary 2026-05</p>
        <pre className="whitespace-pre-wrap text-xs leading-6 text-zinc-300">
{KPI.map((k) => {
  const pctStr = `${(k.pct >= 0 ? "+" : "")}${k.pct.toFixed(1)}%`;
  const tone = (k.good ? k.pct >= 0 : k.pct < 0) ? "+" : "-";
  return `${k.label.padEnd(18)} ${fmt(k.value).padStart(14)}   ${tone === "+" ? "▲" : "▼"} ${pctStr}`;
}).join("\n")}
        </pre>

        <p className="mt-6 text-emerald-500">$ ryukeiri --alerts</p>
        <ul className="mt-2 space-y-1 text-xs">
          {alerts.map((a) => (
            <li key={a.id} className="text-zinc-300">
              <span className={
                a.severity === "danger" ? "text-red-400" :
                a.severity === "warning" ? "text-amber-300" :
                "text-cyan-300"
              }>
                [{a.severity.toUpperCase().padEnd(7)}]
              </span>{" "}
              {a.label}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-emerald-500">$ ryukeiri --recent</p>
        <ul className="mt-2 space-y-1 text-xs text-zinc-400">
          {activities.map((a) => (
            <li key={a.id}>
              <span className="text-zinc-500">{a.time.padEnd(10)}</span> {a.user} :: {a.action}
            </li>
          ))}
        </ul>
      </div>
    </VariantShell>
  );
}
