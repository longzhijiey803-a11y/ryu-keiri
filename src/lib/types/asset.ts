/**
 * 固定資産 ドメイン型（DB未接続 / Supabase 移行前提）。
 * 想定テーブル: fixed_assets / depreciation_schedules。
 */
import type { ID, ISODate } from "@/lib/types/transaction";

export const DEPRECIATION_METHODS = [
  "straight_line",
  "declining_balance",
] as const;
export type DepreciationMethod = (typeof DEPRECIATION_METHODS)[number];
export const DEPRECIATION_METHOD_LABEL: Record<DepreciationMethod, string> = {
  straight_line: "定額法",
  declining_balance: "定率法",
};

export const ASSET_STATUSES = [
  "in_use",
  "depreciating",
  "fully_depreciated",
  "disposed",
] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];
export const ASSET_STATUS_LABEL: Record<AssetStatus, string> = {
  in_use: "使用中",
  depreciating: "償却中",
  fully_depreciated: "償却済",
  disposed: "除却",
};

export interface FixedAsset {
  id: ID;
  name: string; // 資産名
  acquired_on: ISODate; // 取得日
  acquisition_cost: number; // 取得価額
  useful_life_years: number; // 耐用年数
  method: DepreciationMethod; // 償却方法
  current_year_depreciation: number; // 当期償却額
  accumulated_depreciation: number; // 累計償却額
  book_value: number; // 帳簿価額
  department: string;
  status: AssetStatus;
}

export interface AssetFilter {
  query: string;
  status: AssetStatus | "all";
}
