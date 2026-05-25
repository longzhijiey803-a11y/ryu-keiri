import Link from "next/link";

import { cn } from "@/lib/utils";
import { KanbanPreview } from "./_kanban";

export function VariantShell({
  n,
  title,
  sub,
  children,
}: {
  n: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  const TOTAL = 20;
  const cur = parseInt(n, 10);
  const prev = String(((cur - 2 + TOTAL) % TOTAL) + 1).padStart(2, "0");
  const next = String((cur % TOTAL) + 1).padStart(2, "0");
  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            案 {n}
          </p>
          <h1 className="mt-0.5 text-xl font-bold text-foreground">{title}</h1>
          {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Link
            href={`/ui-lab/${prev}`}
            className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="前の案"
          >
            ‹
          </Link>
          <Link
            href={`/ui-lab/${next}`}
            className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="次の案"
          >
            ›
          </Link>
        </div>
      </div>
      {children}
      <KanbanPreview />
    </div>
  );
}

/** 軽量な金額表示。コンパクトモードでは万単位に丸める。 */
export function fmt(n: number, opts?: { compact?: boolean }): string {
  if (opts?.compact) {
    if (n >= 100_000_000) return `¥${(n / 100_000_000).toFixed(1)}億`;
    if (n >= 10_000) return `¥${Math.round(n / 10_000).toLocaleString()}万`;
    return `¥${n.toLocaleString()}`;
  }
  return `¥${n.toLocaleString()}`;
}

/** 差分（%）の見た目を統一 */
export function Delta({
  pct,
  goodWhenUp = true,
  className,
}: {
  pct: number;
  goodWhenUp?: boolean;
  className?: string;
}) {
  const up = pct >= 0;
  const good = goodWhenUp ? up : !up;
  return (
    <span
      className={cn(
        "tabular text-xs font-medium",
        good ? "text-success" : "text-danger",
        className,
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}
