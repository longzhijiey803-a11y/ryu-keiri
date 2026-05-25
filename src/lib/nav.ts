import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  BarChart3,
  Building2,
  CalendarCheck2,
  FileText,
  HandCoins,
  History,
  Landmark,
  LayoutDashboard,
  NotebookPen,
  Paperclip,
  Receipt,
  Settings,
  Users,
  Workflow,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** 中身は Step 4 以降。現状はプレースホルダー（docs/DESIGN.md §A-1） */
  placeholder?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

/**
 * 左サイドバーの情報設計（正本: docs/DESIGN.md §A-3 v1.1）。
 * 4グループ＋区切り線で全16カテゴリを表示する。
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: "ホーム",
    items: [
      { label: "ダッシュボード", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "業務",
    items: [
      { label: "取引管理", href: "/transactions", icon: ArrowRightLeft, placeholder: true },
      { label: "請求管理", href: "/invoices", icon: FileText },
      { label: "経費精算", href: "/expenses", icon: Receipt },
      { label: "入出金管理", href: "/cash", icon: Landmark },
      { label: "売掛・買掛", href: "/receivables", icon: HandCoins },
      { label: "証憑管理", href: "/documents", icon: Paperclip },
      { label: "ワークフロー", href: "/approvals", icon: Workflow },
    ],
  },
  {
    title: "会計",
    items: [
      { label: "仕訳帳", href: "/journal-entries", icon: NotebookPen },
      { label: "月次決算", href: "/monthly-close", icon: CalendarCheck2 },
      { label: "固定資産", href: "/fixed-assets", icon: Building2 },
      { label: "レポート", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "管理",
    items: [
      { label: "取引先管理", href: "/partners", icon: Users },
      { label: "監査ログ", href: "/audit-logs", icon: History },
      { label: "設定", href: "/settings", icon: Settings },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

/** 現在地判定：ルートは完全一致、それ以外は配下も含めてアクティブ。 */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** pathname に対応するナビ項目（ページタイトル等に使用）。 */
export function findNavItem(pathname: string): NavItem | undefined {
  const matches = ALL_NAV_ITEMS.filter((i) => isNavActive(pathname, i.href));
  return matches.sort((a, b) => b.href.length - a.href.length)[0];
}

/**
 * 16案テーマ：pathname に対応するサイドバーグループの色トーン（テーブルヘッダ等で利用）。
 * 4 グループ: ホーム=indigo / 業務=emerald / 会計=amber / 管理=rose。
 * 既定（マッチなし）と取引管理 (/transactions) はカラフルグラデを維持する。
 */
export type GroupTone =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "rainbow";

/**
 * nav に直接出ていないサブルートの所属グループを補う。
 * 例: `/cash` の入出金明細タブは `/bank-transactions` で別ルート。
 */
const EXTRA_GROUP_PREFIXES: { tone: GroupTone; prefixes: string[] }[] = [
  {
    tone: "emerald", // 業務
    prefixes: ["/bank-transactions", "/reconciliation", "/payables", "/workflows"],
  },
];

function startsWithAny(path: string, prefixes: string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

export function groupToneForPath(pathname: string): GroupTone {
  if (pathname === "/transactions" || pathname.startsWith("/transactions/")) {
    return "rainbow"; // 取引管理は据え置き
  }
  for (const x of EXTRA_GROUP_PREFIXES) {
    if (startsWithAny(pathname, x.prefixes)) return x.tone;
  }
  for (const g of NAV_GROUPS) {
    const inGroup = g.items.some(
      (it) =>
        it.href !== "/" && isNavActive(pathname, it.href),
    );
    if (inGroup) {
      if (g.title === "ホーム") return "indigo";
      if (g.title === "業務") return "emerald";
      if (g.title === "会計") return "amber";
      if (g.title === "管理") return "rose";
    }
  }
  return "rainbow";
}

/** GroupTone → Tailwind 背景クラス（テーブルヘッダ・帯用）。 */
export const TONE_BG: Record<GroupTone, string> = {
  indigo: "bg-accent-indigo",
  emerald: "bg-accent-emerald",
  amber: "bg-accent-amber",
  rose: "bg-accent-rose",
  rainbow: "bg-gradient-to-r from-accent-indigo via-accent-fuchsia to-accent-rose",
};
