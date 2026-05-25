import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

type Tone =
  | "default"
  | "primary"
  | "warning"
  | "danger"
  | "indigo"
  | "emerald"
  | "amber"
  | "rose";

const ICON_TONE: Record<Tone, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  indigo: "bg-accent-indigo/15 text-accent-indigo",
  emerald: "bg-accent-emerald/15 text-accent-emerald",
  amber: "bg-accent-amber/15 text-accent-amber",
  rose: "bg-accent-rose/15 text-accent-rose",
};

/** 16案：vivid モードでカード自体に色を敷く。 */
const VIVID_BG: Record<Tone, string> = {
  default: "bg-zinc-700",
  primary: "bg-primary",
  warning: "bg-warning",
  danger: "bg-danger",
  indigo: "bg-accent-indigo",
  emerald: "bg-accent-emerald",
  amber: "bg-accent-amber",
  rose: "bg-accent-rose",
};

export interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  tone?: Tone;
  /** 16案：カード全体を塗る派手モード。 */
  vivid?: boolean;
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
  vivid = false,
  delta,
  href,
}: KpiCardProps) {
  const up = delta ? delta.pct >= 0 : false;
  const good =
    delta?.goodWhenUp === undefined ? null : up === delta.goodWhenUp;
  const deltaColorPlain =
    good === null ? "text-muted-foreground" : good ? "text-success" : "text-danger";

  const inner = vivid ? (
    <div
      className={cn(
        "h-full rounded-lg p-5 text-white shadow-card transition-transform",
        VIVID_BG[tone],
        href && "hover:-translate-y-0.5 hover:shadow-popover",
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-white/85">
          {label}
        </p>
        <span className="flex size-8 items-center justify-center rounded-md bg-white/15">
          <Icon className="size-4 text-white" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tabular tracking-tight">{value}</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-white/85">
        {delta && (
          <span className="inline-flex items-center gap-0.5 font-medium tabular">
            {up ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(delta.pct)}%
          </span>
        )}
        {sub && <span className="truncate">{sub}</span>}
      </div>
    </div>
  ) : (
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
              deltaColorPlain,
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
