import { activities, alerts, grossProfit, kpis } from "@/lib/dashboard-data";
import { VariantShell, fmt } from "../_shared";

type Event = {
  id: string;
  time: string;
  tone: "muted" | "primary" | "danger" | "warning";
  title: string;
  sub?: string;
};

const EVENTS: Event[] = [
  { id: "h", time: "09:00", tone: "muted", title: "営業開始", sub: `現預金 ${fmt(kpis.cashBalance)} で本日スタート` },
  ...activities.map<Event>((a) => ({
    id: a.id,
    time: a.time,
    tone: "primary",
    title: a.action,
    sub: a.user,
  })),
  ...alerts.map<Event>((a) => ({
    id: a.id,
    time: a.date,
    tone: a.severity === "danger" ? "danger" : "warning",
    title: a.label,
    sub: a.message,
  })),
  { id: "k", time: "—", tone: "muted", title: "今月サマリ", sub: `売上 ${fmt(kpis.monthSales)} / 経費 ${fmt(kpis.monthExpenses)} / 利益 ${fmt(grossProfit)}` },
];

const TONE: Record<Event["tone"], string> = {
  muted: "border-border bg-muted",
  primary: "border-primary/40 bg-primary/10",
  warning: "border-warning/40 bg-warning/10",
  danger: "border-danger/40 bg-danger/10",
};

export default function Page() {
  return (
    <VariantShell n="12" title="縦タイムライン" sub="今日の出来事をひとつの時系列にまとめる">
      <ol className="relative space-y-4 pl-6">
        <span className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-border" aria-hidden />
        {EVENTS.map((e) => (
          <li key={e.id} className="relative">
            <span className={`absolute -left-[18px] top-1.5 size-3 rounded-full border-2 ${TONE[e.tone]}`} />
            <div className="rounded-md border border-border bg-surface px-4 py-3">
              <div className="flex items-baseline gap-3">
                <span className="tabular text-xs text-muted-foreground">{e.time}</span>
                <p className="text-sm font-medium text-foreground">{e.title}</p>
              </div>
              {e.sub && <p className="mt-0.5 truncate text-xs text-muted-foreground">{e.sub}</p>}
            </div>
          </li>
        ))}
      </ol>
    </VariantShell>
  );
}
