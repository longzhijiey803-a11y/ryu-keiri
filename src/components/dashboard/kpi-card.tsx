import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "warning" | "danger";

const ICON_TONE: Record<Tone, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  tone?: Tone;
  /** 前月比などの増減。goodWhenUp で色の意味を決める。 */
  delta?: { pct: number; goodWhenUp?: boolean };
  href?: string;
}

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
  delta,
  href,
}: KpiCardProps) {
  const up = delta ? delta.pct >= 0 : false;
  const good =
    delta?.goodWhenUp === undefined ? null : up === delta.goodWhenUp;
  const deltaColor =
    good === null ? "text-muted-foreground" : good ? "text-success" : "text-danger";

  const inner = (
    <Card
      className={cn(
        "h-full p-5 transition-colors",
        href && "hover:border-primary/40",
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            ICON_TONE[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tabular text-foreground">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium tabular",
              deltaColor,
            )}
          >
            {up ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(delta.pct)}%
          </span>
        )}
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
