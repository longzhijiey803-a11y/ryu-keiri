import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

/** Tailwind クラスを安全に結合（shadcn 互換の cn ユーティリティ） */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 金額表示（円・3桁区切り）。テーブルでは右寄せ＋ .tabular と併用する。
 * Intl の通貨記号は環境（Node/ブラウザの ICU）で全角￥/半角¥が割れ SSR
 * ハイドレーション不一致を起こすため、記号と桁区切りを決定的に自前で生成する。
 */
export function formatJPY(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}¥${digits}`;
}

/** ISO日付("YYYY-MM-DD")の差（b - a, 日数）。UTC固定で tz 非依存・決定的。 */
export function daysBetweenISO(a: string, b: string): number {
  const p = (s: string) => {
    const [y, m, d] = s.slice(0, 10).split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((p(b) - p(a)) / 86_400_000);
}

/**
 * ISO 日付/日時を tz 非依存・決定的に整形（SSR ハイドレーション不一致を回避）。
 * 例: "2026-05-12" → "2026/05/12" / "2026-05-12T10:42:00+09:00" → "2026/05/12 10:42"
 */
export function formatISODate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, "/");
}
export function formatISODateTime(iso: string): string {
  const d = iso.slice(0, 10).replace(/-/g, "/");
  const t = iso.slice(11, 16);
  return t ? `${d} ${t}` : d;
}

/** 日付表示（既定: yyyy/MM/dd）。date-fns + 日本ロケール。 */
export function formatDate(
  date: Date | string | number,
  pattern = "yyyy/MM/dd",
): string {
  const d = typeof date === "object" ? date : new Date(date);
  return format(d, pattern, { locale: ja });
}
