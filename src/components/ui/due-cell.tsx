import { cn, daysBetweenISO, formatISODate } from "@/lib/utils";

/**
 * 期限セル：ISO 日付 + 「今日まで X日」バッジ。
 * - 期限切れ: 赤
 * - 当日: 警告
 * - 3日以内: 注意
 * - それ以降: 中立
 * done=true は完了済（緑、または淡色）。
 */
export function DueCell({
  due,
  today,
  done,
  doneLabel,
}: {
  due: string | null;
  today: string;
  done?: boolean;
  doneLabel?: string;
}) {
  if (!due) {
    return <span className="text-muted-foreground/50">—</span>;
  }
  const diff = daysBetweenISO(today, due);
  const formatted = formatISODate(due);
  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap tabular text-muted-foreground">
        {formatted}
        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
          {doneLabel ?? "完了"}
        </span>
      </span>
    );
  }
  // 期限が近い（3日以内）/超過は全画面共通で danger（赤）で警告する。
  let tone: "danger" | "muted" = "muted";
  let badge = "";
  if (diff < 0) {
    tone = "danger";
    badge = `${Math.abs(diff)}日超過`;
  } else if (diff === 0) {
    tone = "danger";
    badge = "本日まで";
  } else if (diff <= 3) {
    tone = "danger";
    badge = `あと${diff}日`;
  } else {
    badge = `あと${diff}日`;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap tabular",
        tone === "danger" ? "font-medium text-danger" : "text-foreground",
      )}
    >
      {formatted}
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
          tone === "danger"
            ? "bg-danger/10 text-danger"
            : "bg-muted text-muted-foreground",
        )}
      >
        {badge}
      </span>
    </span>
  );
}
