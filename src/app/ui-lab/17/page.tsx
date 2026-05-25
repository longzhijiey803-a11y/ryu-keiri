import { changePct, grossProfit, kpis, prevGrossProfit, trend } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

function Sparkline({
  series,
  tone = "primary",
}: {
  series: number[];
  tone?: "primary" | "success" | "warning";
}) {
  const w = 120;
  const h = 36;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const points = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke =
    tone === "success" ? "stroke-success" :
    tone === "warning" ? "stroke-warning" :
    "stroke-primary";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-9 w-[120px] ${stroke}`} fill="none" strokeWidth="1.5">
      <polyline points={points} />
    </svg>
  );
}

const salesSeries = trend.map((t) => t.sales);
const expSeries = trend.map((t) => t.expenses);
const profitSeries = trend.map((t) => t.sales - t.expenses);
const cashSeries = [7_120_000, 7_460_000, 7_820_000, 7_900_000, kpis.cashPrevMonthEnd, kpis.cashBalance];

const KPI = [
  { label: "現預金残高", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), good: true, series: cashSeries, tone: "primary" as const },
  { label: "今月売上", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), good: true, series: salesSeries, tone: "success" as const },
  { label: "今月経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), good: false, series: expSeries, tone: "warning" as const },
  { label: "利益概算", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), good: true, series: profitSeries, tone: "primary" as const },
];

export default function Page() {
  return (
    <VariantShell n="17" title="Sparkline 付き KPI" sub="数値の横に直近 6 ヶ月の小グラフ">
      <div className="grid gap-3 sm:grid-cols-2">
        {KPI.map((k) => (
          <div key={k.label} className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-0.5 tabular text-xl font-semibold text-foreground">{fmt(k.value)}</p>
              <Delta pct={k.pct} goodWhenUp={k.good} />
            </div>
            <Sparkline series={k.series} tone={k.tone} />
          </div>
        ))}
      </div>
    </VariantShell>
  );
}
