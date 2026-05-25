import { grossProfit, kpis, tasks } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

const ACTIONS = [
  { label: "新規仕訳を入力", sub: "借方・貸方を起票" },
  { label: "請求書を発行", sub: "売掛として登録" },
  { label: "経費を申請", sub: "領収書を添付" },
  { label: "銀行明細を取込", sub: "CSV / 連携" },
  { label: "消込を実行", sub: "未消込 3 件" },
  { label: "月次締めへ", sub: `${tasks.todayTotal} 件の未処理` },
];

const STATS = [
  { label: "現預金", value: fmt(kpis.cashBalance) },
  { label: "売上", value: fmt(kpis.monthSales) },
  { label: "経費", value: fmt(kpis.monthExpenses) },
  { label: "利益", value: fmt(grossProfit) },
];

export default function Page() {
  return (
    <VariantShell n="19" title="クイックアクション中心" sub="数値は控えめ、よく使う操作を主役に">
      <div className="rounded-lg border border-border bg-surface px-5 py-3">
        <div className="flex flex-wrap gap-x-8 gap-y-1">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="tabular text-sm font-semibold text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        よく使う操作
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            type="button"
            className="rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-primary/50 hover:bg-muted/30"
          >
            <p className="text-base font-semibold text-foreground">{a.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{a.sub}</p>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        本日の状況
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "本日の未処理", value: `${tasks.todayTotal} 件` },
          { label: "未承認申請", value: `${tasks.unapprovedRequests} 件` },
          { label: "未払請求", value: `${tasks.unpaidBills} 件` },
          { label: "未入金請求", value: `${tasks.unpaidInvoices} 件` },
        ].map((t) => (
          <div key={t.label} className="rounded-md bg-muted/40 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">{t.label}</p>
            <p className="tabular text-base font-semibold text-foreground">{t.value}</p>
          </div>
        ))}
      </div>
    </VariantShell>
  );
}
