"use client";

import * as React from "react";
import { AlertTriangle, UploadCloud } from "lucide-react";

import { Button, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { DOCUMENTS, filterDocuments } from "@/lib/document-data";
import {
  DOCUMENT_STATUS_LABEL,
  isUnlinked,
  type Document,
  type DocumentFilter,
  type DocumentStatus,
} from "@/lib/types/document";
import { USERS } from "@/lib/transactions-data";
import { DocumentFilterBar } from "./document-filter-bar";
import { DocumentTable } from "./document-table";
import { DocumentDetailDrawer } from "./document-detail-drawer";
import {
  DocumentUploadDrawer,
  type UploadPayload,
} from "./document-upload-drawer";

const DEFAULT_FILTER: DocumentFilter = {
  query: "",
  doc_type: "all",
  status: "all",
  date_from: "",
  date_to: "",
  amount_min: "",
  amount_max: "",
  unlinked_only: false,
};

export function DocumentsClient() {
  const { toast } = useToast();
  const [list, setList] = React.useState<Document[]>(DOCUMENTS);
  const [filter, setFilter] = React.useState<DocumentFilter>(DEFAULT_FILTER);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);

  const filtered = React.useMemo(
    () => filterDocuments(list, filter),
    [list, filter],
  );
  const selected = React.useMemo(
    () => list.find((d) => d.id === selectedId) ?? null,
    [list, selectedId],
  );
  const unlinkedCount = list.filter(isUnlinked).length;

  const handleStatusChange = (id: string, status: DocumentStatus) => {
    setList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d)),
    );
    toast({
      title: "証憑ステータスを更新しました",
      description: `${id} → ${DOCUMENT_STATUS_LABEL[status]}`,
      variant: "success",
    });
  };

  const handleUpload = (p: UploadPayload) => {
    const now = new Date().toISOString();
    const doc: Document = {
      id: `DOC-N${list.length + 1}`,
      file_name: p.file_name,
      mime_type: p.mime_type || "application/octet-stream",
      size_bytes: 0,
      storage_path: `documents/inbox/${p.file_name}`,
      doc_type: p.doc_type,
      status: "unlinked",
      partner_name: p.partner_name || null,
      amount: p.amount ? Number(p.amount) : null,
      transaction_date: p.transaction_date || null,
      registration_number: p.registration_number || null,
      uploaded_at: now,
      uploaded_by: USERS[0],
      related_transaction_id: null,
      related_journal_id: null,
      ocr: {
        status: "pending",
        partner_name: null,
        total: null,
        tax: null,
        issue_date: null,
        registration_number: null,
        confidence: null,
      },
      memo: p.memo || null,
    };
    setList((prev) => [doc, ...prev]);
    setUploadOpen(false);
    toast({
      title: "証憑を登録しました",
      description: `${doc.file_name}（未紐づけ）`,
      variant: "success",
    });
  };

  return (
    <>
      <PageHeader
        title="証憑管理"
        description="領収書・請求書・契約書・注文書・納品書などを電帳法を意識して保管・検索します。"
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <UploadCloud /> 証憑をアップロード
          </Button>
        }
      />

      {unlinkedCount > 0 && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/[0.06] px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-danger">
            <AlertTriangle className="size-4 shrink-0" />
            未紐づけの証憑が <span className="font-semibold">{unlinkedCount}</span>{" "}
            件あります。取引・仕訳への紐づけを推奨します。
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilter((f) => ({ ...f, unlinked_only: true }))
            }
          >
            未紐づけを表示
          </Button>
        </div>
      )}

      <DocumentFilterBar
        filter={filter}
        onChange={setFilter}
        resultCount={filtered.length}
        total={list.length}
      />

      <DocumentTable
        data={filtered}
        onRowClick={(d) => {
          setSelectedId(d.id);
          setDetailOpen(true);
        }}
        onStatusChange={handleStatusChange}
      />

      <DocumentDetailDrawer
        doc={selected}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setSelectedId(null);
        }}
      />

      <DocumentUploadDrawer
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />
    </>
  );
}
