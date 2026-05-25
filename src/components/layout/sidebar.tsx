"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_GROUPS, isNavActive } from "@/lib/nav";

/**
 * 16案テーマ：グラデブランド帯＋グループ毎の色帯。
 * 4 グループに対応する色トーン（indigo / emerald / amber / rose）。
 */
const GROUP_TONES = [
  "bg-accent-indigo/90",
  "bg-accent-emerald/90",
  "bg-accent-amber/90",
  "bg-accent-rose/90",
] as const;

const GROUP_ICONS = [
  "bg-accent-indigo/20 text-accent-indigo",
  "bg-accent-emerald/20 text-accent-emerald",
  "bg-accent-amber/20 text-accent-amber",
  "bg-accent-rose/20 text-accent-rose",
] as const;

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-sidebar-active/60 bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar",
      )}
    >
      {/* ブランド（高さは右のトップバーと一致 / ライト=白、ダーク=黒） */}
      <div
        className={cn(
          "flex h-topbar shrink-0 items-center border-b border-border bg-white text-foreground dark:bg-black dark:text-white",
          collapsed ? "justify-center px-0" : "px-4",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2.5",
            collapsed && "justify-center",
          )}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent-indigo/15 text-accent-indigo dark:bg-white/10 dark:text-white">
            <Wallet className="size-4" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-bold leading-tight">
                Ryu Keiri
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                竜之介 経理
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3">
        {NAV_GROUPS.map((group, gi) => {
          const tone = GROUP_TONES[gi % GROUP_TONES.length];
          const iconTone = GROUP_ICONS[gi % GROUP_ICONS.length];
          return (
            <div key={group.title} className={cn(gi > 0 && "mt-3")}>
              {collapsed ? (
                gi > 0 && (
                  <div className={cn("mx-2 mb-2 h-0.5 rounded-full", tone)} />
                )
              ) : (
                <div
                  className={cn(
                    "rounded-t-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white",
                    tone,
                  )}
                >
                  {group.title}
                </div>
              )}
              <ul
                className={cn(
                  "space-y-0.5",
                  !collapsed && "rounded-b-md bg-sidebar-active/40 p-1.5",
                )}
              >
                {group.items.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                          collapsed && "justify-center px-0",
                          active
                            ? "bg-sidebar-active font-medium text-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-active/70 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-md",
                            active ? iconTone : "text-sidebar-foreground/70",
                          )}
                        >
                          <Icon className="size-[16px]" />
                        </span>
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="shrink-0 border-t border-sidebar-active/60 px-4 py-2.5">
          <p className="text-[11px] text-sidebar-foreground/60">
            経理業務 SaaS · v1
          </p>
        </div>
      )}
    </aside>
  );
}
