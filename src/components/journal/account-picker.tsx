"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  ACCOUNT_CATEGORY_LABEL,
  type Account,
} from "@/lib/types/journal";

/**
 * 勘定科目を選び直すためのトリガ＋ドロップダウン。
 * - 通常モード: 科目名のみ表示（クリックでメニュー）
 * - 推測モード（aiPredicted=true）: "AI推測: <科目>" を斜体＋下点線で表示
 *   行クリック（詳細ドロワーを開く）には伝播しない。
 */
export function AccountPicker({
  current,
  accounts,
  onChange,
  aiPredicted,
  extraCount,
}: {
  current: string;
  accounts: Account[];
  onChange: (code: string) => void;
  aiPredicted?: boolean;
  extraCount?: number;
}) {
  return (
    <div
      className="inline-flex"
      role="presentation"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title={aiPredicted ? "AI推測（サンプル）。クリックで修正できます。" : "勘定科目を変更"}
            className={cn(
              "group inline-flex max-w-[200px] items-center gap-1 rounded text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "hover:text-primary",
            )}
          >
            {aiPredicted ? (
              <span className="inline-flex items-center gap-1 truncate">
                <span
                  className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800"
                  aria-label="AI推測（サンプル）"
                >
                  AI推測（サンプル）
                </span>
                <span className="truncate italic underline decoration-amber-500 decoration-dotted underline-offset-4">
                  {current}
                </span>
              </span>
            ) : (
              <span className="truncate text-foreground">{current}</span>
            )}
            {extraCount && extraCount > 0 ? (
              <span className="text-xs text-muted-foreground">
                他{extraCount}
              </span>
            ) : null}
            <ChevronDown
              className={cn(
                "size-3 shrink-0 text-muted-foreground transition-opacity",
                aiPredicted
                  ? "opacity-70"
                  : "opacity-0 group-hover:opacity-70",
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
          <DropdownMenuLabel>勘定科目を選択</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {accounts.map((a) => (
            <DropdownMenuItem
              key={a.code}
              onSelect={() => onChange(a.code)}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2">
                <span className="tabular text-xs text-muted-foreground">
                  {a.code}
                </span>
                <span>{a.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {ACCOUNT_CATEGORY_LABEL[a.category]}
                </span>
              </span>
              {a.name === current && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
