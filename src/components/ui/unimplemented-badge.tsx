import { cn } from "@/lib/utils";

/**
 * 未実装機能であることを示す小型ピル。
 * ボタン内部に差し込むことを想定。disabled ボタンと併用する。
 */
export function UnimplementedBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label="未実装"
      className={cn(
        "ml-1 inline-flex items-center rounded border border-border bg-muted px-1.5 py-px text-[10px] font-medium leading-none text-muted-foreground",
        className,
      )}
    >
      未実装
    </span>
  );
}

export const UNIMPLEMENTED_TITLE = "この機能はまだ実装されていません";

/**
 * 実データではなくダミー（サンプル）であることを示す小型ピル。
 * AI 推測候補・OCR 読み取り・銀行同期など、結果がそれらしく見えるが
 * 実 API に接続されていない箇所で使用する。
 */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      aria-label="サンプル"
      className={cn(
        "inline-flex items-center rounded border border-info/30 bg-info/10 px-1.5 py-px text-[10px] font-medium leading-none text-info",
        className,
      )}
    >
      サンプル
    </span>
  );
}

export const SAMPLE_TITLE =
  "この結果はサンプル（ダミーデータ）です。実 API には接続されていません。";
