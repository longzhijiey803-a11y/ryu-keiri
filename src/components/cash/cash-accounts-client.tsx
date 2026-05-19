"use client";

import * as React from "react";
import { Landmark, RefreshCw, Upload } from "lucide-react";

import { Button, Card, EditableStatus, useToast } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { formatISODateTime, formatJPY } from "@/lib/utils";
import { BANK_ACCOUNTS } from "@/lib/bank-data";
import {
  ACCOUNT_STATUSES,
  ACCOUNT_STATUS_LABEL,
  ACCOUNT_TYPE_LABEL,
  type AccountStatus,
  type BankAccount,
} from "@/lib/types/bank";
import { CashTabs } from "./cash-tabs";
import { AccountStatusBadge } from "./cash-badges";

export function CashAccountsClient() {
  const { toast } = useToast();
  const [accounts, setAccounts] =
    React.useState<BankAccount[]>(BANK_ACCOUNTS);
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  const handleStatusChange = (id: string, status: AccountStatus) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    toast({
      title: "口座の状態を更新しました",
      description: `${id} → ${ACCOUNT_STATUS_LABEL[status]}`,
      variant: "success",
    });
  };

  return (
    <>
      <PageHeader
        title="入出金管理"
        description="銀行口座・入出金明細を管理し、請求書や取引と照合します。"
        actions={
          <>
            <Button variant="outline" disabled title="CSV取込は今後実装">
              <Upload /> CSVインポート
            </Button>
            <Button variant="outline" disabled title="銀行API連携は今後実装">
              <RefreshCw /> 口座を同期
            </Button>
          </>
        }
      />
      <CashTabs />

      <Card className="mb-4 p-5">
        <p className="text-sm text-muted-foreground">合計残高</p>
        <p className="tabular mt-1 text-2xl font-bold text-foreground">
          {formatJPY(total)}
        </p>
      </Card>

      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60 text-xs text-muted-foreground">
              <th className="px-4 py-2.5 text-left font-medium">口座名</th>
              <th className="px-3 py-2.5 text-left font-medium">金融機関</th>
              <th className="px-3 py-2.5 text-left font-medium">支店</th>
              <th className="px-3 py-2.5 text-left font-medium">種別</th>
              <th className="px-3 py-2.5 text-left font-medium">口座番号</th>
              <th className="px-3 py-2.5 text-right font-medium">残高</th>
              <th className="px-3 py-2.5 text-left font-medium">最終同期</th>
              <th className="px-3 py-2.5 text-left font-medium">状態</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr
                key={a.id}
                className="border-b border-border last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Landmark className="size-4 text-muted-foreground" />
                    {a.name}
                  </span>
                </td>
                <td className="px-3 py-3 text-foreground">{a.bank_name}</td>
                <td className="px-3 py-3 text-muted-foreground">
                  {a.branch}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {ACCOUNT_TYPE_LABEL[a.account_type]}
                </td>
                <td className="px-3 py-3 tabular text-muted-foreground">
                  ****{a.last4}
                </td>
                <td className="px-3 py-3 text-right tabular font-medium">
                  {formatJPY(a.balance)}
                </td>
                <td className="px-3 py-3 tabular text-muted-foreground">
                  {a.last_synced_at
                    ? formatISODateTime(a.last_synced_at)
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  <EditableStatus<AccountStatus>
                    title="状態を変更"
                    current={a.status}
                    onChange={(v) => handleStatusChange(a.id, v)}
                    options={ACCOUNT_STATUSES.map((s) => ({
                      value: s,
                      render: <AccountStatusBadge status={s} />,
                    }))}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    title="銀行API連携は今後実装"
                  >
                    <RefreshCw /> 同期
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
