"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import TutorDashboardClient from "@/components/dashboard/TutorDashboardClient";
import StudentDashboardClient from "@/components/dashboard/StudentDashboardClient";
import AdminDashboardClient from "@/components/dashboard/AdminDashboardClient";

export default function DashboardPageClient() {
  const { user } = useAuth();

  if (user?.role === "tutor") {
    return <TutorDashboardClient />;
  }

  if (user?.role === "admin") {
    return <AdminDashboardClient />;
  }

  return <StudentDashboardClient />;
}
