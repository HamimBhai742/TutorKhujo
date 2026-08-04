import React, { Suspense } from "react";
import TutorDashboardClient from "@/components/dashboard/TutorDashboardClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-550 dark:text-zinc-400 font-semibold animate-pulse">Loading dashboard overview...</div>}>
      <TutorDashboardClient />
    </Suspense>
  );
}
