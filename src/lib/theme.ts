/**
 * ダーク/ライトテーマ切替。
 * - 値の正本: localStorage["rk-theme"] = "dark" | "light"
 * - 反映方法: html要素に "dark" クラスを付与/除去（tailwind の darkMode:"class" 連動）
 * - 初期化: layout に no-flash の inline script を埋め、ハイドレーション前に適用する。
 */

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "rk-theme";

/** SSR セーフ。クライアントでのみ DOM/localStorage を触る。 */
export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(THEME_STORAGE_KEY);
  return v === "dark" || v === "light" ? v : null;
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

export function getEffectiveTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * <head> 直下に挿入する no-flash スクリプト本体。
 * localStorage の値（または OS 設定）を読んで dark クラスを付与する。
 * SSR の HTML より先に同期実行されるため、初回描画でちらつかない。
 */
export const NO_FLASH_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`;
