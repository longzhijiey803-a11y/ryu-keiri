import {
  HandCoins,
  PiggyBank,
  Receipt,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui";

/**
 * 色組み合わせ 10 案。
 * 4 アクセント色（インディゴ / エメラルド / アンバー / ローズ）の代替パレットを並べて比較する。
 * 実テーマ（globals.css）には影響しない閲覧用ページ。
 */

interface Palette {
  id: string;
  name: string;
  sub: string;
  colors: [string, string, string, string]; // hex 4 つ
  labels: [string, string, string, string]; // 各色の呼称
}

const PALETTES: Palette[] = [
  {
    id: "01",
    name: "現行（Vivid）",
    sub: "indigo / emerald / amber / rose — いま使っているテーマ",
    colors: ["#6366F1", "#10B981", "#F59E0B", "#F43F5E"],
    labels: ["インディゴ", "エメラルド", "アンバー", "ローズ"],
  },
  {
    id: "02",
    name: "パステル",
    sub: "落ち着いた淡色。長時間でも目に優しい",
    colors: ["#A5B4FC", "#86EFAC", "#FCD34D", "#FCA5A5"],
    labels: ["ラベンダー", "ミント", "クリーム", "コーラル"],
  },
  {
    id: "03",
    name: "ジュエル",
    sub: "深く鮮やかな宝石色。プレミアム感",
    colors: ["#1E3A8A", "#047857", "#B45309", "#9F1239"],
    labels: ["サファイア", "エメラルド深", "トパーズ", "ルビー"],
  },
  {
    id: "04",
    name: "アース",
    sub: "土と森のトーン。実務的で温かい",
    colors: ["#0F766E", "#65A30D", "#CA8A04", "#B45309"],
    labels: ["ティール", "オリーブ", "ターメリック", "クレイ"],
  },
  {
    id: "05",
    name: "サンセット",
    sub: "夕焼けのグラデ。暖色強めで活発",
    colors: ["#7C3AED", "#F97316", "#FACC15", "#E11D48"],
    labels: ["バイオレット", "オレンジ", "サフラン", "クリムゾン"],
  },
  {
    id: "06",
    name: "オーシャン",
    sub: "海と空。寒色系で清潔・信頼感",
    colors: ["#1E40AF", "#0891B2", "#0EA5E9", "#22D3EE"],
    labels: ["ネイビー", "ティール", "スカイ", "シアン"],
  },
  {
    id: "07",
    name: "フォレスト",
    sub: "森の階層。緑系の濃淡で統一",
    colors: ["#14532D", "#65A30D", "#84CC16", "#A3A370"],
    labels: ["フォレスト", "リーフ", "ライム", "モス"],
  },
  {
    id: "08",
    name: "ベリー",
    sub: "果実の色。やや女性的・カジュアル",
    colors: ["#7C3AED", "#C026D3", "#DB2777", "#BE123C"],
    labels: ["バイオレット", "フューシャ", "ピンク", "クリムゾン"],
  },
  {
    id: "09",
    name: "ネオン",
    sub: "高彩度の電子色。テック・モダン",
    colors: ["#06B6D4", "#84CC16", "#EAB308", "#EC4899"],
    labels: ["サイアン", "ライム", "イエロー", "マゼンタ"],
  },
  {
    id: "10",
    name: "モノクローム＋差し色",
    sub: "グレースケール基調＋単色アクセント。コーポレート",
    colors: ["#1F2937", "#4B5563", "#9CA3AF", "#3B82F6"],
    labels: ["スレート濃", "スレート", "スレート淡", "ブルー差し色"],
  },
  // ── 11〜16 は落ち着き／低彩度／モノトーン寄りの追加案 ──
  {
    id: "11",
    name: "純モノクローム",
    sub: "完全グレースケール。彩色なし・印刷物のように静か",
    colors: ["#1F2937", "#4B5563", "#6B7280", "#9CA3AF"],
    labels: ["濃", "中濃", "中", "淡"],
  },
  {
    id: "12",
    name: "セージ＆ダスト",
    sub: "全アクセント低彩度。長時間でも疲れにくい",
    colors: ["#6B7E8E", "#8AA89F", "#C7A977", "#B58A8A"],
    labels: ["ダストブルー", "セージ", "サンド", "ダスティローズ"],
  },
  {
    id: "13",
    name: "ベージュ・コーポレート",
    sub: "紙のような暖色ニュートラル。和文書類との相性◎",
    colors: ["#3F3A36", "#7C7268", "#B9A688", "#D9C4A3"],
    labels: ["墨茶", "オーク", "サンド", "クリーム"],
  },
  {
    id: "14",
    name: "スレートブルー（くすみ）",
    sub: "青みグレー基調＋彩度を抑えた4色アクセント",
    colors: ["#475569", "#7D8FA3", "#A8B9A9", "#C8B58C"],
    labels: ["スレート", "ブルーグレー", "セージ薄", "オールド・ゴールド"],
  },
  {
    id: "15",
    name: "和紙・墨",
    sub: "墨／鼠／砂／淡朱。和帳票風で実務寄り",
    colors: ["#2B2A29", "#6F6A65", "#B7AB95", "#9C5B5B"],
    labels: ["墨", "鼠", "砂", "淡朱"],
  },
  {
    id: "16",
    name: "ノルディック・ライト",
    sub: "北欧ミニマル。彩度低めの寒色 + 暖色ワンポイント",
    colors: ["#3D4F5C", "#6E8294", "#B0BEC5", "#C49A6C"],
    labels: ["インクブルー", "ノルディック・ブルー", "アイス", "カラメル"],
  },
];

const KPI_DEFS: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "現預金残高", value: "¥8,420,000", icon: Wallet },
  { label: "今月売上", value: "¥3,250,000", icon: TrendingUp },
  { label: "今月経費", value: "¥1,480,000", icon: Receipt },
  { label: "利益概算", value: "¥1,770,000", icon: PiggyBank },
];

function PaletteCard({ p }: { p: Palette }) {
  return (
    <Card className="overflow-hidden">
      {/* ヘッダ：パレット名＋色チップ */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            案 {p.id}
          </p>
          <h2 className="mt-0.5 truncate text-md font-semibold text-foreground">
            {p.name}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {p.sub}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {p.colors.map((c) => (
            <span
              key={c}
              className="size-5 rounded-md ring-1 ring-black/5"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* KPI プレビュー（4 色ベタ塗り） */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {KPI_DEFS.map((k, i) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="rounded-lg p-3 text-white shadow-card"
              style={{ backgroundColor: p.colors[i] }}
            >
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/85">
                  {k.label}
                </p>
                <span className="flex size-6 items-center justify-center rounded bg-white/15">
                  <Icon className="size-3 text-white" />
                </span>
              </div>
              <p className="mt-1.5 tabular text-lg font-bold tracking-tight">
                {k.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* テーブルヘッダ・バッジ・サイドバー色帯のプレビュー */}
      <div className="space-y-2 px-3 pb-3">
        {/* テーブルヘッダ（グラデ） */}
        <div
          className="flex items-center justify-between rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white"
          style={{
            background: `linear-gradient(to right, ${p.colors[0]}, ${p.colors[3]})`,
          }}
        >
          <span>テーブルヘッダ</span>
          <span className="opacity-80">グラデ {p.colors[0]} → {p.colors[3]}</span>
        </div>

        {/* バッジサンプル（淡色塗り） */}
        <div className="flex flex-wrap gap-1.5">
          {p.colors.map((c, i) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                backgroundColor: hexWithAlpha(c, 0.15),
                color: c,
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: c }}
              />
              {p.labels[i]}
            </span>
          ))}
        </div>

        {/* サイドバーグループ帯プレビュー */}
        <div className="grid grid-cols-4 gap-1">
          {p.colors.map((c, i) => (
            <div
              key={c}
              className="rounded px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: hexWithAlpha(c, 0.85) }}
            >
              G{i + 1}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/** hex + α を rgba 文字列で返す。 */
function hexWithAlpha(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Page() {
  return (
    <>
      <PageHeader
        title="カラーパレット 16案"
        description="現テーマ（indigo / emerald / amber / rose）の代替。01–10 は通常案、11–16 は低彩度・モノトーン寄り。レイアウトは固定で色だけ差し替えた比較。"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {PALETTES.map((p) => (
          <PaletteCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
