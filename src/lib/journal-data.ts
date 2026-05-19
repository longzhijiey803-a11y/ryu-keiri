/**
 * 仕訳帳ダミーデータ（DB未接続）。型は src/lib/types/journal.ts。
 * 全仕訳は借方合計＝貸方合計（複式簿記の不変条件）。
 * 自動仕訳候補は摘要キーワードのルールベース（AI連携なし）。
 */
import type {
  Account,
  JournalEntry,
  JournalFilter,
  JournalLine,
  JournalSide,
  JournalSuggestion,
} from "@/lib/types/journal";
import { sumSide } from "@/lib/types/journal";
import { USERS } from "@/lib/transactions-data";

const U = Object.fromEntries(USERS.map((u) => [u.id, u]));

export { DEPARTMENTS, PROJECTS } from "@/lib/transactions-data";

/* ── 勘定科目マスタ ─────────────────────── */
export const ACCOUNTS: Account[] = [
  { code: "1100", name: "普通預金", category: "asset", sub_accounts: ["本店", "ネット銀行"] },
  { code: "1300", name: "売掛金", category: "asset", sub_accounts: ["得意先別"] },
  { code: "1360", name: "仮払消費税", category: "asset", sub_accounts: [] },
  { code: "1500", name: "工具器具備品", category: "asset", sub_accounts: [] },
  { code: "2100", name: "未払金", category: "liability", sub_accounts: ["取引先別"] },
  { code: "2150", name: "仮受消費税", category: "liability", sub_accounts: [] },
  { code: "2200", name: "預り金", category: "liability", sub_accounts: ["源泉所得税"] },
  { code: "3000", name: "資本金", category: "equity", sub_accounts: [] },
  { code: "4000", name: "売上高", category: "revenue", sub_accounts: ["製品売上", "保守売上"] },
  { code: "4100", name: "受取利息", category: "revenue", sub_accounts: [] },
  { code: "7000", name: "仕入高", category: "expense", sub_accounts: [] },
  { code: "7200", name: "地代家賃", category: "expense", sub_accounts: [] },
  { code: "7300", name: "通信費", category: "expense", sub_accounts: [] },
  { code: "7400", name: "旅費交通費", category: "expense", sub_accounts: [] },
  { code: "7500", name: "消耗品費", category: "expense", sub_accounts: [] },
  { code: "7600", name: "支払手数料", category: "expense", sub_accounts: [] },
  { code: "7900", name: "雑費", category: "expense", sub_accounts: [] },
];
export const ACCOUNT_BY_CODE = Object.fromEntries(
  ACCOUNTS.map((a) => [a.code, a]),
) as Record<string, Account>;
export function accountName(code: string): string {
  return ACCOUNT_BY_CODE[code]?.name ?? code;
}

type RawLine = Omit<JournalLine, "id" | "account_name"> & {
  account_name?: string;
};
type RawEntry = Omit<
  JournalEntry,
  "debit_total" | "credit_total" | "lines"
> & { lines: RawLine[] };

let lineSeq = 0;
function mk(e: RawEntry): JournalEntry {
  const lines: JournalLine[] = e.lines.map((l) => ({
    ...l,
    id: `JL-${++lineSeq}`,
    account_name: accountName(l.account_code),
  }));
  return {
    ...e,
    lines,
    debit_total: sumSide(lines, "debit"),
    credit_total: sumSide(lines, "credit"),
  };
}

const T10 = "taxable_10" as const;
const NT = "non_taxable" as const;

export const JOURNAL_ENTRIES: JournalEntry[] = [
  mk({
    id: "JV-1207",
    entry_date: "2026-05-12",
    description: "5月分 受託開発 請求（株式会社サンプル商事）",
    status: "review",
    related_transaction_id: "TX-1042",
    related_transaction_name: "5月分 受託開発 請求",
    attachments: [
      { id: "JA-1", file_name: "請求書_INV-2042.pdf", mime_type: "application/pdf", size_bytes: 184_320, uploaded_at: "2026-05-12T10:42:00+09:00", uploaded_by: "経理 太郎" },
    ],
    memo: "検収完了分。",
    created_by: U.u1,
    created_at: "2026-05-12T10:45:00+09:00",
    updated_at: "2026-05-13T09:30:00+09:00",
    lines: [
      { side: "debit", account_code: "1300", sub_account: "得意先別", amount: 2_860_000, tax_category: NT, tax_amount: 0, department: "営業部", project: "受託開発A" },
      { side: "credit", account_code: "4000", sub_account: "製品売上", amount: 2_600_000, tax_category: T10, tax_amount: 260_000, department: "営業部", project: "受託開発A" },
      { side: "credit", account_code: "2150", sub_account: null, amount: 260_000, tax_category: NT, tax_amount: 0, department: "営業部", project: "受託開発A" },
    ],
  }),
  mk({
    id: "JV-1199",
    entry_date: "2026-05-08",
    description: "オフィス賃料 5月",
    status: "confirmed",
    related_transaction_id: "TX-1037",
    related_transaction_name: "オフィス賃料 5月",
    attachments: [],
    memo: null,
    created_by: U.u1,
    created_at: "2026-05-08T13:10:00+09:00",
    updated_at: "2026-05-08T13:10:00+09:00",
    lines: [
      { side: "debit", account_code: "7200", sub_account: null, amount: 345_454, tax_category: T10, tax_amount: 34_546, department: "総務部", project: "コーポレート" },
      { side: "debit", account_code: "1360", sub_account: null, amount: 34_546, tax_category: NT, tax_amount: 0, department: "総務部", project: "コーポレート" },
      { side: "credit", account_code: "2100", sub_account: "取引先別", amount: 380_000, tax_category: NT, tax_amount: 0, department: "総務部", project: "コーポレート" },
    ],
  }),
  mk({
    id: "JV-1180",
    entry_date: "2026-05-01",
    description: "保守契約 売上計上（株式会社オオゾラ）",
    status: "confirmed",
    related_transaction_id: "TX-1028",
    related_transaction_name: "保守契約 入金",
    attachments: [
      { id: "JA-2", file_name: "請求書_INV-1987.pdf", mime_type: "application/pdf", size_bytes: 151_200, uploaded_at: "2026-05-01T10:00:00+09:00", uploaded_by: "経理 太郎" },
    ],
    memo: "毎月計上。",
    created_by: U.u1,
    created_at: "2026-05-01T11:00:00+09:00",
    updated_at: "2026-05-01T11:00:00+09:00",
    lines: [
      { side: "debit", account_code: "1300", sub_account: "得意先別", amount: 540_000, tax_category: NT, tax_amount: 0, department: "営業部", project: "自社プロダクト" },
      { side: "credit", account_code: "4000", sub_account: "保守売上", amount: 490_909, tax_category: T10, tax_amount: 49_091, department: "営業部", project: "自社プロダクト" },
      { side: "credit", account_code: "2150", sub_account: null, amount: 49_091, tax_category: NT, tax_amount: 0, department: "営業部", project: "自社プロダクト" },
    ],
  }),
  mk({
    id: "JV-1150",
    entry_date: "2026-04-25",
    description: "受託開発B 入金消込（合同会社ミドリ）",
    status: "confirmed",
    related_transaction_id: "TX-1024",
    related_transaction_name: "受託開発B 検収請求",
    attachments: [],
    memo: "5/12 入金確認。",
    created_by: U.u1,
    created_at: "2026-05-12T16:00:00+09:00",
    updated_at: "2026-05-12T16:00:00+09:00",
    lines: [
      { side: "debit", account_code: "1100", sub_account: "本店", amount: 1_320_000, tax_category: NT, tax_amount: 0, department: "開発部", project: "受託開発A" },
      { side: "credit", account_code: "1300", sub_account: "得意先別", amount: 1_320_000, tax_category: NT, tax_amount: 0, department: "開発部", project: "受託開発A" },
    ],
  }),
  mk({
    id: "JV-1142",
    entry_date: "2026-05-11",
    description: "クラウド利用料 5月（仕入）",
    status: "draft",
    related_transaction_id: "TX-1041",
    related_transaction_name: "サーバー費用 5月",
    attachments: [
      { id: "JA-3", file_name: "請求書_cloud_202605.pdf", mime_type: "application/pdf", size_bytes: 73_400, uploaded_at: "2026-05-11T14:20:00+09:00", uploaded_by: "経理 太郎" },
    ],
    memo: "OCR取込・要確認。",
    created_by: U.u1,
    created_at: "2026-05-11T14:25:00+09:00",
    updated_at: "2026-05-11T14:25:00+09:00",
    lines: [
      { side: "debit", account_code: "7300", sub_account: null, amount: 120_000, tax_category: T10, tax_amount: 12_000, department: "開発部", project: "自社プロダクト" },
      { side: "debit", account_code: "1360", sub_account: null, amount: 12_000, tax_category: NT, tax_amount: 0, department: "開発部", project: "自社プロダクト" },
      { side: "credit", account_code: "2100", sub_account: "取引先別", amount: 132_000, tax_category: NT, tax_amount: 0, department: "開発部", project: "自社プロダクト" },
    ],
  }),
  mk({
    id: "JV-1120",
    entry_date: "2026-04-20",
    description: "通信費 4月 支払",
    status: "confirmed",
    related_transaction_id: "TX-1008",
    related_transaction_name: "通信費 4月",
    attachments: [],
    memo: null,
    created_by: U.u4,
    created_at: "2026-04-21T09:30:00+09:00",
    updated_at: "2026-04-21T09:30:00+09:00",
    lines: [
      { side: "debit", account_code: "7300", sub_account: null, amount: 21_500, tax_category: T10, tax_amount: 2_150, department: "総務部", project: "コーポレート" },
      { side: "debit", account_code: "1360", sub_account: null, amount: 2_150, tax_category: NT, tax_amount: 0, department: "総務部", project: "コーポレート" },
      { side: "credit", account_code: "1100", sub_account: "本店", amount: 23_650, tax_category: NT, tax_amount: 0, department: "総務部", project: "コーポレート" },
    ],
  }),
  mk({
    id: "JV-1101",
    entry_date: "2026-05-09",
    description: "出張旅費精算 4月（修正再計上）",
    status: "revised",
    related_transaction_id: "TX-1039",
    related_transaction_name: "出張旅費精算 4月",
    attachments: [
      { id: "JA-4", file_name: "領収書_taxi_v2.jpg", mime_type: "image/jpeg", size_bytes: 402_100, uploaded_at: "2026-05-11T09:00:00+09:00", uploaded_by: "田中 花子" },
    ],
    memo: "宛名修正後に再計上。",
    created_by: U.u2,
    created_at: "2026-05-11T09:05:00+09:00",
    updated_at: "2026-05-11T09:40:00+09:00",
    lines: [
      { side: "debit", account_code: "7400", sub_account: null, amount: 7_854, tax_category: T10, tax_amount: 786, department: "営業部", project: "受託開発A" },
      { side: "debit", account_code: "1360", sub_account: null, amount: 786, tax_category: NT, tax_amount: 0, department: "営業部", project: "受託開発A" },
      { side: "credit", account_code: "1100", sub_account: "本店", amount: 8_640, tax_category: NT, tax_amount: 0, department: "営業部", project: "受託開発A" },
    ],
  }),
  mk({
    id: "JV-1098",
    entry_date: "2026-05-07",
    description: "モニター購入（消耗品）",
    status: "review",
    related_transaction_id: "TX-1021",
    related_transaction_name: "備品購入（モニター）",
    attachments: [],
    memo: null,
    created_by: U.u4,
    created_at: "2026-05-07T12:00:00+09:00",
    updated_at: "2026-05-07T12:00:00+09:00",
    lines: [
      { side: "debit", account_code: "7500", sub_account: null, amount: 58_909, tax_category: T10, tax_amount: 5_891, department: "開発部", project: "自社プロダクト" },
      { side: "debit", account_code: "1360", sub_account: null, amount: 5_891, tax_category: NT, tax_amount: 0, department: "開発部", project: "自社プロダクト" },
      { side: "credit", account_code: "2100", sub_account: "取引先別", amount: 64_800, tax_category: NT, tax_amount: 0, department: "開発部", project: "自社プロダクト" },
    ],
  }),
  mk({
    id: "JV-1085",
    entry_date: "2026-05-06",
    description: "顧問コンサル費 5月",
    status: "draft",
    related_transaction_id: "TX-1018",
    related_transaction_name: "コンサル費 5月",
    attachments: [],
    memo: null,
    created_by: U.u1,
    created_at: "2026-05-06T09:10:00+09:00",
    updated_at: "2026-05-06T09:10:00+09:00",
    lines: [
      { side: "debit", account_code: "7600", sub_account: null, amount: 200_000, tax_category: T10, tax_amount: 20_000, department: "管理部", project: "コーポレート" },
      { side: "debit", account_code: "1360", sub_account: null, amount: 20_000, tax_category: NT, tax_amount: 0, department: "管理部", project: "コーポレート" },
      { side: "credit", account_code: "2100", sub_account: "取引先別", amount: 220_000, tax_category: NT, tax_amount: 0, department: "管理部", project: "コーポレート" },
    ],
  }),
  mk({
    id: "JV-1070",
    entry_date: "2026-05-04",
    description: "原材料 仕入（北和工業）",
    status: "review",
    related_transaction_id: "TX-1001",
    related_transaction_name: "仕入（原材料）5月",
    attachments: [
      { id: "JA-5", file_name: "請求書_kitawa_genzai.pdf", mime_type: "application/pdf", size_bytes: 102_400, uploaded_at: "2026-05-04T16:00:00+09:00", uploaded_by: "佐藤 次郎" },
    ],
    memo: null,
    created_by: U.u4,
    created_at: "2026-05-04T16:05:00+09:00",
    updated_at: "2026-05-04T16:05:00+09:00",
    lines: [
      { side: "debit", account_code: "7000", sub_account: null, amount: 648_000, tax_category: T10, tax_amount: 64_800, department: "開発部", project: "受託開発A" },
      { side: "debit", account_code: "1360", sub_account: null, amount: 64_800, tax_category: NT, tax_amount: 0, department: "開発部", project: "受託開発A" },
      { side: "credit", account_code: "2100", sub_account: "取引先別", amount: 712_800, tax_category: NT, tax_amount: 0, department: "開発部", project: "受託開発A" },
    ],
  }),
  mk({
    id: "JV-1052",
    entry_date: "2026-04-30",
    description: "誤計上の取消（通信費 重複）",
    status: "voided",
    related_transaction_id: null,
    related_transaction_name: null,
    attachments: [],
    memo: "重複入力のため取消。",
    created_by: U.u1,
    created_at: "2026-04-30T17:00:00+09:00",
    updated_at: "2026-05-01T09:00:00+09:00",
    lines: [
      { side: "debit", account_code: "7300", sub_account: null, amount: 9_800, tax_category: T10, tax_amount: 980, department: "総務部", project: "コーポレート" },
      { side: "credit", account_code: "1100", sub_account: "本店", amount: 9_800, tax_category: NT, tax_amount: 0, department: "総務部", project: "コーポレート" },
    ],
  }),
  mk({
    id: "JV-1031",
    entry_date: "2026-05-16",
    description: "普通預金 → 定期 振替",
    status: "draft",
    related_transaction_id: "TX-1004",
    related_transaction_name: "普通預金→定期 振替",
    attachments: [],
    memo: "資金移動。",
    created_by: U.u1,
    created_at: "2026-05-16T11:05:00+09:00",
    updated_at: "2026-05-16T11:05:00+09:00",
    lines: [
      { side: "debit", account_code: "1100", sub_account: "ネット銀行", amount: 1_000_000, tax_category: NT, tax_amount: 0, department: "管理部", project: "コーポレート" },
      { side: "credit", account_code: "1100", sub_account: "本店", amount: 1_000_000, tax_category: NT, tax_amount: 0, department: "管理部", project: "コーポレート" },
    ],
  }),
];

/* ── ヘルパ ─────────────────────────────── */
export function lineSummary(
  lines: JournalLine[],
  side: JournalSide,
): { label: string; extra: number } {
  const f = lines.filter((l) => l.side === side);
  if (f.length === 0) return { label: "—", extra: 0 };
  return { label: f[0].account_name, extra: f.length - 1 };
}

export function primaryValue<K extends keyof JournalLine>(
  lines: JournalLine[],
  key: K,
): string {
  const vals = Array.from(
    new Set(lines.map((l) => l[key]).filter(Boolean) as string[]),
  );
  if (vals.length === 0) return "—";
  return vals.length === 1 ? vals[0] : `複数（${vals.length}）`;
}

export function filterJournal(
  list: JournalEntry[],
  f: JournalFilter,
): JournalEntry[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((e) => {
    if (f.status !== "all" && e.status !== f.status) return false;
    if (
      f.department !== "all" &&
      !e.lines.some((l) => l.department === f.department)
    )
      return false;
    if (
      f.project !== "all" &&
      !e.lines.some((l) => l.project === f.project)
    )
      return false;
    if (q) {
      const hay =
        `${e.id} ${e.description} ${e.lines.map((l) => l.account_name).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/* ── 自動仕訳候補（ルールベース・AI連携なし） ── */
const RULES: {
  kw: RegExp;
  side: JournalSide;
  code: string;
  conf: number;
  why: string;
}[] = [
  { kw: /家賃|賃料|オフィス/, side: "debit", code: "7200", conf: 92, why: "摘要に「家賃/賃料」を含む。過去の同種仕訳と一致。" },
  { kw: /通信|サーバー|クラウド|回線/, side: "debit", code: "7300", conf: 88, why: "摘要に「通信/サーバー」を含む。" },
  { kw: /旅費|交通|タクシー|出張|宿泊/, side: "debit", code: "7400", conf: 90, why: "摘要に「旅費/交通」を含む。" },
  { kw: /仕入|原材料|材料/, side: "debit", code: "7000", conf: 87, why: "摘要に「仕入/原材料」を含む。" },
  { kw: /売上|請求|受託|保守/, side: "credit", code: "4000", conf: 85, why: "摘要に「売上/請求」を含む。収益計上と推定。" },
  { kw: /備品|モニター|PC|消耗/, side: "debit", code: "7500", conf: 80, why: "摘要に「備品/消耗」を含む。" },
  { kw: /手数料|コンサル|顧問/, side: "debit", code: "7600", conf: 83, why: "摘要に「手数料/顧問」を含む。" },
];

export function suggestJournal(description: string): JournalSuggestion[] {
  const d = description ?? "";
  const hits = RULES.filter((r) => r.kw.test(d)).slice(0, 3);
  const list = hits.length
    ? hits
    : [
        {
          kw: /./,
          side: "debit" as JournalSide,
          code: "7900",
          conf: 52,
          why: "明確なキーワードが見つかりません。要確認。",
        },
      ];
  return list.map((r, i) => ({
    id: `SUG-${i + 1}`,
    side: r.side,
    account_code: r.code,
    account_name: accountName(r.code),
    tax_category: r.code === "1300" ? "non_taxable" : "taxable_10",
    confidence: r.conf,
    rationale: r.why,
  }));
}
