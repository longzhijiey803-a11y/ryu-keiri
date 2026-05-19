import { PageTabs } from "@/components/layout/page-tabs";

export function CashTabs() {
  return (
    <PageTabs
      tabs={[
        { href: "/cash", label: "銀行口座" },
        { href: "/bank-transactions", label: "入出金明細" },
        { href: "/reconciliation", label: "消込" },
      ]}
    />
  );
}
