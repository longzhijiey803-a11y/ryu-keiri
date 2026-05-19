/**
 * 入出金管理ダミーデータ（DB未接続）。型は src/lib/types/bank.ts。
 * 銀行API/CSVは未連携（UIのみ）。消込ステータスを網羅。
 */
import type {
  BankAccount,
  BankTxn,
  BankTxnFilter,
} from "@/lib/types/bank";

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "BA-1",
    name: "メイン口座",
    bank_name: "みずほ銀行",
    branch: "渋谷支店",
    account_type: "ordinary",
    last4: "1234",
    balance: 8_420_000,
    last_synced_at: "2026-05-19T08:00:00+09:00",
    status: "active",
  },
  {
    id: "BA-2",
    name: "ネット入金口座",
    bank_name: "GMOあおぞらネット銀行",
    branch: "法人営業部",
    account_type: "ordinary",
    last4: "9981",
    balance: 2_150_400,
    last_synced_at: "2026-05-19T07:50:00+09:00",
    status: "active",
  },
  {
    id: "BA-3",
    name: "当座（手形）",
    bank_name: "三菱UFJ銀行",
    branch: "新宿支店",
    account_type: "current",
    last4: "5567",
    balance: 540_000,
    last_synced_at: null,
    status: "error",
  },
];

export const BANK_TXNS: BankTxn[] = [
  {
    id: "BT-1001",
    account_id: "BA-1",
    txn_date: "2026-05-12",
    dir: "in",
    description: "振込 カ）サンプルシヨウジ",
    partner_guess: "株式会社サンプル商事",
    deposit: 1_320_000,
    withdrawal: 0,
    balance: 8_420_000,
    recon_status: "reconciled",
    related_invoice_id: "INV-1955",
    related_transaction_id: "TX-1024",
    memo: "受託開発B 入金",
  },
  {
    id: "BT-1002",
    account_id: "BA-2",
    txn_date: "2026-05-18",
    dir: "in",
    description: "振込 ゴウドウガイシヤミドリ",
    partner_guess: "合同会社ミドリ",
    deposit: 100_000,
    withdrawal: 0,
    balance: 2_150_400,
    recon_status: "discrepancy",
    related_invoice_id: "INV-2033",
    related_transaction_id: null,
    memo: "一部入金（差異あり）",
  },
  {
    id: "BT-1003",
    account_id: "BA-1",
    txn_date: "2026-05-19",
    dir: "in",
    description: "振込 カ）オオゾラ",
    partner_guess: "株式会社オオゾラ",
    deposit: 540_000,
    withdrawal: 0,
    balance: 8_960_000,
    recon_status: "candidate",
    related_invoice_id: null,
    related_transaction_id: null,
    memo: null,
  },
  {
    id: "BT-1004",
    account_id: "BA-1",
    txn_date: "2026-05-15",
    dir: "out",
    description: "口座振替 デンキリヨウキン",
    partner_guess: "東京電力エナジー",
    deposit: 0,
    withdrawal: 23_650,
    balance: 8_396_350,
    recon_status: "reconciled",
    related_invoice_id: "RB-5450",
    related_transaction_id: "TX-1008",
    memo: null,
  },
  {
    id: "BT-1005",
    account_id: "BA-1",
    txn_date: "2026-05-19",
    dir: "out",
    description: "ATM 引出",
    partner_guess: null,
    deposit: 0,
    withdrawal: 50_000,
    balance: 8_346_350,
    recon_status: "unreconciled",
    related_invoice_id: null,
    related_transaction_id: null,
    memo: "用途不明・要確認",
  },
  {
    id: "BT-1006",
    account_id: "BA-1",
    txn_date: "2026-05-17",
    dir: "in",
    description: "振込 カ）グリーンブッサン",
    partner_guess: "株式会社グリーン物産",
    deposit: 198_000,
    withdrawal: 0,
    balance: 8_544_350,
    recon_status: "candidate",
    related_invoice_id: null,
    related_transaction_id: null,
    memo: null,
  },
  {
    id: "BT-1007",
    account_id: "BA-1",
    txn_date: "2026-05-16",
    dir: "out",
    description: "振込 キタワコウギヨウ",
    partner_guess: "北和工業株式会社",
    deposit: 0,
    withdrawal: 712_800,
    balance: 7_831_550,
    recon_status: "pending",
    related_invoice_id: "RB-5500",
    related_transaction_id: null,
    memo: "承認後に消込予定",
  },
  {
    id: "BT-1008",
    account_id: "BA-2",
    txn_date: "2026-05-11",
    dir: "out",
    description: "振込 クラウドサービス",
    partner_guess: "クラウドサービス株式会社",
    deposit: 0,
    withdrawal: 132_000,
    balance: 2_050_400,
    recon_status: "unreconciled",
    related_invoice_id: null,
    related_transaction_id: null,
    memo: null,
  },
  {
    id: "BT-1009",
    account_id: "BA-1",
    txn_date: "2026-05-14",
    dir: "out",
    description: "振込 オフィスチンタイ",
    partner_guess: "オフィス賃貸株式会社",
    deposit: 0,
    withdrawal: 380_000,
    balance: 7_451_550,
    recon_status: "reconciled",
    related_invoice_id: "RB-5480",
    related_transaction_id: "TX-1037",
    memo: null,
  },
  {
    id: "BT-1010",
    account_id: "BA-2",
    txn_date: "2026-05-10",
    dir: "in",
    description: "振込 カ）サンプルシヨウジ",
    partner_guess: "株式会社サンプル商事",
    deposit: 286_000,
    withdrawal: 0,
    balance: 1_918_400,
    recon_status: "unreconciled",
    related_invoice_id: null,
    related_transaction_id: null,
    memo: null,
  },
];

export function filterBankTxns(
  list: BankTxn[],
  f: BankTxnFilter,
): BankTxn[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((t) => {
    if (f.account_id !== "all" && t.account_id !== f.account_id)
      return false;
    if (f.recon_status !== "all" && t.recon_status !== f.recon_status)
      return false;
    if (f.dir !== "all" && t.dir !== f.dir) return false;
    if (q) {
      const hay =
        `${t.id} ${t.description} ${t.partner_guess ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function accountName(id: string): string {
  return BANK_ACCOUNTS.find((a) => a.id === id)?.name ?? id;
}
