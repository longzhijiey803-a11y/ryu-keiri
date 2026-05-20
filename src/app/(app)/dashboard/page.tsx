import {
  ClipboardCheck,
  FileText,
  HandCoins,
  ListChecks,
  PiggyBank,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AlertList } from "@/components/dashboard/alert-list";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ClosingProgress } from "@/components/dashboard/closing-progress";
import { ScheduleList } from "@/components/dashboard/schedule-list";
import { formatJPY } from "@/lib/utils";
import {
  PERIOD,
  TODAY,
  changePct,
  grossProfit,
  kpis,
  payments,
  prevGrossProfit,
  receipts,
  tasks,
} from "@/lib/dashboard-data";

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="ダッシュボード"
        description={`本日 ${TODAY} — 経理業務の状況サマリ`}
        actions={
          <span className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground">
            対象期間：{PERIOD}
          </span>
        }
      />

      {/* 要対応（未処理タスク優先表示） */}
      <section className="mb-8">
        <GroupLabel>要対応</GroupLabel>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="本日の未処理"
            value={`${tasks.todayTotal} 件`}
            sub="要確認タスクの合計"
            icon={ListChecks}
            tone="primary"
            href="/transactions"
          />
          <KpiCard
            label="未承認申請"
            value={`${tasks.unapprovedRequests} 件`}
            sub="経費・支払の承認待ち"
            icon={ClipboardCheck}
            tone="warning"
            href="/approvals"
          />
          <KpiCard
            label="未払請求"
            value={`${tasks.unpaidBills} 件`}
            sub="買掛・支払予定"
            icon={FileText}
            tone="warning"
            href="/invoices"
          />
          <KpiCard
            label="未入金請求"
            value={`${tasks.unpaidInvoices} 件`}
            sub="売掛・入金待ち"
            icon={HandCoins}
            tone="danger"
            href="/receivables"
          />
        </div>
      </section>

      {/* 経営サマリ */}
      <section className="mb-8">
        <GroupLabel>経営サマリ</GroupLabel>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="現預金残高"
            value={formatJPY(kpis.cashBalance)}
            sub={`前月末 ${formatJPY(kpis.cashPrevMonthEnd)}`}
            icon={Wallet}
            tone="primary"
            delta={{
              pct: changePct(kpis.cashBalance, kpis.cashPrevMonthEnd),
              goodWhenUp: true,
            }}
          />
          <KpiCard
            label="今月売上"
            value={formatJPY(kpis.monthSales)}
            sub={`前月 ${formatJPY(kpis.prevMonthSales)}`}
            icon={TrendingUp}
            delta={{
              pct: changePct(kpis.monthSales, kpis.prevMonthSales),
              goodWhenUp: true,
            }}
          />
          <KpiCard
            label="今月経費"
            value={formatJPY(kpis.monthExpenses)}
            sub={`前月 ${formatJPY(kpis.prevMonthExpenses)}`}
            icon={Receipt}
            delta={{
              pct: changePct(kpis.monthExpenses, kpis.prevMonthExpenses),
              goodWhenUp: false,
            }}
          />
          <KpiCard
            label="利益概算"
            value={formatJPY(grossProfit)}
            sub="今月売上 − 今月経費"
            icon={PiggyBank}
            tone="primary"
            delta={{
              pct: changePct(grossProfit, prevGrossProfit),
              goodWhenUp: true,
            }}
          />
        </div>
      </section>

      {/* メイン2カラム */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="月次推移（売上・経費）"
            description="直近6ヶ月"
            href="/reports"
          >
            <TrendChart />
          </SectionCard>

          <div className="grid gap-6 sm:grid-cols-2">
            <SectionCard
              title="近日支払予定"
              description={`${kpis.upcomingPaymentsCount}件 / ${formatJPY(
                kpis.upcomingPaymentsTotal,
              )}`}
              href="/banking"
            >
              <ScheduleList
                rows={payments}
                emptyTitle="近日の支払予定はありません"
              />
            </SectionCard>

            <SectionCard
              title="入金予定"
              description="期日が近い売掛"
              href="/receivables"
            >
              <ScheduleList
                rows={receipts}
                emptyTitle="入金予定はありません"
              />
            </SectionCard>
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="重要アラート"
            description="期限超過・資金繰り・要整備"
          >
            <AlertList />
          </SectionCard>

          <SectionCard title="月次締め進捗" href="/closing">
            <ClosingProgress />
          </SectionCard>

          <SectionCard
            title="最近のアクティビティ"
            href="/audit-log"
            hrefLabel="監査ログ"
          >
            <ActivityFeed />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
