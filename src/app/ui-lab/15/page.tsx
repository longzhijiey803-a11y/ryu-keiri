import { grossProfit, kpis, payments, prevGrossProfit, receipts } from "@/lib/dashboard-data";
import { Delta, VariantShell, fmt } from "../_shared";

export default function Page() {
  return (
    <VariantShell n="15" title="スプレッドシート風" sub="罫線が主役。台帳らしいトーン">
      <section className="overflow-hidden rounded border border-zinc-300 bg-white text-zinc-900">
        <div className="border-b border-zinc-300 bg-zinc-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">経営サマリ — 2026年5月</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-xs text-zinc-500">
            <tr>
              <th className="border-b border-zinc-300 px-3 py-2 text-left font-medium">項目</th>
              <th className="border-b border-l border-zinc-300 px-3 py-2 text-right font-medium">今月</th>
              <th className="border-b border-l border-zinc-300 px-3 py-2 text-right font-medium">前月</th>
              <th className="border-b border-l border-zinc-300 px-3 py-2 text-right font-medium">前月比</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "現預金残高", c: kpis.cashBalance, p: kpis.cashPrevMonthEnd, good: true },
              { label: "売上", c: kpis.monthSales, p: kpis.prevMonthSales, good: true },
              { label: "経費", c: kpis.monthExpenses, p: kpis.prevMonthExpenses, good: false },
              { label: "利益（売上−経費）", c: grossProfit, p: prevGrossProfit, good: true },
            ].map((r) => {
              const pct = r.p === 0 ? 0 : Math.round(((r.c - r.p) / r.p) * 1000) / 10;
              return (
                <tr key={r.label} className="even:bg-zinc-50/60">
                  <td className="border-b border-zinc-200 px-3 py-2">{r.label}</td>
                  <td className="border-b border-l border-zinc-200 px-3 py-2 text-right tabular font-medium">{fmt(r.c)}</td>
                  <td className="border-b border-l border-zinc-200 px-3 py-2 text-right tabular text-zinc-500">{fmt(r.p)}</td>
                  <td className="border-b border-l border-zinc-200 px-3 py-2 text-right">
                    <Delta pct={pct} goodWhenUp={r.good} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Ledger title="近日支払予定" rows={payments} />
        <Ledger title="近日入金予定" rows={receipts} />
      </section>
    </VariantShell>
  );
}

function Ledger({
  title,
  rows,
}: {
  title: string;
  rows: { id: string; partner: string; dueDate: string; amount: number }[];
}) {
  const total = rows.reduce((s, r) => s + r.amount, 0);
  return (
    <div className="overflow-hidden rounded border border-zinc-300 bg-white text-zinc-900">
      <div className="border-b border-zinc-300 bg-zinc-50 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-zinc-50 text-xs text-zinc-500">
          <tr>
            <th className="border-b border-zinc-300 px-3 py-2 text-left font-medium">期日</th>
            <th className="border-b border-l border-zinc-300 px-3 py-2 text-left font-medium">取引先</th>
            <th className="border-b border-l border-zinc-300 px-3 py-2 text-right font-medium">金額</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="even:bg-zinc-50/60">
              <td className="border-b border-zinc-200 px-3 py-2 tabular">{r.dueDate}</td>
              <td className="border-b border-l border-zinc-200 px-3 py-2">{r.partner}</td>
              <td className="border-b border-l border-zinc-200 px-3 py-2 text-right tabular">{fmt(r.amount)}</td>
            </tr>
          ))}
          <tr className="bg-zinc-100 font-semibold">
            <td className="px-3 py-2" colSpan={2}>合計</td>
            <td className="border-l border-zinc-200 px-3 py-2 text-right tabular">{fmt(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
