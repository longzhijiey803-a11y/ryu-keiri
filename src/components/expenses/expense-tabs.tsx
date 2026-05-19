import { PageTabs } from "@/components/layout/page-tabs";

export function ExpenseTabs() {
  return (
    <PageTabs
      tabs={[
        { href: "/expenses", label: "概要" },
        { href: "/expenses/claims", label: "経費申請", match: "prefix" },
      ]}
    />
  );
}
