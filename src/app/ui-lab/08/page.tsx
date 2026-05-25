import { alerts, changePct, grossProfit, kpis, prevGrossProfit } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

const KPI = [
  { icon: "💰", tone: "bg-primary/10 text-primary", label: "現預金残高", value: kpis.cashBalance, pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd), goodWhenUp: true },
  { icon: "📈", tone: "bg-success/10 text-success", label: "今月売上", value: kpis.monthSales, pct: changePct(kpis.monthSales, kpis.prevMonthSales), goodWhenUp: true },
  { icon: "🧾", tone: "bg-warning/10 text-warning", label: "今月経費", value: kpis.monthExpenses, pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses), goodWhenUp: false },
  { icon: "🐷", tone: "bg-info/10 text-info", label: "利益概算", value: grossProfit, pct: changePct(grossProfit, prevGrossProfit), goodWhenUp: true },
];

export default function Page() {
  return (
    <VariantShell n="08" title="アイコン強調" sub="丸アイコンを大きく、数値はその右に">
      <div className="grid gap-3 sm:grid-cols-2">
        {KPI.map((k) => (
          <div key={k.label} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
            <span className={`flex size-14 shrink-0 items-center justify-center rounded-full text-2xl ${k.tone}`}>
              {k.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <p className="tabular text-2xl font-semibold text-foreground">{fmt(k.value)}</p>
              <Delta pct={k.pct} goodWhenUp={k.goodWhenUp} />
            </div>
          </div>
        ))}
      </div>

      <section className="mt-6 flex flex-wrap gap-2">
        {alerts.map((a) => (
          <span
            key={a.id}
            className={
              a.severity === "danger" ? "rounded-full border border-danger/30 bg-danger/5 px-3 py-1.5 text-xs text-danger" :
              a.severity === "warning" ? "rounded-full border border-warning/30 bg-warning/5 px-3 py-1.5 text-xs text-warning" :
              "rounded-full border border-info/30 bg-info/5 px-3 py-1.5 text-xs text-info"
            }
          >
            {a.label}
          </span>
        ))}
      </section>
    </VariantShell>
  );
}
