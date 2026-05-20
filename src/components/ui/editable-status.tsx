"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface StatusOption<T extends string> {
  value: T;
  /** メニュー／トリガに表示するバッジ要素 */
  render: React.ReactNode;
}

/**
 * 一覧テーブル内で使う「クリックで変更できるステータスバッジ」。
 * 行クリック（詳細ドロワー）には伝播しない。全画面で共通利用する。
 */
export function EditableStatus<T extends string>({
  current,
  options,
  onChange,
  title = "変更",
}: {
  current: T;
  options: StatusOption<T>[];
  onChange: (value: T) => void;
  title?: string;
}) {
  const currentNode =
    options.find((o) => o.value === current)?.render ?? current;
  return (
    <div
      className="inline-flex"
      role="presentation"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title={title}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {currentNode}
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((o) => (
            <DropdownMenuItem
              key={o.value}
              onSelect={() => onChange(o.value)}
              className={o.value === current ? "bg-muted" : ""}
            >
              {o.render}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
