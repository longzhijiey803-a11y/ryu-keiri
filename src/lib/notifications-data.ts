/**
 * 通知ダミーデータ（API 未接続）。
 * 取引管理を中心に、承認・期限・差戻し等の経理SaaSで頻出するイベントを網羅。
 */
import type { ISODateTime } from "@/lib/types/transaction";

export const NOTIFICATION_KINDS = [
  "approval",
  "rejected",
  "due",
  "overdue",
  "comment",
  "system",
] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  occurred_at: ISODateTime;
  read: boolean;
  /** クリック時の遷移先（未指定なら遷移しない） */
  href?: string;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "N-1",
    kind: "approval",
    title: "承認依頼：5月分 受託開発 請求",
    description:
      "田中 花子 から ¥2,860,000 の取引承認が依頼されました。",
    occurred_at: "2026-05-20T09:42:00+09:00",
    read: false,
    href: "/transactions",
  },
  {
    id: "N-2",
    kind: "due",
    title: "支払期限が近づいています：仕入（原材料）5月",
    description: "北和工業株式会社 ¥712,800 ・ 期限 2026/06/05",
    occurred_at: "2026-05-20T08:00:00+09:00",
    read: false,
    href: "/transactions",
  },
  {
    id: "N-3",
    kind: "rejected",
    title: "差戻し：出張旅費精算 4月",
    description: "山田 部長 から「領収書を添付してください」と差戻されました。",
    occurred_at: "2026-05-19T18:10:00+09:00",
    read: false,
    href: "/expenses",
  },
  {
    id: "N-4",
    kind: "comment",
    title: "コメント：接待交際費（取引先会食）",
    description: "経理 太郎「高額のため詳細を確認させてください。」",
    occurred_at: "2026-05-19T14:32:00+09:00",
    read: true,
    href: "/expenses",
  },
  {
    id: "N-5",
    kind: "overdue",
    title: "支払期限を超過：オフィス賃料 5月",
    description: "オフィス賃貸株式会社 ¥380,000 ・ 期限 2026/05/15",
    occurred_at: "2026-05-19T09:00:00+09:00",
    read: true,
    href: "/invoices/received",
  },
  {
    id: "N-6",
    kind: "system",
    title: "月次締めリマインド",
    description: "5月分の月次締めが 2026/06/08 までに必要です。",
    occurred_at: "2026-05-18T10:00:00+09:00",
    read: true,
    href: "/monthly-close",
  },
  {
    id: "N-7",
    kind: "approval",
    title: "承認依頼：セミナー参加費",
    description: "佐藤 次郎 から ¥33,000 の経費承認が依頼されました。",
    occurred_at: "2026-05-18T19:05:00+09:00",
    read: true,
    href: "/expenses",
  },
];
