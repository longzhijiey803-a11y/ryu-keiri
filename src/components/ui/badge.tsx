import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * 汎用バッジ。色は意味のあるステータス系のみ（方針）。
 * 業務ステータス専用ラベルは status-badge.tsx を使う。
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-none",
  {
    variants: {
      variant: {
        neutral: "border-transparent bg-muted text-muted-foreground",
        primary: "border-transparent bg-primary/10 text-primary",
        success: "border-transparent bg-success/10 text-success",
        warning: "border-transparent bg-warning/10 text-warning",
        danger: "border-transparent bg-danger/10 text-danger",
        info: "border-transparent bg-info/10 text-info",
        outline: "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
