import { Suspense } from "react";

import { ReconciliationClient } from "@/components/cash/reconciliation-client";

// useSearchParams を含むためビルド時の静的書き出しを避ける
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReconciliationClient />
    </Suspense>
  );
}
