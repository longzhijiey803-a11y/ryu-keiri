"use client";

import * as React from "react";
import Link from "next/link";
import { Banknote, CheckCircle2, Landmark, Link2, Wallet } from "lucide-react";

import {
  Button,
  EmptyState,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@/components/ui";
import { cn, formatISODate, formatJPY } from "@/lib/utils";
import { BANK_ACCOUNTS } from "@/lib/bank-data";
import type { Invoice, Payment } from "@/lib/types/invoice";

const CASH_ACCOUNT = { id: "cash", name: "現金（手元）" };

/**
 * 直接入金フォーム。送信時に親に Payment を返す。
 */
function DirectPaymentForm({
  remaining,
  onCancel,
  onSubmit,
}: {
  remaining: number;
  onCancel: () => void;
  onSubmit: (input: {
    date: string;
    amount: number;
    accountLabel: string;
  }) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = React.useState(today);
  const [accountId, setAccountId] = React.useState<string>(
    BANK_ACCOUNTS[0]?.id ?? CASH_ACCOUNT.id,
  );
  const [amount, setAmount] = React.useState<string>(String(remaining));

  const submit = () => {
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) return;
    const account =
      BANK_ACCOUNTS.find((b) => b.id === accountId) ?? null;
    const label = account
      ? `${account.name}（${account.bank_name}）`
      : CASH_ACCOUNT.name;
    onSubmit({ date, amount: a, accountLabel: label });
  };

  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <p className="mb-3 text-sm font-medium text-foreground">
        入金を直接記録する
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="pay-date">入金日</Label>
          <Input
            id="pay-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <Label>入金先</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {BANK_ACCOUNTS.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}（{a.bank_name}）
                </SelectItem>
              ))}
              <SelectItem value={CASH_ACCOUNT.id}>
                {CASH_ACCOUNT.name}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="pay-amount">入金額</Label>
          <Input
            id="pay-amount"
            type="number"
            inputMode="numeric"
            className="tabular text-right"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          残額 {formatJPY(remaining)} を上限に記録します。
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            キャンセル
          </Button>
          <Button
            size="sm"
            onClick={submit}
            disabled={!Number(amount) || Number(amount) <= 0}
          >
            記録する
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 請求書詳細ドロワーの「入金」タブ。
 * - unpaid / partial：手動消込（消込画面へ遷移）＋ 直接記録フォーム
 * - paid：履歴テキストのみ
 */
export function InvoicePaymentTab({
  invoice,
  paid,
  remaining,
  onAddPayment,
}: {
  invoice: Invoice;
  paid: number;
  remaining: number;
  /** 親（一覧の state）に追加入金を伝える */
  onAddPayment?: (invoiceId: string, payment: Payment) => void;
}) {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = React.useState(false);
  const isIssued = invoice.direction === "issued";
  const isPaid = invoice.payment_state === "paid";

  // 消込画面の自動フィルタ用クエリ
  const reconHref = `/reconciliation?invoice_id=${encodeURIComponent(
    invoice.id,
  )}&amount=${remaining || invoice.total}`;

  const handleSubmit = (input: {
    date: string;
    amount: number;
    accountLabel: string;
  }) => {
    const payment: Payment = {
      id: `P-${invoice.id}-${Date.now()}`,
      date: input.date,
      amount: input.amount,
      method: `直接記録 ・ ${input.accountLabel}`,
      note: "請求書詳細から手入力",
    };
    onAddPayment?.(invoice.id, payment);
    toast({
      title: isIssued ? "入金を記録しました" : "支払を記録しました",
      description: `${formatISODate(input.date)} ・ ${formatJPY(input.amount)} ・ ${input.accountLabel}`,
      variant: "success",
    });
    setFormOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 rounded-md border border-border p-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">請求額</p>
          <p className="tabular font-medium">{formatJPY(invoice.total)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {isIssued ? "入金済" : "支払済"}
          </p>
          <p className="tabular font-medium">{formatJPY(paid)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">残額</p>
          <p
            className={cn(
              "tabular font-medium",
              remaining > 0 ? "text-danger" : "text-success",
            )}
          >
            {formatJPY(remaining)}
          </p>
        </div>
      </div>

      {/* 入金履歴 */}
      {invoice.payments.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={isIssued ? "入金記録がありません" : "支払記録がありません"}
          compact
        />
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {invoice.payments.map((p) => (
            <li
              key={p.id}
              className="flex items-start justify-between gap-3 px-3 py-2.5 text-sm"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-success" />
                <div>
                  <p className="text-foreground">
                    <span className="tabular">{formatISODate(p.date)}</span>
                    <span className="text-muted-foreground"> ・ {p.method}</span>
                  </p>
                  {p.note && (
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                  )}
                </div>
              </div>
              <span className="shrink-0 tabular font-medium">
                {formatJPY(p.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* アクション領域：未入金/一部入金時のみ表示 */}
      {!isPaid && (
        <div className="space-y-2 rounded-md border border-border bg-surface p-3">
          <p className="text-xs text-muted-foreground">
            残額 <span className="tabular font-medium text-foreground">
              {formatJPY(remaining)}
            </span>{" "}
            の{isIssued ? "入金" : "支払"}を処理します。
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button asChild className="flex-1 sm:flex-none">
              <Link href={reconHref}>
                <Landmark /> 銀行明細から手動で消し込む
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setFormOpen((v) => !v)}
              aria-expanded={formOpen}
              className="flex-1 sm:flex-none"
            >
              <Banknote /> 現金受領など・入金を直接記録する
            </Button>
          </div>

          {formOpen && (
            <DirectPaymentForm
              remaining={remaining}
              onCancel={() => setFormOpen(false)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      )}

      {/* 完済済みの履歴ハイライト */}
      {isPaid && invoice.payments.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/[0.06] px-3 py-2.5 text-sm text-success">
          <Link2 className="mt-0.5 size-4" />
          <div>
            <p className="font-medium">
              {formatISODate(
                invoice.payments[invoice.payments.length - 1].date,
              )}{" "}
              {invoice.payments[invoice.payments.length - 1].method} へ
              {isIssued ? "入金消込済み" : "支払消込済み"}
            </p>
            <p className="text-xs text-success/80">
              紐付けID: {invoice.payments[invoice.payments.length - 1].id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
