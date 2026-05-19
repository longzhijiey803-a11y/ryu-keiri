"use client";

import * as React from "react";
import { Download, Plus, Upload } from "lucide-react";

import { Button, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import {
  JOURNAL_ENTRIES,
  accountName,
  filterJournal,
} from "@/lib/journal-data";
import { sumSide, JOURNAL_ENTRY_STATUS_LABEL } from "@/lib/types/journal";
import type {
  JournalDraft,
  JournalEntry,
  JournalEntryStatus,
  JournalFilter,
  JournalLine,
} from "@/lib/types/journal";
import { TRANSACTIONS, USERS } from "@/lib/transactions-data";
import { JournalFilterBar } from "./journal-filter-bar";
import { JournalTable } from "./journal-table";
import { JournalDetailDrawer } from "./journal-detail-drawer";
import { JournalCreateDrawer } from "./journal-create-drawer";

const DEFAULT_FILTER: JournalFilter = {
  query: "",
  status: "all",
  department: "all",
  project: "all",
};

export function JournalClient() {
  const { toast } = useToast();
  const [list, setList] = React.useState<JournalEntry[]>(JOURNAL_ENTRIES);
  const [filter, setFilter] = React.useState<JournalFilter>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = React.useMemo(
    () => filterJournal(list, filter),
    [list, filter],
  );
  const selected = React.useMemo(
    () => list.find((e) => e.id === selectedId) ?? null,
    [list, selectedId],
  );

  const openDetail = (e: JournalEntry) => {
    setSelectedId(e.id);
    setDetailOpen(true);
  };

  const handleStatusChange = (id: string, status: JournalEntryStatus) => {
    setList((prev) =>
      prev.map((e) =>
        e.id === id && e.status !== status
          ? { ...e, status, updated_at: new Date().toISOString() }
          : e,
      ),
    );
    toast({
      title: "仕訳ステータスを更新しました",
      description: `${id} → ${JOURNAL_ENTRY_STATUS_LABEL[status]}`,
      variant: "success",
    });
  };

  const handleCreate = (d: JournalDraft) => {
    const now = new Date().toISOString();
    let seq = 0;
    const lines: JournalLine[] = d.lines.map((l) => ({
      ...l,
      id: `JL-N${++seq}`,
      account_name: accountName(l.account_code),
    }));
    const rel = d.related_transaction_id
      ? TRANSACTIONS.find((t) => t.id === d.related_transaction_id)
      : null;
    const entry: JournalEntry = {
      id: `JV-${1207 + list.length + 1}`,
      entry_date: d.entry_date,
      description: d.description,
      status: "draft",
      lines,
      debit_total: sumSide(lines, "debit"),
      credit_total: sumSide(lines, "credit"),
      related_transaction_id: d.related_transaction_id,
      related_transaction_name: rel ? rel.name : null,
      attachments: d.attachment_names.map((name, i) => ({
        id: `JA-N${i + 1}`,
        file_name: name,
        mime_type: "application/octet-stream",
        size_bytes: 0,
        uploaded_at: now,
        uploaded_by: USERS[0].name,
      })),
      memo: d.memo,
      created_by: USERS[0],
      created_at: now,
      updated_at: now,
    };
    setList((prev) => [entry, ...prev]);
    setCreateOpen(false);
    toast({
      title: "仕訳を作成しました",
      description: `${entry.id} ・ ${entry.description}`,
      variant: "success",
    });
  };

  return (
    <>
      <PageHeader
        title="仕訳帳"
        description="取引を会計データとして記録し、勘定科目・税区分・部門・プロジェクト別に管理します。"
        actions={
          <>
            <Button variant="outline" disabled title="Step 後続で実装">
              <Upload /> インポート
            </Button>
            <Button variant="outline" disabled title="Step 後続で実装">
              <Download /> エクスポート
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus /> 新規仕訳
            </Button>
          </>
        }
      />

      <JournalFilterBar
        filter={filter}
        onChange={setFilter}
        resultCount={filtered.length}
        total={list.length}
      />

      <JournalTable
        data={filtered}
        onRowClick={openDetail}
        onStatusChange={handleStatusChange}
      />

      <JournalDetailDrawer
        entry={selected}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setSelectedId(null);
        }}
      />

      <JournalCreateDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </>
  );
}
