"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { Button, useToast } from "@/components/ui";
import type { BankAccount } from "@/lib/types/bank";

/** 同期結果（成功時は更新後の口座リストを返す） */
export type SyncBankResult =
  | { ok: true; accounts: BankAccount[] }
  | { ok: false; error: string };

/**
 * モック実装：銀行APIが未接続なので、ランダムな結果を返す。
 * - 約15%で失敗
 * - 成功時は last_synced_at を現在時刻に、balance を ±50,000 円程度ずらす
 * - status=closed の口座は対象外
 */
export async function mockSyncBank(
  accounts: BankAccount[],
): Promise<SyncBankResult> {
  await new Promise((r) => setTimeout(r, 1200));
  if (Math.random() < 0.15) {
    return {
      ok: false,
      error: "認証エラー：金融機関の ID/パスワードを確認してください。",
    };
  }
  const now = new Date().toISOString();
  const next: BankAccount[] = accounts.map((a) => {
    if (a.status === "closed") return a;
    const delta = Math.round((Math.random() - 0.3) * 50_000);
    return {
      ...a,
      balance: a.balance + delta,
      last_synced_at: now,
      status: "active",
    };
  });
  return { ok: true, accounts: next };
}

export interface SyncBankButtonProps {
  /** 現在の口座リスト。同期後の結果は onSynced で親に返す。 */
  accounts: BankAccount[];
  /** 同期成功時に呼ばれる。親が state を更新する。 */
  onSynced?: (accounts: BankAccount[]) => void;
  /** 同期開始時（loading 化など外側に通知したい場合） */
  onSyncStart?: () => void;
  /** 同期完了時（成功/失敗どちらでも） */
  onSyncEnd?: (result: SyncBankResult) => void;
  /** 実 API への差し替え用。指定なしはモック実装。 */
  syncFn?: (accounts: BankAccount[]) => Promise<SyncBankResult>;
  label?: string;
  size?: "sm" | "default" | "lg";
  variant?: "primary" | "outline" | "secondary";
  className?: string;
  disabled?: boolean;
}

/**
 * 入出金管理画面の「口座を同期」ボタン。
 * - 押下中は disabled + スピナー
 * - 成功/失敗は toast で通知
 * - 実 API は未接続のため `syncFn` 既定値はモック
 */
export function SyncBankButton({
  accounts,
  onSynced,
  onSyncStart,
  onSyncEnd,
  syncFn = mockSyncBank,
  label = "口座を同期",
  size = "default",
  variant = "primary",
  className,
  disabled,
}: SyncBankButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    onSyncStart?.();
    try {
      const result = await syncFn(accounts);
      if (result.ok) {
        onSynced?.(result.accounts);
        toast({
          title: "口座を同期しました",
          description: `${result.accounts.length} 件の口座を更新しました。`,
          variant: "success",
        });
      } else {
        toast({
          title: "同期に失敗しました",
          description: result.error,
          variant: "error",
        });
      }
      onSyncEnd?.(result);
    } catch (e) {
      const error =
        e instanceof Error ? e.message : "通信エラーが発生しました。";
      toast({
        title: "同期に失敗しました",
        description: error,
        variant: "error",
      });
      onSyncEnd?.({ ok: false, error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled}
      aria-busy={loading}
      aria-label={label}
      onClick={handleClick}
      className={className}
    >
      {loading ? (
        "同期中…"
      ) : (
        <>
          <RefreshCw />
          {label}
        </>
      )}
    </Button>
  );
}
