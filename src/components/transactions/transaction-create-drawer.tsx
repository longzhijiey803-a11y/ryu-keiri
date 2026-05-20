"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X } from "lucide-react";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { DEPARTMENTS, PARTNERS, PROJECTS, USERS } from "@/lib/transactions-data";
import {
  TAX_CATEGORIES,
  TAX_CATEGORY_LABEL,
  TRANSACTION_KINDS,
  TRANSACTION_KIND_LABEL,
  type TransactionDraft,
  type TransactionKind,
  type TaxCategory,
} from "@/lib/types/transaction";

const schema = z.object({
  name: z.string().min(1, "取引名は必須です"),
  kind: z.enum([...TRANSACTION_KINDS] as [TransactionKind, ...TransactionKind[]]),
  partner_id: z.string().min(1, "取引先を選択してください"),
  amount: z
    .number({ error: "金額を数値で入力してください" })
    .int("整数で入力してください")
    .positive("金額は正の数で入力してください"),
  tax_category: z.enum([...TAX_CATEGORIES] as [TaxCategory, ...TaxCategory[]]),
  transaction_date: z.string().min(1, "取引日は必須です"),
  due_date: z.string().optional(),
  assignee_id: z.string().min(1, "担当者を選択してください"),
  department: z.string().optional(),
  project: z.string().optional(),
  memo: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const ERR = "mt-1 text-xs text-danger";

export function TransactionCreateDrawer({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreate: (draft: TransactionDraft) => void;
}) {
  const [files, setFiles] = React.useState<string[]>([]);
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
      kind: "income_invoice",
      partner_id: "",
      amount: undefined,
      tax_category: "taxable_10",
      transaction_date: "",
      due_date: "",
      assignee_id: "",
      department: "",
      project: "",
      memo: "",
    },
  });

  const close = () => {
    reset();
    setFiles([]);
    onOpenChange(false);
  };

  const submit = handleSubmit((v) => {
    onCreate({
      name: v.name,
      kind: v.kind,
      partner_id: v.partner_id,
      amount: v.amount,
      tax_category: v.tax_category,
      transaction_date: v.transaction_date,
      due_date: v.due_date ? v.due_date : null,
      assignee_id: v.assignee_id,
      department: v.department || null,
      project: v.project && v.project !== "（なし）" ? v.project : null,
      memo: v.memo || null,
      attachment_names: files,
    });
    reset();
    setFiles([]);
  });

  return (
    <Drawer open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DrawerContent size="lg">
        <DrawerHeader>
          <DrawerTitle>新規取引</DrawerTitle>
          <DrawerDescription>
            会社のお金に関わる業務イベントを起票します。
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody>
          <form id="txn-create-form" onSubmit={submit} className="space-y-5">
            <div>
              <Label required htmlFor="name">
                取引名
              </Label>
              <Input
                id="name"
                placeholder="例：5月分 受託開発 請求"
                invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && <p className={ERR}>{errors.name.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label required>取引区分</Label>
                <Controller
                  control={control}
                  name="kind"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {TRANSACTION_KINDS.map((k) => (
                          <SelectItem key={k} value={k}>
                            {TRANSACTION_KIND_LABEL[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label required>取引先</Label>
                <Controller
                  control={control}
                  name="partner_id"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger invalid={!!errors.partner_id}>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNERS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.partner_id && (
                  <p className={ERR}>{errors.partner_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label required htmlFor="amount">
                  金額（税込・円）
                </Label>
                <Input
                  id="amount"
                  type="number"
                  inputMode="numeric"
                  className="tabular text-right"
                  placeholder="0"
                  invalid={!!errors.amount}
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className={ERR}>{errors.amount.message}</p>
                )}
              </div>
              <div>
                <Label required>税区分</Label>
                <Controller
                  control={control}
                  name="tax_category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TAX_CATEGORIES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {TAX_CATEGORY_LABEL[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label required htmlFor="transaction_date">
                  取引日
                </Label>
                <Input
                  id="transaction_date"
                  type="date"
                  invalid={!!errors.transaction_date}
                  {...register("transaction_date")}
                />
                {errors.transaction_date && (
                  <p className={ERR}>{errors.transaction_date.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="due_date">支払 / 入金期日</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...register("due_date")}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label required>担当者</Label>
                <Controller
                  control={control}
                  name="assignee_id"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger invalid={!!errors.assignee_id}>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {USERS.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignee_id && (
                  <p className={ERR}>{errors.assignee_id.message}</p>
                )}
              </div>
              <div>
                <Label>部門</Label>
                <Controller
                  control={control}
                  name="department"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label>プロジェクト</Label>
              <Controller
                control={control}
                name="project"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECTS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="memo">メモ</Label>
              <textarea
                id="memo"
                rows={3}
                placeholder="補足・連絡事項など"
                className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
                {...register("memo")}
              />
            </div>

            <div>
              <Label>添付ファイル（証憑）</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-6 text-sm text-muted-foreground hover:border-primary/40">
                <Upload className="size-4" />
                クリックしてファイルを選択
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    setFiles(
                      Array.from(e.target.files ?? []).map((f) => f.name),
                    )
                  }
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <li
                      key={`${f}-${i}`}
                      className="flex items-center justify-between rounded-md bg-muted px-2.5 py-1.5 text-xs text-foreground"
                    >
                      <span className="truncate">{f}</span>
                      <button
                        type="button"
                        aria-label="削除"
                        onClick={() =>
                          setFiles((p) => p.filter((_, idx) => idx !== i))
                        }
                        className="text-muted-foreground hover:text-danger"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="secondary" onClick={close}>
            キャンセル
          </Button>
          <Button type="submit" form="txn-create-form" loading={isSubmitting}>
            取引を作成
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
