"use client";

import * as React from "react";
import { Landmark, RefreshCw, Upload } from "lucide-react";

import { Button, Card, EditableStatus, useToast } from "@/components/ui";
import {
  UNIMPLEMENTED_TITLE,
  UnimplementedBadge,
} from "@/components/ui/unimplemented-badge";
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
import { SyncBankButton } from "./sync-bank-button";

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
            <Button variant="outline" disabled title={UNIMPLEMENTED_TITLE}>
              <Upload /> CSVインポート <UnimplementedBadge />
            </Button>
            <SyncBankButton
              accounts={accounts}
              onSynced={(updated) => setAccounts(updated)}
              variant="primary"
            />
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
            <tr className="border-b border-white/15 bg-accent-emerald text-xs text-white">
              <th className="px-4 py-2.5 text-left font-semibold">口座名</th>
              <th className="px-3 py-2.5 text-left font-semibold">金融機関</th>
              <th className="px-3 py-2.5 text-left font-semibold">支店</th>
              <th className="px-3 py-2.5 text-left font-semibold">種別</th>
              <th className="px-3 py-2.5 text-left font-semibold">口座番号</th>
              <th className="px-3 py-2.5 text-right font-semibold">残高</th>
              <th className="px-3 py-2.5 text-left font-semibold">最終同期</th>
              <th className="px-3 py-2.5 text-left font-semibold">状態</th>
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
                    title={UNIMPLEMENTED_TITLE}
                  >
                    <RefreshCw /> 同期 <UnimplementedBadge />
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
