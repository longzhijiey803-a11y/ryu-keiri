"use client";

import * as React from "react";
import { MessageSquare, Send } from "lucide-react";

import { Avatar, Button, EmptyState } from "@/components/ui";
import { CURRENT_USER, CURRENT_USER_ID } from "@/lib/current-user";
import type { TransactionComment } from "@/lib/types/transaction";
import { TransactionRowActions } from "./transaction-row-actions";

export interface TransactionCommentsProps {
  comments: TransactionComment[];
  /** 新規コメントを投稿する。 */
  onAdd: (body: string) => void;
  /** 既存コメントを編集する。 */
  onEdit?: (id: string, body: string) => void;
  /** 既存コメントを削除する。 */
  onDelete?: (id: string) => void;
  /** 投稿者として表示する現在ユーザー（既定は CURRENT_USER） */
  currentUserName?: string;
  /** 操作権限を持つユーザー ID（既定は CURRENT_USER_ID） */
  currentUserId?: string;
  /** 直近 N 秒以内のコメントを「新着」としてハイライト */
  freshWindowSec?: number;
}

/**
 * 取引詳細ドロワーの「コメント」タブ。
 * - 最新を上に並べる
 * - 新着（直近 60 秒）は淡い primary 背景でハイライト
 * - 入力欄は複数行。Shift+Enter で送信、Enter で改行
 * - 自分の投稿のみホバーで編集 / 削除アイコンが出現
 * - 多数件でも一覧はスクロール可能（max-h）
 */
export function TransactionComments({
  comments,
  onAdd,
  onEdit,
  onDelete,
  currentUserName = CURRENT_USER.name,
  currentUserId = CURRENT_USER_ID,
  freshWindowSec = 60,
}: TransactionCommentsProps) {
  const [draft, setDraft] = React.useState("");
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  // SSR/CSR で時刻がズレてハイドレーション不一致を起こさないよう、マウント後のみ「新着」判定
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    setNow(Date.now());
  }, []);

  const sorted = React.useMemo(
    () => [...comments].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [comments],
  );

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    onAdd(body);
    setDraft("");
    taRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter で送信、Enter は改行
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 一覧（スクロール可能） */}
      {sorted.length === 0 ? (
        <EmptyState icon={MessageSquare} title="コメントはありません" compact />
      ) : (
        <ul className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
          {sorted.map((c) => {
            const fresh =
              now != null &&
              (now - new Date(c.created_at).getTime()) / 1000 <=
                freshWindowSec;
            const canEdit =
              c.author.id === currentUserId && (!!onEdit || !!onDelete);
            return (
              <TransactionRowActions
                key={c.id}
                comment={c}
                canEdit={canEdit}
                fresh={fresh}
                onSave={(id, body) => onEdit?.(id, body)}
                onDelete={(id) => onDelete?.(id)}
              />
            );
          })}
        </ul>
      )}

      {/* 新規入力 */}
      <div className="border-t border-border pt-4">
        <div className="flex items-start gap-3">
          <Avatar name={currentUserName} size="sm" />
          <div className="min-w-0 flex-1">
            <textarea
              ref={taRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={3}
              placeholder="コメントを追加…（Shift+Enter で送信）"
              className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {currentUserName} として投稿
              </p>
              <Button
                size="sm"
                onClick={submit}
                disabled={!draft.trim()}
                aria-label="コメントを送信"
              >
                <Send /> 送信
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
