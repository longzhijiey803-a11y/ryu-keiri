"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  Inbox,
  MessageCircle,
  RotateCcw,
  Settings as SettingsIcon,
  TimerReset,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn, formatISODateTime } from "@/lib/utils";
import {
  NOTIFICATIONS,
  type Notification,
  type NotificationKind,
} from "@/lib/notifications-data";

/** 種別ごとのアイコン・色 */
const KIND_META: Record<
  NotificationKind,
  { icon: LucideIcon; tone: string; label: string }
> = {
  approval: { icon: CheckCheck, tone: "text-info bg-info/10", label: "承認" },
  rejected: { icon: RotateCcw, tone: "text-danger bg-danger/10", label: "差戻し" },
  due: { icon: TimerReset, tone: "text-warning bg-warning/10", label: "期限" },
  overdue: {
    icon: AlertTriangle,
    tone: "text-danger bg-danger/10",
    label: "期限超過",
  },
  comment: {
    icon: MessageCircle,
    tone: "text-foreground bg-muted",
    label: "コメント",
  },
  system: {
    icon: SettingsIcon,
    tone: "text-muted-foreground bg-muted",
    label: "システム",
  },
};

/** 「X分前/X時間前/X日前」表記。`now` は呼び出し側で固定して SSR との不一致を避ける。 */
function relativeTime(iso: string, now: number): string {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "たった今";
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}日前`;
  return formatISODateTime(iso);
}

/** SSR 中は固定文字列、マウント後にライブ更新される「今」のミリ秒。 */
function useClientNow(intervalMs = 60_000): number | null {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

function NotificationItem({
  n,
  onClick,
  now,
}: {
  n: Notification;
  onClick: (n: Notification) => void;
  /** クライアントマウント後の現在時刻。null の間は ISO 表記でフォールバック。 */
  now: number | null;
}) {
  const meta = KIND_META[n.kind];
  const Icon = meta.icon;
  // 中身は同じだが、href があればリンク、なければボタンで描画する
  const inner = (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
          meta.tone,
        )}
        aria-hidden
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              n.read
                ? "text-foreground"
                : "font-semibold text-foreground",
            )}
          >
            {n.title}
          </p>
          {!n.read && (
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              aria-label="未読"
            />
          )}
        </div>
        <p
          className={cn(
            "mt-0.5 line-clamp-2 text-xs",
            n.read ? "text-muted-foreground" : "text-foreground/80",
          )}
        >
          {n.description}
        </p>
        <p
          className="mt-1 text-[11px] text-muted-foreground tabular"
          title={formatISODateTime(n.occurred_at)}
          suppressHydrationWarning
        >
          {now == null ? formatISODateTime(n.occurred_at) : relativeTime(n.occurred_at, now)}
        </p>
      </div>
    </div>
  );

  const baseCls = cn(
    "block w-full cursor-pointer px-3 py-3 text-left transition-colors",
    "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
    !n.read && "bg-info/[0.04]",
  );

  if (n.href) {
    return (
      <Link href={n.href} className={baseCls} onClick={() => onClick(n)}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onClick(n)}
      className={baseCls}
    >
      {inner}
    </button>
  );
}

export function NotificationsDropdown() {
  const [items, setItems] =
    React.useState<Notification[]>(NOTIFICATIONS);
  const [open, setOpen] = React.useState(false);
  const now = useClientNow();
  const unread = items.filter((n) => !n.read).length;

  const markRead = (n: Notification) => {
    if (n.read) return;
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
    );
  };
  const markAllRead = () =>
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={
            unread > 0 ? `通知（未読 ${unread} 件）` : "通知"
          }
          title="通知"
          className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-[18px] text-white ring-2 ring-surface",
              )}
              aria-hidden
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-[360px] overflow-hidden p-0",
          // fade + slide のアニメーション
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              通知
            </span>
            {unread > 0 && (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                未読 {unread}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="inline-flex items-center gap-1 rounded text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <Check className="size-3" /> すべて既読
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-3 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="size-5" />
            </span>
            <p className="text-sm text-muted-foreground">通知はありません</p>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto scrollbar-thin divide-y divide-border">
            {items.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onClick={markRead}
                now={now}
              />
            ))}
          </div>
        )}

        <div className="border-t border-border px-3 py-2 text-center">
          <Link
            href="/settings"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            通知設定を開く
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
