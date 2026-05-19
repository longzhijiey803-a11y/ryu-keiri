import { PageTabs } from "@/components/layout/page-tabs";

export function ArApTabs() {
  return (
    <PageTabs
      tabs={[
        { href: "/receivables", label: "売掛管理" },
        { href: "/payables", label: "買掛管理" },
      ]}
    />
  );
}
