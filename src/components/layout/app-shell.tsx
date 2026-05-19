"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

const STORAGE_KEY = "rk.sidebar.collapsed";

/**
 * 経理SaaS 全画面共通の骨格（ログイン後レイアウト）。
 * 左固定ダークサイドバー + 上部グローバルバー + メインコンテンツ。
 * 折りたたみ状態はレイアウト持続（App Router の layout は遷移で再マウントされない）＋ localStorage。
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggle = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        メインコンテンツへスキップ
      </a>
      <Sidebar collapsed={collapsed} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-200",
          collapsed ? "ml-sidebar-collapsed" : "ml-sidebar",
        )}
      >
        <TopBar collapsed={collapsed} onToggleSidebar={toggle} />
        <main
          id="main-content"
          className="flex-1 px-page py-8"
          tabIndex={-1}
        >
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
