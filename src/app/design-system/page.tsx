"use client";

/**
 * デザインシステム プレビュー（業務画面ではない / ルート: /design-system）。
 * UI部品とトークンの目視確認用。業務画面は Step 3 以降で AppShell 上に構築する。
 */
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  STATUS_KEYS,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { formatJPY } from "@/lib/utils";

type DemoTxn = {
  id: string;
  date: string;
  partner: string;
  type: string;
  amount: number;
  status: (typeof STATUS_KEYS)[number];
};

const demoData: DemoTxn[] = [
  { id: "TX-1042", date: "2026/05/12", partner: "株式会社サンプル商事", type: "売上請求", amount: 286000, status: "承認待ち" },
  { id: "TX-1041", date: "2026/05/11", partner: "合同会社ミドリ", type: "受領請求", amount: 132000, status: "確認待ち" },
  { id: "TX-1039", date: "2026/05/09", partner: "田中 太郎", type: "経費申請", amount: 8640, status: "差戻し" },
  { id: "TX-1037", date: "2026/05/08", partner: "株式会社オオゾラ", type: "入金", amount: 540000, status: "消込済み" },
  { id: "TX-1031", date: "2026/05/02", partner: "電力会社", type: "支払", amount: 47300, status: "支払予定" },
];

const columns: ColumnDef<DemoTxn, unknown>[] = [
  { accessorKey: "id", header: "取引番号" },
  { accessorKey: "date", header: "発生日" },
  { accessorKey: "partner", header: "取引先" },
  { accessorKey: "type", header: "種別" },
  {
    accessorKey: "amount",
    header: "金額",
    meta: { align: "right" },
    cell: ({ getValue }) => formatJPY(getValue() as number),
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() as DemoTxn["status"]} />
    ),
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

const SWATCHES: [string, string][] = [
  ["背景", "bg-background border border-border"],
  ["面", "bg-surface border border-border"],
  ["弱い面", "bg-muted"],
  ["ナビ", "bg-sidebar"],
  ["ナビ選択", "bg-sidebar-active"],
  ["Primary", "bg-primary"],
  ["Success", "bg-success"],
  ["Warning", "bg-warning"],
  ["Danger", "bg-danger"],
  ["Info", "bg-info"],
];

export default function DesignSystemPreview() {
  const [loading, setLoading] = React.useState(false);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-10 px-page py-10">
        <header>
          <Badge variant="primary">Step 2 / デザイン基盤</Badge>
          <h1 className="mt-2 text-3xl font-bold text-foreground">
            Ryu Keiri デザインシステム
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            UI部品・トークンの確認用プレビューです。業務画面は Step 3
            以降で AppShell 上に同じ部品を使って構築します。
          </p>
        </header>

        <Section title="カラートークン">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {SWATCHES.map(([name, cls]) => (
              <div key={name} className="space-y-1.5">
                <div className={`h-14 rounded-md ${cls}`} />
                <p className="text-xs text-muted-foreground">{name}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="タイポグラフィ（日本語UI）">
          <Card>
            <CardContent className="space-y-1">
              <p className="text-3xl font-bold">見出し 経理ダッシュボード</p>
              <p className="text-lg font-semibold">小見出し 月次決算の進捗</p>
              <p className="text-base">
                本文 14px。請求書の発行から入金消込までを一気通貫で扱います。
              </p>
              <p className="text-sm text-muted-foreground">
                補助テキスト 13px。取引先・証憑・承認履歴に紐づきます。
              </p>
              <p className="tabular text-base">
                金額表示 ¥1,234,567（等幅・桁揃え）
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button>プライマリ</Button>
            <Button variant="secondary">セカンダリ</Button>
            <Button variant="outline">アウトライン</Button>
            <Button variant="ghost">ゴースト</Button>
            <Button variant="destructive">削除</Button>
            <Button variant="link">リンク</Button>
            <Button loading>処理中</Button>
            <Button size="sm">小</Button>
            <Button disabled>無効</Button>
          </div>
        </Section>

        <Section title="Badge / StatusBadge">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>neutral</Badge>
              <Badge variant="primary">primary</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="danger">danger</Badge>
              <Badge variant="info">info</Badge>
              <Badge variant="outline">outline</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_KEYS.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
          </div>
        </Section>

        <Section title="Input / Select / Tabs">
          <Card>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label required>取引先名</Label>
                <Input placeholder="株式会社○○" />
              </div>
              <div>
                <Label>金額</Label>
                <Input
                  className="tabular text-right"
                  defaultValue="286,000"
                  inputMode="numeric"
                />
              </div>
              <div>
                <Label>勘定科目</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">売上高</SelectItem>
                    <SelectItem value="ar">売掛金</SelectItem>
                    <SelectItem value="expense">旅費交通費</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>エラー例</Label>
                <Input invalid defaultValue="不正な値" />
                <p className="mt-1 text-xs text-danger">必須項目です。</p>
              </div>
              <div className="sm:col-span-2">
                <Tabs defaultValue="detail">
                  <TabsList>
                    <TabsTrigger value="detail">詳細</TabsTrigger>
                    <TabsTrigger value="journal">仕訳</TabsTrigger>
                    <TabsTrigger value="history">履歴</TabsTrigger>
                  </TabsList>
                  <TabsContent value="detail">
                    <p className="text-sm text-muted-foreground">
                      取引の基本情報を表示する領域です。
                    </p>
                  </TabsContent>
                  <TabsContent value="journal">
                    <p className="text-sm text-muted-foreground">
                      生成された仕訳候補を表示する領域です。
                    </p>
                  </TabsContent>
                  <TabsContent value="history">
                    <p className="text-sm text-muted-foreground">
                      操作・承認の履歴（監査）を表示する領域です。
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section title="Drawer（右スライド・中核UI）">
          <Drawer>
            <DrawerTrigger asChild>
              <Button>取引詳細を開く</Button>
            </DrawerTrigger>
            <DrawerContent size="lg">
              <DrawerHeader>
                <DrawerTitle>取引 TX-1042</DrawerTitle>
                <DrawerDescription>
                  株式会社サンプル商事 / 売上請求
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <StatusBadge status="承認待ち" />
                    <span className="tabular text-lg font-semibold">
                      {formatJPY(286000)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ヘッダー固定・本文スクロール・フッター固定の構造です。タブや証憑ビューを
                    この本文に積み上げます（Step 3 以降）。
                  </p>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="secondary">キャンセル</Button>
                <Button>保存</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Section>

        <Section title="DataTable（一覧の土台）">
          <div className="mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLoading((v) => !v)}
            >
              {loading ? "データ表示" : "ローディング表示"}
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={demoData}
            isLoading={loading}
            enableRowSelection
            getRowId={(r) => r.id}
            onRowClick={() => {}}
          />
        </Section>

        <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
          正本: docs/DESIGN.md §A — 業務画面（ダッシュボード・取引管理等）は次回以降。
        </footer>
      </div>
    </main>
  );
}
