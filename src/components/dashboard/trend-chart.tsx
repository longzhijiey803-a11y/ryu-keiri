import { trend } from "@/lib/dashboard-data";
import { formatJPY } from "@/lib/utils";

/**
 * 売上・経費の月次推移（軽量SVGグループ棒）。
 * チャートライブラリ非依存・控えめな配色（過剰に派手にしない）。
 */
const W = 720;
const H = 260;
const ML = 56;
const MR = 16;
const MT = 16;
const MB = 30;
const PX0 = ML;
const PX1 = W - MR;
const PW = PX1 - PX0;
const PY0 = MT;
const PY1 = H - MB;
const PH = PY1 - PY0;

const CHART_MAX = 3_600_000;
const GRID = [0, 1_200_000, 2_400_000, 3_600_000];

const slot = PW / trend.length;
const BAR_W = 24;
const BAR_GAP = 10;
const groupW = BAR_W * 2 + BAR_GAP;
const groupOffset = (slot - groupW) / 2;

const yOf = (v: number) => PY1 - (v / CHART_MAX) * PH;
const man = (v: number) => `${(v / 10000).toLocaleString("ja-JP")}万`;

export function TrendChart() {
  return (
    <div className="px-5 py-5">
      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary" />
          売上
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-muted-foreground/30" />
          経費
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-64 w-full"
        role="img"
        aria-label="売上と経費の月次推移グラフ"
        preserveAspectRatio="none"
      >
        {/* グリッド＋Y軸ラベル */}
        {GRID.map((g) => {
          const y = yOf(g);
          return (
            <g key={g}>
              <line
                x1={PX0}
                x2={PX1}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth={1}
              />
              <text
                x={PX0 - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                className="fill-muted-foreground"
              >
                {man(g)}
              </text>
            </g>
          );
        })}

        {/* 棒 */}
        {trend.map((d, i) => {
          const gx = PX0 + i * slot + groupOffset;
          const sx = gx;
          const ex = gx + BAR_W + BAR_GAP;
          const sH = (d.sales / CHART_MAX) * PH;
          const eH = (d.expenses / CHART_MAX) * PH;
          return (
            <g key={d.month}>
              <rect
                x={sx}
                y={yOf(d.sales)}
                width={BAR_W}
                height={sH}
                rx={3}
                className="fill-primary"
              >
                <title>{`${d.month} 売上 ${formatJPY(d.sales)}`}</title>
              </rect>
              <rect
                x={ex}
                y={yOf(d.expenses)}
                width={BAR_W}
                height={eH}
                rx={3}
                className="fill-muted-foreground/30"
              >
                <title>{`${d.month} 経費 ${formatJPY(d.expenses)}`}</title>
              </rect>
              <text
                x={gx + groupW / 2}
                y={PY1 + 20}
                textAnchor="middle"
                fontSize={12}
                className="fill-muted-foreground"
              >
                {d.month}
              </text>
            </g>
          );
        })}

        {/* ベースライン */}
        <line
          x1={PX0}
          x2={PX1}
          y1={PY1}
          y2={PY1}
          className="stroke-border"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
