import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * 業務ステータスバッジ。
 * ラベルと色の意味は全画面で統一（正本: docs/DESIGN.md §A-5）。
 * 色＝意味: success=完了/承認済, warning=要対応/保留, danger=異常/超過,
 * info=処理中/予定, neutral=中立/未着手。
 */
export const STATUS_KEYS = [
  "下書き",
  "確認待ち",
  "承認待ち",
  "承認済み",
  "差戻し",
  "支払予定",
  "支払済み",
  "入金待ち",
  "入金済み",
  "未消込",
  "消込済み",
  "期限超過",
  "ロック済み",
] as const;

export type StatusKey = (typeof STATUS_KEYS)[number];

type Tone = "neutral" | "info" | "warning" | "success" | "danger";

const STATUS_TONE: Record<StatusKey, Tone> = {
  下書き: "neutral",
  確認待ち: "info",
  承認待ち: "warning",
  承認済み: "success",
  差戻し: "danger",
  支払予定: "info",
  支払済み: "success",
  入金待ち: "warning",
  入金済み: "success",
  未消込: "warning",
  消込済み: "success",
  期限超過: "danger",
  ロック済み: "neutral",
};

const TONE_CLASS: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  info: { box: "bg-info/10 text-info", dot: "bg-info" },
  warning: { box: "bg-warning/10 text-warning", dot: "bg-warning" },
  success: { box: "bg-success/10 text-success", dot: "bg-success" },
  danger: { box: "bg-danger/10 text-danger", dot: "bg-danger" },
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusKey;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const tone = STATUS_TONE[status];
  const c = TONE_CLASS[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        c.box,
        className,
      )}
      {...props}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {status}
    </span>
  );
}
