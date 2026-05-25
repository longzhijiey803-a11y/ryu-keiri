import { activities, alerts, grossProfit, kpis } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

const KPI = [
  { label: "現預金", value: kpis.cashBalance },
  { label: "売上", value: kpis.monthSales },
  { label: "経費", value: kpis.monthExpenses },
  { label: "利益", value: grossProfit },
];

export default function Page() {
  return (
    <VariantShell n="20" title="和風・低彩度" sub="墨と紺、控えめな朱で落ち着いた配色">
      <div className="rounded-md border border-zinc-300 bg-stone-50 p-8 text-zinc-800">
        <header className="mb-6 flex items-baseline justify-between border-b border-zinc-300 pb-4">
          <h2 className="text-lg font-semibold tracking-wide">経理日誌</h2>
          <p className="text-xs text-zinc-500">令和八年 五月</p>
        </header>

        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {KPI.map((k) => (
            <div key={k.label} className="border-l-2 border-zinc-700/70 pl-3">
              <dt className="text-xs text-zinc-500">{k.label}</dt>
              <dd className="tabular text-xl font-semibold text-zinc-900">{fmt(k.value)}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="border-b border-zinc-300 pb-1 text-sm font-semibold text-zinc-700">
              要注意
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {alerts.slice(0, 4).map((a) => (
                <li key={a.id} className="flex gap-2">
                  <span className={
                    a.severity === "danger" ? "text-rose-700" :
                    a.severity === "warning" ? "text-amber-700" :
                    "text-sky-700"
                  }>※</span>
                  <span>{a.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="border-b border-zinc-300 pb-1 text-sm font-semibold text-zinc-700">
              本日の動き
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {activities.slice(0, 4).map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="tabular text-xs text-zinc-500">{a.time}</span>
                  <span>{a.action}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </VariantShell>
  );
}
