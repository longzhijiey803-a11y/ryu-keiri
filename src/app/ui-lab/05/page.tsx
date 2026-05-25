import { activities, alerts, changePct, grossProfit, kpis } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

export default function Page() {
  const salesPct = changePct(kpis.monthSales, kpis.prevMonthSales);
  return (
    <VariantShell n="05" title="タイル・モザイク" sub="大きい主タイル + 周りに小タイル">
      <div className="grid gap-3 lg:grid-cols-3 lg:grid-rows-2">
        {/* 主役: 売上タイル */}
        <div className="rounded-xl bg-primary p-6 text-primary-foreground lg:col-span-2 lg:row-span-2">
          <p className="text-sm font-medium opacity-80">今月売上</p>
          <p className="mt-3 tabular text-5xl font-bold">{fmt(kpis.monthSales)}</p>
          <p className="mt-2 text-sm opacity-80">
            前月比 {salesPct >= 0 ? "+" : ""}{salesPct.toFixed(1)}% ・ 前月 {fmt(kpis.prevMonthSales)}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <Stat label="経費" value={fmt(kpis.monthExpenses)} />
            <Stat label="利益" value={fmt(grossProfit)} />
          </div>
        </div>

        {/* 小タイル */}
        <Tile label="現預金残高" value={fmt(kpis.cashBalance)} pct={changePct(kpis.cashBalance, kpis.cashPrevMonthEnd)} />
        <Tile
          label="近日支払予定"
          value={`${kpis.upcomingPaymentsCount} 件`}
          sub={fmt(kpis.upcomingPaymentsTotal)}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold">アラート</h2>
          <ul className="space-y-1.5 text-sm">
            {alerts.slice(0, 3).map((a) => (
              <li key={a.id} className="truncate">{a.label}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold">アクティビティ</h2>
          <ul className="space-y-1.5 text-sm">
            {activities.slice(0, 3).map((a) => (
              <li key={a.id} className="truncate">{a.action}</li>
            ))}
          </ul>
        </div>
      </div>
    </VariantShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 px-3 py-2">
      <p className="text-xs opacity-70">{label}</p>
      <p className="mt-0.5 tabular font-semibold">{value}</p>
    </div>
  );
}

function Tile({
  label,
  value,
  pct,
  sub,
}: {
  label: string;
  value: string;
  pct?: number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 tabular text-2xl font-semibold text-foreground">{value}</p>
      {pct !== undefined && <Delta pct={pct} goodWhenUp />}
      {sub && <p className="mt-0.5 tabular text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
