"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, History, Search } from "lucide-react";

import {
  Avatar,
  Badge,
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
import { PageHeader } from "@/components/layout/page-header";
import { formatISODateTime } from "@/lib/utils";
import { AUDIT_LOGS, filterAudit } from "@/lib/audit-data";
import {
  AUDIT_ACTIONS,
  AUDIT_ACTION_LABEL,
  type AuditAction,
  type AuditFilter,
  type AuditLog,
} from "@/lib/types/audit";

const ACTION_VARIANT: Record<
  AuditAction,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  create: "info",
  update: "info",
  delete: "danger",
  approve: "success",
  reject: "danger",
  reconcile: "success",
  export: "neutral",
  login: "neutral",
};

const columns: ColumnDef<AuditLog, unknown>[] = [
  {
    id: "at",
    header: "日時",
    accessorFn: (l) => l.at,
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">
        {formatISODateTime(row.original.at)}
      </span>
    ),
  },
  {
    id: "user",
    header: "操作ユーザー",
    accessorFn: (l) => l.user.name,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Avatar name={row.original.user.name} size="sm" />
        <span className="text-foreground">{row.original.user.name}</span>
      </div>
    ),
  },
  {
    id: "action",
    header: "操作種別",
    accessorFn: (l) => l.action,
    cell: ({ row }) => (
      <Badge variant={ACTION_VARIANT[row.original.action]}>
        {AUDIT_ACTION_LABEL[row.original.action]}
      </Badge>
    ),
  },
  {
    id: "target",
    header: "対象データ",
    accessorFn: (l) => l.target,
    cell: ({ row }) => (
      <span className="block max-w-[200px] truncate text-foreground">
        {row.original.target}
      </span>
    ),
  },
  {
    id: "changes",
    header: "変更内容",
    accessorFn: (l) => l.changes.length,
    cell: ({ row }) =>
      row.original.changes.length > 0 ? (
        <span className="text-muted-foreground">
          {row.original.changes.length} 項目変更
        </span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },
  {
    id: "ip",
    header: "IPアドレス",
    accessorFn: (l) => l.ip,
    cell: ({ row }) => (
      <span className="tabular text-muted-foreground">
        {row.original.ip}
      </span>
    ),
  },
  {
    id: "detail",
    header: "詳細",
    accessorFn: (l) => l.detail ?? "",
    cell: ({ row }) => (
      <span className="block max-w-[220px] truncate text-muted-foreground">
        {row.original.detail ?? "—"}
      </span>
    ),
  },
];

const DEFAULT_FILTER: AuditFilter = { query: "", action: "all" };

export function AuditLogsClient() {
  const { toast } = useToast();
  const [filter, setFilter] = React.useState<AuditFilter>(DEFAULT_FILTER);
  const [selId, setSelId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const data = React.useMemo(
    () => filterAudit(AUDIT_LOGS, filter),
    [filter],
  );
  const sel = AUDIT_LOGS.find((l) => l.id === selId) ?? null;

  return (
    <>
      <PageHeader
        title="監査ログ"
        description="誰が・いつ・何を・どう変更したかを追跡します（追記専用）。"
        actions={
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "監査ログをエクスポート（デモ）",
                description: "CSV出力は実データ接続後に実装します。",
              })
            }
          >
            <Download /> エクスポート
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
            placeholder="対象データ・ユーザー・詳細で検索"
            className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Select
          value={filter.action}
          onValueChange={(v) =>
            setFilter((f) => ({
              ...f,
              action: v as AuditFilter["action"],
            }))
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="操作種別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての操作</SelectItem>
            {AUDIT_ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {AUDIT_ACTION_LABEL[a]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-sm text-muted-foreground">
          {data.length} / {AUDIT_LOGS.length} 件
        </span>
      </div>

      <DataTable
        columns={columns}
        data={data}
        getRowId={(l) => l.id}
        onRowClick={(l) => {
          setSelId(l.id);
          setOpen(true);
        }}
        emptyState={
          <EmptyState
            icon={History}
            title="該当するログがありません"
            description="検索条件を変更してください。"
          />
        }
      />

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent size="lg">
          {sel && (
            <>
              <DrawerHeader>
                <div className="flex items-center gap-2">
                  <DrawerTitle>{sel.target}</DrawerTitle>
                  <Badge variant={ACTION_VARIANT[sel.action]}>
                    {AUDIT_ACTION_LABEL[sel.action]}
                  </Badge>
                </div>
                <DrawerDescription>
                  {formatISODateTime(sel.at)} ・ {sel.user.name} ・{" "}
                  <span className="tabular">{sel.ip}</span>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody className="space-y-4">
                {sel.detail && (
                  <p className="rounded-md bg-muted px-3 py-2 text-sm text-foreground">
                    {sel.detail}
                  </p>
                )}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    変更内容
                  </h3>
                  {sel.changes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      フィールド変更はありません（{AUDIT_ACTION_LABEL[sel.action]}）。
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted-foreground">
                          <th className="py-2 text-left font-medium">
                            項目
                          </th>
                          <th className="py-2 text-left font-medium">
                            変更前
                          </th>
                          <th className="py-2 text-left font-medium">
                            変更後
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sel.changes.map((c, i) => (
                          <tr
                            key={i}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-2 text-foreground">
                              {c.field}
                            </td>
                            <td className="py-2 text-muted-foreground line-through">
                              {c.before ?? "—"}
                            </td>
                            <td className="py-2 font-medium text-foreground">
                              {c.after ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="secondary">閉じる</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
