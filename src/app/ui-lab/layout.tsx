import Link from "next/link";

import { cn } from "@/lib/utils";

import { VariantSidebar } from "./_sidebar";

const VARIANTS = Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { n, href: `/ui-lab/${n}` };
});

export const metadata = {
  title: "UI Lab | Ryu Keiri",
};

export default function UiLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <VariantSidebar />
      <div className="ml-sidebar flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex h-topbar shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
          <Link
            href="/ui-lab"
            className="text-sm font-semibold text-foreground hover:text-primary"
          >
            UI Lab
          </Link>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            ダッシュボード 20 案比較
          </span>
          <nav className="ml-auto flex flex-wrap items-center gap-1">
            {VARIANTS.map((v) => (
              <Link
                key={v.n}
                href={v.href}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-md text-xs font-medium tabular text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                )}
              >
                {v.n}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-page py-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
