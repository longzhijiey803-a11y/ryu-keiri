import { activities, alerts, closing, grossProfit, kpis, tasks } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

const KPI = [
  { label: "現預金残高", value: fmt(kpis.cashBalance) },
  { label: "今月売上", value: fmt(kpis.monthSales) },
  { label: "前月売上", value: fmt(kpis.prevMonthSales) },
  { label: "今月経費", value: fmt(kpis.monthExpenses) },
  { label: "前月経費", value: fmt(kpis.prevMonthExpenses) },
  { label: "利益概算", value: fmt(grossProfit) },
];

export default function Page() {
  return (
    <VariantShell n="04" title="高密度グリッド" sub="KPI 6 枚を細かく並べ、下に補助セクションを 2×2 で">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {KPI.map((k) => (
          <div key={k.label} className="rounded-md border border-border bg-surface px-3 py-2.5">
            <p className="truncate text-[11px] text-muted-foreground">{k.label}</p>
            <p className="mt-0.5 tabular text-sm font-semibold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Section title="要対応">
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center justify-between"><span className="text-muted-foreground">本日の未処理</span><span className="tabular font-medium">{tasks.todayTotal} 件</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">未承認申請</span><span className="tabular font-medium">{tasks.unapprovedRequests} 件</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">未払請求</span><span className="tabular font-medium">{tasks.unpaidBills} 件</span></li>
            <li className="flex items-center justify-between"><span className="text-muted-foreground">未入金請求</span><span className="tabular font-medium">{tasks.unpaidInvoices} 件</span></li>
          </ul>
        </Section>

        <Section title="月次締め">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{closing.period}</span>
            <span className="tabular font-medium">{closing.progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${closing.progress}%` }} />
          </div>
          <ul className="mt-3 space-y-1 text-xs">
            {closing.steps.map((s) => (
              <li key={s.label} className="flex items-center justify-between">
                <span className={s.state === "done" ? "line-through text-muted-foreground" : "text-foreground"}>{s.label}</span>
                <span className="text-muted-foreground">
                  {s.state === "done" ? "完了" : s.state === "in_progress" ? "進行中" : "未着手"}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="アラート">
          <ul className="space-y-1.5 text-sm">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-baseline gap-2">
                <span className="tabular text-xs text-muted-foreground">{a.date}</span>
                <span className="truncate text-foreground">{a.label}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="アクティビティ">
          <ul className="space-y-1.5 text-sm">
            {activities.slice(0, 4).map((a) => (
              <li key={a.id} className="flex items-baseline gap-2">
                <span className="tabular text-xs text-muted-foreground">{a.time}</span>
                <span className="truncate text-foreground">{a.action}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </VariantShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-border bg-surface p-3">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}
