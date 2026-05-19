import { AppShell } from "@/components/layout/app-shell";
import { ToastProvider } from "@/components/ui";

/** ログイン後の全画面共通レイアウト（骨格）。 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
