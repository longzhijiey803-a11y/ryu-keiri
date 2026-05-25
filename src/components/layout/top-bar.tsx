"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PanelLeft, Search, Settings } from "lucide-react";

import { clearAuthCookie } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { HelpDropdown } from "./help-dropdown";
import { NotificationsDropdown } from "./notifications-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { UserMenuDropdown, type UserMenuUser } from "./user-menu-dropdown";

const CURRENT_USER: UserMenuUser = {
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
  const router = useRouter();
  const handleLogout = React.useCallback(() => {
    clearAuthCookie();
    router.replace("/login");
  }, [router]);

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
        <ThemeToggle />

        <HelpDropdown className="hidden sm:inline-flex" />

        <NotificationsDropdown />

        <Link
          href="/settings"
          aria-label="設定"
          title="設定"
          className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
        >
          <Settings className="size-[18px]" />
        </Link>

        <UserMenuDropdown user={CURRENT_USER} onLogout={handleLogout} />
      </div>
    </header>
  );
}
