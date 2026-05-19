"use client";

import * as React from "react";
import {
  Clock,
  FileText,
  History as HistoryIcon,
  MessageSquare,
  Paperclip,
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
import {
  JOURNAL_STATUS_LABEL,
  TAX_CATEGORY_LABEL,
  TRANSACTION_KIND_LABEL,
  type ApprovalStepStatus,
  type Transaction,
} from "@/lib/types/transaction";
import {
  TransactionKindBadge,
  TransactionStatusBadge,
} from "./transaction-badges";

function kb(bytes: number) {
  return bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1000)} KB`;
}

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

const APPROVAL_BADGE: Record<
  ApprovalStepStatus,
  { v: "success" | "danger" | "warning" | "neutral"; t: string }
> = {
  approved: { v: "success", t: "承認" },
  rejected: { v: "danger", t: "差戻し" },
  pending: { v: "warning", t: "承認待ち" },
  skipped: { v: "neutral", t: "スキップ" },
};

export function TransactionDetailDrawer({
  txn,
  open,
  onOpenChange,
}: {
  txn: Transaction | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  if (!txn) return null;

  const debit = txn.journal?.lines
    .filter((l) => l.side === "debit")
    .reduce((s, l) => s + l.amount, 0);
  const credit = txn.journal?.lines
    .filter((l) => l.side === "credit")
    .reduce((s, l) => s + l.amount, 0);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <DrawerTitle>{txn.name}</DrawerTitle>
            <TransactionKindBadge kind={txn.kind} />
          </div>
          <DrawerDescription>
            <span className="tabular">{txn.id}</span> ・ {txn.partner.name}
          </DrawerDescription>
          <div className="mt-2 flex items-center gap-3">
            <TransactionStatusBadge status={txn.status} />
            <span className="tabular text-lg font-semibold text-foreground">
              {formatJPY(txn.amount)}
            </span>
          </div>
        </DrawerHeader>

        <DrawerBody className="pt-3">
          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="evidence">
                証憑{txn.attachments.length ? `（${txn.attachments.length}）` : ""}
              </TabsTrigger>
              <TabsTrigger value="journal">仕訳</TabsTrigger>
              <TabsTrigger value="approval">
                承認{txn.approvals.length ? `（${txn.approvals.length}）` : ""}
              </TabsTrigger>
              <TabsTrigger value="comments">
                コメント{txn.comments.length ? `（${txn.comments.length}）` : ""}
              </TabsTrigger>
              <TabsTrigger value="history">履歴</TabsTrigger>
            </TabsList>

            {/* 概要 */}
            <TabsContent value="overview">
              <dl>
                <Row label="取引区分">
                  {TRANSACTION_KIND_LABEL[txn.kind]}
                </Row>
                <Row label="取引先">
                  {txn.partner.name}
                  {txn.partner.registration_number && (
                    <span className="ml-2 tabular text-xs text-muted-foreground">
                      登録番号 {txn.partner.registration_number}
                    </span>
                  )}
                </Row>
                <Row label="金額">
                  <span className="tabular font-medium">
                    {formatJPY(txn.amount)}
                  </span>
                </Row>
                <Row label="税区分">
                  {TAX_CATEGORY_LABEL[txn.tax_category]}
                </Row>
                <Row label="取引日">
                  <span className="tabular">
                    {formatISODate(txn.transaction_date)}
                  </span>
                </Row>
                <Row label="支払/入金期日">
                  {txn.due_date ? (
                    <span className="tabular">
                      {formatISODate(txn.due_date)}
                    </span>
                  ) : (
                    "—"
                  )}
                </Row>
                <Row label="担当者">
                  <span className="inline-flex items-center gap-2">
                    <Avatar name={txn.assignee.name} size="sm" />
                    {txn.assignee.name}
                  </span>
                </Row>
                <Row label="部門">{txn.department ?? "—"}</Row>
                <Row label="プロジェクト">{txn.project ?? "—"}</Row>
                <Row label="仕訳状態">
                  <Badge
                    variant={
                      txn.journal_status === "posted"
                        ? "success"
                        : txn.journal_status === "draft"
                          ? "info"
                          : "neutral"
                    }
                  >
                    {JOURNAL_STATUS_LABEL[txn.journal_status]}
                  </Badge>
                </Row>
                <Row label="メモ">{txn.memo ?? "—"}</Row>
              </dl>
            </TabsContent>

            {/* 証憑 */}
            <TabsContent value="evidence">
              {txn.attachments.length === 0 ? (
                <EmptyState
                  icon={Paperclip}
                  title="証憑がありません"
                  description="請求書・領収書などをここに添付します（電帳法を意識した保管）。"
                  compact
                />
              ) : (
                <ul className="divide-y divide-border">
                  {txn.attachments.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 py-3">
                      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {a.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {kb(a.size_bytes)} ・{" "}
                          {formatISODateTime(a.uploaded_at)} ・ {a.uploaded_by}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        表示
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            {/* 仕訳 */}
            <TabsContent value="journal">
              {!txn.journal ? (
                <EmptyState
                  icon={FileText}
                  title="未仕訳です"
                  description="この取引から仕訳を生成します（Step 後続で実装）。"
                  compact
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="tabular">{txn.journal.id}</span>
                    <Badge
                      variant={
                        txn.journal.status === "posted" ? "success" : "info"
                      }
                    >
                      {JOURNAL_STATUS_LABEL[txn.journal.status]}
                    </Badge>
                    <span className="tabular">
                      {formatISODate(txn.journal.entry_date)}
                    </span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="py-2 text-left font-medium">借/貸</th>
                        <th className="py-2 text-left font-medium">勘定科目</th>
                        <th className="py-2 text-right font-medium">金額</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txn.journal.lines.map((l) => (
                        <tr
                          key={l.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-2">
                            <Badge
                              variant={
                                l.side === "debit" ? "info" : "neutral"
                              }
                            >
                              {l.side === "debit" ? "借方" : "貸方"}
                            </Badge>
                          </td>
                          <td className="py-2 text-foreground">
                            <span className="tabular text-xs text-muted-foreground">
                              {l.account_code}
                            </span>{" "}
                            {l.account_name}
                          </td>
                          <td className="py-2 text-right tabular">
                            {formatJPY(l.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="text-sm font-medium">
                        <td className="pt-2 text-muted-foreground" colSpan={2}>
                          借方 / 貸方 合計
                        </td>
                        <td className="pt-2 text-right tabular">
                          {formatJPY(debit ?? 0)} / {formatJPY(credit ?? 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* 承認 */}
            <TabsContent value="approval">
              {txn.approvals.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="承認フローはありません"
                  description="金額・区分に応じた承認経路がここに表示されます。"
                  compact
                />
              ) : (
                <ol className="space-y-3">
                  {txn.approvals.map((s) => {
                    const b = APPROVAL_BADGE[s.status];
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
            </TabsContent>

            {/* コメント */}
            <TabsContent value="comments">
              {txn.comments.length === 0 ? (
                <EmptyState
                  icon={MessageSquare}
                  title="コメントはありません"
                  compact
                />
              ) : (
                <ul className="space-y-3">
                  {txn.comments.map((c) => (
                    <li key={c.id} className="flex gap-3">
                      <Avatar name={c.author.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">
                            {c.author.name}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {formatISODateTime(c.created_at)}
                          </span>
                        </p>
                        <p className="mt-0.5 text-sm text-foreground">
                          {c.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 border-t border-border pt-4">
                <textarea
                  disabled
                  placeholder="コメントを追加（Step 後続で有効化）"
                  className="h-20 w-full resize-none rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
                />
              </div>
            </TabsContent>

            {/* 履歴 */}
            <TabsContent value="history">
              {txn.history.length === 0 ? (
                <EmptyState
                  icon={HistoryIcon}
                  title="履歴はありません"
                  compact
                />
              ) : (
                <ul className="space-y-3">
                  {txn.history.map((h) => (
                    <li key={h.id} className="flex gap-3">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-border" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{h.actor.name}</span>{" "}
                          が {h.action}
                          {h.detail ? `（${h.detail}）` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground tabular">
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
          <Button disabled title="Step 後続で実装">
            編集
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
