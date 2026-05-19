import { CalendarX2 } from "lucide-react";

import { EmptyState, StatusBadge } from "@/components/ui";
import { formatJPY } from "@/lib/utils";
import type { ScheduleRow } from "@/lib/dashboard-data";

/** 支払予定 / 入金予定の軽量リスト（ダッシュボード用・DataTableより簡素）。 */
export function ScheduleList({
  rows,
  emptyTitle,
}: {
  rows: ScheduleRow[];
  emptyTitle: string;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState icon={CalendarX2} title={emptyTitle} compact />
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-xs text-muted-foreground">
          <th className="px-5 py-2 text-left font-medium">取引先</th>
          <th className="px-3 py-2 text-left font-medium">期日</th>
          <th className="px-3 py-2 text-right font-medium">金額</th>
          <th className="px-5 py-2 text-right font-medium">状態</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.id}
            className="border-b border-border last:border-0 hover:bg-muted/40"
          >
            <td className="max-w-[180px] truncate px-5 py-3 text-foreground">
              {r.partner}
            </td>
            <td className="px-3 py-3 tabular text-muted-foreground">
              {r.dueDate}
            </td>
            <td className="px-3 py-3 text-right tabular font-medium text-foreground">
              {formatJPY(r.amount)}
            </td>
            <td className="px-5 py-3 text-right">
              <StatusBadge status={r.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
