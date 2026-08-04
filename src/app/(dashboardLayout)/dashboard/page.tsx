import React, { Suspense } from "react";
import DashboardPageClient from "@/components/dashboard/DashboardPageClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-555 dark:text-zinc-400 font-semibold animate-pulse">Loading dashboard...</div>}>
      <DashboardPageClient />
    </Suspense>
  );
}
