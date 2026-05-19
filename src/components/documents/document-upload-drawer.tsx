"use client";

import * as React from "react";
import { FileText, ScanLine, UploadCloud, X } from "lucide-react";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABEL,
  type DocumentType,
} from "@/lib/types/document";

export interface UploadPayload {
  file_name: string;
  mime_type: string;
  doc_type: DocumentType;
  partner_name: string;
  amount: string;
  transaction_date: string;
  registration_number: string;
  memo: string;
}

const EMPTY: UploadPayload = {
  file_name: "",
  mime_type: "",
  doc_type: "invoice",
  partner_name: "",
  amount: "",
  transaction_date: "",
  registration_number: "",
  memo: "",
};

export function DocumentUploadDrawer({
  open,
  onOpenChange,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUpload: (p: UploadPayload) => void;
}) {
  const [p, setP] = React.useState<UploadPayload>(EMPTY);
  const [dragging, setDragging] = React.useState(false);
  const set = (patch: Partial<UploadPayload>) =>
    setP((prev) => ({ ...prev, ...patch }));

  const close = () => {
    setP(EMPTY);
    setDragging(false);
    onOpenChange(false);
  };

  const pick = (f: File | undefined) => {
    if (!f) return;
    set({ file_name: f.name, mime_type: f.type || "application/octet-stream" });
  };

  return (
    <Drawer open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerTitle>証憑をアップロード</DrawerTitle>
          <DrawerDescription>
            PDF / 画像に対応（予定）。電帳法の検索要件に必要な項目を登録します。
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody className="space-y-5">
          {/* ドラッグ&ドロップ / ファイル選択 */}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files?.[0]);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors",
              dragging
                ? "border-primary bg-primary/[0.04]"
                : "border-border bg-background hover:border-primary/40",
            )}
          >
            <UploadCloud className="size-7 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              ここにドラッグ＆ドロップ
            </p>
            <p className="text-xs text-muted-foreground">
              または クリックしてファイルを選択（PDF / JPG / PNG）
            </p>
            <input
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </label>

          {p.file_name && (
            <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {p.file_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.mime_type}
                </p>
              </div>
              <button
                type="button"
                aria-label="取り消し"
                onClick={() => set({ file_name: "", mime_type: "" })}
                className="text-muted-foreground hover:text-danger"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* OCR プレースホルダー */}
          <div className="rounded-md border border-primary/30 bg-primary/[0.04] p-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ScanLine className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  OCR 自動読み取り（今後連携）
                </p>
                <p className="text-xs text-muted-foreground">
                  アップロード後、取引先・金額・日付・登録番号を自動抽出予定。現在は手入力してください。
                </p>
              </div>
            </div>
          </div>

          {/* 電帳法メタデータ */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>種別</Label>
              <Select
                value={p.doc_type}
                onValueChange={(v) => set({ doc_type: v as DocumentType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {DOCUMENT_TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>取引先</Label>
              <Input
                placeholder="株式会社○○"
                value={p.partner_name}
                onChange={(e) => set({ partner_name: e.target.value })}
              />
            </div>
            <div>
              <Label>金額（税込）</Label>
              <Input
                inputMode="numeric"
                className="tabular text-right"
                placeholder="0"
                value={p.amount}
                onChange={(e) => set({ amount: e.target.value })}
              />
            </div>
            <div>
              <Label>取引日</Label>
              <Input
                type="date"
                value={p.transaction_date}
                onChange={(e) => set({ transaction_date: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>インボイス登録番号</Label>
              <Input
                placeholder="T + 13桁（例：T1234567890123）"
                className="tabular"
                value={p.registration_number}
                onChange={(e) =>
                  set({ registration_number: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Label>メモ</Label>
              <textarea
                rows={2}
                value={p.memo}
                onChange={(e) => set({ memo: e.target.value })}
                placeholder="補足"
                className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="secondary" onClick={close}>
            キャンセル
          </Button>
          <Button
            disabled={!p.file_name}
            onClick={() => {
              onUpload(p);
              setP(EMPTY);
            }}
          >
            証憑を登録
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
