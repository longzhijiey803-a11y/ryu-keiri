import * as React from "react";

import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger";

const TONE: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 */
  value: number;
  tone?: Tone;
}

export function Progress({
  value,
  tone = "primary",
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-all", TONE[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
