"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

/** 入力: 高さ 40px（§A-5）。invalid でエラー罫線。金額は className に "tabular text-right" を付与。 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-input w-full rounded-md border bg-surface px-3 text-base text-foreground",
          "placeholder:text-muted-foreground/70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
          "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
          invalid
            ? "border-danger focus-visible:ring-danger"
            : "border-border",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "mb-1.5 block text-sm font-medium text-foreground",
      className,
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-0.5 text-danger">*</span>}
  </label>
));
Label.displayName = "Label";

export { Input, Label };
