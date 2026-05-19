import * as React from "react";

import { cn } from "@/lib/utils";

/** 簡易アバター（イニシャル表示）。画像対応は将来必要時に拡張。 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: "sm" | "md";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] ?? "") + (parts[1][0] ?? "");
  return name.slice(0, 2);
}

export function Avatar({
  name,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full bg-primary/10 font-medium text-primary",
        size === "sm" ? "size-7 text-xs" : "size-8 text-sm",
        className,
      )}
      aria-hidden
      {...props}
    >
      {initials(name)}
    </span>
  );
}
