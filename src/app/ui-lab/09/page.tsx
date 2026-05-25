import { alerts, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

type Bar = {
  label: string;
  current: number;
  target: number;
  sub: string;
  tone: "primary" | "success" | "warning" | "danger";
};

const SAFE_CASH = 5_000_000;

const BARS: Bar[] = [
  {
    label: "今月売上 vs 前月",
    current: kpis.monthSales,
    target: Math.max(kpis.prevMonthSales, kpis.monthSales),
    sub: `今月 ${fmt(kpis.monthSales)} / 前月 ${fmt(kpis.prevMonthSales)}`,
    tone: kpis.monthSales >= kpis.prevMonthSales ? "success" : "warning",
  },
  {
    label: "今月経費 vs 前月",
    current: kpis.monthExpenses,
    target: Math.max(kpis.prevMonthExpenses, kpis.monthExpenses),
    sub: `今月 ${fmt(kpis.monthExpenses)} / 前月 ${fmt(kpis.prevMonthExpenses)}`,
    tone: kpis.monthExpenses <= kpis.prevMonthExpenses ? "success" : "warning",
  },
  {
    label: "利益 vs 前月",
    current: grossProfit,
    target: Math.max(prevGrossProfit, grossProfit),
    sub: `今月 ${fmt(grossProfit)} / 前月 ${fmt(prevGrossProfit)}`,
    tone: grossProfit >= prevGrossProfit ? "success" : "danger",
  },
  {
    label: "現預金（安全水準）",
    current: kpis.cashBalance,
    target: Math.max(SAFE_CASH * 2, kpis.cashBalance),
    sub: `現在 ${fmt(kpis.cashBalance)} / 安全水準 ${fmt(SAFE_CASH)}`,
    tone: kpis.cashBalance >= SAFE_CASH ? "primary" : "danger",
  },
];

const TONE_BG: Record<Bar["tone"], string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export default function Page() {
  return (
    <VariantShell n="09" title="進捗バー視覚化" sub="数字より相対関係を見せる。前月比・水準比をバーで表す">
      <div className="space-y-4">
        {BARS.map((b) => {
          const pct = Math.max(0, Math.min(100, Math.round((b.current / b.target) * 100)));
          return (
            <div key={b.label} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-sm font-medium text-foreground">{b.label}</p>
                <p className="tabular text-xs text-muted-foreground">{pct}%</p>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${TONE_BG[b.tone]}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 tabular text-xs text-muted-foreground">{b.sub}</p>
            </div>
          );
        })}
      </div>

      <section className="mt-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold">注意事項</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {alerts.slice(0, 3).map((a) => (
            <li key={a.id}>・{a.label}</li>
          ))}
        </ul>
      </section>
    </VariantShell>
  );
}
