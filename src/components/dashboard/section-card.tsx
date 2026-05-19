import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

/** ダッシュボードの汎用カード（見出し＋任意のリンク＋本文）。 */
export function SectionCard({
  title,
  description,
  href,
  hrefLabel = "すべて表示",
  className,
  bodyClassName,
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-md font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-primary hover:underline"
          >
            {hrefLabel}
            <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </Card>
  );
}
