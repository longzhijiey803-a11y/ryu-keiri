"use client";

import * as React from "react";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "error" | "warning";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
}

interface ToastCtx {
  toast: (t: {
    title: string;
    description?: string;
    variant?: Variant;
  }) => void;
}

const Ctx = React.createContext<ToastCtx | null>(null);

export function useToast(): ToastCtx {
  const c = React.useContext(Ctx);
  if (!c) {
    // Provider 未マウント時も落とさない（no-op）
    return { toast: () => {} };
  }
  return c;
}

const META: Record<
  Variant,
  { icon: typeof Info; cls: string }
> = {
  default: { icon: Info, cls: "text-foreground" },
  success: { icon: CircleCheck, cls: "text-success" },
  error: { icon: CircleX, cls: "text-danger" },
  warning: { icon: TriangleAlert, cls: "text-warning" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const seq = React.useRef(0);

  const remove = React.useCallback((id: number) => {
    setItems((p) => p.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback<ToastCtx["toast"]>(
    ({ title, description, variant = "default" }) => {
      const id = ++seq.current;
      setItems((p) => [...p, { id, title, description, variant }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {items.map((t) => {
          const m = META[t.variant];
          const Icon = m.icon;
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-md border border-border bg-surface p-3 shadow-popover data-[state=open]:animate-overlay-in"
              data-state="open"
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", m.cls)} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {t.title}
                </p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                aria-label="閉じる"
                onClick={() => remove(t.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
