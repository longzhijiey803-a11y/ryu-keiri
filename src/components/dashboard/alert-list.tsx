import Link from "next/link";
import {
  AlertOctagon,
  AlertTriangle,
  ChevronRight,
  CircleCheck,
  Info,
  type LucideIcon,
} from "lucide-react";

import { EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  alerts as DEFAULT_ALERTS,
  type AlertItem,
  type AlertType,
  type Severity,
} from "@/lib/dashboard-data";

/** Severity 別のアクセント色 / アイコン */
const STYLE: Record<
  Severity,
  { icon: LucideIcon; border: string; iconColor: string; bg: string }
> = {
  danger: {
    icon: AlertOctagon,
    border: "border-l-danger",
    iconColor: "text-danger",
    bg: "bg-danger/[0.04]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-l-warning",
    iconColor: "text-warning",
    bg: "bg-warning/[0.04]",
  },
  info: {
    icon: Info,
    border: "border-l-info",
    iconColor: "text-info",
    bg: "",
  },
};

/** type 別の遷移先テンプレ。relatedId があれば filter クエリに付与する。 */
function alertHref(a: AlertItem): string {
  const id = a.relatedId
    ? `?filter=${encodeURIComponent(a.relatedId)}`
    : "";
  switch (a.type) {
    case "overdue_payment":
      return `/payables${id}`;
    case "overdue_receivable":
      return `/receivables${id}`;
    case "pending_close":
      return "/monthly-close";
    case "cash_warning":
      return "/cash";
    case "master_data":
      return "/partners";
    default:
      return "/dashboard";
  }
}

/** type ラベル（バッジ表示） */
const TYPE_LABEL: Record<AlertType, string> = {
  overdue_payment: "支払期限",
  overdue_receivable: "入金期日",
  pending_close: "月次締め",
  cash_warning: "資金繰り",
  master_data: "マスタ",
};

export interface AlertListProps {
  /** 表示するアラート。未指定はダミーデータ。 */
  items?: AlertItem[];
  /** リストの最大高（スクロール対応）。未指定はスクロールなし。 */
  maxHeightClass?: string;
}

export function AlertList({
  items = DEFAULT_ALERTS,
  maxHeightClass,
}: AlertListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={CircleCheck}
        title="対応が必要なアラートはありません"
        description="未処理・期限超過・資金繰りの警告は現在ありません。"
        compact
      />
    );
  }

  return (
    <ul
      className={cn(
        "divide-y divide-border",
        maxHeightClass ?? "max-h-[420px]",
        "overflow-y-auto scrollbar-thin",
      )}
    >
      {items.map((a) => {
        const s = STYLE[a.severity];
        const Icon = s.icon;
        const href = alertHref(a);
        return (
          <li key={a.id}>
            <Link
              href={href}
              aria-label={`${TYPE_LABEL[a.type]}：${a.label}`}
              className={cn(
                "group flex gap-3 border-l-4 px-5 py-3.5 outline-none transition-colors",
                "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring",
                s.border,
                s.bg,
              )}
            >
              <Icon
                className={cn("mt-0.5 size-4 shrink-0", s.iconColor)}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-foreground">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          a.severity === "danger" &&
                            "bg-danger/10 text-danger",
                          a.severity === "warning" &&
                            "bg-warning/10 text-warning",
                          a.severity === "info" && "bg-info/10 text-info",
                        )}
                      >
                        {TYPE_LABEL[a.type]}
                      </span>
                      <span className="truncate">{a.label}</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {a.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <span className="tabular">{a.date}</span>
                    <ChevronRight
                      className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
