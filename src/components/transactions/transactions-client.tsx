"use client";

import * as React from "react";
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
import type {
  JournalStatus,
  Transaction,
  TransactionDraft,
  TransactionFilter,
  TransactionStatus,
} from "@/lib/types/transaction";
import {
  JOURNAL_STATUS_LABEL,
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
  const { toast } = useToast();
  const [list, setList] = React.useState<Transaction[]>(TRANSACTIONS);
  const [filter, setFilter] = React.useState<TransactionFilter>(
    DEFAULT_FILTER,
  );
  const [view, setView] = React.useState<View>("table");
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

  const openDetail = (t: Transaction) => {
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
        <TransactionKanban data={filtered} onCardClick={openDetail} />
      )}

      <TransactionDetailDrawer
        txn={selected}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setSelectedId(null);
        }}
      />

      <TransactionCreateDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </>
  );
}
