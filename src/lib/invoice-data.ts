/**
 * 請求管理ダミーデータ（DB未接続）。型は src/lib/types/invoice.ts。
 * 発行(issued)・受領(received) を網羅。期限超過・各ステータス・入金/支払状態を含む。
 */
import type {
  Invoice,
  InvoiceFilter,
  InvoiceLine,
} from "@/lib/types/invoice";
import { isOverdue } from "@/lib/types/invoice";
import { PARTNERS, USERS } from "@/lib/transactions-data";

const P = Object.fromEntries(PARTNERS.map((p) => [p.id, p]));
const U = Object.fromEntries(USERS.map((u) => [u.id, u]));

type Raw = Omit<Invoice, "subtotal" | "tax" | "total"> & {
  subtotal: number;
  tax: number;
};
function mk(e: Raw): Invoice {
  return { ...e, total: e.subtotal + e.tax };
}
const line = (
  id: string,
  description: string,
  quantity: number,
  unit_price: number,
): InvoiceLine => ({
  id,
  description,
  quantity,
  unit_price,
  amount: quantity * unit_price,
  tax_category: "taxable_10",
});

export const ISSUED_INVOICES: Invoice[] = [
  mk({
    id: "INV-2042",
    direction: "issued",
    number: "INV-2042",
    partner_id: "p1",
    partner: P.p1,
    subject: "5月分 受託開発 請求",
    issue_date: "2026-05-12",
    receipt_date: null,
    due_date: "2026-06-30",
    subtotal: 2_600_000,
    tax: 260_000,
    status: "awaiting_payment",
    payment_state: "unpaid",
    lines: [line("IL-1", "受託開発 5月分", 1, 2_600_000)],
    payments: [],
    attachments: [
      { id: "IA-1", file_name: "請求書_INV-2042.pdf", mime_type: "application/pdf", size_bytes: 184_320, uploaded_at: "2026-05-12T10:42:00+09:00", uploaded_by: "経理 太郎" },
    ],
    approvals: [],
    history: [
      { id: "IH-1", actor: U.u1, action: "請求書を発行", at: "2026-05-12T10:42:00+09:00", detail: null },
      { id: "IH-2", actor: U.u1, action: "送付", at: "2026-05-12T11:00:00+09:00", detail: "メール送付" },
    ],
    related_transaction_id: "TX-1042",
    related_journal_id: "JV-1207",
    assignee: U.u1,
    memo: "検収完了分。",
    created_at: "2026-05-12T10:42:00+09:00",
    updated_at: "2026-05-12T11:00:00+09:00",
  }),
  mk({
    id: "INV-1987",
    direction: "issued",
    number: "INV-1987",
    partner_id: "p2",
    partner: P.p2,
    subject: "保守契約 5月",
    issue_date: "2026-05-01",
    receipt_date: null,
    due_date: "2026-05-15",
    subtotal: 490_909,
    tax: 49_091,
    status: "awaiting_payment",
    payment_state: "unpaid",
    lines: [line("IL-2", "保守サービス 5月", 1, 490_909)],
    payments: [],
    attachments: [],
    approvals: [],
    history: [
      { id: "IH-3", actor: U.u1, action: "請求書を発行", at: "2026-05-01T10:00:00+09:00", detail: null },
    ],
    related_transaction_id: "TX-1028",
    related_journal_id: "JV-1180",
    assignee: U.u1,
    memo: "入金期日超過。督促要。",
    created_at: "2026-05-01T10:00:00+09:00",
    updated_at: "2026-05-01T10:00:00+09:00",
  }),
  mk({
    id: "INV-1955",
    direction: "issued",
    number: "INV-1955",
    partner_id: "p2",
    partner: P.p2,
    subject: "受託開発B 検収請求",
    issue_date: "2026-04-25",
    receipt_date: null,
    due_date: "2026-05-31",
    subtotal: 1_200_000,
    tax: 120_000,
    status: "paid",
    payment_state: "paid",
    lines: [line("IL-3", "受託開発B 一括", 1, 1_200_000)],
    payments: [
      { id: "PM-1", date: "2026-05-12", amount: 1_320_000, method: "銀行振込", note: "全額入金" },
    ],
    attachments: [
      { id: "IA-2", file_name: "請求書_INV-1955.pdf", mime_type: "application/pdf", size_bytes: 172_900, uploaded_at: "2026-04-25T15:20:00+09:00", uploaded_by: "経理 太郎" },
    ],
    approvals: [],
    history: [
      { id: "IH-4", actor: U.u1, action: "請求書を発行", at: "2026-04-25T15:20:00+09:00", detail: null },
      { id: "IH-5", actor: U.u1, action: "入金消込", at: "2026-05-12T16:00:00+09:00", detail: "¥1,320,000" },
    ],
    related_transaction_id: "TX-1024",
    related_journal_id: "JV-1150",
    assignee: U.u1,
    memo: null,
    created_at: "2026-04-25T15:20:00+09:00",
    updated_at: "2026-05-12T16:00:00+09:00",
  }),
  mk({
    id: "INV-2051",
    direction: "issued",
    number: "INV-2051",
    partner_id: "p3",
    partner: P.p3,
    subject: "保守サービス 6月（前倒し）",
    issue_date: null,
    receipt_date: null,
    due_date: "2026-06-20",
    subtotal: 490_909,
    tax: 49_091,
    status: "draft",
    payment_state: "unpaid",
    lines: [line("IL-4", "保守サービス 6月", 1, 490_909)],
    payments: [],
    attachments: [],
    approvals: [],
    history: [
      { id: "IH-6", actor: U.u1, action: "下書きを作成", at: "2026-05-15T17:40:00+09:00", detail: null },
    ],
    related_transaction_id: "TX-1011",
    related_journal_id: null,
    assignee: U.u1,
    memo: "未送付。",
    created_at: "2026-05-15T17:40:00+09:00",
    updated_at: "2026-05-15T17:40:00+09:00",
  }),
  mk({
    id: "INV-2033",
    direction: "issued",
    number: "INV-2033",
    partner_id: "p7",
    partner: P.p7,
    subject: "物品販売",
    issue_date: "2026-05-05",
    receipt_date: null,
    due_date: "2026-05-30",
    subtotal: 180_000,
    tax: 18_000,
    status: "partially_paid",
    payment_state: "partial",
    lines: [line("IL-5", "物品 一式", 1, 180_000)],
    payments: [
      { id: "PM-2", date: "2026-05-18", amount: 100_000, method: "銀行振込", note: "内入金" },
    ],
    attachments: [],
    approvals: [],
    history: [
      { id: "IH-7", actor: U.u2, action: "請求書を発行", at: "2026-05-05T13:00:00+09:00", detail: null },
    ],
    related_transaction_id: "TX-1015",
    related_journal_id: null,
    assignee: U.u2,
    memo: "一部入金済み。残額 ¥98,000。",
    created_at: "2026-05-05T13:00:00+09:00",
    updated_at: "2026-05-18T10:00:00+09:00",
  }),
  mk({
    id: "INV-2060",
    direction: "issued",
    number: "INV-2060",
    partner_id: "p1",
    partner: P.p1,
    subject: "追加開発 スポット",
    issue_date: "2026-05-16",
    receipt_date: null,
    due_date: "2026-06-15",
    subtotal: 350_000,
    tax: 35_000,
    status: "sent",
    payment_state: "unpaid",
    lines: [line("IL-6", "スポット開発", 1, 350_000)],
    payments: [],
    attachments: [],
    approvals: [],
    history: [
      { id: "IH-8", actor: U.u1, action: "送付", at: "2026-05-16T09:00:00+09:00", detail: null },
    ],
    related_transaction_id: null,
    related_journal_id: null,
    assignee: U.u1,
    memo: null,
    created_at: "2026-05-16T09:00:00+09:00",
    updated_at: "2026-05-16T09:00:00+09:00",
  }),
];

export const RECEIVED_INVOICES: Invoice[] = [
  mk({
    id: "RB-5521",
    direction: "received",
    number: "CL-202605-12",
    partner_id: "p6",
    partner: P.p6,
    subject: "クラウド利用料 5月",
    issue_date: "2026-05-10",
    receipt_date: "2026-05-11",
    due_date: "2026-05-28",
    subtotal: 120_000,
    tax: 12_000,
    status: "reviewing",
    payment_state: "unpaid",
    lines: [line("RL-1", "クラウド利用料", 1, 120_000)],
    payments: [],
    attachments: [
      { id: "RA-1", file_name: "請求書_cloud_202605.pdf", mime_type: "application/pdf", size_bytes: 73_400, uploaded_at: "2026-05-11T14:20:00+09:00", uploaded_by: "経理 太郎" },
    ],
    approvals: [],
    history: [
      { id: "RH-1", actor: U.u1, action: "受領請求書を登録", at: "2026-05-11T14:20:00+09:00", detail: "OCR取込" },
    ],
    related_transaction_id: "TX-1041",
    related_journal_id: "JV-1142",
    assignee: U.u1,
    memo: null,
    created_at: "2026-05-11T14:20:00+09:00",
    updated_at: "2026-05-11T14:25:00+09:00",
  }),
  mk({
    id: "RB-5500",
    direction: "received",
    number: "KW-2042",
    partner_id: "p8",
    partner: P.p8,
    subject: "原材料 仕入 5月",
    issue_date: "2026-05-04",
    receipt_date: "2026-05-04",
    due_date: "2026-06-05",
    subtotal: 648_000,
    tax: 64_800,
    status: "approval",
    payment_state: "unpaid",
    lines: [line("RL-2", "原材料一式", 1, 648_000)],
    payments: [],
    attachments: [
      { id: "RA-2", file_name: "請求書_kitawa_genzai.pdf", mime_type: "application/pdf", size_bytes: 102_400, uploaded_at: "2026-05-04T16:00:00+09:00", uploaded_by: "佐藤 次郎" },
    ],
    approvals: [
      { id: "RAP-1", order: 1, approver: U.u3, role: "部門長", status: "pending", acted_at: null, comment: null },
    ],
    history: [
      { id: "RH-2", actor: U.u4, action: "受領請求書を登録", at: "2026-05-04T16:00:00+09:00", detail: null },
    ],
    related_transaction_id: "TX-1001",
    related_journal_id: "JV-1070",
    assignee: U.u4,
    memo: null,
    created_at: "2026-05-04T16:00:00+09:00",
    updated_at: "2026-05-04T16:05:00+09:00",
  }),
  mk({
    id: "RB-5480",
    direction: "received",
    number: "OFFICE-0531",
    partner_id: "p5",
    partner: P.p5,
    subject: "オフィス賃料 5月",
    issue_date: "2026-05-01",
    receipt_date: "2026-05-02",
    due_date: "2026-05-31",
    subtotal: 345_454,
    tax: 34_546,
    status: "scheduled_payment",
    payment_state: "scheduled",
    lines: [line("RL-3", "オフィス賃料 5月", 1, 345_454)],
    payments: [],
    attachments: [],
    approvals: [
      { id: "RAP-2", order: 1, approver: U.u3, role: "部門長", status: "approved", acted_at: "2026-05-08T13:00:00+09:00", comment: null },
    ],
    history: [
      { id: "RH-3", actor: U.u1, action: "承認", at: "2026-05-08T13:00:00+09:00", detail: "部門長承認" },
    ],
    related_transaction_id: "TX-1037",
    related_journal_id: "JV-1199",
    assignee: U.u1,
    memo: "月末払い。",
    created_at: "2026-05-02T09:00:00+09:00",
    updated_at: "2026-05-08T13:00:00+09:00",
  }),
  mk({
    id: "RB-5450",
    direction: "received",
    number: "TEL-0420",
    partner_id: "p4",
    partner: P.p4,
    subject: "通信費 4月",
    issue_date: "2026-04-18",
    receipt_date: "2026-04-19",
    due_date: "2026-04-30",
    subtotal: 21_500,
    tax: 2_150,
    status: "paid",
    payment_state: "paid",
    lines: [line("RL-4", "通信費 4月", 1, 21_500)],
    payments: [
      { id: "PM-3", date: "2026-04-30", amount: 23_650, method: "口座引落", note: null },
    ],
    attachments: [],
    approvals: [
      { id: "RAP-3", order: 1, approver: U.u3, role: "部門長", status: "approved", acted_at: "2026-04-21T09:00:00+09:00", comment: null },
    ],
    history: [
      { id: "RH-4", actor: U.u4, action: "支払消込", at: "2026-04-30T10:00:00+09:00", detail: null },
    ],
    related_transaction_id: "TX-1008",
    related_journal_id: "JV-1120",
    assignee: U.u4,
    memo: null,
    created_at: "2026-04-19T10:00:00+09:00",
    updated_at: "2026-04-30T10:00:00+09:00",
  }),
  mk({
    id: "RB-5600",
    direction: "received",
    number: "TAXI-0509",
    partner_id: "p7",
    partner: P.p7,
    subject: "出張旅費（タクシー）",
    issue_date: "2026-05-09",
    receipt_date: "2026-05-09",
    due_date: "2026-05-20",
    subtotal: 7_854,
    tax: 786,
    status: "rejected",
    payment_state: "unpaid",
    lines: [line("RL-5", "タクシー代", 1, 7_854)],
    payments: [],
    attachments: [
      { id: "RA-3", file_name: "領収書_taxi.jpg", mime_type: "image/jpeg", size_bytes: 421_900, uploaded_at: "2026-05-09T18:02:00+09:00", uploaded_by: "田中 花子" },
    ],
    approvals: [
      { id: "RAP-4", order: 1, approver: U.u3, role: "部門長", status: "rejected", acted_at: "2026-05-10T08:50:00+09:00", comment: "宛名が個人名。会社名で再取得。" },
    ],
    history: [
      { id: "RH-5", actor: U.u3, action: "差戻し", at: "2026-05-10T08:50:00+09:00", detail: "証憑不備" },
    ],
    related_transaction_id: "TX-1039",
    related_journal_id: null,
    assignee: U.u2,
    memo: "差戻し中。",
    created_at: "2026-05-09T18:02:00+09:00",
    updated_at: "2026-05-10T08:50:00+09:00",
  }),
  mk({
    id: "RB-5620",
    direction: "received",
    number: "KW-CONS-0506",
    partner_id: "p8",
    partner: P.p8,
    subject: "顧問コンサル費 5月",
    issue_date: "2026-05-06",
    receipt_date: "2026-05-06",
    due_date: "2026-05-10",
    subtotal: 200_000,
    tax: 20_000,
    status: "unconfirmed",
    payment_state: "unpaid",
    lines: [line("RL-6", "顧問料 5月", 1, 200_000)],
    payments: [],
    attachments: [],
    approvals: [],
    history: [
      { id: "RH-6", actor: U.u1, action: "受領請求書を登録", at: "2026-05-06T09:00:00+09:00", detail: null },
    ],
    related_transaction_id: "TX-1018",
    related_journal_id: "JV-1085",
    assignee: U.u1,
    memo: "未確認・支払期限超過。",
    created_at: "2026-05-06T09:00:00+09:00",
    updated_at: "2026-05-06T09:00:00+09:00",
  }),
];

export const ALL_INVOICES = [...ISSUED_INVOICES, ...RECEIVED_INVOICES];

export function findInvoice(id: string): Invoice | undefined {
  return ALL_INVOICES.find((i) => i.id === id);
}

export function filterInvoices(
  list: Invoice[],
  f: InvoiceFilter,
): Invoice[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((inv) => {
    if (f.status !== "all" && inv.status !== f.status) return false;
    if (f.payment_state !== "all" && inv.payment_state !== f.payment_state)
      return false;
    if (f.overdue_only && !isOverdue(inv)) return false;
    if (q) {
      const hay =
        `${inv.id} ${inv.number} ${inv.subject} ${inv.partner.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
