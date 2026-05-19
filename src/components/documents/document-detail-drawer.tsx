"use client";

import * as React from "react";
import {
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Link2,
  ScanLine,
} from "lucide-react";

import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui";
import { cn, formatISODate, formatISODateTime, formatJPY } from "@/lib/utils";
import { isUnlinked, type Document } from "@/lib/types/document";
import { DocumentStatusBadge, DocumentTypeBadge } from "./document-badges";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-border py-2.5 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function OcrRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="flex-1 truncate text-right text-sm text-foreground">
        {value ?? "—"}
      </span>
      <Button variant="outline" size="sm" disabled title="OCR連携後に有効化">
        採用
      </Button>
    </div>
  );
}

export function DocumentDetailDrawer({
  doc,
  open,
  onOpenChange,
}: {
  doc: Document | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  if (!doc) return null;
  const isImg = doc.mime_type.startsWith("image/");
  const unlinked = isUnlinked(doc);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DrawerTitle className="max-w-[420px] truncate">
              {doc.file_name}
            </DrawerTitle>
            <DocumentTypeBadge type={doc.doc_type} />
            <DocumentStatusBadge status={doc.status} />
          </div>
          <DrawerDescription>
            <span className="tabular">{doc.id}</span> ・{" "}
            {Math.round(doc.size_bytes / 1000)} KB ・ {doc.mime_type}
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-6">
          {unlinked && (
            <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/[0.06] px-3 py-2.5 text-sm text-danger">
              <AlertTriangle className="size-4 shrink-0" />
              未紐づけ：この証憑は取引・仕訳に紐づいていません。早期の紐づけを推奨します。
            </div>
          )}

          {/* ファイルプレビュー領域 */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              プレビュー
            </h3>
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
              {isImg ? (
                <ImageIcon className="size-10" />
              ) : (
                <FileText className="size-10" />
              )}
              <p className="text-sm">
                {isImg ? "画像" : "PDF"} プレビューは今後対応
              </p>
              <p className="tabular text-xs">{doc.storage_path}</p>
            </div>
          </section>

          {/* OCR 結果の確認UI */}
          <section>
            <div className="mb-2 flex items-center gap-2">
              <ScanLine className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                OCR 読み取り結果
              </h3>
              {doc.ocr.status === "done" && doc.ocr.confidence != null && (
                <Badge variant="info">信頼度 {doc.ocr.confidence}%</Badge>
              )}
              {doc.ocr.status === "pending" && (
                <Badge variant="warning">解析中</Badge>
              )}
              {doc.ocr.status === "none" && (
                <Badge variant="neutral">未実施</Badge>
              )}
            </div>
            {doc.ocr.status === "done" ? (
              <div className="rounded-md border border-border p-3">
                <OcrRow label="取引先" value={doc.ocr.partner_name} />
                <OcrRow
                  label="金額"
                  value={
                    doc.ocr.total != null ? formatJPY(doc.ocr.total) : null
                  }
                />
                <OcrRow
                  label="消費税"
                  value={doc.ocr.tax != null ? formatJPY(doc.ocr.tax) : null}
                />
                <OcrRow
                  label="発行日"
                  value={
                    doc.ocr.issue_date
                      ? formatISODate(doc.ocr.issue_date)
                      : null
                  }
                />
                <OcrRow
                  label="登録番号"
                  value={doc.ocr.registration_number}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  ※ OCR連携は今後実装。現在は読み取り想定値の確認UIです。
                </p>
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-6 text-center text-sm text-muted-foreground">
                {doc.ocr.status === "pending"
                  ? "OCR解析待ち（今後連携）"
                  : "この証憑はOCR未実施です"}
              </p>
            )}
          </section>

          {/* メタデータ（電帳法 検索項目） */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              メタデータ
            </h3>
            <dl>
              <Row label="種別">
                <DocumentTypeBadge type={doc.doc_type} />
              </Row>
              <Row label="取引先">{doc.partner_name ?? "—"}</Row>
              <Row label="金額">
                {doc.amount != null ? (
                  <span className="tabular font-medium">
                    {formatJPY(doc.amount)}
                  </span>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="取引日">
                <span className="tabular">
                  {doc.transaction_date
                    ? formatISODate(doc.transaction_date)
                    : "—"}
                </span>
              </Row>
              <Row label="登録番号">
                <span className="tabular">
                  {doc.registration_number ?? "—"}
                </span>
              </Row>
              <Row label="アップロード">
                <span className="tabular">
                  {formatISODateTime(doc.uploaded_at)}
                </span>
              </Row>
              <Row label="登録者">{doc.uploaded_by.name}</Row>
              <Row label="メモ">{doc.memo ?? "—"}</Row>
            </dl>
          </section>

          {/* 関連付け */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              関連付け
            </h3>
            <div
              className={cn(
                "space-y-2 rounded-md border p-3",
                unlinked
                  ? "border-danger/30 bg-danger/[0.04]"
                  : "border-border",
              )}
            >
              <p className="flex items-center gap-2 text-sm text-foreground">
                <Link2 className="size-4 text-muted-foreground" />
                関連取引：
                <span className="tabular font-medium">
                  {doc.related_transaction_id ?? "未紐づけ"}
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm text-foreground">
                <Link2 className="size-4 text-muted-foreground" />
                関連仕訳：
                <span className="tabular font-medium">
                  {doc.related_journal_id ?? "未紐づけ"}
                </span>
              </p>
              {unlinked && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  title="Step 後続で実装"
                >
                  取引／仕訳に紐づける
                </Button>
              )}
            </div>
          </section>
        </DrawerBody>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">閉じる</Button>
          </DrawerClose>
          <Button disabled title="Step 後続で実装">
            編集
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
