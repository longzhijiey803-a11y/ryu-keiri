"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Upload, X } from "lucide-react";

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
import { formatJPY } from "@/lib/utils";
import { ACCOUNTS, DEPARTMENTS } from "@/lib/journal-data";
import { USERS } from "@/lib/transactions-data";
import {
  TAX_CATEGORIES,
  TAX_CATEGORY_LABEL,
  type TaxCategory,
} from "@/lib/types/transaction";
import type { ExpenseDraft } from "@/lib/types/expense";

const lineSchema = z.object({
  used_on: z.string().min(1, "利用日は必須です"),
  payee: z.string().min(1, "支払先は必須です"),
  amount: z
    .number({ error: "金額を入力してください" })
    .int("整数で入力してください")
    .positive("金額は正の数で入力してください"),
  tax_category: z.enum([...TAX_CATEGORIES] as [TaxCategory, ...TaxCategory[]]),
  account_hint: z.string().optional(),
  note: z.string().optional(),
});
const schema = z.object({
  subject: z.string().min(1, "件名は必須です"),
  applicant_id: z.string().min(1, "申請者を選択してください"),
  department: z.string().min(1, "部門を選択してください"),
  claim_date: z.string().min(1, "申請日は必須です"),
  memo: z.string().optional(),
  lines: z.array(lineSchema).min(1, "経費明細を1件以上入力してください"),
});
type FormValues = z.infer<typeof schema>;
const ERR = "mt-1 text-xs text-danger";

const emptyLine = () => ({
  used_on: "",
  payee: "",
  amount: undefined as unknown as number,
  tax_category: "taxable_10" as TaxCategory,
  account_hint: "",
  note: "",
});

export function ExpenseCreateDrawer({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreate: (draft: ExpenseDraft) => void;
}) {
  const [files, setFiles] = React.useState<string[]>([]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      applicant_id: "",
      department: "",
      claim_date: "",
      memo: "",
      lines: [emptyLine()],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  const total = (watch("lines") ?? []).reduce(
    (s, l) => s + (Number(l?.amount) || 0),
    0,
  );

  const close = () => {
    reset();
    setFiles([]);
    onOpenChange(false);
  };

  const submit = handleSubmit((v) => {
    onCreate({
      subject: v.subject,
      applicant_id: v.applicant_id,
      department: v.department,
      claim_date: v.claim_date,
      memo: v.memo || null,
      lines: v.lines.map((l) => ({
        used_on: l.used_on,
        payee: l.payee,
        amount: l.amount,
        tax_category: l.tax_category,
        account_hint: l.account_hint || "",
        note: l.note || null,
      })),
      receipt_names: files,
    });
    reset();
    setFiles([]);
  });

  return (
    <Drawer open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <DrawerTitle>新規経費申請</DrawerTitle>
          <DrawerDescription>
            領収書を添付して申請します。承認後に経理が精算します。
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody>
          <form id="exp-create-form" onSubmit={submit} className="space-y-5">
            <div>
              <Label required htmlFor="subject">
                件名
              </Label>
              <Input
                id="subject"
                placeholder="例：出張旅費（大阪・5月）"
                invalid={!!errors.subject}
                {...register("subject")}
              />
              {errors.subject && (
                <p className={ERR}>{errors.subject.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label required>申請者</Label>
                <Controller
                  control={control}
                  name="applicant_id"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger invalid={!!errors.applicant_id}>
                        <SelectValue placeholder="選択" />
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
                {errors.applicant_id && (
                  <p className={ERR}>{errors.applicant_id.message}</p>
                )}
              </div>
              <div>
                <Label required>部門</Label>
                <Controller
                  control={control}
                  name="department"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger invalid={!!errors.department}>
                        <SelectValue placeholder="選択" />
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
                {errors.department && (
                  <p className={ERR}>{errors.department.message}</p>
                )}
              </div>
              <div>
                <Label required htmlFor="claim_date">
                  申請日
                </Label>
                <Input
                  id="claim_date"
                  type="date"
                  invalid={!!errors.claim_date}
                  {...register("claim_date")}
                />
                {errors.claim_date && (
                  <p className={ERR}>{errors.claim_date.message}</p>
                )}
              </div>
            </div>

            {/* 経費明細 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  経費明細
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append(emptyLine())}
                >
                  <Plus /> 明細を追加
                </Button>
              </div>
              {fields.map((f, idx) => {
                const le = errors.lines?.[idx];
                return (
                  <div
                    key={f.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>利用日</Label>
                        <Input
                          type="date"
                          invalid={!!le?.used_on}
                          {...register(`lines.${idx}.used_on`)}
                        />
                      </div>
                      <div>
                        <Label>支払先</Label>
                        <Input
                          placeholder="例：JR東海"
                          invalid={!!le?.payee}
                          {...register(`lines.${idx}.payee`)}
                        />
                      </div>
                      <div>
                        <Label>金額（税込）</Label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          className="tabular text-right"
                          placeholder="0"
                          invalid={!!le?.amount}
                          {...register(`lines.${idx}.amount`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label>税区分</Label>
                        <Controller
                          control={control}
                          name={`lines.${idx}.tax_category`}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
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
                      <div>
                        <Label>勘定科目候補</Label>
                        <Controller
                          control={control}
                          name={`lines.${idx}.account_hint`}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="科目を選択" />
                              </SelectTrigger>
                              <SelectContent>
                                {ACCOUNTS.map((a) => (
                                  <SelectItem
                                    key={a.code}
                                    value={`${a.code} ${a.name}`}
                                  >
                                    <span className="tabular text-xs text-muted-foreground">
                                      {a.code}
                                    </span>{" "}
                                    {a.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div>
                        <Label>明細メモ</Label>
                        <Input
                          placeholder="任意"
                          {...register(`lines.${idx}.note`)}
                        />
                      </div>
                    </div>
                    {(le?.used_on || le?.payee || le?.amount) && (
                      <p className={ERR}>
                        利用日・支払先・金額は必須です。
                      </p>
                    )}
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(idx)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 /> 削除
                      </Button>
                    </div>
                  </div>
                );
              })}
              <p className="text-right text-sm text-muted-foreground">
                合計：
                <span className="tabular ml-1 font-semibold text-foreground">
                  {formatJPY(total)}
                </span>
              </p>
            </div>

            <div>
              <Label>領収書添付</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-5 text-sm text-muted-foreground hover:border-primary/40">
                <Upload className="size-4" />
                クリックしてファイルを選択（PDF / 画像）
                <input
                  type="file"
                  multiple
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(e) =>
                    setFiles(
                      Array.from(e.target.files ?? []).map((x) => x.name),
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
                          setFiles((p) => p.filter((_, x) => x !== i))
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

            <div>
              <Label htmlFor="memo">メモ</Label>
              <textarea
                id="memo"
                rows={2}
                placeholder="補足・連絡事項など"
                className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
                {...register("memo")}
              />
            </div>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="secondary" onClick={close}>
            キャンセル
          </Button>
          <Button
            type="submit"
            form="exp-create-form"
            loading={isSubmitting}
          >
            申請する
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
