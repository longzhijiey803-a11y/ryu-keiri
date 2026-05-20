"use client";

import * as React from "react";
import { MessageSquare, Send } from "lucide-react";

import { Avatar, Button, EmptyState } from "@/components/ui";
import { cn, formatISODateTime } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/current-user";
import type { TransactionComment } from "@/lib/types/transaction";

export interface TransactionCommentsProps {
  comments: TransactionComment[];
  /** 新規コメントを投稿する。親が state を更新する想定。 */
  onAdd: (body: string) => void;
  /** 投稿者として表示する現在ユーザー（既定は CURRENT_USER） */
  currentUserName?: string;
  /** 直近 N 秒以内のコメントを「新着」としてハイライト */
  freshWindowSec?: number;
}

/**
 * 取引詳細ドロワーの「コメント」タブ。
 * - 最新を上に並べる
 * - 新着（直近 60 秒）は淡い primary 背景でハイライト
 * - 入力欄は複数行。Shift+Enter で送信、Enter で改行
 */
export function TransactionComments({
  comments,
  onAdd,
  currentUserName = CURRENT_USER.name,
  freshWindowSec = 60,
}: TransactionCommentsProps) {
  const [draft, setDraft] = React.useState("");
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  // SSR/CSR で時刻がズレてハイドレーション不一致を起こさないよう、マウント後のみ「新着」判定する
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    setNow(Date.now());
  }, []);

  const sorted = React.useMemo(
    () =>
      [...comments].sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
      ),
    [comments],
  );

  const submit = () => {
    const body = draft.trim();
    if (!body) return;
    onAdd(body);
    setDraft("");
    // フォーカスを保ち連続投稿しやすく
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
      {/* 一覧 */}
      {sorted.length === 0 ? (
        <EmptyState icon={MessageSquare} title="コメントはありません" compact />
      ) : (
        <ul className="space-y-2">
          {sorted.map((c) => {
            const fresh =
              now != null &&
              (now - new Date(c.created_at).getTime()) / 1000 <=
                freshWindowSec;
            return (
              <li
                key={c.id}
                className={cn(
                  "flex gap-3 rounded-md border border-transparent px-2 py-2 transition-colors",
                  fresh && "border-primary/30 bg-primary/[0.04]",
                )}
              >
                <Avatar name={c.author.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">
                      {c.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground tabular">
                      {formatISODateTime(c.created_at)}
                    </span>
                    {fresh && (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        新着
                      </span>
                    )}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
                    {c.body}
                  </p>
                </div>
              </li>
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
