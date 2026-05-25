import { redirect } from "next/navigation";

/** ルートはダッシュボードへ統合（ホームの機能はダッシュボードへ移管済み）。 */
export default function RootPage() {
  redirect("/dashboard");
}
