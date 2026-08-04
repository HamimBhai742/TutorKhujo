import React, { Suspense } from "react";
import TutorsClient from "@/components/tutors/TutorsClient";

export default function TutorsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-semibold text-zinc-450 dark:text-zinc-555 animate-pulse">Loading tutors list...</div>}>
      <TutorsClient />
    </Suspense>
  );
}
