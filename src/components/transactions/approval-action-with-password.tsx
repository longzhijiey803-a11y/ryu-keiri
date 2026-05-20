"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  AlertCircle,
  Check,
  Lock,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";

import { Avatar, Badge, Button, Input } from "@/components/ui";
import { cn, formatISODateTime } from "@/lib/utils";
import type {
  ApprovalStep,
  ApprovalStepStatus,
} from "@/lib/types/transaction";

/** 承認アクション（行内ボタンとモーダルの両方で共通の語彙） */
export type ApprovalActionKind = "approve" | "return" | "reject";

const ACTION_META: Record<
  ApprovalActionKind,
  {
    label: string;
    icon: typeof Check;
    /** Button variant */
    variant: "primary" | "outline" | "destructive";
    /** モーダル見出し色 */
    tone: "success" | "warning" | "danger";
    /** 反映後の status */
    nextStatus: ApprovalStepStatus;
  }
> = {
  approve: {
    label: "承認",
    icon: Check,
    variant: "primary",
    tone: "success",
    nextStatus: "approved",
  },
  return: {
    label: "差戻し",
    icon: RotateCcw,
    // 警告色のアウトラインボタン
    variant: "outline",
    tone: "warning",
    nextStatus: "rejected",
  },
  reject: {
    label: "却下",
    icon: XCircle,
    variant: "destructive",
    tone: "danger",
    nextStatus: "rejected",
  },
};

/** モック用パスワード。将来は Supabase Auth/2FA に差し替え。 */
export const MOCK_APPROVAL_PASSWORD = "password123";

const BADGE_TONE: Record<
  ApprovalStepStatus,
  { v: "success" | "danger" | "warning" | "neutral"; t: string }
> = {
  approved: { v: "success", t: "承認済み" },
  rejected: { v: "danger", t: "差戻し" },
  pending: { v: "warning", t: "承認待ち" },
  skipped: { v: "neutral", t: "スキップ" },
};

/* ────────────────────────────────────────────
   本人確認モーダル（中央表示・Esc / 背景クリックで閉じる）
   ──────────────────────────────────────────── */
function PasswordConfirmModal({
  open,
  onOpenChange,
  action,
  step,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  action: ApprovalActionKind;
  step: ApprovalStep;
  /** 親に確定アクションを伝える。 */
  onConfirm: (input: { action: ApprovalActionKind; comment: string }) => void;
}) {
  const meta = ACTION_META[action];
  const ActionIcon = meta.icon;
  const [pw, setPw] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const pwRef = React.useRef<HTMLInputElement | null>(null);

  // 開閉のたびに入力をクリア
  React.useEffect(() => {
    if (open) {
      setPw("");
      setComment("");
      setError(null);
      // 自動フォーカス
      setTimeout(() => pwRef.current?.focus(), 0);
    }
  }, [open]);

  const submit = () => {
    if (pw !== MOCK_APPROVAL_PASSWORD) {
      setError("パスワードが正しくありません。");
      return;
    }
    onConfirm({ action, comment: comment.trim() });
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[1px]",
            "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[440px] -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-border bg-surface p-5 shadow-popover",
            "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
          )}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full",
                  meta.tone === "success" && "bg-success/10 text-success",
                  meta.tone === "warning" && "bg-warning/10 text-warning",
                  meta.tone === "danger" && "bg-danger/10 text-danger",
                )}
                aria-hidden
              >
                <ActionIcon className="size-4" />
              </span>
              <div>
                <DialogPrimitive.Title className="text-base font-semibold text-foreground">
                  {meta.label}の本人確認
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-0.5 text-xs text-muted-foreground">
                  {step.order}. {step.role}（{step.approver.name}）として処理します。
                </DialogPrimitive.Description>
              </div>
            </div>
            <DialogPrimitive.Close
              aria-label="閉じる"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="space-y-3"
          >
            <div>
              <label
                htmlFor="approval-password"
                className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-foreground"
              >
                <Lock className="size-3" />
                パスワード <span className="text-danger">*</span>
              </label>
              <Input
                id="approval-password"
                ref={pwRef}
                type="password"
                autoComplete="current-password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="本人確認のためパスワードを入力"
                invalid={!!error}
              />
              {error && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-danger">
                  <AlertCircle className="size-3" />
                  {error}
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground">
                デモ用パスワード：{" "}
                <code className="rounded bg-muted px-1 tabular">
                  {MOCK_APPROVAL_PASSWORD}
                </code>
              </p>
            </div>

            {action !== "approve" && (
              <div>
                <label
                  htmlFor="approval-comment"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  コメント
                  {action === "return" && (
                    <span className="ml-1 text-muted-foreground">
                      （差戻し理由を残すと申請者に伝わります）
                    </span>
                  )}
                </label>
                <textarea
                  id="approval-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="任意"
                  className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            )}

            <div className="mt-1 flex items-center justify-end gap-2">
              <DialogPrimitive.Close asChild>
                <Button variant="secondary" type="button">
                  キャンセル
                </Button>
              </DialogPrimitive.Close>
              <Button
                type="submit"
                variant={meta.variant}
                disabled={!pw}
              >
                <ActionIcon /> {meta.label}を確定
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ────────────────────────────────────────────
   承認ステップ行 + アクションボタン
   ──────────────────────────────────────────── */
export function ApprovalActionWithPassword({
  step,
  /** ログイン中ユーザーID。一致するときのみ操作可能 */
  currentUserId,
  /** 親に処理結果を流す（state 更新は親が担当） */
  onAction,
}: {
  step: ApprovalStep;
  currentUserId?: string;
  onAction: (
    stepId: string,
    action: ApprovalActionKind,
    comment: string,
  ) => void;
}) {
  const [openAction, setOpenAction] =
    React.useState<ApprovalActionKind | null>(null);
  const badge = BADGE_TONE[step.status];
  const isPending = step.status === "pending";
  const isOwner = currentUserId ? step.approver.id === currentUserId : true;
  const canAct = isPending && isOwner;

  return (
    <li className="rounded-md border border-border bg-surface p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={step.approver.name} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {step.order}. {step.role}
            </p>
            <p className="text-xs text-muted-foreground">
              {step.approver.name}
            </p>
          </div>
        </div>
        <Badge variant={badge.v}>{badge.t}</Badge>
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground">
        {step.acted_at ? formatISODateTime(step.acted_at) : "未対応"}
        {step.comment ? ` ・ ${step.comment}` : ""}
      </p>

      {canAct && (
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenAction("reject")}
            className="text-danger hover:text-danger"
          >
            <XCircle /> 却下
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenAction("return")}
            className="text-warning hover:text-warning"
          >
            <RotateCcw /> 差戻し
          </Button>
          <Button
            size="sm"
            onClick={() => setOpenAction("approve")}
          >
            <Check /> 承認
          </Button>
        </div>
      )}

      {!isPending && (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          このステップは{" "}
          <span className="font-medium text-foreground">
            {badge.t}
          </span>{" "}
          のため、追加操作はできません。
        </p>
      )}

      {isPending && !isOwner && (
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          自分の承認順ではないため操作できません（承認者：{step.approver.name}）。
        </p>
      )}

      {openAction && (
        <PasswordConfirmModal
          open={!!openAction}
          onOpenChange={(o) => !o && setOpenAction(null)}
          action={openAction}
          step={step}
          onConfirm={({ action, comment }) => {
            onAction(step.id, action, comment);
          }}
        />
      )}
    </li>
  );
}
