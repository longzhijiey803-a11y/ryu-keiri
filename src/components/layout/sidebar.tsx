"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_GROUPS, isNavActive } from "@/lib/nav";

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar",
      )}
    >
      {/* ブランド */}
      <div
        className={cn(
          "flex h-topbar shrink-0 items-center gap-2.5 border-b border-white/5 px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Wallet className="size-4" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-white">
              Ryu Keiri
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              竜之介 経理
            </p>
          </div>
        )}
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.title} className={cn(gi > 0 && "mt-5")}>
            {collapsed ? (
              gi > 0 && <div className="mx-2 mb-3 h-px bg-white/10" />
            ) : (
              <p className="mb-1.5 px-2.5 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/45">
                {group.title}
              </p>
            )}
            <ul className="space-y-0.5">
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
                        "group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-base transition-colors",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-sidebar-active font-medium text-white"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {active && (
                        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" />
                      )}
                      <Icon
                        className={cn(
                          "size-[18px] shrink-0",
                          active
                            ? "text-primary"
                            : "text-sidebar-foreground/70 group-hover:text-white",
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="shrink-0 border-t border-white/5 px-4 py-3">
          <p className="text-xs text-sidebar-foreground/45">
            経理業務SaaS — UI骨格 (Step 3)
          </p>
        </div>
      )}
    </aside>
  );
}
