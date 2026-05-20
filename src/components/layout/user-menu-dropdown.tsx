"use client";

import Link from "next/link";
import {
  Building2,
  ChevronDown,
  LogOut,
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

export interface UserMenuUser {
  name: string;
  email: string;
  org?: string;
}

/** TopBar 右端のユーザーメニュー（アバター + 名前 + ドロップダウン） */
export function UserMenuDropdown({
  user,
  onLogout,
  className,
}: {
  user: UserMenuUser;
  onLogout?: () => void;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`ユーザーメニュー（${user.name}）`}
          className={cn(
            "ml-1 flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <Avatar name={user.name} />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight text-foreground">
              {user.name}
            </span>
            {user.org && (
              <span className="block text-xs leading-tight text-muted-foreground">
                {user.org}
              </span>
            )}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-64 overflow-hidden",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
        )}
      >
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            {user.org && (
              <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                <Building2 className="size-3" />
                {user.org}
              </p>
            )}
          </div>
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
        <DropdownMenuItem
          onSelect={onLogout}
          disabled={!onLogout}
          className={onLogout ? "text-danger focus:text-danger" : undefined}
        >
          <LogOut /> ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
