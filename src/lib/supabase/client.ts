/**
 * Supabase クライアント（土台）。
 *
 * 現状アプリは全てダミーデータで動作しており、このクライアントは未使用。
 * 実データ接続時に各 *-data.ts のダミーを Supabase クエリへ置き換える。
 *
 * 必要な環境変数（.env.local / Vercel）:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 * サーバー専用処理では SUPABASE_SERVICE_ROLE_KEY を別途利用（クライアントへ露出しない）。
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * ブラウザ用シングルトン。env 未設定なら null を返す（ダミー運用時に安全）。
 * 取得側は `const sb = getSupabaseClient(); if (!sb) { …ダミー… }` を想定。
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  if (!browserClient) {
    browserClient = createClient<Database>(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return browserClient;
}

export const isSupabaseConfigured = (): boolean =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
