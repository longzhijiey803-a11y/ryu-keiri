"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Check, CircleSlash, Link2, X } from "lucide-react";

import { Button, EmptyState, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { cn, formatISODate, formatJPY } from "@/lib/utils";
import { BANK_TXNS } from "@/lib/bank-data";
import { txnAmount, type BankTxn } from "@/lib/types/bank";
import { candidatesFor, type ReconCandidate } from "@/lib/recon";
import { CashTabs } from "./cash-tabs";
import { ReconStatusBadge } from "./cash-badges";

function MatchChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
        ok ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      {ok ? <Check className="size-3" /> : <CircleSlash className="size-3" />}
      {label}
    </span>
  );
}

export function ReconciliationClient() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  // 請求書詳細の「銀行明細から手動で消し込む」から渡されるヒント
  const hintInvoiceId = searchParams.get("invoice_id");
  const hintAmount = Number(searchParams.get("amount") ?? "");
  const [hintCleared, setHintCleared] = React.useState(false);
  const filterHintActive =
    !!hintInvoiceId && !hintCleared;

  const [list, setList] = React.useState<BankTxn[]>(BANK_TXNS);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [pickedInvoice, setPickedInvoice] = React.useState<string | null>(
    null,
  );
  const [reason, setReason] = React.useState("");

  // 全候補から推定一致する明細だけを先頭に出すための並び替え
  const unsorted = list.filter((t) => t.recon_status !== "reconciled");
  const targets = React.useMemo(() => {
    if (!filterHintActive) return unsorted;
    return [...unsorted].sort((a, b) => {
      const ah = Number.isFinite(hintAmount) && txnAmount(a) === hintAmount;
      const bh = Number.isFinite(hintAmount) && txnAmount(b) === hintAmount;
      if (ah === bh) return 0;
      return ah ? -1 : 1;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, filterHintActive, hintAmount]);
  const selected = list.find((t) => t.id === selectedId) ?? null;
  const candidates: ReconCandidate[] = selected
    ? candidatesFor(selected)
    : [];
  const picked = candidates.find((c) => c.invoice.id === pickedInvoice);
  const hasDiff = picked ? !picked.amountMatch : false;

  const select = (t: BankTxn) => {
    setSelectedId(t.id);
    setPickedInvoice(null);
    setReason("");
  };

  const execute = () => {
    if (!selected || !picked) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? {
              ...t,
              recon_status: hasDiff ? "discrepancy" : "reconciled",
              related_invoice_id: picked.invoice.id,
              related_transaction_id:
                picked.invoice.related_transaction_id ??
                t.related_transaction_id,
              memo: hasDiff ? `差異理由: ${reason}` : t.memo,
            }
          : t,
      ),
    );
    toast({
      title: hasDiff ? "差異ありで消込しました" : "消込しました",
      description: `${selected.id} ↔ ${picked.invoice.number}`,
      variant: hasDiff ? "warning" : "success",
    });
    setSelectedId(null);
    setPickedInvoice(null);
    setReason("");
  };

  return (
    <>
      <PageHeader
        title="消込"
        description="入出金明細と請求書・取引を照合し、消込を実行します。"
      />
      <CashTabs />

      {filterHintActive && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-md border border-primary/30 bg-primary/[0.04] px-3 py-2.5 text-sm">
          <div>
            <p className="font-medium text-primary">
              請求書 {hintInvoiceId} の消込候補を絞り込み中
            </p>
            <p className="text-xs text-muted-foreground">
              {Number.isFinite(hintAmount) && hintAmount > 0
                ? `${formatJPY(hintAmount)} と一致する明細を先頭に表示しています。`
                : "請求書に紐づく明細を先頭に表示しています。"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHintCleared(true)}
            aria-label="ヒントを閉じる"
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 左: 入出金明細 */}
        <section className="rounded-lg border border-border bg-surface shadow-card">
          <header className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
            入出金明細（要消込 {targets.length} 件）
          </header>
          <ul className="max-h-[640px] divide-y divide-border overflow-y-auto scrollbar-thin">
            {targets.length === 0 ? (
              <EmptyState
                icon={Check}
                title="未消込の明細はありません"
                compact
              />
            ) : (
              targets.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => select(t)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
                      selectedId === t.id && "bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="tabular text-xs text-muted-foreground">
                        {formatISODate(t.txn_date)} ・ {t.id}
                      </span>
                      <ReconStatusBadge status={t.recon_status} />
                    </div>
                    <p className="mt-1 truncate text-sm text-foreground">
                      {t.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {t.partner_guess ?? "取引先不明"}
                      </span>
                      <span
                        className={cn(
                          "tabular text-sm font-semibold",
                          t.dir === "in" ? "text-success" : "text-danger",
                        )}
                      >
                        {t.dir === "in" ? "+" : "-"}
                        {formatJPY(txnAmount(t))}
                      </span>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* 右: 消込候補 */}
        <section className="rounded-lg border border-border bg-surface shadow-card">
          <header className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
            消込候補
          </header>
          <div className="p-4">
            {!selected ? (
              <EmptyState
                icon={Link2}
                title="左の明細を選択してください"
                description="選択した明細に対する候補と一致度を表示します。"
                compact
              />
            ) : candidates.length === 0 ? (
              <EmptyState
                icon={CircleSlash}
                title="候補が見つかりません"
                description="金額・日付・取引先名で一致する請求書がありません。"
                compact
              />
            ) : (
              <div className="space-y-3">
                {candidates.map((c) => (
                  <button
                    key={c.invoice.id}
                    type="button"
                    onClick={() => setPickedInvoice(c.invoice.id)}
                    className={cn(
                      "w-full rounded-md border p-3 text-left transition-colors",
                      pickedInvoice === c.invoice.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          <span className="tabular">{c.invoice.number}</span>{" "}
                          ・ {c.invoice.partner.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.invoice.subject} ・ 期限{" "}
                          {formatISODate(c.invoice.due_date)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="tabular text-sm font-semibold text-foreground">
                          {formatJPY(c.invoice.total)}
                        </p>
                        <p
                          className={cn(
                            "text-xs font-medium",
                            c.score >= 80
                              ? "text-success"
                              : c.score >= 50
                                ? "text-warning"
                                : "text-muted-foreground",
                          )}
                        >
                          スコア {c.score}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <MatchChip
                        ok={c.amountMatch}
                        label={
                          c.amountMatch
                            ? "金額一致"
                            : `金額差 ${formatJPY(Math.abs(c.amountDiff))}`
                        }
                      />
                      <MatchChip
                        ok={c.dateClose}
                        label={`日付±${c.dateDiffDays}日`}
                      />
                      <MatchChip ok={c.partnerMatch} label="取引先名一致" />
                    </div>
                  </button>
                ))}

                {picked && (
                  <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
                    {hasDiff && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-danger">
                          差異理由（金額不一致のため必須）
                        </label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={2}
                          placeholder="例：振込手数料の差引、内入金 など"
                          className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button
                        onClick={execute}
                        disabled={hasDiff && !reason.trim()}
                      >
                        <Check /> 消込を実行
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
