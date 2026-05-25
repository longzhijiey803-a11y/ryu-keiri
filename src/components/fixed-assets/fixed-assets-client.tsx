"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Plus, Search } from "lucide-react";

import {
  Button,
  DataTable,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  EmptyState,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@/components/ui";
import {
  UNIMPLEMENTED_TITLE,
  UnimplementedBadge,
} from "@/components/ui/unimplemented-badge";
import { PageHeader } from "@/components/layout/page-header";
import { cn, formatISODate, formatJPY } from "@/lib/utils";
import {
  FIXED_ASSETS,
  depreciationSchedule,
  filterAssets,
} from "@/lib/asset-data";
import {
  ASSET_STATUSES,
  ASSET_STATUS_LABEL,
  DEPRECIATION_METHOD_LABEL,
  type AssetFilter,
  type AssetStatus,
  type FixedAsset,
} from "@/lib/types/asset";

const STATUS_TONE: Record<AssetStatus, string> = {
  in_use: "bg-success/10 text-success",
  depreciating: "bg-info/10 text-info",
  fully_depreciated: "bg-muted text-muted-foreground",
  disposed: "bg-danger/10 text-danger",
};
function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_TONE[status],
      )}
    >
      {ASSET_STATUS_LABEL[status]}
    </span>
  );
}

const columns: ColumnDef<FixedAsset, unknown>[] = [
  {
    id: "name",
    header: "資産名",
    accessorFn: (a) => a.name,
    cell: ({ row }) => (
      <span className="block max-w-[220px] truncate font-medium text-foreground">
        {row.original.name}
      </span>
    ),
  },
  {
    id: "acquired_on",
    header: "取得日",
    accessorFn: (a) => a.acquired_on,
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">
        {formatISODate(row.original.acquired_on)}
      </span>
    ),
  },
  {
    id: "acquisition_cost",
    header: "取得価額",
    accessorFn: (a) => a.acquisition_cost,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-medium">
        {formatJPY(row.original.acquisition_cost)}
      </span>
    ),
  },
  {
    id: "useful_life_years",
    header: "耐用年数",
    accessorFn: (a) => a.useful_life_years,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="tabular text-muted-foreground">
        {row.original.useful_life_years} 年
      </span>
    ),
  },
  {
    id: "method",
    header: "償却方法",
    accessorFn: (a) => a.method,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {DEPRECIATION_METHOD_LABEL[row.original.method]}
      </span>
    ),
  },
  {
    id: "current_year_depreciation",
    header: "当期償却額",
    accessorFn: (a) => a.current_year_depreciation,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="tabular text-muted-foreground">
        {formatJPY(row.original.current_year_depreciation)}
      </span>
    ),
  },
  {
    id: "book_value",
    header: "帳簿価額",
    accessorFn: (a) => a.book_value,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-medium">
        {formatJPY(row.original.book_value)}
      </span>
    ),
  },
  {
    id: "department",
    header: "部門",
    accessorFn: (a) => a.department,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.department}
      </span>
    ),
  },
  {
    id: "status",
    header: "ステータス",
    accessorFn: (a) => a.status,
    cell: ({ row }) => <AssetStatusBadge status={row.original.status} />,
  },
];

const DEFAULT_FILTER: AssetFilter = { query: "", status: "all" };

export function FixedAssetsClient() {
  const { toast } = useToast();
  const [filter, setFilter] = React.useState<AssetFilter>(DEFAULT_FILTER);
  const [selId, setSelId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const data = React.useMemo(
    () => filterAssets(FIXED_ASSETS, filter),
    [filter],
  );
  const sel = FIXED_ASSETS.find((a) => a.id === selId) ?? null;

  return (
    <>
      <PageHeader
        title="固定資産"
        description="固定資産台帳と減価償却を管理します。"
        actions={
          <Button
            onClick={() =>
              toast({
                title: "資産登録は未実装です",
                description: "登録フォームはバックエンド接続後に実装します。",
                variant: "warning",
              })
            }
          >
            <Plus /> 資産を登録
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filter.query}
            onChange={(e) =>
              setFilter((f) => ({ ...f, query: e.target.value }))
            }
            placeholder="資産名・部門で検索"
            className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Select
          value={filter.status}
          onValueChange={(v) =>
            setFilter((f) => ({
              ...f,
              status: v as AssetFilter["status"],
            }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての状態</SelectItem>
            {ASSET_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {ASSET_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-sm text-muted-foreground">
          {data.length} / {FIXED_ASSETS.length} 件
        </span>
      </div>

      <DataTable
        columns={columns}
        data={data}
        getRowId={(a) => a.id}
        onRowClick={(a) => {
          setSelId(a.id);
          setOpen(true);
        }}
        emptyState={
          <EmptyState
            icon={Building2}
            title="該当する資産がありません"
            description="検索条件を変更してください。"
          />
        }
      />

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent size="lg">
          {sel && (
            <>
              <DrawerHeader>
                <DrawerTitle>{sel.name}</DrawerTitle>
                <DrawerDescription>
                  <span className="tabular">{sel.id}</span> ・{" "}
                  {sel.department} ・ {ASSET_STATUS_LABEL[sel.status]}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody className="space-y-5">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">取得日</dt>
                    <dd className="tabular">
                      {formatISODate(sel.acquired_on)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      取得価額
                    </dt>
                    <dd className="tabular font-medium">
                      {formatJPY(sel.acquisition_cost)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      償却方法 / 耐用年数
                    </dt>
                    <dd>
                      {DEPRECIATION_METHOD_LABEL[sel.method]} /{" "}
                      {sel.useful_life_years}年
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      帳簿価額
                    </dt>
                    <dd className="tabular font-medium">
                      {formatJPY(sel.book_value)}
                    </dd>
                  </div>
                </dl>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    減価償却スケジュール（簡易・定額）
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="py-2 text-left font-medium">年度</th>
                        <th className="py-2 text-right font-medium">
                          償却額
                        </th>
                        <th className="py-2 text-right font-medium">
                          期末簿価
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {depreciationSchedule(sel).map((r) => (
                        <tr
                          key={r.year}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-2 tabular text-foreground">
                            {r.year}年
                          </td>
                          <td className="py-2 text-right tabular text-muted-foreground">
                            {formatJPY(r.depreciation)}
                          </td>
                          <td className="py-2 text-right tabular">
                            {formatJPY(r.book_value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="secondary">閉じる</Button>
                </DrawerClose>
                <Button disabled title={UNIMPLEMENTED_TITLE}>
                  除却処理 <UnimplementedBadge />
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
