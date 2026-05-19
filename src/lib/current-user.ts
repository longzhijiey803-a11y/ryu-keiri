/**
 * 現在ログイン中ユーザー（認証未実装のため固定）。
 * 「自分の承認待ち」「自分の申請」の判定に使用。Supabase Auth 接続時に差し替える。
 */
import { USERS } from "@/lib/transactions-data";

export const CURRENT_USER = USERS[0]; // 経理 太郎 (u1)
export const CURRENT_USER_ID = CURRENT_USER.id;
