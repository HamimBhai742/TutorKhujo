"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import TutorDashboardClient from "@/components/dashboard/TutorDashboardClient";
import StudentDashboardClient from "@/components/dashboard/StudentDashboardClient";

export default function DashboardPageClient() {
  const { user } = useAuth();

  if (user?.role === "tutor") {
    return <TutorDashboardClient />;
  }

  return <StudentDashboardClient />;
}
