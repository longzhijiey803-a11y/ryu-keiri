"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 右スライドドロワー（今後の中核UI / docs/DESIGN.md §A-8）。
 * ヘッダー/フッター固定・本文スクロール・幅 variant: sm/md/lg/xl（420/520/720/920px）。
 * 編集中の離脱確認は onInteractOutside / onEscapeKeyDown を将来差し込めるよう素通し。
 */
const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

const drawerVariants = cva(
  "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-surface shadow-drawer outline-none data-[state=open]:animate-drawer-in data-[state=closed]:animate-drawer-out",
  {
    variants: {
      size: {
        sm: "sm:max-w-drawer-sm",
        md: "sm:max-w-drawer-md",
        lg: "sm:max-w-drawer-lg",
        xl: "sm:max-w-drawer-xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerVariants> {}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ className, children, size, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[1px]",
        "data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
      )}
    />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(drawerVariants({ size }), className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

function DrawerHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-start justify-between gap-3 border-b border-border px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">{children}</div>
      <DrawerClose
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="閉じる"
      >
        <X className="size-4" />
      </DrawerClose>
    </div>
  );
}

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("truncate text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("mt-0.5 text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;

/** 本文（スクロール領域） */
function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto scrollbar-thin px-6 py-5",
        className,
      )}
      {...props}
    />
  );
}

/** フッター（固定・保存/キャンセル等） */
function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 border-t border-border px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
};
