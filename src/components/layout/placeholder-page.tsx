"use client";

import { usePathname } from "next/navigation";
import { Construction, Plus } from "lucide-react";

import { Button } from "@/components/ui";
import { findNavItem } from "@/lib/nav";
import { PageHeader } from "./page-header";

/** ルートごとの説明と主アクション（骨格用。中身は Step 4 以降）。 */
const META: Record<string, { description: string; action?: string }> = {
  "/": { description: "経理業務のホーム。よく使う導線と当日のタスクをまとめます。" },
  "/dashboard": { description: "KPI・アラート・承認待ちを俯瞰するロール別ダッシュボード。" },
  "/transactions": { description: "お金・債権債務・費用収益に影響する業務イベントの台帳。", action: "新規取引" },
  "/invoices": { description: "請求書の発行・受領と売掛/買掛への連携。", action: "請求書を作成" },
  "/expenses": { description: "経費の申請・承認・精算。", action: "経費を申請" },
  "/banking": { description: "口座残高と入出金明細、仕訳とのマッチング。", action: "明細を取込" },
  "/receivables": { description: "売掛金・買掛金の残高とエイジング、消込。" },
  "/evidence": { description: "証憑の保管と検索（電帳法を意識したメタデータ）。", action: "証憑をアップロード" },
  "/workflow": { description: "承認ワークフローの定義と承認待ちの処理。" },
  "/journal": { description: "仕訳帳・総勘定元帳・試算表。", action: "仕訳を入力" },
  "/closing": { description: "月次決算のチェックリストと月次ロック。" },
  "/fixed-assets": { description: "固定資産台帳と減価償却。", action: "資産を登録" },
  "/reports": { description: "財務サマリ・予実・資金繰り・エクスポート。" },
  "/partners": { description: "取引先マスタ（インボイス登録番号を含む）。", action: "取引先を追加" },
  "/audit-log": { description: "操作の監査ログ（誰が・いつ・何を・前後値）。" },
  "/settings": { description: "組織・ユーザー・権限・マスタ・連携の設定。" },
};

export function PlaceholderPage() {
  const pathname = usePathname();
  const item = findNavItem(pathname);
  const meta = META[item?.href ?? ""] ?? { description: "" };
  const title = item?.label ?? "ページ";

  return (
    <>
      <PageHeader
        title={title}
        description={meta.description}
        actions={
          meta.action ? (
            <Button disabled title="Step 4 以降で実装">
              <Plus /> {meta.action}
            </Button>
          ) : undefined
        }
      />

      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-border bg-surface">
        <div className="max-w-md px-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Construction className="size-6" />
          </span>
          <h2 className="mt-4 text-md font-semibold text-foreground">
            「{title}」は準備中です
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            このページは共通レイアウトの確認用プレースホルダーです。画面の中身は
            Step 4 以降で、Step 2 のデザイン部品を使って実装します。
          </p>
        </div>
      </div>
    </>
  );
}
