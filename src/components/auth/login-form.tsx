"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * 社内アプリのログイン画面用フォーム。
 * - 認証は未実装。`onSubmit` 未指定時はモック（{ demo / demo } のみ成功）
 * - 将来 Supabase / Auth API へは `onSubmit` を差し替えるだけで接続可能
 */
const schema = z.object({
  userId: z
    .string()
    .min(1, { message: "ユーザーIDを入力してください" })
    .regex(/^[A-Za-z0-9]+$/, { message: "ユーザーIDは英数字のみ使用できます" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});

export type LoginFormValues = z.infer<typeof schema>;

export interface LoginFormProps {
  /** 初期値（社員番号の引き継ぎ等） */
  defaultValues?: Partial<LoginFormValues>;
  /** 認証処理を差し替えるためのフック。例外を throw すればエラー表示。 */
  onSubmit?: (values: LoginFormValues) => Promise<void>;
  /** 成功時のリダイレクト先 */
  redirectTo?: string;
  className?: string;
}

const MOCK_CREDENTIALS = { userId: "demo", password: "demo" } as const;

/** デフォルトのモック認証: { demo / demo } のみ成功 */
async function mockAuthenticate(values: LoginFormValues): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
  if (
    values.userId !== MOCK_CREDENTIALS.userId ||
    values.password !== MOCK_CREDENTIALS.password
  ) {
    throw new Error("ユーザーIDまたはパスワードが正しくありません");
  }
}

export function LoginForm({
  defaultValues,
  onSubmit,
  redirectTo = "/dashboard",
  className,
}: LoginFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      userId: defaultValues?.userId ?? "",
      password: defaultValues?.password ?? "",
    },
  });

  const userId = watch("userId");
  const password = watch("password");
  const canSubmit = userId.trim().length > 0 && password.length > 0 && !isSubmitting;

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await (onSubmit ?? mockAuthenticate)(values);
      router.push(redirectTo);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "ログインに失敗しました。時間をおいて再度お試しください。";
      setSubmitError(msg);
    }
  });

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="flex-col items-start gap-1 border-b-0 pb-0">
        <CardTitle>ログイン</CardTitle>
        <CardDescription>
          社員番号またはユーザーIDとパスワードを入力してください
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <div>
            <Label htmlFor="login-user-id" required>
              社員番号 / ユーザーID
            </Label>
            <Input
              id="login-user-id"
              type="text"
              autoComplete="username"
              inputMode="text"
              autoFocus
              invalid={!!errors.userId}
              aria-describedby={errors.userId ? "login-user-id-error" : undefined}
              {...register("userId")}
            />
            {errors.userId && (
              <p id="login-user-id-error" className="mt-1.5 text-xs text-danger">
                {errors.userId.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="login-password" required className="mb-0">
                パスワード
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline focus-visible:underline focus-visible:outline-none"
              >
                パスワードを忘れた場合
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              invalid={!!errors.password}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="login-password-error" className="mt-1.5 text-xs text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{submitError}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={!canSubmit}
            className="mt-2 w-full"
          >
            {isSubmitting ? "認証中..." : "ログイン"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
