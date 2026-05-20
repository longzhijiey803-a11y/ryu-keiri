"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, Pencil, Trash2, X } from "lucide-react";

import { Avatar, Button } from "@/components/ui";
import { cn, formatISODateTime } from "@/lib/utils";
import type { TransactionComment } from "@/lib/types/transaction";

/**
 * 取引コメント 1 件分の行表示＋編集／削除アクション。
 * - hover で初めて見える控えめなアイコンボタン（pencil / trash）
 * - 編集: その場でテキストエリアに切替、保存 / キャンセル
 * - 削除: モーダル（DialogPrimitive）で確認後に親へ通知
 * - 投稿者本人（canEdit=true）にのみアイコンを表示
 *
 * 将来 Supabase 連携時は onSave / onDelete を非同期化するだけで OK。
 */
export interface TransactionRowActionsProps {
  comment: TransactionComment;
  /** 表示中ユーザーが操作可能か（通常は投稿者本人） */
  canEdit: boolean;
  /** 新着ハイライト（直近 N 秒以内に作成された） */
  fresh?: boolean;
  /** 編集確定時 */
  onSave: (id: string, newBody: string) => void;
  /** 削除確定時 */
  onDelete: (id: string) => void;
}

export function TransactionRowActions({
  comment,
  canEdit,
  fresh,
  onSave,
  onDelete,
}: TransactionRowActionsProps) {
  const [editing, setEditing] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handleSave = (body: string) => {
    const trimmed = body.trim();
    if (trimmed && trimmed !== comment.body) {
      onSave(comment.id, trimmed);
    }
    setEditing(false);
  };

  return (
    <li
      className={cn(
        "group flex gap-3 rounded-md border border-transparent px-2 py-2 transition-colors",
        fresh && "border-primary/30 bg-primary/[0.04]",
        canEdit && !editing && "hover:bg-muted/40",
      )}
    >
      <Avatar name={comment.author.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="flex flex-1 flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-foreground">
              {comment.author.name}
            </span>
            <span className="tabular text-xs text-muted-foreground">
              {formatISODateTime(comment.created_at)}
            </span>
            {fresh && (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                新着
              </span>
            )}
          </p>
          {!editing && canEdit && (
            <ActionIcons
              onEdit={() => setEditing(true)}
              onDelete={() => setConfirmOpen(true)}
            />
          )}
        </div>

        {editing ? (
          <CommentEditor
            initialBody={comment.body}
            onCancel={() => setEditing(false)}
            onSave={handleSave}
          />
        ) : (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
            {comment.body}
          </p>
        )}
      </div>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          onDelete(comment.id);
          setConfirmOpen(false);
        }}
        previewBody={comment.body}
      />
    </li>
  );
}

/* ── ホバー時に右上に出る編集 / 削除アイコン ─────────────────────── */
function ActionIcons({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
      <IconButton title="編集" onClick={onEdit}>
        <Pencil className="size-3.5" />
      </IconButton>
      <IconButton title="削除" onClick={onDelete} tone="danger">
        <Trash2 className="size-3.5" />
      </IconButton>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  title,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  tone?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        tone === "danger" && "hover:bg-danger/10 hover:text-danger",
      )}
    >
      {children}
    </button>
  );
}

/* ── インライン編集用テキストエリア ──────────────────────────────── */
function CommentEditor({
  initialBody,
  onSave,
  onCancel,
}: {
  initialBody: string;
  onSave: (body: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = React.useState(initialBody);
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    taRef.current?.focus();
    const len = taRef.current?.value.length ?? 0;
    taRef.current?.setSelectionRange(len, len);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      onSave(draft);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const dirty = draft.trim() && draft.trim() !== initialBody;

  return (
    <div className="mt-1 flex flex-col gap-2">
      <textarea
        ref={taRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        rows={3}
        className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          Shift+Enter で保存 / Esc でキャンセル
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X /> キャンセル
          </Button>
          <Button size="sm" onClick={() => onSave(draft)} disabled={!dirty}>
            <Check /> 保存
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── 削除確認モーダル ─────────────────────────────────────────────── */
function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  previewBody,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
  previewBody: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[min(420px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-5 shadow-card focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="text-base font-semibold text-foreground">
            コメントを削除しますか？
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-1 text-xs text-muted-foreground">
            この操作は取り消せません。
          </DialogPrimitive.Description>
          <div className="mt-3 max-h-32 overflow-y-auto rounded-md border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
            <p className="whitespace-pre-wrap break-words">{previewBody}</p>
          </div>
          <div className="mt-5 flex items-center justify-end gap-2">
            <DialogPrimitive.Close asChild>
              <Button size="sm" variant="ghost">
                キャンセル
              </Button>
            </DialogPrimitive.Close>
            <Button size="sm" variant="destructive" onClick={onConfirm}>
              <Trash2 /> 削除する
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
