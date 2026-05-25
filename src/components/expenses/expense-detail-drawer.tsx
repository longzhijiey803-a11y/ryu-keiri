"use client";

import * as React from "react";
import {
  AlertTriangle,
  Check,
  FileText,
  History as HistoryIcon,
  Image as ImageIcon,
  RotateCcw,
  XCircle,
} from "lucide-react";

import {
  Avatar,
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  EmptyState,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { formatISODate, formatISODateTime, formatJPY } from "@/lib/utils";
import { TAX_CATEGORY_LABEL } from "@/lib/types/transaction";
import { claimIssues, type ExpenseClaim } from "@/lib/types/expense";
import type { ApprovalActionKind } from "@/lib/types/workflow";
import {
  ExpensePayStateBadge,
  ExpenseStatusBadge,
} from "./expense-badges";

const AP_BADGE = {
  approved: { v: "success", t: "承認" },
  rejected: { v: "danger", t: "差戻し/却下" },
  pending: { v: "warning", t: "承認待ち" },
  skipped: { v: "neutral", t: "スキップ" },
} as const;

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-border py-2.5 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function ActionBar({
  onAction,
}: {
  onAction: (kind: ApprovalActionKind, comment: string) => void;
}) {
  const [comment, setComment] = React.useState("");
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-4">
      <p className="mb-2 text-sm font-semibold text-foreground">承認操作</p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="コメント（差戻し・却下時は理由を推奨）"
        className="mb-3 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          className="bg-success hover:bg-success/90"
          onClick={() => onAction("approve", comment)}
        >
          <Check /> 承認する
        </Button>
        <Button
          variant="outline"
          className="border-warning text-warning hover:bg-warning/10"
          onClick={() => onAction("return", comment)}
        >
          <RotateCcw /> 差戻す
        </Button>
        <Button
          variant="outline"
          className="border-danger text-danger hover:bg-danger/10"
          onClick={() => onAction("reject", comment)}
        >
          <XCircle /> 却下する
        </Button>
      </div>
    </div>
  );
}

export function ExpenseDetailDrawer({
  claim,
  open,
  onOpenChange,
  onAction,
  onComment,
}: {
  claim: ExpenseClaim | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAction?: (
    id: string,
    kind: ApprovalActionKind,
    comment: string,
  ) => void;
  onComment?: (id: string, body: string) => void;
}) {
  const [comment, setComment] = React.useState("");
  if (!claim) return null;
  const c = claim;
  const issues = claimIssues(c);
  const actionable =
    c.status === "submitted" || c.status === "pending_approval";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DrawerTitle>
              <span className="tabular">{c.id}</span>
            </DrawerTitle>
            <ExpenseStatusBadge status={c.status} />
            <ExpensePayStateBadge state={c.pay_state} />
          </div>
          <DrawerDescription>
            {c.subject} ・ {c.applicant.name}（{c.department}）
          </DrawerDescription>
          <div className="mt-2 tabular text-lg font-semibold text-foreground">
            {formatJPY(c.total)}
          </div>
        </DrawerHeader>

        <DrawerBody className="pt-3">
          {issues.length > 0 && (
            <div className="mb-4 rounded-md border border-danger/30 bg-danger/[0.06] p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-danger">
                <AlertTriangle className="size-4" /> 不備があります
              </p>
              <ul className="mt-1 list-disc pl-7 text-sm text-danger">
                {issues.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          )}

          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="lines">明細</TabsTrigger>
              <TabsTrigger value="receipts">
                領収書{c.receipts.length ? `（${c.receipts.length}）` : ""}
              </TabsTrigger>
              <TabsTrigger value="approval">承認</TabsTrigger>
              <TabsTrigger value="comments">
                コメント{c.comments.length ? `（${c.comments.length}）` : ""}
              </TabsTrigger>
              <TabsTrigger value="history">履歴</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <dl>
                <Row label="件名">{c.subject}</Row>
                <Row label="申請者">
                  <span className="inline-flex items-center gap-2">
                    <Avatar name={c.applicant.name} size="sm" />
                    {c.applicant.name}
                  </span>
                </Row>
                <Row label="部門">{c.department}</Row>
                <Row label="申請日">
                  <span className="tabular">
                    {formatISODate(c.claim_date)}
                  </span>
                </Row>
                <Row label="合計金額">
                  <span className="tabular font-medium">
                    {formatJPY(c.total)}
                  </span>
                </Row>
                <Row label="承認状態">
                  <ExpenseStatusBadge status={c.status} />
                </Row>
                <Row label="支払状態">
                  <ExpensePayStateBadge state={c.pay_state} />
                </Row>
                <Row label="メモ">{c.memo ?? "—"}</Row>
              </dl>
            </TabsContent>

            <TabsContent value="lines">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="py-2 text-left font-medium">利用日</th>
                    <th className="py-2 text-left font-medium">支払先</th>
                    <th className="py-2 text-left font-medium">勘定科目候補</th>
                    <th className="py-2 text-left font-medium">税区分</th>
                    <th className="py-2 text-right font-medium">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {c.lines.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 tabular text-muted-foreground">
                        {formatISODate(l.used_on)}
                      </td>
                      <td className="py-2 text-foreground">{l.payee}</td>
                      <td className="py-2 text-muted-foreground">
                        {l.account_hint || (
                          <span className="text-danger">未設定</span>
                        )}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {TAX_CATEGORY_LABEL[l.tax_category]}
                      </td>
                      <td className="py-2 text-right tabular font-medium">
                        {formatJPY(l.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="text-sm font-medium">
                    <td className="pt-2 text-muted-foreground" colSpan={4}>
                      合計
                    </td>
                    <td className="pt-2 text-right tabular">
                      {formatJPY(c.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </TabsContent>

            <TabsContent value="receipts">
              {c.receipts.length === 0 ? (
                <EmptyState
                  icon={AlertTriangle}
                  title="領収書が添付されていません"
                  description="不備として扱われます。領収書を添付してください。"
                  compact
                />
              ) : (
                <div className="space-y-4">
                  {c.receipts.map((r) => {
                    const img = r.mime_type.startsWith("image/");
                    return (
                      <div
                        key={r.id}
                        className="overflow-hidden rounded-md border border-border"
                      >
                        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-3 py-2">
                          {img ? (
                            <ImageIcon className="size-4 text-muted-foreground" />
                          ) : (
                            <FileText className="size-4 text-muted-foreground" />
                          )}
                          <span className="flex-1 truncate text-sm font-medium text-foreground">
                            {r.file_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(r.size_bytes / 1000)} KB
                          </span>
                        </div>
                        <div className="flex h-48 flex-col items-center justify-center gap-1 bg-muted/20 text-muted-foreground">
                          {img ? (
                            <ImageIcon className="size-8" />
                          ) : (
                            <FileText className="size-8" />
                          )}
                          <p className="text-xs">
                            {img ? "画像" : "PDF"} プレビュー非対応
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approval">
              <div className="space-y-4">
                {onAction && actionable && (
                  <ActionBar
                    onAction={(kind, cm) => onAction(c.id, kind, cm)}
                  />
                )}
                {c.approvals.length === 0 ? (
                  <EmptyState
                    icon={HistoryIcon}
                    title="承認フローはありません"
                    compact
                  />
                ) : (
                  <ol className="space-y-3">
                    {c.approvals.map((s) => {
                      const b = AP_BADGE[s.status];
                      return (
                        <li
                          key={s.id}
                          className="rounded-md border border-border p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {s.order}. {s.role}（{s.approver.name}）
                            </span>
                            <Badge variant={b.v}>{b.t}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {s.acted_at
                              ? formatISODateTime(s.acted_at)
                              : "未対応"}
                            {s.comment ? ` ・ ${s.comment}` : ""}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments">
              {c.comments.length === 0 ? (
                <EmptyState
                  icon={HistoryIcon}
                  title="コメントはありません"
                  compact
                />
              ) : (
                <ul className="space-y-3">
                  {c.comments.map((cm) => (
                    <li key={cm.id} className="flex gap-3">
                      <Avatar name={cm.author.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">
                            {cm.author.name}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatISODateTime(cm.created_at)}
                          </span>
                        </p>
                        <p className="mt-0.5 text-sm text-foreground">
                          {cm.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {onComment && (
                <div className="mt-4 border-t border-border pt-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    placeholder="コメントを追加"
                    className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      size="sm"
                      disabled={!comment.trim()}
                      onClick={() => {
                        onComment(c.id, comment.trim());
                        setComment("");
                      }}
                    >
                      コメント
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {c.history.length === 0 ? (
                <EmptyState
                  icon={HistoryIcon}
                  title="履歴はありません"
                  compact
                />
              ) : (
                <ul className="space-y-3">
                  {c.history.map((h) => (
                    <li key={h.id} className="flex gap-3">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-border" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">
                            {h.actor.name}
                          </span>{" "}
                          が {h.action}
                          {h.detail ? `（${h.detail}）` : ""}
                        </p>
                        <p className="tabular text-xs text-muted-foreground">
                          {formatISODateTime(h.at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </DrawerBody>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">閉じる</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
