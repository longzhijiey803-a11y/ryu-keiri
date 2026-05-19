import * as React from "react";
import { Loader2, TriangleAlert, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** ローディング状態（中央スピナー）。 */
export function LoadingState({
  label = "読み込み中…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-14 text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/** エラー状態（再試行ボタン任意）。 */
export function ErrorState({
  icon: Icon = TriangleAlert,
  title = "読み込みに失敗しました",
  description,
  onRetry,
  className,
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-14 text-center",
        className,
      )}
      role="alert"
    >
      <span className="mb-1 flex size-10 items-center justify-center rounded-full bg-danger/10 text-danger">
        <Icon className="size-5" />
      </span>
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          再試行
        </button>
      )}
    </div>
  );
}
