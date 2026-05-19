"use client";

import * as React from "react";
import {
  ArrowRightLeft,
  CalendarCheck2,
  Circle,
  CircleCheck,
  CircleDot,
  FileText,
  Landmark,
  Lock,
  Paperclip,
  Receipt,
} from "lucide-react";

import { Button, Card, Progress, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { cn, formatISODate, formatJPY } from "@/lib/utils";
import {
  CHECKLIST,
  CLOSE_DUE,
  CLOSE_OWNER,
  CLOSE_PERIOD,
  closeMetrics,
  type CloseStep,
  type StepState,
} from "@/lib/monthly-close-data";

const STEP_META: Record<
  StepState,
  { icon: typeof Circle; cls: string; label: string }
> = {
  done: { icon: CircleCheck, cls: "text-success", label: "完了" },
  in_progress: { icon: CircleDot, cls: "text-warning", label: "進行中" },
  todo: { icon: Circle, cls: "text-muted-foreground/50", label: "未着手" },
};

export function MonthlyCloseClient() {
  const { toast } = useToast();
  const [steps, setSteps] = React.useState<CloseStep[]>(CHECKLIST);
  const m = closeMetrics();

  const doneCount = steps.filter((s) => s.state === "done").length;
  const progress = Math.round((doneCount / steps.length) * 100);
  const closeable = progress === 100;

  const cycle = (id: string) =>
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next: StepState =
          s.state === "todo"
            ? "in_progress"
            : s.state === "in_progress"
              ? "done"
              : "todo";
        if (next === "done")
          toast({ title: `「${s.label}」を完了にしました`, variant: "success" });
        return { ...s, state: next };
      }),
    );

  return (
    <>
      <PageHeader
        title="月次決算"
        description={`${CLOSE_PERIOD} の締め作業。未処理をゼロにしてロックします。`}
        actions={
          <Button
            disabled={!closeable}
            title={closeable ? "" : "全工程の完了が必要です"}
            onClick={() =>
              toast({
                title: `${CLOSE_PERIOD} を締めました（デモ）`,
                description: "実際のロックは Supabase 接続後に実装します。",
                variant: "success",
              })
            }
          >
            <Lock /> 月次をロック
          </Button>
        }
      />

      {/* 進捗 */}
      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">今月の締め進捗</p>
            <p className="tabular mt-1 text-3xl font-bold text-foreground">
              {progress}%
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">ステータス</p>
              <p className="font-medium text-foreground">
                {closeable ? "締め可能" : "作業中"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">担当者</p>
              <p className="font-medium text-foreground">{CLOSE_OWNER}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">期限</p>
              <p className="tabular font-medium text-foreground">
                {formatISODate(CLOSE_DUE)}
              </p>
            </div>
          </div>
        </div>
        <Progress
          value={progress}
          tone={closeable ? "success" : "primary"}
          className="mt-4"
        />
      </Card>

      {/* 未処理メトリクス */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="未処理取引" value={`${m.unprocessedTxns} 件`} icon={ArrowRightLeft} tone={m.unprocessedTxns ? "warning" : "default"} href="/transactions" />
        <KpiCard label="未承認申請" value={`${m.unapprovedClaims} 件`} icon={Receipt} tone={m.unapprovedClaims ? "warning" : "default"} href="/approvals" />
        <KpiCard label="未消込明細" value={`${m.unreconciled} 件`} icon={Landmark} tone={m.unreconciled ? "danger" : "default"} href="/reconciliation" />
        <KpiCard label="未提出証憑" value={`${m.unfiledDocs} 件`} icon={Paperclip} tone={m.unfiledDocs ? "danger" : "default"} href="/documents" />
        <KpiCard label="未確定仕訳" value={`${m.unconfirmedJournals} 件`} icon={FileText} tone={m.unconfirmedJournals ? "warning" : "default"} href="/journal-entries" />
        <KpiCard label="残高確認（口座）" value={`${m.accounts} 口座`} sub={formatJPY(m.cashBalance)} icon={CalendarCheck2} tone="primary" href="/cash" />
      </div>

      {/* チェックリスト */}
      <Card>
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-md font-semibold text-foreground">
            締めチェックリスト
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            行をクリックで 未着手 → 進行中 → 完了 を切り替え（{doneCount}/
            {steps.length} 完了）
          </p>
        </div>
        <ul className="divide-y divide-border">
          {steps.map((s) => {
            const meta = STEP_META[s.state];
            const Icon = meta.icon;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => cycle(s.id)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className={cn("size-5 shrink-0", meta.cls)} />
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      s.state === "done"
                        ? "text-muted-foreground line-through"
                        : "text-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="hidden w-28 text-sm text-muted-foreground sm:block">
                    {s.assignee}
                  </span>
                  <span className="tabular hidden w-24 text-sm text-muted-foreground sm:block">
                    {formatISODate(s.due)}
                  </span>
                  <span
                    className={cn(
                      "w-16 text-right text-xs font-medium",
                      meta.cls,
                    )}
                  >
                    {meta.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
