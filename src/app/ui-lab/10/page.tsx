import { activities, alerts, grossProfit, kpis } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

const KPI = [
  { label: "現預金", value: fmt(kpis.cashBalance) },
  { label: "売上", value: fmt(kpis.monthSales) },
  { label: "経費", value: fmt(kpis.monthExpenses) },
  { label: "利益", value: fmt(grossProfit) },
];

export default function Page() {
  return (
    <VariantShell n="10" title="ミニマル・罫線最小" sub="カード・影なし。ラベルと数字だけで構成">
      <dl className="grid grid-cols-2 gap-y-6 lg:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label}>
            <dt className="text-xs text-muted-foreground">{k.label}</dt>
            <dd className="tabular text-2xl font-medium tracking-tight text-foreground">{k.value}</dd>
          </div>
        ))}
      </dl>

      <hr className="my-10 border-border" />

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm text-muted-foreground">アラート</h2>
          <ul className="space-y-2 text-sm text-foreground">
            {alerts.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="tabular text-muted-foreground">{a.date}</span>
                <span>{a.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-sm text-muted-foreground">アクティビティ</h2>
          <ul className="space-y-2 text-sm text-foreground">
            {activities.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="tabular text-muted-foreground">{a.time}</span>
                <span>{a.action}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </VariantShell>
  );
}
