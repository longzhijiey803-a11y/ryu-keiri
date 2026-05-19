import { PageTabs } from "@/components/layout/page-tabs";

export function WorkflowNav() {
  return (
    <PageTabs
      tabs={[
        { href: "/approvals", label: "承認一覧", match: "prefix" },
        { href: "/workflows", label: "承認ルール設定", match: "prefix" },
      ]}
    />
  );
}
