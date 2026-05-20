import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  DOCUMENT_STATUS_LABEL,
  DOCUMENT_TYPE_LABEL,
  type DocumentStatus,
  type DocumentType,
} from "@/lib/types/document";

type Tone = "neutral" | "info" | "success" | "danger";
const TONE: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  info: { box: "bg-info/10 text-info", dot: "bg-info" },
  success: { box: "bg-success/10 text-success", dot: "bg-success" },
  danger: { box: "bg-danger/10 text-danger", dot: "bg-danger" },
};
const STATUS_TONE: Record<DocumentStatus, Tone> = {
  unlinked: "danger", // 未紐づけは目立たせる
  reviewing: "info",
  linked: "success",
  archived: "neutral",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const c = TONE[STATUS_TONE[status]];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        c.box,
      )}
    >
      <span className={cn("size-1.5 rounded-full", c.dot)} aria-hidden />
      {DOCUMENT_STATUS_LABEL[status]}
    </span>
  );
}

export function DocumentTypeBadge({ type }: { type: DocumentType }) {
  return <Badge variant="outline">{DOCUMENT_TYPE_LABEL[type]}</Badge>;
}
