"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Plus, Table2 } from "lucide-react";

import { Button, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import {
  PARTNERS,
  TRANSACTIONS,
  USERS,
  filterTransactions,
} from "@/lib/transactions-data";
import { CURRENT_USER } from "@/lib/current-user";
import type {
  JournalStatus,
  Transaction,
  TransactionDraft,
  TransactionFilter,
  TransactionStatus,
} from "@/lib/types/transaction";
import {
  JOURNAL_STATUS_LABEL,
  TRANSACTION_KIND_DIRECTION,
  TRANSACTION_STATUS_LABEL,
} from "@/lib/types/transaction";
import { TransactionFilterBar } from "./transaction-filter-bar";
import { TransactionTable } from "./transaction-table";
import { TransactionKanban } from "./transaction-kanban";
import { TransactionDetailDrawer } from "./transaction-detail-drawer";
import { TransactionCreateDrawer } from "./transaction-create-drawer";

type View = "table" | "kanban";

const DEFAULT_FILTER: TransactionFilter = {
  query: "",
  kind: "all",
  status: "all",
  assignee_id: "all",
};

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  const Item = ({
    v,
    icon: Icon,
    label,
  }: {
    v: View;
    icon: typeof Table2;
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      aria-pressed={view === v}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
        view === v
          ? "bg-surface text-foreground shadow-card"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
  return (
    <div className="inline-flex items-center rounded-md border border-border bg-muted p-1">
      <Item v="table" icon={Table2} label="テーブル" />
      <Item v="kanban" icon={LayoutGrid} label="カンバン" />
    </div>
  );
}

export function TransactionsClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [list, setList] = React.useState<Transaction[]>(TRANSACTIONS);
  const [filter, setFilter] = React.useState<TransactionFilter>(
    DEFAULT_FILTER,
  );
  const [view, setView] = React.useState<View>("kanban");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = React.useMemo(
    () => filterTransactions(list, filter),
    [list, filter],
  );
  const selected = React.useMemo(
    () => list.find((t) => t.id === selectedId) ?? null,
    [list, selectedId],
  );

  /**
   * 行クリック時の遷移ルール。
   * - 承認待ち（approval）→ /approvals
   * - 入金待ち / 支払予定（消込対象）→ /reconciliation
   * - それ以外（下書き / 確認待ち / 完了 / 差戻し）→ 詳細ドロワーを開く（既存挙動）
   */
  const openDetail = (t: Transaction) => {
    if (t.status === "approval") {
      router.push(`/approvals?txn=${t.id}`);
      return;
    }
    if (t.status === "awaiting_deposit" || t.status === "scheduled_payment") {
      router.push(`/reconciliation?txn=${t.id}`);
      return;
    }
    setSelectedId(t.id);
    setDetailOpen(true);
  };

  const nowISO = () => new Date().toISOString();

  const handleStatusChange = (id: string, status: TransactionStatus) => {
    let changed = false;
    setList((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.status === status) return t;
        changed = true;
        return { ...t, status, updated_at: nowISO() };
      }),
    );
    if (changed)
      toast({
        title: "ステータスを更新しました",
        description: `${id} → ${TRANSACTION_STATUS_LABEL[status]}`,
        variant: "success",
      });
  };

  const handleJournalStatusChange = (id: string, js: JournalStatus) => {
    let changed = false;
    setList((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.journal_status === js) return t;
        changed = true;
        return { ...t, journal_status: js, updated_at: nowISO() };
      }),
    );
    if (changed)
      toast({
        title: "仕訳状態を更新しました",
        description: `${id} → ${JOURNAL_STATUS_LABEL[js]}`,
        variant: "success",
      });
  };

  /**
   * 承認アクション。pending→approved/rejected に更新し、history に記録。
   * 「return（差戻し）」は API 上は rejected と同じステータス値だが、history と取引ステータスで区別する。
   */
  const handleApprovalAction = (
    txnId: string,
    stepId: string,
    action: "approve" | "return" | "reject",
    comment: string,
  ) => {
    const now = new Date().toISOString();
    const actionLabel =
      action === "approve"
        ? "承認"
        : action === "return"
          ? "差戻し"
          : "却下";
    setList((prev) =>
      prev.map((t) => {
        if (t.id !== txnId) return t;
        const approvals = t.approvals.map((s) =>
          s.id === stepId
            ? {
                ...s,
                status:
                  action === "approve"
                    ? ("approved" as const)
                    : ("rejected" as const),
                acted_at: now,
                comment: comment || s.comment,
              }
            : s,
        );
        // 全員承認した時は取引方向に応じて次ステージへ進める：
        //   outflow（仕入/経費/支払/給与/税金/固定資産）→ 支払予定
        //   inflow（売上/入金）→ 入金待ち
        //   neutral（借入/振替/赤黒）→ 完了
        const allApproved = approvals.every(
          (s) => s.status === "approved" || s.status === "skipped",
        );
        const dir = TRANSACTION_KIND_DIRECTION[t.kind];
        const nextStatus: TransactionStatus =
          action === "reject"
            ? "rejected"
            : action === "return"
              ? "review"
              : allApproved
                ? dir === "outflow"
                  ? "scheduled_payment"
                  : dir === "inflow"
                    ? "awaiting_deposit"
                    : "done"
                : t.status;
        return {
          ...t,
          approvals,
          status: nextStatus,
          history: [
            ...t.history,
            {
              id: `H-${txnId}-${Date.now()}`,
              actor: CURRENT_USER,
              action: actionLabel,
              at: now,
              detail: comment || null,
            },
          ],
          updated_at: now,
        };
      }),
    );
    toast({
      title: `${actionLabel}しました`,
      description: `${txnId} ・ ${stepId}`,
      variant:
        action === "approve"
          ? "success"
          : action === "return"
            ? "warning"
            : "error",
    });
  };

  /** 取引コメントの編集。投稿者本人のみ呼び出される（フロントで権限制御）。 */
  const handleEditComment = (
    txnId: string,
    commentId: string,
    body: string,
  ) => {
    const now = new Date().toISOString();
    setList((prev) =>
      prev.map((t) =>
        t.id !== txnId
          ? t
          : {
              ...t,
              comments: t.comments.map((c) =>
                c.id === commentId ? { ...c, body } : c,
              ),
              history: [
                ...t.history,
                {
                  id: `H-${txnId}-${Date.now()}`,
                  actor: CURRENT_USER,
                  action: "コメント編集",
                  at: now,
                  detail: body.slice(0, 60),
                },
              ],
              updated_at: now,
            },
      ),
    );
    toast({
      title: "コメントを更新しました",
      variant: "success",
    });
  };

  /** 取引コメントの削除（モーダル確認後に呼ばれる） */
  const handleDeleteComment = (txnId: string, commentId: string) => {
    const now = new Date().toISOString();
    setList((prev) =>
      prev.map((t) =>
        t.id !== txnId
          ? t
          : {
              ...t,
              comments: t.comments.filter((c) => c.id !== commentId),
              history: [
                ...t.history,
                {
                  id: `H-${txnId}-${Date.now()}`,
                  actor: CURRENT_USER,
                  action: "コメント削除",
                  at: now,
                  detail: null,
                },
              ],
              updated_at: now,
            },
      ),
    );
    toast({
      title: "コメントを削除しました",
      variant: "warning",
    });
  };

  /** 取引へのコメント追加（drawer から） */
  const handleAddComment = (id: string, body: string) => {
    const now = new Date().toISOString();
    setList((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: `TC-${id}-${Date.now()}`,
                  author: CURRENT_USER,
                  body,
                  created_at: now,
                },
              ],
              history: [
                ...t.history,
                {
                  id: `H-${id}-${Date.now()}`,
                  actor: CURRENT_USER,
                  action: "コメント追加",
                  at: now,
                  detail: body.slice(0, 60),
                },
              ],
              updated_at: now,
            }
          : t,
      ),
    );
  };

  const handleCreate = (d: TransactionDraft) => {
    const partner =
      PARTNERS.find((p) => p.id === d.partner_id) ?? PARTNERS[0];
    const assignee = USERS.find((u) => u.id === d.assignee_id) ?? USERS[0];
    const now = new Date().toISOString();
    const seq = list.length + 1;
    const newTxn: Transaction = {
      id: `TX-${1042 + seq}`,
      name: d.name,
      kind: d.kind,
      status: "draft",
      partner_id: partner.id,
      partner,
      amount: d.amount,
      tax_category: d.tax_category,
      transaction_date: d.transaction_date,
      due_date: d.due_date,
      assignee_id: assignee.id,
      assignee,
      department: d.department,
      project: d.project,
      memo: d.memo,
      attachments: [],
      journal: null,
      journal_status: "unposted",
      approvals: [],
      comments: [],
      history: [
        {
          id: `H-${now}`,
          actor: assignee,
          action: "下書きを作成",
          at: now,
          detail: null,
        },
      ],
      created_at: now,
      updated_at: now,
    };
    setList((prev) => [newTxn, ...prev]);
    setCreateOpen(false);
    toast({
      title: "取引を作成しました",
      description: `${newTxn.id} ・ ${newTxn.name}`,
      variant: "success",
    });
  };

  return (
    <>
      <PageHeader
        title="取引管理"
        description="売上・仕入・経費・支払・入金など、会社のお金に関わる取引を一元管理します。"
        actions={
          <>
            <ViewToggle view={view} onChange={setView} />
            <Button onClick={() => setCreateOpen(true)}>
              <Plus /> 新規取引
            </Button>
          </>
        }
      />

      <TransactionFilterBar
        filter={filter}
        onChange={setFilter}
        resultCount={filtered.length}
        total={list.length}
      />

      {view === "table" ? (
        <TransactionTable
          data={filtered}
          onRowClick={openDetail}
          onStatusChange={handleStatusChange}
          onJournalStatusChange={handleJournalStatusChange}
        />
      ) : (
        <TransactionKanban
          data={filtered}
          onCardClick={openDetail}
          onStatusChange={handleStatusChange}
        />
      )}

      <TransactionDetailDrawer
        txn={selected}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setSelectedId(null);
        }}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onApprovalAction={handleApprovalAction}
      />

      <TransactionCreateDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </>
  );
}
