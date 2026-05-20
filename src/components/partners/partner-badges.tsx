import { Badge } from "@/components/ui";
import { PARTNER_KIND_LABEL, type PartnerKind } from "@/lib/partners-data";

export function PartnerKindBadge({ kind }: { kind: PartnerKind }) {
  const variant =
    kind === "customer"
      ? "info"
      : kind === "supplier"
        ? "primary"
        : kind === "both"
          ? "success"
          : "neutral";
  return <Badge variant={variant}>{PARTNER_KIND_LABEL[kind]}</Badge>;
}

/** 適格請求書発行事業者の登録番号 有無（未登録は警告色） */
export function RegNoBadge({ value }: { value: string | null }) {
  if (value) {
    return (
      <span className="tabular text-sm text-foreground">{value}</span>
    );
  }
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
      未登録
    </span>
  );
}
