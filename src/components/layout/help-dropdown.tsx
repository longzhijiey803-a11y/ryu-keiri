"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  Keyboard,
  LifeBuoy,
  Lightbulb,
  MessageCircleQuestion,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

interface HelpLink {
  label: string;
  icon: typeof BookOpen;
  href?: string;
  external?: boolean;
  hint?: string;
}

/** 表示するヘルプリンク。将来は FAQ / チュートリアル / Slack 連携などに差し替え。 */
const HELP_LINKS: HelpLink[] = [
  {
    label: "クイックスタートガイド",
    icon: BookOpen,
    href: "/dashboard",
    hint: "主要画面と業務フローの最短ルート",
  },
  {
    label: "よくある質問（FAQ）",
    icon: MessageCircleQuestion,
    hint: "公開準備中",
  },
  {
    label: "キーボードショートカット",
    icon: Keyboard,
    hint: "⌘K で検索 / Esc で閉じる",
  },
  {
    label: "ヒント・Tips",
    icon: Lightbulb,
    hint: "AI 推測・自動仕訳の使い方",
  },
  {
    label: "サポートに問い合わせる",
    icon: LifeBuoy,
    external: true,
    hint: "support@example.co.jp",
  },
];

export function HelpDropdown({ className }: { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="ヘルプ"
          title="ヘルプ"
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <HelpCircle className="size-[18px]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-[320px] overflow-hidden p-0",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
        )}
      >
        <div className="border-b border-border bg-muted/40 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">
            ヘルプ・ガイド
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            このアプリの使い方をすばやく確認できます。
          </p>
        </div>

        <DropdownMenuLabel className="px-3 pt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          リソース
        </DropdownMenuLabel>
        <div className="px-1 pb-1">
          {HELP_LINKS.map((l) => {
            const Icon = l.icon;
            const content = (
              <div className="flex w-full items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {l.label}
                  </p>
                  {l.hint && (
                    <p className="truncate text-xs text-muted-foreground">
                      {l.hint}
                    </p>
                  )}
                </div>
                {l.href && (
                  <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                )}
              </div>
            );
            if (l.href) {
              return (
                <DropdownMenuItem key={l.label} asChild>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                  >
                    {content}
                  </Link>
                </DropdownMenuItem>
              );
            }
            return (
              <DropdownMenuItem
                key={l.label}
                disabled
                className="cursor-not-allowed opacity-70"
              >
                {content}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />
        <div className="px-4 py-2.5 text-[11px] text-muted-foreground">
          バージョン v0.1.0（デモ）
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
