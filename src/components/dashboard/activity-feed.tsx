import { Inbox } from "lucide-react";

import { Avatar, EmptyState } from "@/components/ui";
import { activities } from "@/lib/dashboard-data";

export function ActivityFeed() {
  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="アクティビティはまだありません"
        description="仕訳・承認・消込などの操作がここに表示されます。"
        compact
      />
    );
  }

  return (
    <ul className="px-5 py-2">
      {activities.map((a, i) => (
        <li key={a.id} className="flex gap-3 py-3">
          <div className="flex flex-col items-center">
            <Avatar name={a.user} size="sm" />
            {i < activities.length - 1 && (
              <span className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-sm text-foreground">
              <span className="font-medium">{a.user}</span> が {a.action}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
