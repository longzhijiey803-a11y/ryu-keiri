import { PageHeader } from "@/components/layout/page-header";
import { ExpenseTabs } from "@/components/expenses/expense-tabs";

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title="経費精算"
        description="社員が領収書を添付して申請し、上長・経理が承認・精算します。"
      />
      <ExpenseTabs />
      {children}
    </>
  );
}
