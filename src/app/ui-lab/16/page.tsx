import { alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

const KPI = [
  { label: "現預金残高", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), good: true,
    bg: "bg-indigo-500", fg: "text-white" },
  { label: "今月売上", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), good: true,
    bg: "bg-emerald-500", fg: "text-white" },
  { label: "今月経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), good: false,
    bg: "bg-amber-500", fg: "text-white" },
  { label: "利益概算", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), good: true,
    bg: "bg-rose-500", fg: "text-white" },
];

export default function Page() {
  return (
    <VariantShell n="16" title="カラフル・フル背景" sub="KPI ごとに別色のベタ塗りカード">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className={`rounded-2xl ${k.bg} ${k.fg} p-5 shadow-sm`}>
            <p className="text-xs opacity-80">{k.label}</p>
            <p className="mt-2 tabular text-3xl font-bold tracking-tight">{fmt(k.value)}</p>
            <p className="mt-1 text-xs opacity-90">
              {k.pct >= 0 ? "▲" : "▼"} {Math.abs(k.pct).toFixed(1)}% 前月比
            </p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl bg-zinc-900 p-5 text-white">
        <h2 className="mb-3 text-sm font-semibold">注意項目</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {alerts.slice(0, 4).map((a) => (
            <li key={a.id} className="rounded-md bg-white/10 px-3 py-2 text-sm">
              <p className="font-medium">{a.label}</p>
              <p className="mt-0.5 truncate text-xs opacity-70">{a.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </VariantShell>
  );
}
