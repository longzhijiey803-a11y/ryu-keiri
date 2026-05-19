import { PageHeader } from "@/components/layout/page-header";
import { InvoiceTabs } from "@/components/invoices/invoice-tabs";

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title="請求管理"
        description="発行請求書と受領請求書を一元管理します。売掛・買掛、入金・支払と連動します。"
      />
      <InvoiceTabs />
      {children}
    </>
  );
}
