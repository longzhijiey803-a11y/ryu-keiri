import { cn } from "@/lib/utils";

/** 遅延日数（売掛）: 1日以上で赤系 */
export function OverdueBadge({ days }: { days: number }) {
  if (days <= 0)
    return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
      遅延 {days}日
    </span>
  );
}

/** 支払期限（買掛）: 超過=赤 / 7日以内=黄 / それ以外=控えめ */
export function DueBadge({ days }: { days: number }) {
  if (days < 0)
    return (
      <span className="inline-flex items-center whitespace-nowrap rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
        超過 {Math.abs(days)}日
      </span>
    );
  const soon = days <= 7;
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium",
        soon ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground",
      )}
    >
      あと {days}日
    </span>
  );
}
