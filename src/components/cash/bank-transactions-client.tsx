"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui";
import { PageHeader } from "@/components/layout/page-header";
import { BANK_TXNS, filterBankTxns } from "@/lib/bank-data";
import type { BankTxnFilter } from "@/lib/types/bank";
import { CashTabs } from "./cash-tabs";
import { BankTxnFilterBar } from "./bank-txn-filter-bar";
import { BankTxnTable } from "./bank-txn-table";

const DEFAULT_FILTER: BankTxnFilter = {
  query: "",
  account_id: "all",
  recon_status: "all",
  dir: "all",
};

export function BankTransactionsClient() {
  const [filter, setFilter] = React.useState<BankTxnFilter>(DEFAULT_FILTER);
  const filtered = React.useMemo(
    () => filterBankTxns(BANK_TXNS, filter),
    [filter],
  );

  return (
    <>
      <PageHeader
        title="入出金管理"
        description="銀行明細を取り込み、請求書・取引と照合（消込）します。"
        actions={
          <Button variant="outline" disabled title="CSV取込は今後実装">
            <Upload /> CSVインポート
          </Button>
        }
      />
      <CashTabs />

      <BankTxnFilterBar
        filter={filter}
        onChange={setFilter}
        resultCount={filtered.length}
        total={BANK_TXNS.length}
      />

      <BankTxnTable data={filtered} />
    </>
  );
}
