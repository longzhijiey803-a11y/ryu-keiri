/**
 * 月次決算 ダミーデータ／導出メトリクス（DB未接続）。
 */
import { TRANSACTIONS, USERS } from "@/lib/transactions-data";
import { JOURNAL_ENTRIES } from "@/lib/journal-data";
import { EXPENSE_CLAIMS } from "@/lib/expense-data";
import { BANK_TXNS, BANK_ACCOUNTS } from "@/lib/bank-data";
import { DOCUMENTS } from "@/lib/document-data";
import { isUnlinked } from "@/lib/types/document";

export const CLOSE_PERIOD = "2026年5月";

export type StepState = "done" | "in_progress" | "todo";
export interface CloseStep {
  id: string;
  label: string;
  assignee: string;
  due: string; // ISODate
  state: StepState;
}

export const CHECKLIST: CloseStep[] = [
  { id: "C1", label: "銀行残高確認", assignee: "経理 太郎", due: "2026-06-03", state: "done" },
  { id: "C2", label: "カード明細確認", assignee: "経理 太郎", due: "2026-06-03", state: "done" },
  { id: "C3", label: "売掛金確認", assignee: "経理 太郎", due: "2026-06-04", state: "in_progress" },
  { id: "C4", label: "買掛金確認", assignee: "佐藤 次郎", due: "2026-06-04", state: "in_progress" },
  { id: "C5", label: "未払金確認", assignee: "佐藤 次郎", due: "2026-06-05", state: "todo" },
  { id: "C6", label: "前払費用確認", assignee: "経理 太郎", due: "2026-06-05", state: "todo" },
  { id: "C7", label: "固定資産確認", assignee: "経理 太郎", due: "2026-06-05", state: "todo" },
  { id: "C8", label: "経費精算確認", assignee: "田中 花子", due: "2026-06-06", state: "todo" },
  { id: "C9", label: "仕訳レビュー", assignee: "山田 部長", due: "2026-06-07", state: "todo" },
  { id: "C10", label: "月次レポート作成", assignee: "経理 太郎", due: "2026-06-08", state: "todo" },
];

export function closeMetrics() {
  return {
    unprocessedTxns: TRANSACTIONS.filter((t) => t.status !== "done").length,
    unapprovedClaims: EXPENSE_CLAIMS.filter(
      (c) => c.status === "submitted" || c.status === "pending_approval",
    ).length,
    unreconciled: BANK_TXNS.filter((t) => t.recon_status !== "reconciled")
      .length,
    unfiledDocs: DOCUMENTS.filter(isUnlinked).length,
    unconfirmedJournals: JOURNAL_ENTRIES.filter(
      (j) => j.status === "draft" || j.status === "review",
    ).length,
    accounts: BANK_ACCOUNTS.length,
    cashBalance: BANK_ACCOUNTS.reduce((s, a) => s + a.balance, 0),
  };
}

export const CLOSE_OWNER = USERS[0].name;
export const CLOSE_DUE = "2026-06-08";
