/**
 * 認証セッションの最小実装（モック）。
 * - 本物のバックエンド接続前のスタブ。Cookie の有無のみでガードする。
 * - 値は固定 "1"。署名・暗号化はしない（HttpOnly でもない）。
 */
export const AUTH_COOKIE = "rk-auth";

const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

export function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=1; path=/; SameSite=Lax; max-age=${MAX_AGE_SECONDS}`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; SameSite=Lax; max-age=0`;
}
