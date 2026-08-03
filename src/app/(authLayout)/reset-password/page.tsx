import React, { Suspense } from "react";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F5B47]" />
      </div>
    }>
      <ResetPasswordClient />
    </Suspense>
  );
}
