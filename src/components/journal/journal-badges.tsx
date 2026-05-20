import { cn } from "@/lib/utils";
import {
  JOURNAL_ENTRY_STATUS_LABEL,
  type JournalEntryStatus,
} from "@/lib/types/journal";

/**
 * 仕訳ステータスバッジ（下書き/確認待ち/確定/修正済み/取消 専用）。
 * 汎用 StatusBadge（§A-5 の13語彙固定）とは別だが同トーン配色で統一。視認性重視。
 */
type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "ai";

const STATUS_TONE: Record<JournalEntryStatus, Tone> = {
  draft: "neutral",
  ai_predicted: "ai",
  review: "info",
  confirmed: "success",
  revised: "warning",
  voided: "danger",
};

const TONE_CLASS: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  info: { box: "bg-info/10 text-info", dot: "bg-info" },
  success: { box: "bg-success/10 text-success", dot: "bg-success" },
  warning: { box: "bg-warning/10 text-warning", dot: "bg-warning" },
  danger: { box: "bg-danger/10 text-danger", dot: "bg-danger" },
  ai: { box: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
};

export function JournalStatusBadge({
  status,
  className,
}: {
  status: JournalEntryStatus;
  className?: string;
}) {
  const c = TONE_CLASS[STATUS_TONE[status]];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        c.box,
        status === "voided" && "line-through",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {JOURNAL_ENTRY_STATUS_LABEL[status]}
    </span>
  );
}
