/**
 * 固定資産台帳ダミーデータ（DB未接続）。型は src/lib/types/asset.ts。
 */
import type { AssetFilter, FixedAsset } from "@/lib/types/asset";

export const FIXED_ASSETS: FixedAsset[] = [
  {
    id: "FA-001",
    name: "ノートPC（開発用 ×10）",
    acquired_on: "2024-04-01",
    acquisition_cost: 2_200_000,
    useful_life_years: 4,
    method: "straight_line",
    current_year_depreciation: 550_000,
    accumulated_depreciation: 1_100_000,
    book_value: 1_100_000,
    department: "開発部",
    status: "depreciating",
  },
  {
    id: "FA-002",
    name: "複合機",
    acquired_on: "2023-09-15",
    acquisition_cost: 880_000,
    useful_life_years: 5,
    method: "straight_line",
    current_year_depreciation: 176_000,
    accumulated_depreciation: 440_000,
    book_value: 440_000,
    department: "管理部",
    status: "depreciating",
  },
  {
    id: "FA-003",
    name: "サーバーラック",
    acquired_on: "2022-06-01",
    acquisition_cost: 1_500_000,
    useful_life_years: 6,
    method: "declining_balance",
    current_year_depreciation: 210_000,
    accumulated_depreciation: 980_000,
    book_value: 520_000,
    department: "開発部",
    status: "depreciating",
  },
  {
    id: "FA-004",
    name: "オフィス家具一式",
    acquired_on: "2021-04-01",
    acquisition_cost: 1_200_000,
    useful_life_years: 8,
    method: "straight_line",
    current_year_depreciation: 150_000,
    accumulated_depreciation: 750_000,
    book_value: 450_000,
    department: "総務部",
    status: "in_use",
  },
  {
    id: "FA-005",
    name: "業務用エアコン",
    acquired_on: "2020-07-01",
    acquisition_cost: 960_000,
    useful_life_years: 6,
    method: "straight_line",
    current_year_depreciation: 0,
    accumulated_depreciation: 960_000,
    book_value: 1,
    department: "総務部",
    status: "fully_depreciated",
  },
  {
    id: "FA-006",
    name: "社用車（営業）",
    acquired_on: "2019-10-01",
    acquisition_cost: 2_800_000,
    useful_life_years: 6,
    method: "declining_balance",
    current_year_depreciation: 0,
    accumulated_depreciation: 2_799_999,
    book_value: 1,
    department: "営業部",
    status: "disposed",
  },
  {
    id: "FA-007",
    name: "ソフトウェア（基幹システム）",
    acquired_on: "2024-01-01",
    acquisition_cost: 3_600_000,
    useful_life_years: 5,
    method: "straight_line",
    current_year_depreciation: 720_000,
    accumulated_depreciation: 720_000,
    book_value: 2_880_000,
    department: "管理部",
    status: "depreciating",
  },
];

export function findAsset(id: string): FixedAsset | undefined {
  return FIXED_ASSETS.find((a) => a.id === id);
}

export function filterAssets(
  list: FixedAsset[],
  f: AssetFilter,
): FixedAsset[] {
  const q = f.query.trim().toLowerCase();
  return list.filter((a) => {
    if (f.status !== "all" && a.status !== f.status) return false;
    if (q && !`${a.id} ${a.name} ${a.department}`.toLowerCase().includes(q))
      return false;
    return true;
  });
}

/** 定額法の年次償却スケジュール（簡易・表示用） */
export function depreciationSchedule(
  a: FixedAsset,
): { year: number; depreciation: number; book_value: number }[] {
  const annual = Math.floor(a.acquisition_cost / a.useful_life_years);
  const rows: { year: number; depreciation: number; book_value: number }[] =
    [];
  let bv = a.acquisition_cost;
  const startYear = Number(a.acquired_on.slice(0, 4));
  for (let i = 0; i < a.useful_life_years; i++) {
    const dep = i === a.useful_life_years - 1 ? bv - 1 : annual;
    bv = Math.max(1, bv - dep);
    rows.push({ year: startYear + i, depreciation: dep, book_value: bv });
  }
  return rows;
}
