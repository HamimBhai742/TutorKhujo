import React, { Suspense } from "react";
import TuitionsClient from "@/components/tuitions/TuitionsClient";

export const metadata = {
  title: "Browse Tuition Jobs | TutorKhujo",
  description: "Search and apply for active home and online tuition jobs posted by students and parents in Dhaka.",
};

export default function TuitionJobsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-sm font-semibold animate-pulse text-zinc-450 dark:text-zinc-555">Loading tuition jobs...</div>}>
      <TuitionsClient />
    </Suspense>
  );
}
