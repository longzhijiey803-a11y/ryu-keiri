"use client";

import * as React from "react";
import {
  Building2,
  CalendarClock,
  KeyRound,
  Mail,
  Network,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  Avatar,
  Button,
  Card,
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
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CURRENT_USER, CURRENT_USER_ID } from "@/lib/current-user";
import { DEPARTMENTS } from "@/lib/workflow-data";
import { AUDIT_LOGS } from "@/lib/audit-data";
import { AUDIT_ACTION_LABEL } from "@/lib/types/audit";
import { formatISODateTime } from "@/lib/utils";

const ROLES = [
  "管理者",
  "経理マネージャー",
  "経理担当者",
  "申請者",
  "閲覧（税理士）",
] as const;
type Role = (typeof ROLES)[number];

const ORG = "竜之介ホールディングス";

/** 16案テーマ：アクションごとの色トーン（アクティビティ用）。 */
const ACTION_TONE: Record<string, string> = {
  create: "bg-accent-emerald/15 text-accent-emerald",
  update: "bg-accent-indigo/15 text-accent-indigo",
  delete: "bg-accent-rose/15 text-accent-rose",
  approve: "bg-accent-emerald/15 text-accent-emerald",
  reject: "bg-accent-rose/15 text-accent-rose",
  reconcile: "bg-accent-amber/15 text-accent-amber",
  export: "bg-accent-fuchsia/15 text-accent-fuchsia",
  login: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300",
};

function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-md font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

export function ProfileClient() {
  const { toast } = useToast();

  // 編集可能なローカル状態（Supabase 接続前のデモ。保存は toast のみ）
  const [name, setName] = React.useState(CURRENT_USER.name);
  const [email, setEmail] = React.useState(CURRENT_USER.email);
  const [department, setDepartment] = React.useState<string>(DEPARTMENTS[0]);
  const [role, setRole] = React.useState<Role>("経理担当者");

  const dirty =
    name !== CURRENT_USER.name ||
    email !== CURRENT_USER.email ||
    department !== DEPARTMENTS[0] ||
    role !== "経理担当者";

  const onSave = () => {
    if (!name.trim()) {
      toast({ title: "氏名を入力してください", variant: "error" });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast({ title: "メールアドレスの形式が不正です", variant: "error" });
      return;
    }
    toast({
      title: "プロフィールを保存しました",
      description:
        "（デモ表示。バックエンド接続後に永続化されます）",
      variant: "success",
    });
  };

  const onReset = () => {
    setName(CURRENT_USER.name);
    setEmail(CURRENT_USER.email);
    setDepartment(DEPARTMENTS[0]);
    setRole("経理担当者");
  };

  // 自分のアクティビティ
  const myActivities = React.useMemo(
    () => AUDIT_LOGS.filter((l) => l.user.id === CURRENT_USER_ID).slice(0, 8),
    [],
  );

  return (
    <>
      <PageHeader
        title="プロフィール"
        description="アカウント情報・所属・表示設定の確認と編集ができます。"
        actions={
          <>
            <Button variant="ghost" onClick={onReset} disabled={!dirty}>
              元に戻す
            </Button>
            <Button onClick={onSave} disabled={!dirty}>
              <Save /> 保存
            </Button>
          </>
        }
      />

      {/* アイデンティティ（ヒーロー） */}
      <Card className="mb-6 overflow-hidden">
        <div className="flex items-center gap-5 bg-gradient-to-r from-accent-indigo/15 via-accent-fuchsia/10 to-accent-rose/15 px-6 py-5">
          <Avatar name={name || CURRENT_USER.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-bold text-foreground">
              {name || CURRENT_USER.name}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {role} ・ {department}
            </p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <Building2 className="size-3.5" />
              {ORG}
            </p>
          </div>
          <span className="hidden shrink-0 items-center gap-1 rounded-full bg-accent-indigo/15 px-2.5 py-1 text-xs font-medium text-accent-indigo sm:inline-flex">
            <Sparkles className="size-3.5" />
            ID {CURRENT_USER_ID}
          </span>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左：基本情報 */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="アカウント情報"
            description="氏名・連絡先・所属。Supabase Auth 接続後に永続化されます。"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">氏名</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    placeholder="氏名"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email">メールアドレス</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>所属組織</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={ORG} disabled className="pl-9" />
                </div>
                <p className="text-xs text-muted-foreground">
                  組織は管理者のみ変更可能です。
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-dept">部門</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="profile-dept">
                    <Network className="size-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="profile-role">ロール</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as Role)}
                >
                  <SelectTrigger id="profile-role">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  実権限の変更は管理者が「設定 → 権限設定」から行います。
                </p>
              </div>
            </div>
          </SectionCard>

          {/* セキュリティ */}
          <SectionCard
            title="セキュリティ"
            description="パスワード・二要素認証など。"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-accent-amber/15 text-accent-amber">
                  <KeyRound className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    パスワードを変更
                  </p>
                  <p className="text-xs text-muted-foreground">
                    最終更新: 90日以上前
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    title: "未実装です",
                    description:
                      "Supabase Auth 接続後にパスワード変更フローを有効化します。",
                    variant: "warning",
                  })
                }
              >
                変更する
              </Button>
            </div>
          </SectionCard>
        </div>

        {/* 右：表示設定 + アクティビティ */}
        <div className="space-y-6">
          <SectionCard
            title="表示設定"
            description="テーマや表示密度。ブラウザにのみ保存されます。"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">テーマ</p>
                <p className="text-xs text-muted-foreground">
                  ライト / ダーク を切り替え
                </p>
              </div>
              <ThemeToggle />
            </div>
          </SectionCard>

          <SectionCard
            title="最近のアクティビティ"
            description="自分の監査ログ（直近 8 件）"
          >
            {myActivities.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                記録されたアクティビティはありません。
              </p>
            ) : (
              <ul className="-mx-5 -my-5 divide-y divide-border">
                {myActivities.map((l) => (
                  <li key={l.id} className="flex items-start gap-3 px-5 py-3">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        ACTION_TONE[l.action] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {AUDIT_ACTION_LABEL[l.action].slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">
                          {AUDIT_ACTION_LABEL[l.action]}
                        </span>
                        ：{l.target}
                      </p>
                      {l.detail && (
                        <p className="truncate text-xs text-muted-foreground">
                          {l.detail}
                        </p>
                      )}
                      <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] tabular text-muted-foreground">
                        <CalendarClock className="size-3" />
                        {formatISODateTime(l.at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </>
  );
}
