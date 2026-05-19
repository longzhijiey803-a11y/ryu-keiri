import { Circle, CircleCheck, CircleDot } from "lucide-react";

import { Progress } from "@/components/ui";
import { closing } from "@/lib/dashboard-data";

const STEP = {
  done: { icon: CircleCheck, cls: "text-success", label: "完了" },
  in_progress: { icon: CircleDot, cls: "text-warning", label: "進行中" },
  todo: { icon: Circle, cls: "text-muted-foreground/50", label: "未着手" },
} as const;

export function ClosingProgress() {
  return (
    <div className="px-5 py-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{closing.period} の締め</p>
          <p className="mt-1 text-2xl font-bold tabular text-foreground">
            {closing.progress}%
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          残り {closing.steps.filter((s) => s.state !== "done").length} 工程
        </p>
      </div>
      <Progress
        value={closing.progress}
        tone={closing.progress >= 100 ? "success" : "primary"}
        className="mt-3"
      />
      <ul className="mt-4 space-y-2.5">
        {closing.steps.map((s) => {
          const meta = STEP[s.state];
          const Icon = meta.icon;
          return (
            <li key={s.label} className="flex items-center gap-2.5">
              <Icon className={`size-4 shrink-0 ${meta.cls}`} />
              <span
                className={
                  s.state === "done"
                    ? "text-sm text-muted-foreground line-through"
                    : "text-sm text-foreground"
                }
              >
                {s.label}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
