import {
  AlertOctagon,
  AlertTriangle,
  CircleCheck,
  Info,
  type LucideIcon,
} from "lucide-react";

import { EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";
import { alerts, type Severity } from "@/lib/dashboard-data";

const STYLE: Record<
  Severity,
  { icon: LucideIcon; border: string; icon_c: string; bg: string }
> = {
  danger: {
    icon: AlertOctagon,
    border: "border-l-danger",
    icon_c: "text-danger",
    bg: "bg-danger/[0.04]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-l-warning",
    icon_c: "text-warning",
    bg: "",
  },
  info: {
    icon: Info,
    border: "border-l-info",
    icon_c: "text-info",
    bg: "",
  },
};

export function AlertList() {
  if (alerts.length === 0) {
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
    <ul className="divide-y divide-border">
      {alerts.map((a) => {
        const s = STYLE[a.severity];
        const Icon = s.icon;
        return (
          <li
            key={a.id}
            className={cn(
              "flex gap-3 border-l-4 px-5 py-3.5",
              s.border,
              s.bg,
            )}
          >
            <Icon className={cn("mt-0.5 size-4 shrink-0", s.icon_c)} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-medium text-foreground">
                  {a.title}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {a.time}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {a.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
