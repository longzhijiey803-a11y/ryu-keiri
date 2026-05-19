"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  PanelLeft,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

const CURRENT_USER = {
  name: "経理 担当者",
  email: "keiri@example.co.jp",
  org: "竜之介ホールディングス",
};

function IconButton({
  label,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TopBar({
  collapsed,
  onToggleSidebar,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-topbar shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <IconButton
        label={collapsed ? "サイドバーを開く" : "サイドバーを折りたたむ"}
        onClick={onToggleSidebar}
      >
        <PanelLeft className="size-[18px]" />
      </IconButton>

      {/* グローバル検索（骨格・非機能） */}
      <div className="relative max-w-xl flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="取引・請求書・取引先・金額で検索"
          className="h-input w-full rounded-md border border-border bg-background pl-9 pr-16 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <IconButton label="ヘルプ" className="hidden sm:inline-flex">
          <CircleHelp className="size-[18px]" />
        </IconButton>

        {/* 通知 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="通知"
              title="通知"
              className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-surface" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuLabel>通知</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              通知機能は Step 4 以降で実装します
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link
          href="/settings"
          aria-label="設定"
          title="設定"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Settings className="size-[18px]" />
        </Link>

        {/* ユーザーメニュー */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar name={CURRENT_USER.name} />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight text-foreground">
                  {CURRENT_USER.name}
                </span>
                <span className="block text-xs leading-tight text-muted-foreground">
                  {CURRENT_USER.org}
                </span>
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>
              <span className="block text-sm font-medium text-foreground">
                {CURRENT_USER.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {CURRENT_USER.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <UserRound /> プロフィール
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings /> 設定
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <LogOut /> ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
