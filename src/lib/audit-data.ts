/**
 * 監査ログ ダミーデータ（DB未接続）。型は src/lib/types/audit.ts。
 */
import type { AuditFilter, AuditLog } from "@/lib/types/audit";
import { USERS } from "@/lib/transactions-data";

const U = Object.fromEntries(USERS.map((u) => [u.id, u]));

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AL-1001", at: "2026-05-19T10:42:00+09:00", user: U.u1, action: "create", target: "請求書 INV-2042", changes: [], ip: "203.0.113.10", detail: "受託開発 請求を発行" },
  { id: "AL-1002", at: "2026-05-19T09:58:00+09:00", user: U.u2, action: "create", target: "経費申請 EXP-1042", changes: [], ip: "203.0.113.22", detail: null },
  { id: "AL-1003", at: "2026-05-18T17:21:00+09:00", user: U.u1, action: "reconcile", target: "入出金 BT-1001", changes: [{ field: "recon_status", before: "未消込", after: "消込済み" }], ip: "203.0.113.10", detail: "INV-1955 と消込" },
  { id: "AL-1004", at: "2026-05-18T16:05:00+09:00", user: U.u3, action: "approve", target: "経費申請 EXP-1031", changes: [{ field: "status", before: "承認待ち", after: "承認済み" }], ip: "198.51.100.5", detail: "部門長承認" },
  { id: "AL-1005", at: "2026-05-18T15:30:00+09:00", user: U.u1, action: "update", target: "仕訳 JV-1199", changes: [{ field: "status", before: "下書き", after: "確定" }, { field: "memo", before: null, after: "月末計上" }], ip: "203.0.113.10", detail: null },
  { id: "AL-1006", at: "2026-05-18T11:00:00+09:00", user: U.u3, action: "reject", target: "経費申請 EXP-1039", changes: [{ field: "status", before: "承認待ち", after: "差戻し" }], ip: "198.51.100.5", detail: "領収書不備" },
  { id: "AL-1007", at: "2026-05-17T19:30:00+09:00", user: U.u2, action: "create", target: "証憑 DOC-1099", changes: [], ip: "203.0.113.22", detail: "種別不明・OCR待ち" },
  { id: "AL-1008", at: "2026-05-17T13:30:00+09:00", user: U.u1, action: "update", target: "経費申請 EXP-1070", changes: [{ field: "pay_state", before: "未精算", after: "精算予定" }], ip: "203.0.113.10", detail: "5/25 振込予定" },
  { id: "AL-1009", at: "2026-05-16T11:05:00+09:00", user: U.u1, action: "create", target: "仕訳 JV-1031", changes: [], ip: "203.0.113.10", detail: "口座間振替" },
  { id: "AL-1010", at: "2026-05-15T10:00:00+09:00", user: U.u1, action: "export", target: "レポート PL（2026-04）", changes: [], ip: "203.0.113.10", detail: "CSVエクスポート" },
  { id: "AL-1011", at: "2026-05-15T08:00:00+09:00", user: U.u1, action: "login", target: "アカウント", changes: [], ip: "203.0.113.10", detail: "2要素認証成功" },
  { id: "AL-1012", at: "2026-05-14T21:01:00+09:00", user: U.u5, action: "create", target: "経費申請 EXP-1060", changes: [], ip: "192.0.2.44", detail: "接待交際費" },
  { id: "AL-1013", at: "2026-05-12T16:00:00+09:00", user: U.u1, action: "reconcile", target: "売掛 INV-1955", changes: [{ field: "payment_state", before: "未入金", after: "消込済み" }], ip: "203.0.113.10", detail: "¥1,320,000 入金消込" },
  { id: "AL-1014", at: "2026-05-11T09:40:00+09:00", user: U.u2, action: "update", target: "仕訳 JV-1101", changes: [{ field: "status", before: "下書き", after: "修正済み" }], ip: "203.0.113.22", detail: "宛名修正後 再計上" },
  { id: "AL-1015", at: "2026-05-10T08:50:00+09:00", user: U.u3, action: "reject", target: "経費申請 EXP-1039", changes: [], ip: "198.51.100.5", detail: "差戻し" },
];

export function filterAudit(
  list: AuditLog[],
  f: AuditFilter,
): AuditLog[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((l) => {
    if (f.action !== "all" && l.action !== f.action) return false;
    if (
      q &&
      !`${l.target} ${l.user.name} ${l.detail ?? ""}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    return true;
  });
}
