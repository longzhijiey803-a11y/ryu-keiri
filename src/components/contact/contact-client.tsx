"use client";

import * as React from "react";
import { LifeBuoy, Mail, MessageSquare, Send } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

type Category = "question" | "bug" | "feature" | "billing" | "other";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "question", label: "使い方の質問" },
  { value: "bug", label: "不具合の報告" },
  { value: "feature", label: "機能の要望" },
  { value: "billing", label: "契約・請求について" },
  { value: "other", label: "その他" },
];

export function ContactClient() {
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [category, setCategory] = React.useState<Category>("question");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  const canSubmit =
    name.trim() !== "" &&
    email.trim() !== "" &&
    subject.trim() !== "" &&
    body.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    toast({
      title: "送信処理は未実装です",
      description:
        "送信機能はバックエンド接続後に有効化します。直接メールでのお問い合わせをご利用ください。",
      variant: "warning",
    });
  };

  return (
    <>
      <PageHeader
        title="お問い合わせ"
        description="ご質問・不具合のご報告・機能のご要望など、お気軽にお寄せください。"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>お問い合わせフォーム</CardTitle>
                <CardDescription>
                  入力内容をもとにサポート担当からメールでご返信いたします。
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-name" required>
                      お名前
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="山田 太郎"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email" required>
                      メールアドレス
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="taro@example.co.jp"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-category">お問い合わせ種別</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as Category)}
                  >
                    <SelectTrigger id="contact-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact-subject" required>
                    件名
                  </Label>
                  <Input
                    id="contact-subject"
                    placeholder="例：仕訳の AI 推測結果について"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact-body" required>
                    お問い合わせ内容
                  </Label>
                  <textarea
                    id="contact-body"
                    rows={8}
                    placeholder="お問い合わせ内容をできるだけ具体的にご記入ください。"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    className="w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button type="submit" disabled={!canSubmit}>
                    <Send /> 送信する
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="size-4 text-primary" />
                  サポート窓口
                </CardTitle>
                <CardDescription>
                  メール・チャットでもお問い合わせいただけます。
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    メールサポート
                  </p>
                  <a
                    href="mailto:support@example.co.jp"
                    className="text-sm text-primary hover:underline"
                  >
                    support@example.co.jp
                  </a>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    平日 9:00 〜 18:00 / 1〜2 営業日以内に返信
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <MessageSquare className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    チャットサポート
                  </p>
                  <p className="text-sm text-muted-foreground">
                    画面右下のチャットアイコンからご利用ください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>お問い合わせ前に</CardTitle>
                <CardDescription>
                  下記もあわせてご確認ください。
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>・操作方法はクイックスタートガイドにまとまっています。</li>
                <li>・通信エラー時はブラウザ再読み込みをお試しください。</li>
                <li>・請求関連は登録メールアドレスからご連絡ください。</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
