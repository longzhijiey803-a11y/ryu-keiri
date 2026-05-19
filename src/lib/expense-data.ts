/**
 * 経費精算ダミーデータ（DB未接続）。型は src/lib/types/expense.ts。
 * 全8ステータスを網羅。一部は領収書未添付/明細不備（警告表示の確認用）。
 */
import type {
  ExpenseClaim,
  ExpenseFilter,
  ExpenseLine,
} from "@/lib/types/expense";
import { USERS } from "@/lib/transactions-data";

const U = Object.fromEntries(USERS.map((u) => [u.id, u]));

type RawLine = Omit<ExpenseLine, "id">;
type Raw = Omit<ExpenseClaim, "total" | "lines" | "applicant"> & {
  lines: RawLine[];
};
let ls = 0;
function mk(e: Raw): ExpenseClaim {
  const lines: ExpenseLine[] = e.lines.map((l) => ({
    ...l,
    id: `EL-${++ls}`,
  }));
  return {
    ...e,
    applicant: U[e.applicant_id],
    lines,
    total: lines.reduce((s, l) => s + l.amount, 0),
  };
}
const T10 = "taxable_10" as const;

export const EXPENSE_CLAIMS: ExpenseClaim[] = [
  mk({
    id: "EXP-1042",
    subject: "出張旅費（大阪・5月）",
    applicant_id: "u2",
    department: "営業部",
    claim_date: "2026-05-12",
    status: "pending_approval",
    pay_state: "unpaid",
    lines: [
      { used_on: "2026-05-08", payee: "JR東海", amount: 27_800, tax_category: T10, account_hint: "7400 旅費交通費", note: "新幹線往復" },
      { used_on: "2026-05-08", payee: "ホテルグランデ", amount: 14_300, tax_category: T10, account_hint: "7400 旅費交通費", note: "宿泊" },
    ],
    receipts: [
      { id: "ER-1", file_name: "領収書_shinkansen.pdf", mime_type: "application/pdf", size_bytes: 88_200, uploaded_at: "2026-05-12T09:10:00+09:00", uploaded_by: "田中 花子" },
      { id: "ER-2", file_name: "領収書_hotel.jpg", mime_type: "image/jpeg", size_bytes: 412_300, uploaded_at: "2026-05-12T09:11:00+09:00", uploaded_by: "田中 花子" },
    ],
    approvals: [
      { id: "EA-1", order: 1, approver: U.u3, role: "部門長", status: "approved", acted_at: "2026-05-13T09:00:00+09:00", comment: "出張報告と一致。" },
      { id: "EA-2", order: 2, approver: U.u1, role: "経理", status: "pending", acted_at: null, comment: null },
    ],
    comments: [
      { id: "EC-1", author: U.u2, body: "領収書2点添付しました。", created_at: "2026-05-12T09:12:00+09:00" },
    ],
    history: [
      { id: "EH-1", actor: U.u2, action: "経費を申請", at: "2026-05-12T09:12:00+09:00", detail: null },
      { id: "EH-2", actor: U.u3, action: "一次承認", at: "2026-05-13T09:00:00+09:00", detail: "部門長承認" },
    ],
    memo: "客先訪問のため。",
    created_at: "2026-05-12T09:12:00+09:00",
    updated_at: "2026-05-13T09:00:00+09:00",
  }),
  mk({
    id: "EXP-1039",
    subject: "タクシー代（深夜帰宅）",
    applicant_id: "u4",
    department: "開発部",
    claim_date: "2026-05-10",
    status: "returned",
    pay_state: "unpaid",
    lines: [
      { used_on: "2026-05-09", payee: "東京無線タクシー", amount: 8_640, tax_category: T10, account_hint: "7400 旅費交通費", note: null },
    ],
    receipts: [],
    approvals: [
      { id: "EA-3", order: 1, approver: U.u3, role: "部門長", status: "rejected", acted_at: "2026-05-10T08:50:00+09:00", comment: "領収書を添付してください。" },
    ],
    comments: [
      { id: "EC-2", author: U.u3, body: "差戻します。領収書必須です。", created_at: "2026-05-10T08:51:00+09:00" },
    ],
    history: [
      { id: "EH-3", actor: U.u4, action: "経費を申請", at: "2026-05-10T07:40:00+09:00", detail: null },
      { id: "EH-4", actor: U.u3, action: "差戻し", at: "2026-05-10T08:50:00+09:00", detail: "証憑不備" },
    ],
    memo: null,
    created_at: "2026-05-10T07:40:00+09:00",
    updated_at: "2026-05-10T08:51:00+09:00",
  }),
  mk({
    id: "EXP-1031",
    subject: "書籍購入（技術書）",
    applicant_id: "u4",
    department: "開発部",
    claim_date: "2026-05-07",
    status: "approved",
    pay_state: "scheduled",
    lines: [
      { used_on: "2026-05-05", payee: "技術書専門店", amount: 9_900, tax_category: T10, account_hint: "7500 消耗品費", note: "業務関連" },
    ],
    receipts: [
      { id: "ER-3", file_name: "領収書_book.pdf", mime_type: "application/pdf", size_bytes: 51_200, uploaded_at: "2026-05-07T18:00:00+09:00", uploaded_by: "佐藤 次郎" },
    ],
    approvals: [
      { id: "EA-4", order: 1, approver: U.u3, role: "部門長", status: "approved", acted_at: "2026-05-08T10:00:00+09:00", comment: null },
      { id: "EA-5", order: 2, approver: U.u1, role: "経理", status: "approved", acted_at: "2026-05-08T14:00:00+09:00", comment: "OK" },
    ],
    comments: [],
    history: [
      { id: "EH-5", actor: U.u4, action: "経費を申請", at: "2026-05-07T18:01:00+09:00", detail: null },
      { id: "EH-6", actor: U.u1, action: "最終承認", at: "2026-05-08T14:00:00+09:00", detail: null },
    ],
    memo: null,
    created_at: "2026-05-07T18:01:00+09:00",
    updated_at: "2026-05-08T14:00:00+09:00",
  }),
  mk({
    id: "EXP-1028",
    subject: "会議用茶菓代",
    applicant_id: "u2",
    department: "営業部",
    claim_date: "2026-05-06",
    status: "settled",
    pay_state: "settled",
    lines: [
      { used_on: "2026-05-02", payee: "コンビニ", amount: 3_240, tax_category: "taxable_8", account_hint: "7900 雑費", note: "8%軽減" },
    ],
    receipts: [
      { id: "ER-4", file_name: "領収書_cafe.jpg", mime_type: "image/jpeg", size_bytes: 220_100, uploaded_at: "2026-05-06T12:00:00+09:00", uploaded_by: "田中 花子" },
    ],
    approvals: [
      { id: "EA-6", order: 1, approver: U.u3, role: "部門長", status: "approved", acted_at: "2026-05-06T15:00:00+09:00", comment: null },
    ],
    comments: [],
    history: [
      { id: "EH-7", actor: U.u2, action: "経費を申請", at: "2026-05-06T12:01:00+09:00", detail: null },
      { id: "EH-8", actor: U.u1, action: "精算実行", at: "2026-05-15T10:00:00+09:00", detail: "給与外振込" },
    ],
    memo: null,
    created_at: "2026-05-06T12:01:00+09:00",
    updated_at: "2026-05-15T10:00:00+09:00",
  }),
  mk({
    id: "EXP-1050",
    subject: "セミナー参加費",
    applicant_id: "u4",
    department: "開発部",
    claim_date: "2026-05-15",
    status: "submitted",
    pay_state: "unpaid",
    lines: [
      { used_on: "2026-05-14", payee: "技術カンファレンス事務局", amount: 33_000, tax_category: T10, account_hint: "", note: "勘定科目要確認" },
    ],
    receipts: [
      { id: "ER-5", file_name: "領収書_seminar.pdf", mime_type: "application/pdf", size_bytes: 71_000, uploaded_at: "2026-05-15T19:00:00+09:00", uploaded_by: "佐藤 次郎" },
    ],
    approvals: [
      { id: "EA-7", order: 1, approver: U.u3, role: "部門長", status: "pending", acted_at: null, comment: null },
    ],
    comments: [],
    history: [
      { id: "EH-9", actor: U.u4, action: "経費を申請", at: "2026-05-15T19:01:00+09:00", detail: null },
    ],
    memo: "勘定科目候補が未設定（不備）。",
    created_at: "2026-05-15T19:01:00+09:00",
    updated_at: "2026-05-15T19:01:00+09:00",
  }),
  mk({
    id: "EXP-1055",
    subject: "備品（USBハブ）",
    applicant_id: "u2",
    department: "営業部",
    claim_date: "2026-05-16",
    status: "draft",
    pay_state: "unpaid",
    lines: [
      { used_on: "2026-05-16", payee: "家電量販店", amount: 2_980, tax_category: T10, account_hint: "7500 消耗品費", note: null },
    ],
    receipts: [],
    approvals: [],
    comments: [],
    history: [
      { id: "EH-10", actor: U.u2, action: "下書きを作成", at: "2026-05-16T17:00:00+09:00", detail: null },
    ],
    memo: "領収書未添付（下書き）。",
    created_at: "2026-05-16T17:00:00+09:00",
    updated_at: "2026-05-16T17:00:00+09:00",
  }),
  mk({
    id: "EXP-1060",
    subject: "接待交際費（取引先会食）",
    applicant_id: "u5",
    department: "管理部",
    claim_date: "2026-05-14",
    status: "pending_approval",
    pay_state: "unpaid",
    lines: [
      { used_on: "2026-05-13", payee: "和食処 さくら", amount: 48_400, tax_category: T10, account_hint: "7900 雑費", note: "取引先2名" },
    ],
    receipts: [
      { id: "ER-6", file_name: "領収書_dinner.pdf", mime_type: "application/pdf", size_bytes: 130_500, uploaded_at: "2026-05-14T21:00:00+09:00", uploaded_by: "鈴木 経営" },
    ],
    approvals: [
      { id: "EA-8", order: 1, approver: U.u1, role: "経理", status: "pending", acted_at: null, comment: null },
    ],
    comments: [],
    history: [
      { id: "EH-11", actor: U.u5, action: "経費を申請", at: "2026-05-14T21:01:00+09:00", detail: null },
    ],
    memo: "高額のため経理確認。",
    created_at: "2026-05-14T21:01:00+09:00",
    updated_at: "2026-05-14T21:01:00+09:00",
  }),
  mk({
    id: "EXP-1066",
    subject: "駐車場代",
    applicant_id: "u4",
    department: "開発部",
    claim_date: "2026-05-11",
    status: "rejected",
    pay_state: "unpaid",
    lines: [
      { used_on: "2026-05-03", payee: "私的利用の疑い", amount: 1_500, tax_category: T10, account_hint: "7400 旅費交通費", note: null },
    ],
    receipts: [
      { id: "ER-7", file_name: "領収書_parking.jpg", mime_type: "image/jpeg", size_bytes: 90_400, uploaded_at: "2026-05-11T10:00:00+09:00", uploaded_by: "佐藤 次郎" },
    ],
    approvals: [
      { id: "EA-9", order: 1, approver: U.u3, role: "部門長", status: "rejected", acted_at: "2026-05-11T11:00:00+09:00", comment: "業務外利用のため却下。" },
    ],
    comments: [
      { id: "EC-3", author: U.u3, body: "業務との関連が確認できません。", created_at: "2026-05-11T11:01:00+09:00" },
    ],
    history: [
      { id: "EH-12", actor: U.u4, action: "経費を申請", at: "2026-05-11T09:30:00+09:00", detail: null },
      { id: "EH-13", actor: U.u3, action: "却下", at: "2026-05-11T11:00:00+09:00", detail: null },
    ],
    memo: null,
    created_at: "2026-05-11T09:30:00+09:00",
    updated_at: "2026-05-11T11:00:00+09:00",
  }),
  mk({
    id: "EXP-1070",
    subject: "消耗品（文具）",
    applicant_id: "u1",
    department: "管理部",
    claim_date: "2026-05-17",
    status: "scheduled",
    pay_state: "scheduled",
    lines: [
      { used_on: "2026-05-16", payee: "文具店", amount: 4_620, tax_category: T10, account_hint: "7500 消耗品費", note: null },
    ],
    receipts: [
      { id: "ER-8", file_name: "領収書_stationery.pdf", mime_type: "application/pdf", size_bytes: 40_100, uploaded_at: "2026-05-17T10:00:00+09:00", uploaded_by: "経理 太郎" },
    ],
    approvals: [
      { id: "EA-10", order: 1, approver: U.u3, role: "部門長", status: "approved", acted_at: "2026-05-17T13:00:00+09:00", comment: null },
    ],
    comments: [],
    history: [
      { id: "EH-14", actor: U.u1, action: "経費を申請", at: "2026-05-17T10:01:00+09:00", detail: null },
      { id: "EH-15", actor: U.u1, action: "精算予定に登録", at: "2026-05-17T13:30:00+09:00", detail: "5/25 振込予定" },
    ],
    memo: null,
    created_at: "2026-05-17T10:01:00+09:00",
    updated_at: "2026-05-17T13:30:00+09:00",
  }),
];

export function findClaim(id: string): ExpenseClaim | undefined {
  return EXPENSE_CLAIMS.find((c) => c.id === id);
}

export function filterClaims(
  list: ExpenseClaim[],
  f: ExpenseFilter,
): ExpenseClaim[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((c) => {
    if (f.status !== "all" && c.status !== f.status) return false;
    if (f.department !== "all" && c.department !== f.department) return false;
    if (q) {
      const hay = `${c.id} ${c.subject} ${c.applicant.name}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
