import Link from "next/link";

const VARIANTS: { n: string; title: string; sub: string }[] = [
  { n: "01", title: "標準・コンパクト", sub: "KPI 4枚 + アラート / アクティビティ" },
  { n: "02", title: "ヒーロー＋小カード", sub: "巨大数値の主役 + 補助 3 枚" },
  { n: "03", title: "数値先行・罫線レス", sub: "特大数字とラベルだけ" },
  { n: "04", title: "高密度グリッド", sub: "KPI 6 枚 + 補助セクション 2×2" },
  { n: "05", title: "タイル・モザイク", sub: "大1 + 小4 のタイル" },
  { n: "06", title: "テーブル中心", sub: "上に KPI、下に要対応テーブル" },
  { n: "07", title: "2 カラム", sub: "左 KPI 縦並び / 右 アクティビティ" },
  { n: "08", title: "アイコン強調", sub: "丸アイコン + 数値の強調" },
  { n: "09", title: "進捗バー視覚化", sub: "売上・経費・利益・残高のバー" },
  { n: "10", title: "ミニマル・罫線最小", sub: "ラベル＋数値だけの最薄レイアウト" },
  { n: "11", title: "ダーク・ターミナル風", sub: "黒背景 + 緑/シアンのアクセント" },
  { n: "12", title: "縦タイムライン", sub: "今日の出来事を時系列で並べる" },
  { n: "13", title: "チャート中心", sub: "売上推移を主役にしたバーチャート" },
  { n: "14", title: "1 枚カード集約", sub: "全情報を 1 枚のロングカードに" },
  { n: "15", title: "スプレッドシート風", sub: "罫線つきの帳票・台帳ライク" },
  { n: "16", title: "カラフル・フル背景", sub: "KPI ごとに別色の塗りカード" },
  { n: "17", title: "Sparkline 付き KPI", sub: "数値の横に小さな推移ライン" },
  { n: "18", title: "ニュース紙面風", sub: "見出し＋リード文＋本文の編集スタイル" },
  { n: "19", title: "クイックアクション中心", sub: "KPI 小、ボタンとショートカット主役" },
  { n: "20", title: "和風・低彩度", sub: "墨/紺/朱の落ち着いた配色" },
];

export default function UiLabIndex() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        ダッシュボード 10 案
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        同じダミーデータを使って、見せ方だけを変えた10通りの比較用ページです。
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {VARIANTS.map((v) => (
          <li key={v.n}>
            <Link
              href={`/ui-lab/${v.n}`}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/50 hover:bg-muted/30"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold tabular text-primary">
                {v.n}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  {v.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {v.sub}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
