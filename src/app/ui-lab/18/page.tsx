import { alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

export default function Page() {
  const salesPct = changePct(kpis.monthSales, kpis.prevMonthSales);
  const profitPct = changePct(grossProfit, prevGrossProfit);
  return (
    <VariantShell n="18" title="ニュース紙面風" sub="編集記事のように見出し＋リード＋本文">
      <article className="rounded-lg border border-border bg-surface p-8 font-serif">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">2026年5月 / 経理週報</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-foreground">
          今月の売上は前月比 {salesPct >= 0 ? "+" : ""}{salesPct.toFixed(1)}%、利益も {profitPct >= 0 ? "+" : ""}{profitPct.toFixed(1)}% で推移
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {fmt(kpis.monthSales)} の売上、{fmt(kpis.monthExpenses)} の経費で、利益概算は {fmt(grossProfit)} となった。
          現預金残高は {fmt(kpis.cashBalance)} まで積み上がり、安全水準を上回って推移している。
          一方、支払期日を超過した請求が 2 件、入金が遅れている売掛が 1 件あり、早期の対応が望まれる。
        </p>

        <div className="my-6 grid grid-cols-3 gap-6 border-y border-border py-4 text-center">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">売上</p>
            <p className="tabular text-2xl font-bold text-foreground">{fmt(kpis.monthSales)}</p>
          </div>
          <div className="border-x border-border">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">経費</p>
            <p className="tabular text-2xl font-bold text-foreground">{fmt(kpis.monthExpenses)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">利益</p>
            <p className="tabular text-2xl font-bold text-foreground">{fmt(grossProfit)}</p>
          </div>
        </div>

        <h3 className="mt-6 text-base font-semibold text-foreground">主な懸念事項</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground">
          {alerts.slice(0, 4).map((a) => (
            <li key={a.id} className="leading-7">
              <span className="font-semibold">{a.label}</span>
              <span className="ml-2 text-muted-foreground">— {a.message}</span>
            </li>
          ))}
        </ul>
      </article>
    </VariantShell>
  );
}
