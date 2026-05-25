import { CalendarX2 } from "lucide-react";

import { EmptyState, StatusBadge } from "@/components/ui";
import { formatJPY } from "@/lib/utils";
import type { ScheduleRow } from "@/lib/dashboard-data";

/**
 * 支払予定 / 入金予定の軽量リスト（ダッシュボード用）。
 * - `table-fixed` + `colgroup` で列幅を比率固定 → ヘッダと本文が縦方向に厳密に揃う
 * - 縦スクロール時の列ズレを `scrollbar-gutter: stable` で防止
 * - sticky thead は border-collapse の罫線消え対策として box-shadow で線を表現
 */
export function ScheduleList({
  rows,
  emptyTitle,
}: {
  rows: ScheduleRow[];
  emptyTitle: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="px-5 py-6">
        <EmptyState icon={CalendarX2} title={emptyTitle} compact />
      </div>
    );
  }

  return (
    <div
      className="max-h-[360px] w-full overflow-y-auto overflow-x-hidden"
      style={{ scrollbarGutter: "stable" }}
    >
      <table className="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-[280px]" />
          <col className="w-[120px]" />
          <col className="w-[140px]" />
          <col className="w-[140px]" />
          <col /> {/* 右側の余白を吸収するフィラー列：行/罫線/hover を全幅で揃える */}
        </colgroup>

        <thead className="sticky top-0 z-10 bg-surface shadow-[inset_0_-1px_0_rgb(var(--border))]">
          <tr className="text-xs text-muted-foreground">
            <th className="px-5 py-3 text-left font-medium">取引先</th>
            <th className="px-3 py-3 text-left font-medium">期日</th>
            <th className="px-3 py-3 text-left font-medium">金額</th>
            <th className="px-3 py-3 text-left font-medium">状態</th>
            <th aria-hidden />
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => {
            const isLast = i === rows.length - 1;
            const border = isLast ? "" : "border-b border-border";
            return (
              <tr
                key={r.id}
                className="transition-colors hover:bg-muted/50"
              >
                <td
                  className={`${border} truncate px-5 py-3.5 text-foreground`}
                  title={r.partner}
                >
                  {r.partner}
                </td>
                <td
                  className={`${border} whitespace-nowrap px-3 py-3.5 tabular text-xs text-muted-foreground`}
                >
                  {r.dueDate}
                </td>
                <td
                  className={`${border} whitespace-nowrap px-3 py-3.5 tabular font-medium text-foreground`}
                >
                  {formatJPY(r.amount)}
                </td>
                <td className={`${border} px-3 py-3.5`}>
                  <StatusBadge status={r.status} />
                </td>
                <td className={`${border} px-5 py-3.5`} aria-hidden />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
