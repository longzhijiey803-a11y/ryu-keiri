import { PageTabs } from "@/components/layout/page-tabs";

export function InvoiceTabs() {
  return (
    <PageTabs
      tabs={[
        { href: "/invoices", label: "概要" },
        { href: "/invoices/issued", label: "発行請求書", match: "prefix" },
        { href: "/invoices/received", label: "受領請求書", match: "prefix" },
      ]}
    />
  );
}
