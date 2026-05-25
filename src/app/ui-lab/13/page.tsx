import { changePct, grossProfit, kpis, trend } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

const STRIP = [
  { label: "現預金", value: fmt(kpis.cashBalance) },
  { label: "売上", value: fmt(kpis.monthSales) },
  { label: "経費", value: fmt(kpis.monthExpenses) },
  { label: "利益", value: fmt(grossProfit) },
];

export default function Page() {
  const maxVal = Math.max(...trend.flatMap((t) => [t.sales, t.expenses]));
  return (
    <VariantShell n="13" title="チャート中心" sub="売上・経費の月次推移を主役に">
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {STRIP.map((s) => (
          <div key={s.label}>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="tabular text-base font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-foreground">月次推移（直近 6 ヶ月）</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-primary" />売上</span>
            <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-muted-foreground/50" />経費</span>
          </div>
        </div>

        <div className="grid grid-cols-6 items-end gap-3 sm:gap-6">
          {trend.map((t) => {
            const sH = Math.round((t.sales / maxVal) * 200);
            const eH = Math.round((t.expenses / maxVal) * 200);
            return (
              <div key={t.month} className="flex flex-col items-center">
                <div className="flex h-[220px] items-end gap-1">
                  <div className="w-5 rounded-t-sm bg-primary" style={{ height: `${sH}px` }} title={fmt(t.sales)} />
                  <div className="w-5 rounded-t-sm bg-muted-foreground/40" style={{ height: `${eH}px` }} title={fmt(t.expenses)} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{t.month}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">今月売上</p>
            <p className="tabular text-2xl font-semibold text-foreground">{fmt(kpis.monthSales)}</p>
            <Delta pct={changePct(kpis.monthSales, kpis.prevMonthSales)} goodWhenUp />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">今月経費</p>
            <p className="tabular text-2xl font-semibold text-foreground">{fmt(kpis.monthExpenses)}</p>
            <Delta pct={changePct(kpis.monthExpenses, kpis.prevMonthExpenses)} goodWhenUp={false} />
          </div>
        </div>
      </section>
    </VariantShell>
  );
}
