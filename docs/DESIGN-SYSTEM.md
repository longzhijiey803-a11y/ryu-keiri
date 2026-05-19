# Ryu Keiri デザインシステム（Step 2 成果物）

このドキュメントは、Step 2 で構築した UI 基盤の構成と使い方をまとめた索引です。デザイントークンの正本は `docs/DESIGN.md` の §A-5 にあり、本書はその実装側の対応関係を示すものです。Step 3 以降の業務画面は、すべてここで定義した部品とトークンの上に構築します。

## ファイル構成

| ファイル | 役割 |
| --- | --- |
| `tailwind.config.ts` | デザイントークン（色・角丸・余白・影・フォント・アニメーション）の定義 |
| `src/app/globals.css` | CSS 変数（色は "R G B" 三値で保持・ライトテーマ単一）、基本スタイル、日本語フォントスタック、補助ユーティリティ（`.tabular` / `.scrollbar-thin` / `.page-px`） |
| `src/lib/utils.ts` | 共通ユーティリティ。`cn()`（クラス結合）、`formatJPY()`（金額表示）、`formatDate()`（日付表示） |
| `src/components/ui/` | 共通 UI 部品。`index.ts` から一括 import できます |
| `components.json` | shadcn 互換設定。将来 `npx shadcn add` で部品を追加できます |
| `src/app/design-system/page.tsx` | デザインシステムのプレビュー画面（業務画面ではありません） |

## トークン要点

- **色**: 背景 `#F6F7F9` / 面 `#FFFFFF` / 罫線 `#E5E7EB` / 本文 `#111827` / 補助テキスト `#6B7280` / プライマリ `#0F766E` / サイドバー `#24272E`（選択時 `#3A3D45`）。意味を持たせる色は success・warning・danger・info の 4 つだけです。
- **角丸**: sm 6px / md 8px（入力・ボタン）/ lg 12px（カード）/ xl 16px。
- **寸法**: 入力高 40px、テーブル行 44px、テーブル見出し 40px、トップバー 56px、サイドバー 264px（折りたたみ時 72px）、ドロワー 420 / 520 / 720 / 920px。
- **影**: `shadow-card`（控えめ）、`shadow-popover`、`shadow-drawer` の 3 種類。
- **文字**: 本文 14px、テーブル 13px、補助 12px。金額やコードは `.tabular` を付けて等幅・桁揃えにします。
- 不透明度ユーティリティに対応しています（例: `bg-primary/10`）。

## コンポーネント一覧

- **Button** — 6 バリアント・3 サイズ・loading 対応
- **Card** — Header / Title / Description / Content / Footer の一式
- **Badge** — 汎用バッジ
- **StatusBadge** — 業務ステータス 13 種。色の意味は全画面で統一
- **Input / Label** — 入力欄とラベル（invalid 状態あり）
- **Select** — Radix ベース
- **Tabs** — Radix ベースの下線型タブ
- **Drawer** — Radix Dialog ベースの右スライド。幅 sm / md / lg / xl、ヘッダー・本文・フッター固定
- **DataTable** — TanStack Table ベース。ソート・複数選択・行クリック・ローディング・空状態・金額右寄せ・ツールバー差し込みに対応

## 使い方

```tsx
import { Button, StatusBadge, DataTable } from "@/components/ui";
```

## 既知の制約・次への申し送り

- 現時点はライトテーマ単一です（ダークテーマは現要件外）。
- AppShell / Sidebar / TopBar / PageHeader は未実装です。Step 3 で本デザイン基盤の上に構築します。
- ルート `/` は Step 3 以降で AppShell（または `/dashboard`）に使う前提です。デザインシステムのプレビューは `/design-system` に配置しています。
- フォントはビルド時にネットワークへ依存しないシステムスタックです（Inter → Hiragino → Noto Sans JP → Meiryo の順）。
