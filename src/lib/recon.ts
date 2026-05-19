/**
 * 消込候補スコアリング（ルールベース・DB未接続）。
 * 入金(in)→発行請求書、出金(out)→受領請求書 を候補に。
 */
import { ISSUED_INVOICES, RECEIVED_INVOICES } from "@/lib/invoice-data";
import type { Invoice } from "@/lib/types/invoice";
import type { BankTxn } from "@/lib/types/bank";
import { txnAmount } from "@/lib/types/bank";
import { daysBetweenISO } from "@/lib/utils";

export interface ReconCandidate {
  invoice: Invoice;
  score: number; // 0-100
  amountMatch: boolean;
  amountDiff: number;
  dateClose: boolean;
  dateDiffDays: number;
  partnerMatch: boolean;
}

export function candidatesFor(txn: BankTxn): ReconCandidate[] {
  const pool = txn.dir === "in" ? ISSUED_INVOICES : RECEIVED_INVOICES;
  const amt = txnAmount(txn);
  const guess = (txn.partner_guess ?? "").toLowerCase();

  return pool
    .map((invoice): ReconCandidate => {
      const amountDiff = amt - invoice.total;
      const amountMatch = amountDiff === 0;
      const dateDiffDays = Math.abs(
        daysBetweenISO(invoice.due_date, txn.txn_date),
      );
      const dateClose = dateDiffDays <= 7;
      const pn = invoice.partner.name.toLowerCase();
      const partnerMatch =
        guess.length > 0 && (pn.includes(guess) || guess.includes(pn));

      // 近似一致（差額 5% 以内）も部分加点
      const near =
        !amountMatch &&
        invoice.total > 0 &&
        Math.abs(amountDiff) / invoice.total <= 0.05;

      const score =
        (amountMatch ? 50 : near ? 30 : 0) +
        (dateClose ? 25 : 0) +
        (partnerMatch ? 25 : 0);

      return {
        invoice,
        score,
        amountMatch,
        amountDiff,
        dateClose,
        dateDiffDays,
        partnerMatch,
      };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
