/**
 * ダッシュボード用ダミーデータ（DB未接続）。
 * 現実的な金額・件数に調整。Step 5 以降で実データに差し替える。
 */
import type { StatusKey } from "@/components/ui";

export const PERIOD = "2026年5月";
export const TODAY = "2026/05/19";

/** 要対応（未処理タスク） */
export const tasks = {
  todayTotal: 25,
  unapprovedRequests: 8, // 未承認申請（経費等）
  unpaidBills: 12, // 未払請求（買掛）
  unpaidInvoices: 5, // 未入金請求（売掛）
};

/** 経営サマリ KPI（前月比つき） */
export const kpis = {
  cashBalance: 8_420_000,
  cashPrevMonthEnd: 7_980_000,
  monthSales: 3_250_000,
  prevMonthSales: 2_890_000,
  monthExpenses: 1_480_000,
  prevMonthExpenses: 1_390_000,
  upcomingPaymentsCount: 7,
  upcomingPaymentsTotal: 901_500,
};
export const grossProfit = kpis.monthSales - kpis.monthExpenses; // 利益概算
export const prevGrossProfit = kpis.prevMonthSales - kpis.prevMonthExpenses;

/** 月次締め進捗 */
export const closing = {
  period: PERIOD,
  progress: 64,
  steps: [
    { label: "未仕訳の解消", state: "done" as const },
    { label: "銀行残高の照合", state: "in_progress" as const },
    { label: "経過勘定の計上", state: "todo" as const },
    { label: "減価償却の計上", state: "todo" as const },
    { label: "試算表レビュー", state: "todo" as const },
  ],
};

/** 月次推移（直近6ヶ月） */
export const trend: { month: string; sales: number; expenses: number }[] = [
  { month: "12月", sales: 2_980_000, expenses: 1_520_000 },
  { month: "1月", sales: 2_640_000, expenses: 1_380_000 },
  { month: "2月", sales: 3_110_000, expenses: 1_450_000 },
  { month: "3月", sales: 3_420_000, expenses: 1_610_000 },
  { month: "4月", sales: 2_890_000, expenses: 1_390_000 },
  { month: "5月", sales: 3_250_000, expenses: 1_480_000 },
];

export type Severity = "danger" | "warning" | "info";

export type AlertType =
  | "overdue_payment"
  | "overdue_receivable"
  | "pending_close"
  | "cash_warning"
  | "master_data";

export interface AlertItem {
  id: string;
  type: AlertType;
  severity: Severity;
  /** 短い見出し */
  label: string;
  /** 詳細メッセージ */
  message: string;
  /** 対象日 / 表示用 */
  date: string;
  /** 紐づく取引/請求書/勘定の ID。クエリ用 */
  relatedId?: string;
}

export const alerts: AlertItem[] = [
  {
    id: "AL-01",
    type: "overdue_payment",
    severity: "danger",
    label: "支払期限を超過しています",
    message: "買掛 INV-2042 / 株式会社サンプル商事 ¥286,000（期限を3日超過）",
    date: "本日",
    relatedId: "INV-2042",
  },
  {
    id: "AL-02",
    type: "overdue_receivable",
    severity: "danger",
    label: "入金期日を超過しています",
    message: "売掛 INV-1987 / 合同会社ミドリ ¥540,000（期日を5日超過）",
    date: "本日",
    relatedId: "INV-1987",
  },
  {
    id: "AL-03",
    type: "pending_close",
    severity: "warning",
    label: "月次締めに残作業があります",
    message: "5月：未消込 3件・未承認 8件 が未処理です",
    date: "本日",
  },
  {
    id: "AL-04",
    type: "cash_warning",
    severity: "warning",
    label: "資金繰り注意",
    message:
      "近日支払により現預金が安全水準（¥5,000,000）を一時的に下回る見込み",
    date: "本日",
  },
  {
    id: "AL-05",
    type: "master_data",
    severity: "info",
    label: "取引先マスタの未整備",
    message: "適格請求書発行事業者番号が未登録の取引先が 2 社あります",
    date: "昨日",
  },
];

export const activities: {
  id: string;
  user: string;
  action: string;
  time: string;
}[] = [
  { id: "AC-1", user: "経理 太郎", action: "請求書 INV-2051 を発行しました", time: "10:42" },
  { id: "AC-2", user: "田中 花子", action: "経費 EX-338（¥8,640）を申請しました", time: "09:58" },
  { id: "AC-3", user: "経理 太郎", action: "入金消込（¥540,000 / 株式会社オオゾラ）を実行しました", time: "昨日 17:21" },
  { id: "AC-4", user: "山田 部長", action: "経費 EX-336 を承認しました", time: "昨日 16:05" },
  { id: "AC-5", user: "経理 太郎", action: "仕訳 JV-1207 を確定しました", time: "昨日 15:30" },
];

export type ScheduleRow = {
  id: string;
  partner: string;
  dueDate: string;
  amount: number;
  status: StatusKey;
};

/** 近日支払予定 */
export const payments: ScheduleRow[] = [
  { id: "P-1", partner: "株式会社サンプル商事", dueDate: "2026/05/21", amount: 286_000, status: "期限超過" },
  { id: "P-2", partner: "東京電力エナジー", dueDate: "2026/05/25", amount: 47_300, status: "支払予定" },
  { id: "P-3", partner: "合同会社ミドリ", dueDate: "2026/05/28", amount: 132_000, status: "支払予定" },
  { id: "P-4", partner: "オフィス賃貸株式会社", dueDate: "2026/05/31", amount: 380_000, status: "支払予定" },
  { id: "P-5", partner: "クラウドサービス株式会社", dueDate: "2026/06/02", amount: 56_100, status: "支払予定" },
];

/** 入金予定 */
export const receipts: ScheduleRow[] = [
  { id: "R-1", partner: "株式会社オオゾラ", dueDate: "2026/05/20", amount: 540_000, status: "入金待ち" },
  { id: "R-2", partner: "合同会社ミドリ", dueDate: "2026/05/22", amount: 540_000, status: "期限超過" },
  { id: "R-3", partner: "株式会社サンプル商事", dueDate: "2026/05/27", amount: 286_000, status: "入金待ち" },
  { id: "R-4", partner: "株式会社グリーン物産", dueDate: "2026/05/30", amount: 198_000, status: "入金待ち" },
  { id: "R-5", partner: "北和工業株式会社", dueDate: "2026/06/03", amount: 412_000, status: "入金待ち" },
];

/** 前月比（％、四捨五入） */
export function changePct(current: number, prev: number): number {
  if (prev === 0) return 0;
  return Math.round(((current - prev) / prev) * 1000) / 10;
}
