"use client";

import * as React from "react";
import { FileText, Link2, Paperclip } from "lucide-react";

import {
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
} from "@/components/ui";
import { cn, formatISODate, formatISODateTime, formatJPY } from "@/lib/utils";
import { TAX_CATEGORY_LABEL } from "@/lib/types/transaction";
import type { JournalEntry } from "@/lib/types/journal";
import { JournalStatusBadge } from "./journal-badges";

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

export function JournalDetailDrawer({
  entry,
  open,
  onOpenChange,
  onEdit,
}: {
  entry: JournalEntry | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** 編集ボタン押下時。未指定なら編集ボタンは無効。 */
  onEdit?: (entry: JournalEntry) => void;
}) {
  if (!entry) return null;
  const balanced =
    entry.debit_total > 0 && entry.debit_total === entry.credit_total;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <DrawerTitle>
              <span className="tabular">{entry.id}</span>
            </DrawerTitle>
            <JournalStatusBadge status={entry.status} />
          </div>
          <DrawerDescription>{entry.description}</DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {/* 概要 */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              概要
            </h3>
            <dl>
              <Row label="仕訳日">
                <span className="tabular">
                  {formatISODate(entry.entry_date)}
                </span>
              </Row>
              <Row label="摘要">{entry.description}</Row>
              <Row label="ステータス">
                <JournalStatusBadge status={entry.status} />
              </Row>
              <Row label="関連取引">
                {entry.related_transaction_id ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Link2 className="size-3.5 text-muted-foreground" />
                    <span className="tabular text-xs text-muted-foreground">
                      {entry.related_transaction_id}
                    </span>
                    {entry.related_transaction_name}
                  </span>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="作成者">{entry.created_by.name}</Row>
              <Row label="作成 / 更新">
                <span className="tabular">
                  {formatISODateTime(entry.created_at)} /{" "}
                  {formatISODateTime(entry.updated_at)}
                </span>
              </Row>
              <Row label="メモ">{entry.memo ?? "—"}</Row>
            </dl>
          </section>

          {/* 明細（複式） */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              仕訳明細
            </h3>
            <div className="overflow-x-auto scrollbar-thin rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-xs text-muted-foreground">
                    <th className="px-3 py-2 text-left font-medium">借/貸</th>
                    <th className="px-3 py-2 text-left font-medium">
                      勘定科目 / 補助
                    </th>
                    <th className="px-3 py-2 text-left font-medium">
                      部門 / PJ
                    </th>
                    <th className="px-3 py-2 text-left font-medium">税区分</th>
                    <th className="px-3 py-2 text-right font-medium">
                      消費税
                    </th>
                    <th className="px-3 py-2 text-right font-medium">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.lines.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-3 py-2">
                        <Badge
                          variant={l.side === "debit" ? "info" : "neutral"}
                        >
                          {l.side === "debit" ? "借方" : "貸方"}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-foreground">
                        <span className="tabular text-xs text-muted-foreground">
                          {l.account_code}
                        </span>{" "}
                        {l.account_name}
                        {l.sub_account && (
                          <span className="block text-xs text-muted-foreground">
                            {l.sub_account}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {l.department ?? "—"}
                        {l.project ? ` / ${l.project}` : ""}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {TAX_CATEGORY_LABEL[l.tax_category]}
                      </td>
                      <td className="px-3 py-2 text-right tabular text-muted-foreground">
                        {l.tax_amount ? formatJPY(l.tax_amount) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular font-medium">
                        {formatJPY(l.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 貸借一致チェック */}
            <div
              className={cn(
                "mt-3 flex items-center justify-between rounded-md border px-3 py-2.5 text-sm",
                balanced
                  ? "border-success/30 bg-success/[0.06] text-success"
                  : "border-danger/30 bg-danger/[0.06] text-danger",
              )}
            >
              <span className="tabular">
                借方合計 {formatJPY(entry.debit_total)} ／ 貸方合計{" "}
                {formatJPY(entry.credit_total)}
              </span>
              <span className="font-medium">
                {balanced ? "貸借一致" : "不一致"}
              </span>
            </div>
          </section>

          {/* 証憑 */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              関連証憑
            </h3>
            {entry.attachments.length === 0 ? (
              <EmptyState
                icon={Paperclip}
                title="証憑がありません"
                compact
              />
            ) : (
              <ul className="divide-y divide-border rounded-md border border-border">
                {entry.attachments.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 p-3">
                    <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {a.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(a.size_bytes / 1000)} KB ・{" "}
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
          </section>
        </DrawerBody>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">閉じる</Button>
          </DrawerClose>
          <Button
            onClick={() => onEdit?.(entry)}
            disabled={!onEdit || entry.status === "voided"}
            title={
              entry.status === "voided"
                ? "取消済みの仕訳は編集できません"
                : "仕訳を編集"
            }
          >
            編集
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
