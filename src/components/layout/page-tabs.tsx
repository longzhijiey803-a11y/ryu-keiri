"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface PageTab {
  href: string;
  label: string;
  /** exact: パス完全一致 / prefix: 配下も含めてアクティブ（既定 exact） */
  match?: "exact" | "prefix";
}

/** 画面内タブ（下線型）。各機能のタブUIを統一する共通コンポーネント。 */
export function PageTabs({ tabs }: { tabs: PageTab[] }) {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex items-center gap-1 border-b border-border">
      {tabs.map((t) => {
        const active =
          t.match === "prefix"
            ? pathname === t.href || pathname.startsWith(t.href + "/")
            : pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative -mb-px h-9 px-3 text-base font-medium transition-colors",
              "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-sm",
              active
                ? "text-foreground after:bg-primary"
                : "text-muted-foreground hover:text-foreground after:bg-transparent",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
