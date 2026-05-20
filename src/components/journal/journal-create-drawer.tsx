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
import { cn, formatJPY } from "@/lib/utils";
import { ACCOUNTS, DEPARTMENTS, PROJECTS } from "@/lib/journal-data";
import { TRANSACTIONS } from "@/lib/transactions-data";
import {
  TAX_CATEGORIES,
  TAX_CATEGORY_LABEL,
  type TaxCategory,
} from "@/lib/types/transaction";
import type {
  JournalDraft,
  JournalEntry,
  JournalSide,
} from "@/lib/types/journal";
import { JournalSuggestionPanel } from "./journal-suggestion-panel";

const lineSchema = z.object({
  side: z.enum(["debit", "credit"]),
  account_code: z.string().min(1, "勘定科目を選択してください"),
  sub_account: z.string().optional(),
  amount: z
    .number({ error: "金額を入力してください" })
    .int("整数で入力してください")
    .positive("金額は正の数で入力してください"),
  tax_category: z.enum([...TAX_CATEGORIES] as [TaxCategory, ...TaxCategory[]]),
  tax_amount: z.number().int().nonnegative(),
  department: z.string().optional(),
  project: z.string().optional(),
});

const schema = z
  .object({
    entry_date: z.string().min(1, "仕訳日は必須です"),
    description: z.string().min(1, "摘要は必須です"),
    related_transaction_id: z.string().optional(),
    memo: z.string().optional(),
    lines: z.array(lineSchema).min(2, "借方・貸方の明細を入力してください"),
  })
  .refine(
    (v) => {
      const d = v.lines
        .filter((l) => l.side === "debit")
        .reduce((s, l) => s + (l.amount || 0), 0);
      const c = v.lines
        .filter((l) => l.side === "credit")
        .reduce((s, l) => s + (l.amount || 0), 0);
      return d > 0 && d === c;
    },
    { message: "借方合計と貸方合計が一致していません", path: ["lines"] },
  );

type FormValues = z.infer<typeof schema>;

const ERR = "mt-1 text-xs text-danger";
const toNum0 = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

function emptyLine(side: JournalSide) {
  return {
    side,
    account_code: "",
    sub_account: "",
    amount: undefined as unknown as number,
    tax_category: "taxable_10" as TaxCategory,
    tax_amount: 0,
    department: "",
    project: "",
  };
}

function entryToFormValues(entry: JournalEntry): FormValues {
  return {
    entry_date: entry.entry_date,
    description: entry.description,
    related_transaction_id: entry.related_transaction_id ?? "",
    memo: entry.memo ?? "",
    lines: entry.lines.map((l) => ({
      side: l.side,
      account_code: l.account_code,
      sub_account: l.sub_account ?? "",
      amount: l.amount,
      tax_category: l.tax_category,
      tax_amount: l.tax_amount,
      department: l.department ?? "",
      project: l.project ?? "",
    })),
  };
}

const EMPTY_DEFAULTS: FormValues = {
  entry_date: "",
  description: "",
  related_transaction_id: "",
  memo: "",
  lines: [emptyLine("debit"), emptyLine("credit")],
};

export function JournalCreateDrawer({
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  initialEntry,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreate: (draft: JournalDraft) => void;
  /** 編集モード時に呼ばれる。指定があれば「編集」モードとして動作。 */
  onUpdate?: (id: string, draft: JournalDraft) => void;
  /** 編集対象の仕訳。指定があれば編集モード。 */
  initialEntry?: JournalEntry | null;
}) {
  const isEdit = !!initialEntry && !!onUpdate;
  const [files, setFiles] = React.useState<string[]>([]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_DEFAULTS,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  // 開く度に初期値を切り替え（編集対象が変わったときも追従）
  React.useEffect(() => {
    if (!open) return;
    if (initialEntry) {
      reset(entryToFormValues(initialEntry));
      setFiles(initialEntry.attachments.map((a) => a.file_name));
    } else {
      reset(EMPTY_DEFAULTS);
      setFiles([]);
    }
  }, [open, initialEntry, reset]);

  const watched = watch("lines");
  const debitSum = (watched ?? [])
    .filter((l) => l?.side === "debit")
    .reduce((s, l) => s + (Number(l?.amount) || 0), 0);
  const creditSum = (watched ?? [])
    .filter((l) => l?.side === "credit")
    .reduce((s, l) => s + (Number(l?.amount) || 0), 0);
  const diff = debitSum - creditSum;
  const balanced = debitSum > 0 && diff === 0;

  const description = watch("description");

  const close = () => {
    reset();
    setFiles([]);
    onOpenChange(false);
  };

  const applySuggestion = (
    s: { side: JournalSide; account_code: string; tax_category: TaxCategory },
    mode: "adopt" | "edit",
  ) => {
    const idx = fields.findIndex((f) => f.side === s.side);
    const target =
      idx >= 0 ? idx : (append(emptyLine(s.side)), fields.length);
    setValue(`lines.${target}.account_code`, s.account_code, {
      shouldValidate: true,
    });
    if (mode === "adopt") {
      setValue(`lines.${target}.tax_category`, s.tax_category);
    }
  };

  const submit = handleSubmit((v) => {
    const draft: JournalDraft = {
      entry_date: v.entry_date,
      description: v.description,
      related_transaction_id: v.related_transaction_id || null,
      memo: v.memo || null,
      lines: v.lines.map((l) => ({
        side: l.side,
        account_code: l.account_code,
        sub_account: l.sub_account || null,
        amount: l.amount,
        tax_category: l.tax_category,
        tax_amount: l.tax_amount || 0,
        department: l.department || null,
        project: l.project || null,
      })),
      attachment_names: files,
    };
    if (isEdit && initialEntry) {
      onUpdate!(initialEntry.id, draft);
    } else {
      onCreate(draft);
    }
    reset();
    setFiles([]);
  });

  const renderLines = (side: JournalSide) =>
    fields.map((f, idx) => {
      if (f.side !== side) return null;
      const lineErr = errors.lines?.[idx];
      return (
        <div
          key={f.id}
          className="rounded-md border border-border bg-background p-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>勘定科目</Label>
              <Controller
                control={control}
                name={`lines.${idx}.account_code`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger invalid={!!lineErr?.account_code}>
                      <SelectValue placeholder="科目を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNTS.map((a) => (
                        <SelectItem key={a.code} value={a.code}>
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
              {lineErr?.account_code && (
                <p className={ERR}>{lineErr.account_code.message}</p>
              )}
            </div>

            <div>
              <Label>補助科目</Label>
              <Input
                placeholder="任意"
                {...register(`lines.${idx}.sub_account`)}
              />
            </div>
            <div>
              <Label>金額（税込）</Label>
              <Input
                type="number"
                inputMode="numeric"
                className="tabular text-right"
                placeholder="0"
                invalid={!!lineErr?.amount}
                {...register(`lines.${idx}.amount`, { valueAsNumber: true })}
              />
              {lineErr?.amount && (
                <p className={ERR}>{lineErr.amount.message}</p>
              )}
            </div>

            <div>
              <Label>税区分</Label>
              <Controller
                control={control}
                name={`lines.${idx}.tax_category`}
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
            <div>
              <Label>消費税額</Label>
              <Input
                type="number"
                inputMode="numeric"
                className="tabular text-right"
                placeholder="0"
                {...register(`lines.${idx}.tax_amount`, {
                  setValueAs: toNum0,
                })}
              />
            </div>

            <div>
              <Label>部門</Label>
              <Controller
                control={control}
                name={`lines.${idx}.department`}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="任意" />
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
            <div>
              <Label>プロジェクト</Label>
              <Controller
                control={control}
                name={`lines.${idx}.project`}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="任意" />
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
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(idx)}
              disabled={fields.length <= 2}
            >
              <Trash2 /> この明細を削除
            </Button>
          </div>
        </div>
      );
    });

  return (
    <Drawer open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DrawerContent size="xl">
        <DrawerHeader>
          <DrawerTitle>
            {isEdit ? `仕訳を編集 ・ ${initialEntry?.id}` : "新規仕訳"}
          </DrawerTitle>
          <DrawerDescription>
            複式簿記。借方合計と貸方合計を一致させてください。
          </DrawerDescription>
        </DrawerHeader>

        <DrawerBody>
          <form id="jv-create-form" onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label required htmlFor="entry_date">
                  仕訳日
                </Label>
                <Input
                  id="entry_date"
                  type="date"
                  invalid={!!errors.entry_date}
                  {...register("entry_date")}
                />
                {errors.entry_date && (
                  <p className={ERR}>{errors.entry_date.message}</p>
                )}
              </div>
              <div>
                <Label>関連取引</Label>
                <Controller
                  control={control}
                  name="related_transaction_id"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="任意" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTIONS.slice(0, 10).map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.id} ・ {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label required htmlFor="description">
                摘要
              </Label>
              <Input
                id="description"
                placeholder="例：5月分 受託開発 請求"
                invalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <p className={ERR}>{errors.description.message}</p>
              )}
            </div>

            <JournalSuggestionPanel
              description={description ?? ""}
              onApply={applySuggestion}
            />

            {/* 借方明細 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  借方明細
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append(emptyLine("debit"))}
                >
                  <Plus /> 借方を追加
                </Button>
              </div>
              {renderLines("debit")}
            </div>

            {/* 貸方明細 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  貸方明細
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append(emptyLine("credit"))}
                >
                  <Plus /> 貸方を追加
                </Button>
              </div>
              {renderLines("credit")}
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

            <div>
              <Label>関連証憑</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-3 py-5 text-sm text-muted-foreground hover:border-primary/40">
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
          </form>
        </DrawerBody>

        <DrawerFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* 貸借一致チェック（リアルタイム） */}
          <div
            className={cn(
              "flex flex-1 items-center justify-between rounded-md border px-3 py-2 text-sm",
              balanced
                ? "border-success/30 bg-success/[0.06] text-success"
                : "border-danger/30 bg-danger/[0.06] text-danger",
            )}
          >
            <span className="tabular">
              借方 {formatJPY(debitSum)} ／ 貸方 {formatJPY(creditSum)}
            </span>
            <span className="font-medium">
              {balanced
                ? "貸借一致"
                : debitSum === 0 && creditSum === 0
                  ? "金額未入力"
                  : `不一致（差額 ${formatJPY(Math.abs(diff))}）`}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={close}>
              キャンセル
            </Button>
            <Button
              type="submit"
              form="jv-create-form"
              loading={isSubmitting}
              disabled={!balanced}
            >
              {isEdit ? "変更を保存" : "仕訳を作成"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
