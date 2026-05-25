"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Paperclip, Plus, Search, Sparkles, Wallet, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "@/lib/nav";

const ACTIVE_HREF = "/dashboard";

/** ヘルパー：すべての案で共通のコンテナ。位置と幅は layout の ml-sidebar と揃える。 */
function Shell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-sidebar flex-col overflow-hidden",
        className,
      )}
    >
      {children}
    </aside>
  );
}

/** すべての nav 項目をフラットに取り出す（変則表示用）。 */
function flatItems() {
  return NAV_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.title })));
}

// =====================================================================
// 01 標準・コンパクト：既存ベース、密度コンパクトめ
// =====================================================================
function Side01() {
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="竜之介 経理" tone="dark" />
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wide text-sidebar-foreground/45">
              {g.title}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <RowDark key={it.href} item={it} active={it.href === ACTIVE_HREF} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <Footer tone="dark" text="経理業務 SaaS" />
    </Shell>
  );
}

// =====================================================================
// 02 ヒーロー＋小カード：ブランドゾーンが主役。グラデ気味
// =====================================================================
function Side02() {
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <div className="px-4 pt-5 pb-4">
        <div className="rounded-xl bg-gradient-to-br from-primary/30 via-primary/15 to-transparent p-4">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-4" />
          </span>
          <p className="mt-3 text-base font-semibold text-white">Ryu Keiri</p>
          <p className="text-xs text-sidebar-foreground/60">竜之介 経理 ダッシュボード</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-1 px-2.5 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
              {g.title}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <RowDark key={it.href} item={it} active={it.href === ACTIVE_HREF} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 03 数値先行・罫線レス：ライト系、テキストとアイコンだけ
// =====================================================================
function Side03() {
  return (
    <Shell className="bg-background text-foreground">
      <div className="px-6 pt-6 pb-4">
        <p className="text-2xl font-bold tracking-tight">Ryu Keiri</p>
        <p className="text-xs text-muted-foreground">竜之介 経理</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {flatItems().map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
              it.href === ACTIVE_HREF
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <it.icon className="size-[18px]" />
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 04 高密度グリッド：行間狭く、グループタイトルも小
// =====================================================================
function Side04() {
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="高密度モード" tone="dark" />
      <nav className="flex-1 overflow-y-auto px-2.5 py-2.5 text-[13px]">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-2.5")}>
            <p className="mb-0.5 px-2 text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/45">
              {g.title}
            </p>
            <ul>
              {g.items.map((it) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-center gap-2 rounded px-2 py-1",
                        active
                          ? "bg-sidebar-active text-white"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <it.icon className="size-4" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 05 タイル・モザイク：項目を 2 列タイルで（業務だけタイル、他はリスト）
// =====================================================================
function Side05() {
  const featured = NAV_GROUPS[1].items.slice(0, 6);
  const rest = NAV_GROUPS.flatMap((g) => g.items).filter(
    (it) => !featured.find((f) => f.href === it.href),
  );
  const colors = [
    "bg-indigo-500/15 text-indigo-200",
    "bg-emerald-500/15 text-emerald-200",
    "bg-amber-500/15 text-amber-200",
    "bg-rose-500/15 text-rose-200",
    "bg-sky-500/15 text-sky-200",
    "bg-violet-500/15 text-violet-200",
  ];
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="モザイク" tone="dark" />
      <div className="px-3 pt-2">
        <p className="mb-2 px-1 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
          業務
        </p>
        <div className="grid grid-cols-2 gap-2">
          {featured.map((it, i) => (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-lg p-2.5 text-xs",
                colors[i % colors.length],
                it.href === ACTIVE_HREF && "ring-1 ring-white/40",
              )}
            >
              <it.icon className="size-4" />
              <span className="leading-tight">{it.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <nav className="mt-3 flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-1 px-1 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
          その他
        </p>
        <ul className="space-y-0.5">
          {rest.map((it) => (
            <RowDark key={it.href} item={it} active={it.href === ACTIVE_HREF} />
          ))}
        </ul>
      </nav>
    </Shell>
  );
}

// =====================================================================
// 06 テーブル中心：グレースケール、台帳の見出し風
// =====================================================================
function Side06() {
  return (
    <Shell className="bg-zinc-100 text-zinc-700">
      <div className="border-b border-zinc-300 bg-zinc-200/60 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Menu
        </p>
        <p className="mt-0.5 text-base font-semibold text-zinc-900">Ryu Keiri</p>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {NAV_GROUPS.map((g) => (
          <div key={g.title}>
            <p className="border-b border-zinc-300 bg-zinc-200/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              {g.title}
            </p>
            <ul>
              {g.items.map((it) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href} className="border-b border-zinc-200">
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm",
                        active
                          ? "bg-white font-semibold text-zinc-900"
                          : "hover:bg-white",
                      )}
                    >
                      <it.icon className="size-4 text-zinc-500" />
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 07 2 カラム：左にアイコン列、右にラベル列を別領域として表示
// =====================================================================
function Side07() {
  const items = flatItems();
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <div className="grid h-full grid-cols-[56px_1fr]">
        <div className="flex flex-col items-center gap-2 border-r border-white/5 bg-zinc-900/50 py-4">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wallet className="size-4" />
          </span>
          <div className="mt-2 flex flex-col gap-1.5">
            {items.slice(0, 8).map((it) => (
              <Link
                key={it.href}
                href={it.href}
                title={it.label}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md transition-colors",
                  it.href === ACTIVE_HREF
                    ? "bg-primary/20 text-primary"
                    : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <it.icon className="size-[18px]" />
              </Link>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto px-3 py-4">
          <p className="px-2 text-base font-semibold text-white">Ryu Keiri</p>
          <p className="px-2 text-xs text-sidebar-foreground/60">竜之介 経理</p>
          <nav className="mt-4">
            {NAV_GROUPS.map((g, gi) => (
              <div key={g.title} className={cn(gi > 0 && "mt-3")}>
                <p className="mb-1 px-2 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
                  {g.title}
                </p>
                <ul className="space-y-0.5">
                  {g.items.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className={cn(
                          "block truncate rounded-md px-2 py-1.5 text-sm",
                          it.href === ACTIVE_HREF
                            ? "bg-sidebar-active text-white"
                            : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                        )}
                      >
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </Shell>
  );
}

// =====================================================================
// 08 アイコン強調：丸アイコン大、ラベル小
// =====================================================================
function Side08() {
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="アイコン強調" tone="dark" />
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-2 px-2 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
              {g.title}
            </p>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-1.5",
                        active
                          ? "bg-sidebar-active text-white"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full",
                          active
                            ? "bg-primary/20 text-primary"
                            : "bg-white/5 text-sidebar-foreground/80",
                        )}
                      >
                        <it.icon className="size-4" />
                      </span>
                      <span className="text-[13px]">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 09 進捗バー視覚化：項目末尾に細いバー
// =====================================================================
function Side09() {
  const widths = [80, 55, 95, 30, 70, 45, 60, 90, 25, 50, 65, 75, 40, 85];
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="進捗ビュー" tone="dark" />
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-1.5 px-2.5 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
              {g.title}
            </p>
            <ul className="space-y-1">
              {g.items.map((it, ii) => {
                const w = widths[(gi * 5 + ii) % widths.length];
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "block rounded-md px-2.5 py-1.5",
                        active
                          ? "bg-sidebar-active text-white"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <div className="flex items-center gap-2 text-[13px]">
                        <it.icon className="size-4" />
                        <span className="truncate">{it.label}</span>
                        <span className="ml-auto tabular text-[10px] text-sidebar-foreground/50">
                          {w}%
                        </span>
                      </div>
                      <div className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className={cn(
                            "h-full",
                            active ? "bg-primary" : "bg-sidebar-foreground/40",
                          )}
                          style={{ width: `${w}%` }}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 10 ミニマル・罫線最小：ライト、テキストオンリー
// =====================================================================
function Side10() {
  return (
    <Shell className="bg-background text-foreground">
      <div className="px-6 py-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Ryu</p>
        <p className="text-lg font-medium">Keiri</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-6">
        <ul className="space-y-2.5">
          {flatItems().map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "block text-sm transition-colors",
                  it.href === ACTIVE_HREF
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Shell>
  );
}

// =====================================================================
// 11 ダーク・ターミナル風：黒背景、emerald、CLI 風
// =====================================================================
function Side11() {
  return (
    <Shell className="bg-zinc-950 font-mono text-xs text-emerald-300">
      <div className="border-b border-emerald-500/20 px-4 py-4">
        <p className="text-emerald-500">$ ryukeiri --menu</p>
        <p className="mt-1 text-zinc-500">v1.0.0 · 竜之介 経理</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-3 leading-6">
        {NAV_GROUPS.map((g) => (
          <div key={g.title} className="mt-3 first:mt-0">
            <p className="px-1 text-emerald-500/70">## {g.title}</p>
            <ul>
              {g.items.map((it) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "block truncate rounded px-2 py-0.5",
                        active
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-200",
                      )}
                    >
                      <span className="text-emerald-500/60">▸ </span>
                      {it.label.toLowerCase().replace(/[ ・]/g, "_")}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-emerald-500/20 px-4 py-2 text-zinc-500">
        <span className="text-emerald-500">$</span> _
      </div>
    </Shell>
  );
}

// =====================================================================
// 12 縦タイムライン：左端に縦線とドット
// =====================================================================
function Side12() {
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="タイムライン" tone="dark" />
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <div className="relative pl-5">
          <span className="absolute inset-y-1 left-1.5 w-px bg-white/15" />
          {NAV_GROUPS.map((g, gi) => (
            <div key={g.title} className={cn(gi > 0 && "mt-4")}>
              <p className="mb-1.5 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
                {g.title}
              </p>
              <ul className="space-y-1.5">
                {g.items.map((it) => {
                  const active = it.href === ACTIVE_HREF;
                  return (
                    <li key={it.href} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[18px] top-1.5 size-2 rounded-full",
                          active ? "bg-primary ring-2 ring-primary/30" : "bg-white/25",
                        )}
                      />
                      <Link
                        href={it.href}
                        className={cn(
                          "flex items-center gap-2 text-sm",
                          active ? "font-medium text-white" : "text-sidebar-foreground hover:text-white",
                        )}
                      >
                        <it.icon className="size-4" />
                        <span>{it.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </Shell>
  );
}

// =====================================================================
// 13 チャート中心：上部にミニ棒グラフ、その下にメニュー
// =====================================================================
function Side13() {
  const bars = [40, 55, 35, 70, 50, 80, 60];
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="チャートビュー" tone="dark" />
      <div className="px-4 pt-3">
        <p className="text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
          今週の売上推移
        </p>
        <div className="mt-2 flex h-16 items-end gap-1.5 rounded-md bg-black/20 p-2">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-primary/70"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <nav className="mt-3 flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-3")}>
            <p className="mb-1 px-2.5 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
              {g.title}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <RowDark key={it.href} item={it} active={it.href === ACTIVE_HREF} />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 14 1 枚カード集約：内側を 1 枚のカードでくくる
// =====================================================================
function Side14() {
  return (
    <Shell className="bg-background p-3">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-border bg-muted/40 px-4 py-3">
          <p className="text-base font-semibold text-foreground">Ryu Keiri</p>
          <p className="text-xs text-muted-foreground">竜之介 経理</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 text-foreground">
          {NAV_GROUPS.map((g, gi) => (
            <div key={g.title} className={cn(gi > 0 && "mt-3")}>
              <p className="mb-1 px-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                {g.title}
              </p>
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const active = it.href === ACTIVE_HREF;
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-foreground hover:bg-muted/60",
                        )}
                      >
                        <it.icon className="size-4" />
                        <span>{it.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-border bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
          v1.0 · 経理 SaaS
        </div>
      </div>
    </Shell>
  );
}

// =====================================================================
// 15 スプレッドシート風：行番号付き、罫線で区切る
// =====================================================================
function Side15() {
  const items = flatItems();
  return (
    <Shell className="bg-white text-zinc-900">
      <div className="border-b border-zinc-300 bg-zinc-100 px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          A · メニュー
        </p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-900">Ryu Keiri</p>
      </div>
      <nav className="flex-1 overflow-y-auto text-sm">
        <table className="w-full">
          <tbody>
            {items.map((it, i) => {
              const active = it.href === ACTIVE_HREF;
              return (
                <tr
                  key={it.href}
                  className={cn(
                    "border-b border-zinc-200",
                    active && "bg-amber-50",
                  )}
                >
                  <td className="w-8 border-r border-zinc-200 bg-zinc-100 px-2 py-1 text-right tabular text-[11px] text-zinc-500">
                    {i + 1}
                  </td>
                  <td className="px-2 py-1">
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-center gap-2",
                        active ? "font-semibold text-zinc-900" : "text-zinc-700 hover:text-zinc-900",
                      )}
                    >
                      <it.icon className="size-3.5 text-zinc-500" />
                      <span>{it.label}</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </nav>
    </Shell>
  );
}

// =====================================================================
// 16 カラフル・フル背景：各グループに別色のヘッダー
// =====================================================================
function Side16() {
  const groupTones = [
    "bg-indigo-500/90",
    "bg-emerald-500/90",
    "bg-amber-500/90",
    "bg-rose-500/90",
  ];
  return (
    <Shell className="bg-zinc-900 text-white">
      <div className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 px-4 py-4">
        <p className="text-base font-bold">Ryu Keiri</p>
        <p className="text-xs text-white/80">カラフル・モード</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-3")}>
            <div
              className={cn(
                "rounded-t-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide",
                groupTones[gi % groupTones.length],
              )}
            >
              {g.title}
            </div>
            <ul className="rounded-b-lg bg-white/5 p-1.5">
              {g.items.map((it) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                        active
                          ? "bg-white/15 font-medium text-white"
                          : "text-white/85 hover:bg-white/10",
                      )}
                    >
                      <it.icon className="size-4" />
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 17 Sparkline 付き：右端にミニ折れ線
// =====================================================================
function Sparkline({ seed }: { seed: number }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const v = ((seed * (i + 1)) % 9) + 1;
    return v;
  });
  const max = Math.max(...pts);
  const w = 36;
  const h = 14;
  const d = pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="shrink-0 opacity-70">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Side17() {
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="Sparkline" tone="dark" />
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-1 px-2.5 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
              {g.title}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((it, ii) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px]",
                        active
                          ? "bg-sidebar-active text-white"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <it.icon className="size-4 shrink-0" />
                      <span className="truncate">{it.label}</span>
                      <span className="ml-auto text-primary/80">
                        <Sparkline seed={gi * 7 + ii + 3} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 18 ニュース紙面風：serif、新聞風の目次
// =====================================================================
function Side18() {
  return (
    <Shell className="bg-stone-50 font-serif text-stone-900">
      <div className="border-b-2 border-stone-900 px-5 pt-6 pb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">経理週報</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Ryu Keiri</h1>
        <p className="mt-0.5 text-xs text-stone-500">第 217 号 · 五月号</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-5 py-4">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-1.5 border-b border-stone-300 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              {g.title}
            </p>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-baseline gap-2 text-[15px] leading-6",
                        active
                          ? "font-semibold text-stone-900 underline decoration-stone-900/50 underline-offset-4"
                          : "text-stone-700 hover:text-stone-900",
                      )}
                    >
                      <span className="text-stone-400">¶</span>
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </Shell>
  );
}

// =====================================================================
// 19 クイックアクション中心：上部に大きなアクションボタン
// =====================================================================
function Side19() {
  return (
    <Shell className="bg-sidebar text-sidebar-foreground">
      <Brand title="Ryu Keiri" sub="クイック" tone="dark" />
      <div className="px-3 pt-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="size-4" /> 新規取引を追加
        </button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="flex flex-col items-center gap-1 rounded-md bg-white/5 px-2 py-2 text-xs hover:bg-white/10">
            <Sparkles className="size-4 text-primary" />
            AI 仕訳
          </button>
          <button className="flex flex-col items-center gap-1 rounded-md bg-white/5 px-2 py-2 text-xs hover:bg-white/10">
            <Search className="size-4 text-primary" />
            検索
          </button>
          <button className="flex flex-col items-center gap-1 rounded-md bg-white/5 px-2 py-2 text-xs hover:bg-white/10">
            <Zap className="size-4 text-primary" />
            一括承認
          </button>
          <button className="flex flex-col items-center gap-1 rounded-md bg-white/5 px-2 py-2 text-xs hover:bg-white/10">
            <Paperclip className="size-4 text-primary" />
            証憑アップ
          </button>
        </div>
      </div>
      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-1 px-2.5 text-[11px] uppercase tracking-wide text-sidebar-foreground/45">
          メニュー
        </p>
        <ul className="space-y-0.5">
          {flatItems().map((it) => (
            <RowDark key={it.href} item={it} active={it.href === ACTIVE_HREF} compact />
          ))}
        </ul>
      </nav>
    </Shell>
  );
}

// =====================================================================
// 20 和風・低彩度：墨色背景、朱の差し色、縦線アクセント
// =====================================================================
function Side20() {
  return (
    <Shell className="bg-stone-100 text-stone-800">
      <div className="border-b border-stone-300 px-5 pt-6 pb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-[0.4em] text-stone-900">竜</span>
          <span className="text-xs text-stone-500">経理日誌</span>
        </div>
        <p className="mt-1 text-[11px] tracking-widest text-stone-500">RYU KEIRI</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && "mt-4")}>
            <p className="mb-1.5 px-2.5 text-[11px] tracking-[0.2em] text-stone-500">
              ― {g.title} ―
            </p>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = it.href === ACTIVE_HREF;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "relative flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm",
                        active
                          ? "bg-stone-200/70 font-semibold text-stone-900"
                          : "text-stone-700 hover:bg-stone-200/50",
                      )}
                    >
                      {active && (
                        <span className="absolute inset-y-1 left-0 w-0.5 bg-rose-800" />
                      )}
                      <it.icon className="size-4 text-stone-500" />
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-stone-300 px-5 py-3 text-[11px] tracking-widest text-stone-500">
        令和八年 五月
      </div>
    </Shell>
  );
}

// =====================================================================
// 共通パーツ
// =====================================================================
function Brand({
  title,
  sub,
  tone,
}: {
  title: string;
  sub: string;
  tone: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "flex h-topbar shrink-0 items-center gap-2.5 px-4",
        tone === "dark" ? "border-b border-white/5" : "border-b border-border",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Wallet className="size-4" />
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-base font-semibold",
            tone === "dark" ? "text-white" : "text-foreground",
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "truncate text-xs",
            tone === "dark" ? "text-sidebar-foreground/60" : "text-muted-foreground",
          )}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

function Footer({ tone, text }: { tone: "dark" | "light"; text: string }) {
  return (
    <div
      className={cn(
        "shrink-0 px-4 py-3 text-xs",
        tone === "dark"
          ? "border-t border-white/5 text-sidebar-foreground/45"
          : "border-t border-border text-muted-foreground",
      )}
    >
      {text}
    </div>
  );
}

function RowDark({
  item,
  active,
  compact,
}: {
  item: { href: string; label: string; icon: LucideIcon };
  active: boolean;
  compact?: boolean;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-md px-2.5",
          compact ? "py-1.5 text-[13px]" : "py-2 text-sm",
          active
            ? "bg-sidebar-active font-medium text-white"
            : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
        )}
      >
        <Icon
          className={cn(
            "size-[18px] shrink-0",
            active ? "text-primary" : "text-sidebar-foreground/70 group-hover:text-white",
          )}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}

// =====================================================================
// ディスパッチャ
// =====================================================================
const VARIANT_MAP: Record<string, () => JSX.Element> = {
  "01": Side01,
  "02": Side02,
  "03": Side03,
  "04": Side04,
  "05": Side05,
  "06": Side06,
  "07": Side07,
  "08": Side08,
  "09": Side09,
  "10": Side10,
  "11": Side11,
  "12": Side12,
  "13": Side13,
  "14": Side14,
  "15": Side15,
  "16": Side16,
  "17": Side17,
  "18": Side18,
  "19": Side19,
  "20": Side20,
};

export function VariantSidebar({ variant }: { variant?: string }) {
  const pathname = usePathname() ?? "";
  const fromPath = pathname.match(/^\/ui-lab\/(\d{2})/)?.[1];
  const key = variant ?? fromPath ?? "01";
  const Comp = VARIANT_MAP[key] ?? Side01;
  return <Comp />;
}
