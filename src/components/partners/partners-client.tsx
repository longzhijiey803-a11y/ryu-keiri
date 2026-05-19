"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Plus, Search } from "lucide-react";

import {
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
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { formatISODate, formatJPY } from "@/lib/utils";
import {
  PARTNER_KINDS,
  PARTNER_KIND_LABEL,
  PARTNER_RECORDS,
  filterPartners,
  partnerInvoices,
  type PartnerFilter,
  type PartnerKind,
  type PartnerRecord,
} from "@/lib/partners-data";
import { PartnerKindBadge, RegNoBadge } from "./partner-badges";

const schema = z.object({
  name: z.string().min(1, "取引先名は必須です"),
  kind: z.enum([...PARTNER_KINDS] as [PartnerKind, ...PartnerKind[]]),
  registration_number: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^T\d{13}$/.test(v),
      "登録番号は T + 13桁 で入力してください（例: T1234567890123）",
    ),
  note: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const columns: ColumnDef<PartnerRecord, unknown>[] = [
  {
    id: "name",
    header: "取引先名",
    accessorFn: (p) => p.name,
    cell: ({ row }) => (
      <div className="min-w-[180px]">
        <p className="truncate font-medium text-foreground">
          {row.original.name}
        </p>
        <p className="tabular text-xs text-muted-foreground">
          {row.original.id}
        </p>
      </div>
    ),
  },
  {
    id: "kind",
    header: "区分",
    accessorFn: (p) => p.kind,
    cell: ({ row }) => <PartnerKindBadge kind={row.original.kind} />,
  },
  {
    id: "registration_number",
    header: "インボイス登録番号",
    accessorFn: (p) => p.registration_number ?? "",
    cell: ({ row }) => (
      <RegNoBadge value={row.original.registration_number} />
    ),
  },
  {
    id: "ar",
    header: "売掛残",
    accessorFn: (p) => p.ar_outstanding,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span
        className={
          row.original.ar_outstanding > 0
            ? "font-medium text-foreground"
            : "text-muted-foreground/50"
        }
      >
        {row.original.ar_outstanding > 0
          ? formatJPY(row.original.ar_outstanding)
          : "—"}
      </span>
    ),
  },
  {
    id: "ap",
    header: "買掛残",
    accessorFn: (p) => p.ap_outstanding,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span
        className={
          row.original.ap_outstanding > 0
            ? "font-medium text-foreground"
            : "text-muted-foreground/50"
        }
      >
        {row.original.ap_outstanding > 0
          ? formatJPY(row.original.ap_outstanding)
          : "—"}
      </span>
    ),
  },
  {
    id: "txn",
    header: "取引件数",
    accessorFn: (p) => p.txn_count,
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="tabular text-muted-foreground">
        {row.original.txn_count}
      </span>
    ),
  },
  {
    id: "active",
    header: "状態",
    accessorFn: (p) => p.active,
    cell: ({ row }) =>
      row.original.active ? (
        <Badge variant="success">有効</Badge>
      ) : (
        <Badge variant="neutral">停止</Badge>
      ),
  },
];

const DEFAULT_FILTER: PartnerFilter = {
  query: "",
  kind: "all",
  only_no_regno: false,
};
const ERR = "mt-1 text-xs text-danger";

export function PartnersClient() {
  const { toast } = useToast();
  const [list, setList] = React.useState<PartnerRecord[]>(PARTNER_RECORDS);
  const [filter, setFilter] = React.useState<PartnerFilter>(DEFAULT_FILTER);
  const [selId, setSelId] = React.useState<string | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const data = React.useMemo(
    () => filterPartners(list, filter),
    [list, filter],
  );
  const sel = list.find((p) => p.id === selId) ?? null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      kind: "customer",
      registration_number: "",
      note: "",
    },
  });

  const closeCreate = () => {
    reset();
    setCreateOpen(false);
  };

  const submit = handleSubmit((v) => {
    const rec: PartnerRecord = {
      id: `PT-N${list.length + 1}`,
      name: v.name,
      registration_number: v.registration_number || null,
      kind: v.kind,
      ar_outstanding: 0,
      ap_outstanding: 0,
      txn_count: 0,
      active: true,
    };
    setList((prev) => [rec, ...prev]);
    reset();
    setCreateOpen(false);
    toast({
      title: "取引先を追加しました",
      description: rec.name,
      variant: "success",
    });
  });

  return (
    <>
      <PageHeader
        title="取引先管理"
        description="取引先マスタ（適格請求書発行事業者の登録番号を含む）。"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus /> 取引先を追加
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
            placeholder="取引先名・登録番号で検索"
            className="h-input w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Select
          value={filter.kind}
          onValueChange={(v) =>
            setFilter((f) => ({ ...f, kind: v as PartnerFilter["kind"] }))
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="区分" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての区分</SelectItem>
            {PARTNER_KINDS.map((k) => (
              <SelectItem key={k} value={k}>
                {PARTNER_KIND_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="inline-flex h-input cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground">
          <input
            type="checkbox"
            className="size-4 accent-warning"
            checked={filter.only_no_regno}
            onChange={(e) =>
              setFilter((f) => ({ ...f, only_no_regno: e.target.checked }))
            }
          />
          登録番号 未登録のみ
        </label>
        <span className="ml-auto text-sm text-muted-foreground">
          {data.length} / {list.length} 件
        </span>
      </div>

      <DataTable
        columns={columns}
        data={data}
        getRowId={(p) => p.id}
        onRowClick={(p) => {
          setSelId(p.id);
          setDetailOpen(true);
        }}
        emptyState={
          <EmptyState
            icon={Building2}
            title="該当する取引先がありません"
            description="検索条件を変更するか、取引先を追加してください。"
          />
        }
      />

      {/* 詳細 */}
      <Drawer open={detailOpen} onOpenChange={setDetailOpen}>
        <DrawerContent size="lg">
          {sel && (
            <>
              <DrawerHeader>
                <div className="flex items-center gap-2">
                  <DrawerTitle>{sel.name}</DrawerTitle>
                  <PartnerKindBadge kind={sel.kind} />
                </div>
                <DrawerDescription>
                  <span className="tabular">{sel.id}</span>
                </DrawerDescription>
              </DrawerHeader>
              <DrawerBody className="space-y-5">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">
                      インボイス登録番号
                    </dt>
                    <dd className="mt-0.5">
                      <RegNoBadge value={sel.registration_number} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">売掛残</dt>
                    <dd className="tabular font-medium">
                      {formatJPY(sel.ar_outstanding)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">買掛残</dt>
                    <dd className="tabular font-medium">
                      {formatJPY(sel.ap_outstanding)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      関連取引件数
                    </dt>
                    <dd className="tabular">{sel.txn_count} 件</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">状態</dt>
                    <dd>{sel.active ? "有効" : "停止"}</dd>
                  </div>
                </dl>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    関連請求書
                  </h3>
                  {partnerInvoices(sel.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      関連する請求書はありません。
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs text-muted-foreground">
                          <th className="py-2 text-left font-medium">
                            番号
                          </th>
                          <th className="py-2 text-left font-medium">
                            区分
                          </th>
                          <th className="py-2 text-left font-medium">
                            件名
                          </th>
                          <th className="py-2 text-right font-medium">
                            金額
                          </th>
                          <th className="py-2 text-right font-medium">
                            期限
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {partnerInvoices(sel.id).map((i) => (
                          <tr
                            key={i.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-2 tabular text-foreground">
                              {i.number}
                            </td>
                            <td className="py-2 text-muted-foreground">
                              {i.direction === "issued" ? "発行" : "受領"}
                            </td>
                            <td className="py-2 text-muted-foreground">
                              {i.subject}
                            </td>
                            <td className="py-2 text-right tabular">
                              {formatJPY(i.total)}
                            </td>
                            <td className="py-2 text-right tabular text-muted-foreground">
                              {formatISODate(i.due_date)}
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
                <Button disabled title="Step 後続で実装">
                  編集
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* 追加 */}
      <Drawer
        open={createOpen}
        onOpenChange={(o) => (o ? setCreateOpen(true) : closeCreate())}
      >
        <DrawerContent size="md">
          <DrawerHeader>
            <DrawerTitle>取引先を追加</DrawerTitle>
            <DrawerDescription>
              取引先マスタに新規登録します。
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <form
              id="partner-create-form"
              onSubmit={submit}
              className="space-y-5"
            >
              <div>
                <Label required htmlFor="p-name">
                  取引先名
                </Label>
                <Input
                  id="p-name"
                  placeholder="株式会社○○"
                  invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p className={ERR}>{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label required>区分</Label>
                <Controller
                  control={control}
                  name="kind"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNER_KINDS.map((k) => (
                          <SelectItem key={k} value={k}>
                            {PARTNER_KIND_LABEL[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="p-regno">インボイス登録番号</Label>
                <Input
                  id="p-regno"
                  className="tabular"
                  placeholder="T + 13桁（任意）"
                  invalid={!!errors.registration_number}
                  {...register("registration_number")}
                />
                {errors.registration_number && (
                  <p className={ERR}>
                    {errors.registration_number.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="p-note">備考</Label>
                <textarea
                  id="p-note"
                  rows={2}
                  placeholder="任意"
                  className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
                  {...register("note")}
                />
              </div>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="secondary" onClick={closeCreate}>
              キャンセル
            </Button>
            <Button
              type="submit"
              form="partner-create-form"
              loading={isSubmitting}
            >
              追加する
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
