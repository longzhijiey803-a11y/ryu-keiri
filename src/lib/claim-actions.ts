/**
 * 経費申請への承認アクション適用（DB未接続・クライアント状態の純粋変換）。
 * 経費精算画面と承認画面の双方から利用する。
 */
import type { ExpenseClaim } from "@/lib/types/expense";
import type { ApprovalActionKind } from "@/lib/types/workflow";
import { CURRENT_USER } from "@/lib/current-user";

function nowISO() {
  return new Date().toISOString();
}

export function applyApprovalAction(
  claims: ExpenseClaim[],
  id: string,
  kind: ApprovalActionKind,
  comment: string,
): ExpenseClaim[] {
  const at = nowISO();
  const actor = CURRENT_USER;
  return claims.map((c) => {
    if (c.id !== id) return c;
    const approvals = c.approvals.map((s) => ({ ...s }));
    const idx = approvals.findIndex((s) => s.status === "pending");

    let status = c.status;
    let action = "";
    if (kind === "approve") {
      if (idx >= 0) {
        approvals[idx].status = "approved";
        approvals[idx].acted_at = at;
        approvals[idx].comment = comment || null;
      }
      const remaining = approvals.some((s) => s.status === "pending");
      status = remaining ? "pending_approval" : "approved";
      action = remaining ? "承認（次の承認へ）" : "最終承認";
    } else if (kind === "return") {
      if (idx >= 0) {
        approvals[idx].status = "rejected";
        approvals[idx].acted_at = at;
        approvals[idx].comment = comment || "差戻し";
      }
      status = "returned";
      action = "差戻し";
    } else {
      if (idx >= 0) {
        approvals[idx].status = "rejected";
        approvals[idx].acted_at = at;
        approvals[idx].comment = comment || "却下";
      }
      status = "rejected";
      action = "却下";
    }

    return {
      ...c,
      status,
      approvals,
      comments: comment
        ? [
            ...c.comments,
            {
              id: `CM-${at}`,
              author: actor,
              body: comment,
              created_at: at,
            },
          ]
        : c.comments,
      history: [
        ...c.history,
        { id: `H-${at}`, actor, action, at, detail: comment || null },
      ],
      updated_at: at,
    };
  });
}

export function addClaimComment(
  claims: ExpenseClaim[],
  id: string,
  body: string,
): ExpenseClaim[] {
  const at = nowISO();
  return claims.map((c) =>
    c.id === id
      ? {
          ...c,
          comments: [
            ...c.comments,
            { id: `CM-${at}`, author: CURRENT_USER, body, created_at: at },
          ],
          updated_at: at,
        }
      : c,
  );
}
