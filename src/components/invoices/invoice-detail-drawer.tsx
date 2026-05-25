"use client";

import * as React from "react";
import {
  Clock,
  FileText,
  History as HistoryIcon,
  Link2,
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
  DueCell,
  EmptyState,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import {
  UNIMPLEMENTED_TITLE,
  UnimplementedBadge,
} from "@/components/ui/unimplemented-badge";
import { formatISODate, formatISODateTime, formatJPY } from "@/lib/utils";
import { TAX_CATEGORY_LABEL } from "@/lib/types/transaction";
import { TODAY, isOverdue, type Invoice, type Payment } from "@/lib/types/invoice";
import {
  InvoiceStatusBadge,
  OverdueBadge,
  PaymentStateBadge,
} from "./invoice-badges";
import { InvoicePaymentTab } from "./invoice-payment-tab";

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

const AP_BADGE = {
  approved: { v: "success", t: "承認" },
  rejected: { v: "danger", t: "差戻し" },
  pending: { v: "warning", t: "承認待ち" },
  skipped: { v: "neutral", t: "スキップ" },
} as const;

export function InvoiceDetailDrawer({
  invoice,
  open,
  onOpenChange,
  onAddPayment,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAddPayment?: (invoiceId: string, payment: Payment) => void;
}) {
  if (!invoice) return null;
  const inv = invoice;
  const isIssued = inv.direction === "issued";
  const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
  const remaining = Math.max(0, inv.total - paid);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DrawerTitle>
              <span className="tabular">{inv.number}</span>
            </DrawerTitle>
            <Badge variant="outline">
              {isIssued ? "発行" : "受領"}
            </Badge>
            <InvoiceStatusBadge
              direction={inv.direction}
              status={inv.status}
            />
            {isOverdue(inv) && <OverdueBadge />}
          </div>
          <DrawerDescription>
            {inv.subject} ・ {inv.partner.name}
          </DrawerDescription>
          <div className="mt-2 tabular text-lg font-semibold text-foreground">
            {formatJPY(inv.total)}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              （税 {formatJPY(inv.tax)}）
            </span>
          </div>
        </DrawerHeader>

        <DrawerBody className="pt-3">
          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="lines">明細</TabsTrigger>
              <TabsTrigger value="evidence">
                証憑{inv.attachments.length ? `（${inv.attachments.length}）` : ""}
              </TabsTrigger>
              <TabsTrigger value="payment">
                {isIssued ? "入金" : "支払"}
              </TabsTrigger>
              <TabsTrigger value="journal">仕訳</TabsTrigger>
              <TabsTrigger value="approval">
                承認{inv.approvals.length ? `（${inv.approvals.length}）` : ""}
              </TabsTrigger>
              <TabsTrigger value="history">履歴</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <dl>
                <Row label={isIssued ? "請求先" : "請求元"}>
                  {inv.partner.name}
                  {inv.partner.registration_number && (
                    <span className="ml-2 tabular text-xs text-muted-foreground">
                      登録番号 {inv.partner.registration_number}
                    </span>
                  )}
                </Row>
                <Row label="件名">{inv.subject}</Row>
                <Row label="請求金額（税込）">
                  <span className="tabular font-medium">
                    {formatJPY(inv.total)}
                  </span>
                </Row>
                <Row label="消費税">
                  <span className="tabular">{formatJPY(inv.tax)}</span>
                </Row>
                <Row label={isIssued ? "発行日" : "受領日"}>
                  <span className="tabular">
                    {isIssued
                      ? inv.issue_date
                        ? formatISODate(inv.issue_date)
                        : "—"
                      : inv.receipt_date
                        ? formatISODate(inv.receipt_date)
                        : "—"}
                  </span>
                </Row>
                <Row label="支払期限">
                  <DueCell
                    due={inv.due_date}
                    today={TODAY}
                    done={inv.payment_state === "paid"}
                    doneLabel={inv.direction === "issued" ? "入金済" : "支払済"}
                  />
                </Row>
                <Row label={isIssued ? "ステータス" : "承認状態"}>
                  <InvoiceStatusBadge
                    direction={inv.direction}
                    status={inv.status}
                  />
                </Row>
                <Row label={isIssued ? "入金状態" : "支払状態"}>
                  <PaymentStateBadge state={inv.payment_state} />
                </Row>
                <Row label="担当者">
                  <span className="inline-flex items-center gap-2">
                    <Avatar name={inv.assignee.name} size="sm" />
                    {inv.assignee.name}
                  </span>
                </Row>
                <Row label="メモ">{inv.memo ?? "—"}</Row>
              </dl>
            </TabsContent>

            <TabsContent value="lines">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="py-2 text-left font-medium">内容</th>
                    <th className="py-2 text-right font-medium">数量</th>
                    <th className="py-2 text-right font-medium">単価</th>
                    <th className="py-2 text-right font-medium">金額</th>
                    <th className="py-2 text-left font-medium">税区分</th>
                  </tr>
                </thead>
                <tbody>
                  {inv.lines.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2 text-foreground">
                        {l.description}
                      </td>
                      <td className="py-2 text-right tabular">
                        {l.quantity}
                      </td>
                      <td className="py-2 text-right tabular">
                        {formatJPY(l.unit_price)}
                      </td>
                      <td className="py-2 text-right tabular font-medium">
                        {formatJPY(l.amount)}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {TAX_CATEGORY_LABEL[l.tax_category]}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="text-sm">
                    <td className="pt-3 text-muted-foreground" colSpan={3}>
                      小計 / 消費税 / 合計
                    </td>
                    <td
                      className="pt-3 text-right tabular font-medium"
                      colSpan={2}
                    >
                      {formatJPY(inv.subtotal)} / {formatJPY(inv.tax)} /{" "}
                      {formatJPY(inv.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </TabsContent>

            <TabsContent value="evidence">
              {inv.attachments.length === 0 ? (
                <EmptyState
                  icon={Paperclip}
                  title="証憑がありません"
                  compact
                />
              ) : (
                <ul className="divide-y divide-border">
                  {inv.attachments.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 py-3"
                    >
                      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <FileText className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {a.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(a.size_bytes / 1000)} KB ・{" "}
                          {formatISODateTime(a.uploaded_at)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        プレビュー
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="payment">
              <InvoicePaymentTab
                invoice={inv}
                paid={paid}
                remaining={remaining}
                onAddPayment={onAddPayment}
              />
            </TabsContent>

            <TabsContent value="journal">
              {inv.related_journal_id ? (
                <div className="rounded-md border border-border p-3 text-sm">
                  <p className="flex items-center gap-2 text-foreground">
                    <Link2 className="size-4 text-muted-foreground" />
                    関連仕訳：
                    <span className="tabular font-medium">
                      {inv.related_journal_id}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    仕訳帳で詳細を確認できます（連携は仕訳帳画面）。
                  </p>
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="関連仕訳がありません"
                  description="この請求書からの仕訳は未作成です。"
                  compact
                />
              )}
            </TabsContent>

            <TabsContent value="approval">
              {inv.approvals.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="承認フローはありません"
                  compact
                />
              ) : (
                <ol className="space-y-3">
                  {inv.approvals.map((s) => {
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
            </TabsContent>

            <TabsContent value="history">
              {inv.history.length === 0 ? (
                <EmptyState
                  icon={HistoryIcon}
                  title="履歴はありません"
                  compact
                />
              ) : (
                <ul className="space-y-3">
                  {inv.history.map((h) => (
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
          <Button disabled title={UNIMPLEMENTED_TITLE}>
            編集 <UnimplementedBadge />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
