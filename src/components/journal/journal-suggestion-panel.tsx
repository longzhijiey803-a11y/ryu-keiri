"use client";

import { Check, Pencil, Sparkles } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { suggestJournal } from "@/lib/journal-data";
import { TAX_CATEGORY_LABEL } from "@/lib/types/transaction";
import type { JournalSuggestion } from "@/lib/types/journal";

function confColor(c: number) {
  if (c >= 85) return "text-success";
  if (c >= 70) return "text-warning";
  return "text-muted-foreground";
}

export function JournalSuggestionPanel({
  description,
  onApply,
}: {
  description: string;
  /** mode: adopt=勘定科目＋税区分を採用 / edit=科目のみ採用しその場で修正 */
  onApply: (s: JournalSuggestion, mode: "adopt" | "edit") => void;
}) {
  const desc = description.trim();
  const suggestions = desc ? suggestJournal(desc) : [];

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            自動仕訳候補
          </p>
          <p className="text-xs text-muted-foreground">
            摘要・過去仕訳からのルール推定（AI連携は今後）
          </p>
        </div>
      </div>

      {!desc ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          摘要を入力すると、推定勘定科目・税区分の候補が表示されます。
        </p>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="rounded-md border border-border bg-surface p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {s.side === "debit" ? "借方" : "貸方"}：
                    <span className="tabular text-xs text-muted-foreground">
                      {" "}
                      {s.account_code}
                    </span>{" "}
                    {s.account_name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    推定税区分：{TAX_CATEGORY_LABEL[s.tax_category]}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    根拠：{s.rationale}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "tabular text-sm font-semibold",
                      confColor(s.confidence),
                    )}
                  >
                    {s.confidence}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">信頼度</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onApply(s, "edit")}
                >
                  <Pencil /> 修正して採用
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onApply(s, "adopt")}
                >
                  <Check /> 採用
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
