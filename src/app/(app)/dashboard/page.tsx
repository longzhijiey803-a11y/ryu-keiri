import Link from "next/link";
import {
  ArrowRightLeft,
  CalendarCheck2,
  ClipboardCheck,
  FileText,
  HandCoins,
  Landmark,
  ListChecks,
  NotebookPen,
  Paperclip,
  PiggyBank,
  Receipt,
  RotateCcw,
  TrendingUp,
  Wallet,
  type LucideIcon,
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
import { CURRENT_USER, CURRENT_USER_ID } from "@/lib/current-user";
import { EXPENSE_CLAIMS } from "@/lib/expense-data";
import { myPendingTasks, myRequests } from "@/lib/workflow-data";
import { ALL_INVOICES } from "@/lib/invoice-data";
import { isOverdue } from "@/lib/types/invoice";
import { BANK_TXNS } from "@/lib/bank-data";
import { DOCUMENTS } from "@/lib/document-data";
import { isUnlinked } from "@/lib/types/document";
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

/** ホームから移管：よく使う導線。 */
const QUICK_LINKS: {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { href: "/transactions", label: "取引を登録", desc: "売上・仕入・経費など", icon: ArrowRightLeft },
  { href: "/invoices/issued", label: "請求書を発行", desc: "発行・送付・売掛", icon: FileText },
  { href: "/expenses/claims", label: "経費を申請", desc: "領収書を添付して申請", icon: Receipt },
  { href: "/journal-entries", label: "仕訳を入力", desc: "複式・自動仕訳候補", icon: NotebookPen },
  { href: "/reconciliation", label: "消込", desc: "入出金と請求の照合", icon: Landmark },
  { href: "/monthly-close", label: "月次決算", desc: "締めチェックリスト", icon: CalendarCheck2 },
  { href: "/documents", label: "証憑をアップロード", desc: "電帳法を意識した保管", icon: Paperclip },
  { href: "/receivables", label: "売掛・買掛", desc: "回収・支払の管理", icon: HandCoins },
];

export default function DashboardPage() {
  // ホームから移管：個人視点の要対応件数
  const myPending = myPendingTasks(EXPENSE_CLAIMS, CURRENT_USER_ID).length;
  const myReturned = myRequests(EXPENSE_CLAIMS, CURRENT_USER_ID).filter(
    (c) => c.status === "returned",
  ).length;
  const overdueInvoices = ALL_INVOICES.filter(isOverdue).length;
  const unreconciled = BANK_TXNS.filter(
    (t) => t.recon_status !== "reconciled",
  ).length;
  const unlinkedDocs = DOCUMENTS.filter(isUnlinked).length;

  return (
    <>
      <PageHeader
        title="ダッシュボード"
        description={`こんにちは、${CURRENT_USER.name} さん ・ 本日 ${TODAY} ｜ 本日対応すべきタスクと、よく使う操作をまとめています。`}
        actions={
          <span className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground">
            対象期間：{PERIOD}
          </span>
        }
      />

      {/* 経営サマリ（16案：カラフル・フル背景） */}
      <section className="mb-8">
        <GroupLabel>経営サマリ</GroupLabel>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="現預金残高"
            value={formatJPY(kpis.cashBalance)}
            sub={`前月末 ${formatJPY(kpis.cashPrevMonthEnd)}`}
            icon={Wallet}
            tone="indigo"
            vivid
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
            tone="emerald"
            vivid
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
            tone="amber"
            vivid
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
            tone="rose"
            vivid
            delta={{
              pct: changePct(grossProfit, prevGrossProfit),
              goodWhenUp: true,
            }}
          />
        </div>
      </section>

      {/* あなたの要対応（ホームから移管：個人視点） */}
      <section className="mb-8">
        <GroupLabel>あなたの要対応</GroupLabel>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <KpiCard
            label="自分の承認待ち"
            value={`${myPending} 件`}
            sub="あなたが承認者"
            icon={ClipboardCheck}
            tone={myPending ? "amber" : "default"}
            href="/approvals"
          />
          <KpiCard
            label="差戻しの申請"
            value={`${myReturned} 件`}
            sub="自分の経費申請"
            icon={RotateCcw}
            tone={myReturned ? "rose" : "default"}
            href="/expenses/claims"
          />
          <KpiCard
            label="期限超過の請求"
            value={`${overdueInvoices} 件`}
            sub="発行・受領"
            icon={FileText}
            tone={overdueInvoices ? "rose" : "default"}
            href="/invoices"
          />
          <KpiCard
            label="未消込明細"
            value={`${unreconciled} 件`}
            sub="入出金の照合"
            icon={Landmark}
            tone={unreconciled ? "amber" : "default"}
            href="/reconciliation"
          />
          <KpiCard
            label="未提出証憑"
            value={`${unlinkedDocs} 件`}
            sub="取引・仕訳に未紐づけ"
            icon={Paperclip}
            tone={unlinkedDocs ? "rose" : "default"}
            href="/documents"
          />
        </div>
      </section>

      {/* 要対応（組織全体の未処理タスク） */}
      <section className="mb-8">
        <GroupLabel>要対応（全社）</GroupLabel>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="本日の未処理"
            value={`${tasks.todayTotal} 件`}
            sub="要確認タスクの合計"
            icon={ListChecks}
            tone="indigo"
            href="/transactions"
          />
          <KpiCard
            label="未承認申請"
            value={`${tasks.unapprovedRequests} 件`}
            sub="経費・支払の承認待ち"
            icon={ClipboardCheck}
            tone="amber"
            href="/approvals"
          />
          <KpiCard
            label="未払請求"
            value={`${tasks.unpaidBills} 件`}
            sub="買掛・支払予定"
            icon={FileText}
            tone="amber"
            href="/invoices"
          />
          <KpiCard
            label="未入金請求"
            value={`${tasks.unpaidInvoices} 件`}
            sub="売掛・入金待ち"
            icon={HandCoins}
            tone="rose"
            href="/receivables"
          />
        </div>
      </section>

      {/* よく使う導線（ホームから移管） */}
      <section className="mb-8">
        <SectionCard title="よく使う導線" description="ワンクリックで開始">
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex items-center gap-3 rounded-md border border-border bg-surface p-3 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {q.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {q.desc}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </SectionCard>
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

          <SectionCard
            title="近日支払予定"
            description={`${kpis.upcomingPaymentsCount}件 / ${formatJPY(
              kpis.upcomingPaymentsTotal,
            )}`}
            href="/cash"
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

        <div className="space-y-6">
          <SectionCard
            title="重要アラート"
            description="期限超過・資金繰り・要整備"
          >
            <AlertList />
          </SectionCard>

          <SectionCard title="月次締め進捗" href="/monthly-close">
            <ClosingProgress />
          </SectionCard>

          <SectionCard
            title="最近のアクティビティ"
            href="/audit-logs"
            hrefLabel="監査ログ"
          >
            <ActivityFeed />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
