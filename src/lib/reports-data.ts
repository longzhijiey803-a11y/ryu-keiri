/**
 * レポート用データ（DB未接続・既存ダミーから導出 + 一部固定値）。
 * 実データ接続時は集計クエリ／ビューに置換する。
 */
import { RECEIVABLES, PAYABLES } from "@/lib/ar-ap-data";
import { JOURNAL_ENTRIES } from "@/lib/journal-data";
import { EXPENSE_CLAIMS } from "@/lib/expense-data";

export interface ReportLine {
  label: string;
  amount: number;
  emphasis?: boolean; // 小計・合計を強調
}

/* ── 損益計算書（PL）2026年5月 ── */
export const PL: ReportLine[] = [
  { label: "売上高", amount: 3_250_000 },
  { label: "売上原価", amount: -712_800 },
  { label: "売上総利益", amount: 2_537_200, emphasis: true },
  { label: "販売費及び一般管理費", amount: -1_480_000 },
  { label: "営業利益", amount: 1_057_200, emphasis: true },
  { label: "営業外収益", amount: 12_000 },
  { label: "営業外費用", amount: -8_000 },
  { label: "経常利益", amount: 1_061_200, emphasis: true },
];

/* ── 貸借対照表（BS）2026年5月末 ── */
export const BS_ASSETS: ReportLine[] = [
  { label: "現金及び預金", amount: 11_110_400 },
  { label: "売掛金", amount: 3_864_000 },
  { label: "棚卸資産", amount: 1_200_000 },
  { label: "固定資産", amount: 6_290_001 },
  { label: "資産合計", amount: 22_464_401, emphasis: true },
];
export const BS_LIAB_EQUITY: ReportLine[] = [
  { label: "買掛金・未払金", amount: 2_133_454 },
  { label: "未払消費税等", amount: 480_000 },
  { label: "借入金", amount: 5_000_000 },
  { label: "負債合計", amount: 7_613_454, emphasis: true },
  { label: "資本金", amount: 10_000_000 },
  { label: "利益剰余金", amount: 4_850_947 },
  { label: "純資産合計", amount: 14_850_947, emphasis: true },
];

/* ── キャッシュフロー（CF）── */
export const CF: ReportLine[] = [
  { label: "営業活動によるCF", amount: 1_420_000, emphasis: true },
  { label: "　税引前利益", amount: 1_061_200 },
  { label: "　減価償却費", amount: 806_000 },
  { label: "　売上債権の増減", amount: -360_000 },
  { label: "　仕入債務の増減", amount: -87_200 },
  { label: "投資活動によるCF", amount: -3_600_000, emphasis: true },
  { label: "財務活動によるCF", amount: -200_000, emphasis: true },
  { label: "現金及び現金同等物の増減", amount: -2_380_000, emphasis: true },
];

/* ── 売掛金 / 買掛金 年齢表 ── */
export interface AgingRow {
  partner: string;
  not_due: number;
  d1_30: number;
  d31_60: number;
  d61_90: number;
  d90_over: number;
  total: number;
}
function bucket(
  rows: { partner_name: string; outstanding: number; overdue: number }[],
): AgingRow[] {
  const map = new Map<string, AgingRow>();
  for (const r of rows) {
    if (r.outstanding <= 0) continue;
    const a =
      map.get(r.partner_name) ??
      {
        partner: r.partner_name,
        not_due: 0,
        d1_30: 0,
        d31_60: 0,
        d61_90: 0,
        d90_over: 0,
        total: 0,
      };
    const o = r.overdue;
    if (o <= 0) a.not_due += r.outstanding;
    else if (o <= 30) a.d1_30 += r.outstanding;
    else if (o <= 60) a.d31_60 += r.outstanding;
    else if (o <= 90) a.d61_90 += r.outstanding;
    else a.d90_over += r.outstanding;
    a.total += r.outstanding;
    map.set(r.partner_name, a);
  }
  return Array.from(map.values());
}
export const AR_AGING = bucket(
  RECEIVABLES.map((r) => ({
    partner_name: r.partner_name,
    outstanding: r.outstanding,
    overdue: r.overdue_days,
  })),
);
export const AP_AGING = bucket(
  PAYABLES.map((r) => ({
    partner_name: r.partner_name,
    outstanding: r.outstanding,
    overdue: -r.due_in_days,
  })),
);

/* ── 部門別収支（仕訳から導出） ── */
export interface DeptPnl {
  department: string;
  revenue: number;
  expense: number;
}
export function deptPnl(): DeptPnl[] {
  const map = new Map<string, DeptPnl>();
  for (const e of JOURNAL_ENTRIES) {
    if (e.status === "voided") continue;
    for (const l of e.lines) {
      const dep = l.department ?? "未設定";
      const d = map.get(dep) ?? { department: dep, revenue: 0, expense: 0 };
      if (l.account_code.startsWith("4") && l.side === "credit")
        d.revenue += l.amount;
      if (l.account_code.startsWith("7") && l.side === "debit")
        d.expense += l.amount;
      map.set(dep, d);
    }
  }
  return Array.from(map.values()).filter((d) => d.revenue || d.expense);
}

/* ── 経費分析（経費申請の勘定科目候補別） ── */
export function expenseBreakdown(): { account: string; amount: number }[] {
  const map = new Map<string, number>();
  for (const c of EXPENSE_CLAIMS) {
    for (const l of c.lines) {
      const k = l.account_hint.trim() || "未分類";
      map.set(k, (map.get(k) ?? 0) + l.amount);
    }
  }
  return Array.from(map.entries())
    .map(([account, amount]) => ({ account, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export { trend as MONTHLY_TREND } from "@/lib/dashboard-data";
