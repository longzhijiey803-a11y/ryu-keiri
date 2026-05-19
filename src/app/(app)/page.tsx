import Link from "next/link";
import {
  ArrowRightLeft,
  CalendarCheck2,
  ClipboardCheck,
  FileText,
  HandCoins,
  Landmark,
  NotebookPen,
  Paperclip,
  Receipt,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { Avatar } from "@/components/ui";
import { CURRENT_USER, CURRENT_USER_ID } from "@/lib/current-user";
import { EXPENSE_CLAIMS } from "@/lib/expense-data";
import { myPendingTasks, myRequests } from "@/lib/workflow-data";
import { ALL_INVOICES } from "@/lib/invoice-data";
import { isOverdue } from "@/lib/types/invoice";
import { BANK_TXNS } from "@/lib/bank-data";
import { DOCUMENTS } from "@/lib/document-data";
import { isUnlinked } from "@/lib/types/document";
import { AUDIT_LOGS } from "@/lib/audit-data";
import { AUDIT_ACTION_LABEL } from "@/lib/types/audit";
import { PERIOD, TODAY } from "@/lib/dashboard-data";
import { formatISODateTime } from "@/lib/utils";

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

export default function HomePage() {
  const myPending = myPendingTasks(EXPENSE_CLAIMS, CURRENT_USER_ID).length;
  const myReturned = myRequests(EXPENSE_CLAIMS, CURRENT_USER_ID).filter(
    (c) => c.status === "returned",
  ).length;
  const overdueInvoices = ALL_INVOICES.filter(isOverdue).length;
  const unreconciled = BANK_TXNS.filter(
    (t) => t.recon_status !== "reconciled",
  ).length;
  const unlinkedDocs = DOCUMENTS.filter(isUnlinked).length;
  const recent = AUDIT_LOGS.slice(0, 6);

  return (
    <>
      <PageHeader
        title="ホーム"
        description={`本日 ${TODAY} ・ ${PERIOD} ｜ よく使う導線と当日のタスク`}
      />

      {/* 挨拶 */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-5 shadow-card">
        <Avatar name={CURRENT_USER.name} />
        <div>
          <p className="text-md font-semibold text-foreground">
            こんにちは、{CURRENT_USER.name} さん
          </p>
          <p className="text-sm text-muted-foreground">
            本日対応すべきタスクと、よく使う操作をまとめています。
          </p>
        </div>
      </div>

      {/* 自分の要対応 */}
      <section className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          あなたの要対応
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <KpiCard
            label="自分の承認待ち"
            value={`${myPending} 件`}
            sub="あなたが承認者"
            icon={ClipboardCheck}
            tone={myPending ? "warning" : "default"}
            href="/approvals"
          />
          <KpiCard
            label="差戻しの申請"
            value={`${myReturned} 件`}
            sub="自分の経費申請"
            icon={RotateCcw}
            tone={myReturned ? "danger" : "default"}
            href="/expenses/claims"
          />
          <KpiCard
            label="期限超過の請求"
            value={`${overdueInvoices} 件`}
            sub="発行・受領"
            icon={FileText}
            tone={overdueInvoices ? "danger" : "default"}
            href="/invoices"
          />
          <KpiCard
            label="未消込明細"
            value={`${unreconciled} 件`}
            sub="入出金の照合"
            icon={Landmark}
            tone={unreconciled ? "warning" : "default"}
            href="/reconciliation"
          />
          <KpiCard
            label="未提出証憑"
            value={`${unlinkedDocs} 件`}
            sub="取引・仕訳に未紐づけ"
            icon={Paperclip}
            tone={unlinkedDocs ? "danger" : "default"}
            href="/documents"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* よく使う導線 */}
        <div className="lg:col-span-2">
          <SectionCard title="よく使う導線" description="ワンクリックで開始">
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
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
        </div>

        {/* 最近のアクティビティ */}
        <SectionCard
          title="最近のアクティビティ"
          href="/audit-logs"
          hrefLabel="監査ログ"
        >
          <ul className="divide-y divide-border">
            {recent.map((l) => (
              <li key={l.id} className="flex gap-3 px-5 py-3">
                <Avatar name={l.user.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{l.user.name}</span> が{" "}
                    {l.target} を{AUDIT_ACTION_LABEL[l.action]}
                  </p>
                  <p className="tabular text-xs text-muted-foreground">
                    {formatISODateTime(l.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
