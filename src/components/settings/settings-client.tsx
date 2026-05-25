"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Building,
  Calendar,
  ChevronRight,
  FileText,
  Network,
  Percent,
  Plus,
  Receipt,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
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
import { cn } from "@/lib/utils";
import { ACCOUNTS } from "@/lib/journal-data";
import { DEPARTMENTS } from "@/lib/workflow-data";
import { USERS } from "@/lib/transactions-data";
import { ACCOUNT_CATEGORY_LABEL } from "@/lib/types/journal";
import type { AppUser } from "@/lib/types/transaction";

type Sec =
  | "company"
  | "fiscal"
  | "tax"
  | "invoice"
  | "accounts"
  | "departments"
  | "members"
  | "roles"
  | "approval"
  | "notify";

const SECTIONS: { key: Sec; label: string; icon: typeof Building }[] = [
  { key: "company", label: "会社情報", icon: Building },
  { key: "fiscal", label: "会計年度", icon: Calendar },
  { key: "tax", label: "消費税設定", icon: Percent },
  { key: "invoice", label: "インボイス設定", icon: Receipt },
  { key: "accounts", label: "勘定科目設定", icon: FileText },
  { key: "departments", label: "部門設定", icon: Network },
  { key: "members", label: "担当者", icon: UserCog },
  { key: "roles", label: "権限設定", icon: ShieldCheck },
  { key: "approval", label: "承認ルール", icon: Users },
  { key: "notify", label: "通知設定", icon: Bell },
];

interface MemberRow extends AppUser {
  role: string;
  department: string;
}

const DEFAULT_MEMBERS: MemberRow[] = USERS.map((u, i) => ({
  ...u,
  role:
    i === 0
      ? "経理担当者"
      : i === 1
        ? "申請者"
        : i === 2
          ? "経理マネージャー"
          : i === 3
            ? "申請者"
            : "管理者",
  department:
    i === 0
      ? "管理部"
      : i === 1
        ? "営業部"
        : i === 2
          ? "営業部"
          : i === 3
            ? "開発部"
            : "管理部",
}));

const MEMBER_ROLES = [
  "管理者",
  "経理マネージャー",
  "経理担当者",
  "申請者",
  "閲覧（税理士）",
] as const;

const ROLES = [
  { role: "管理者", scope: "全機能・設定" },
  { role: "経理マネージャー", scope: "承認・締め・マスタ" },
  { role: "経理担当者", scope: "起票・消込・レポート閲覧" },
  { role: "申請者", scope: "経費申請のみ" },
  { role: "閲覧（税理士）", scope: "閲覧・エクスポート" },
];

export function SettingsClient() {
  const { toast } = useToast();
  const [sec, setSec] = React.useState<Sec>("company");
  const saved = () =>
    toast({
      title: "保存処理は未実装です",
      description:
        "現在の画面入力は保存されません。バックエンド接続後に有効化します。",
      variant: "warning",
    });

  // 担当者管理（セッション内のデモ。実保存は Supabase 接続後）
  const [members, setMembers] =
    React.useState<MemberRow[]>(DEFAULT_MEMBERS);
  const [newName, setNewName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newRole, setNewRole] = React.useState<(typeof MEMBER_ROLES)[number]>(
    "経理担当者",
  );
  const [newDept, setNewDept] = React.useState<string>(DEPARTMENTS[0]);
  const seqRef = React.useRef(DEFAULT_MEMBERS.length);

  const addMember = () => {
    const name = newName.trim();
    const email = newEmail.trim();
    if (!name) {
      toast({ title: "氏名を入力してください", variant: "error" });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast({ title: "メールアドレスの形式が不正です", variant: "error" });
      return;
    }
    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      toast({ title: "同じメールの担当者が既に存在します", variant: "error" });
      return;
    }
    seqRef.current += 1;
    const m: MemberRow = {
      id: `u${seqRef.current}`,
      name,
      email,
      role: newRole,
      department: newDept,
    };
    setMembers((prev) => [...prev, m]);
    setNewName("");
    setNewEmail("");
    toast({
      title: "担当者を追加しました",
      description: `${m.name}（${m.email}）`,
      variant: "success",
    });
  };

  const removeMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (target) {
      toast({
        title: "担当者を削除しました",
        description: target.name,
        variant: "warning",
      });
    }
  };

  const updateRole = (id: string, role: string) =>
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m)),
    );
  const updateDept = (id: string, department: string) =>
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, department } : m)),
    );

  return (
    <>
      <PageHeader
        title="設定"
        description="会社・会計・税・マスタ・権限・通知の設定。"
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-0.5">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSec(s.key)}
                aria-current={sec === s.key ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors",
                  sec === s.key
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div>
          {sec === "company" && (
            <Card className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>会社名</Label>
                  <Input defaultValue="竜之介ホールディングス株式会社" />
                </div>
                <div>
                  <Label>代表者</Label>
                  <Input defaultValue="竜之介 太郎" />
                </div>
                <div>
                  <Label>所在地</Label>
                  <Input defaultValue="東京都渋谷区〇〇 1-2-3" />
                </div>
                <div>
                  <Label>法人番号</Label>
                  <Input className="tabular" defaultValue="1234567890123" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={saved}>保存</Button>
              </div>
            </Card>
          )}

          {sec === "fiscal" && (
            <Card className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>会計年度 開始月</Label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (m) => (
                          <SelectItem key={m} value={String(m)}>
                            {m}月
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>当期</Label>
                  <Input defaultValue="2026年4月 〜 2027年3月" />
                </div>
                <div>
                  <Label>月次締め日</Label>
                  <Input className="tabular" defaultValue="翌月8営業日" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={saved}>保存</Button>
              </div>
            </Card>
          )}

          {sec === "tax" && (
            <Card className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>課税方式</Label>
                  <Select defaultValue="invoice">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invoice">原則課税</SelectItem>
                      <SelectItem value="simple">簡易課税</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>端数処理</Label>
                  <Select defaultValue="round_down">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_down">切り捨て</SelectItem>
                      <SelectItem value="round">四捨五入</SelectItem>
                      <SelectItem value="round_up">切り上げ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>標準税率 / 軽減税率</Label>
                  <Input defaultValue="10% / 8%" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={saved}>保存</Button>
              </div>
            </Card>
          )}

          {sec === "invoice" && (
            <Card className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>適格請求書発行事業者 登録番号</Label>
                  <Input className="tabular" defaultValue="T1234567890123" />
                </div>
                <div>
                  <Label>インボイス制度対応</Label>
                  <Select defaultValue="on">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">有効</SelectItem>
                      <SelectItem value="off">無効</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                ※ 登録番号の自動照合機能は現在ご利用いただけません。
              </p>
              <div className="mt-5 flex justify-end">
                <Button onClick={saved}>保存</Button>
              </div>
            </Card>
          )}

          {sec === "accounts" && (
            <Card>
              <div className="border-b border-border px-5 py-3 text-sm font-semibold">
                勘定科目（{ACCOUNTS.length} 科目）
              </div>
              <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-accent-rose text-white">
                    <tr className="text-xs font-semibold">
                      <th className="px-5 py-2 text-left">コード</th>
                      <th className="px-3 py-2 text-left">科目名</th>
                      <th className="px-3 py-2 text-left">区分</th>
                      <th className="px-5 py-2 text-left">補助科目</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACCOUNTS.map((a) => (
                      <tr
                        key={a.code}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-5 py-2 tabular text-muted-foreground">
                          {a.code}
                        </td>
                        <td className="px-3 py-2 text-foreground">
                          {a.name}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {ACCOUNT_CATEGORY_LABEL[a.category]}
                        </td>
                        <td className="px-5 py-2 text-muted-foreground">
                          {a.sub_accounts.join("、") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {sec === "departments" && (
            <Card className="p-5">
              <ul className="divide-y divide-border">
                {DEPARTMENTS.map((d) => (
                  <li
                    key={d}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="text-foreground">{d}</span>
                    <span className="text-xs text-muted-foreground">
                      有効
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={saved}>
                  部門を追加
                </Button>
              </div>
            </Card>
          )}

          {sec === "members" && (
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  担当者を追加
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label required htmlFor="member-name">
                      氏名
                    </Label>
                    <Input
                      id="member-name"
                      placeholder="例：山田 太郎"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label required htmlFor="member-email">
                      メール
                    </Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="taro.yamada@example.co.jp"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>権限ロール</Label>
                    <Select
                      value={newRole}
                      onValueChange={(v) =>
                        setNewRole(v as (typeof MEMBER_ROLES)[number])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMBER_ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>所属部門</Label>
                    <Select value={newDept} onValueChange={setNewDept}>
                      <SelectTrigger>
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
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    招待メールは Supabase Auth 接続後に送信します。現在はローカルに追加のみ。
                  </p>
                  <Button onClick={addMember}>
                    <Plus /> 担当者を追加
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <span className="text-sm font-semibold text-foreground">
                    登録済み担当者（{members.length} 名）
                  </span>
                </div>
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/15 bg-accent-rose text-xs font-semibold text-white [&_th]:!font-semibold [&_th]:!text-white">
                        <th className="px-5 py-2.5 text-left font-medium">
                          氏名
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium">
                          メール
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium">
                          ロール
                        </th>
                        <th className="px-3 py-2.5 text-left font-medium">
                          所属部門
                        </th>
                        <th className="px-5 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr
                          key={m.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-5 py-2.5">
                            <div className="flex items-center gap-2">
                              <Avatar name={m.name} size="sm" />
                              <span className="text-foreground">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 tabular text-muted-foreground">
                            {m.email}
                          </td>
                          <td className="px-3 py-2.5">
                            <Select
                              value={m.role}
                              onValueChange={(v) => updateRole(m.id, v)}
                            >
                              <SelectTrigger className="h-8 w-40 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MEMBER_ROLES.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {r}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-3 py-2.5">
                            <Select
                              value={m.department}
                              onValueChange={(v) => updateDept(m.id, v)}
                            >
                              <SelectTrigger className="h-8 w-32 text-sm">
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
                          </td>
                          <td className="px-5 py-2.5 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMember(m.id)}
                              title="この担当者を削除"
                            >
                              <Trash2 className="text-danger" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {sec === "roles" && (
            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/15 bg-accent-rose text-xs font-semibold text-white [&_th]:!font-semibold [&_th]:!text-white">
                    <th className="px-5 py-2.5 text-left font-medium">
                      ロール
                    </th>
                    <th className="px-5 py-2.5 text-left font-medium">
                      権限範囲
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROLES.map((r) => (
                    <tr
                      key={r.role}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-2.5 font-medium text-foreground">
                        {r.role}
                      </td>
                      <td className="px-5 py-2.5 text-muted-foreground">
                        {r.scope}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {sec === "approval" && (
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">
                承認ルール（金額別・部門別・役職別・経理確認・最終承認者）は
                専用画面で設定します。
              </p>
              <Link
                href="/workflows"
                className="mt-3 inline-flex h-input items-center gap-1 rounded-md bg-primary px-4 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                承認ルール設定を開く
                <ChevronRight className="size-4" />
              </Link>
            </Card>
          )}

          {sec === "notify" && (
            <Card className="p-5">
              <ul className="space-y-3">
                {[
                  "承認依頼が来たとき",
                  "差戻し・却下されたとき",
                  "支払期限・入金期日の超過",
                  "月次締めのリマインド",
                ].map((n, i) => (
                  <li
                    key={n}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-foreground">{n}</span>
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      defaultChecked={i < 3}
                    />
                  </li>
                ))}
              </ul>
              <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                ※ 外部通知（メール／Slack 等）への配信は現在ご利用いただけません。
              </p>
              <div className="mt-5 flex justify-end">
                <Button onClick={saved}>保存</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
