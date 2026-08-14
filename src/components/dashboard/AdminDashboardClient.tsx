"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  FileCheck,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  XCircle,
  UserCheck,
  Clock,
  ExternalLink
} from "lucide-react";
import {
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_VERIFICATIONS,
  MOCK_ADMIN_TUITION_POSTS,
  MOCK_ADMIN_TRANSACTIONS,
  TutorVerification,
  AdminTuitionPost
} from "@/data/adminDashboard";
import { ROUTES } from "@/constants/routes";

export default function AdminDashboardClient() {
  const [verifications, setVerifications] = useState<TutorVerification[]>(
    MOCK_ADMIN_VERIFICATIONS.filter((v) => v.status === "Pending")
  );
  const [tuitions, setTuitions] = useState<AdminTuitionPost[]>(
    MOCK_ADMIN_TUITION_POSTS.slice(0, 3)
  );

  const totalUsers = MOCK_ADMIN_USERS.length;
  const totalTutors = MOCK_ADMIN_USERS.filter((u) => u.role === "tutor").length;
  const totalStudents = MOCK_ADMIN_USERS.filter((u) => u.role === "student").length;
  const totalRevenue = MOCK_ADMIN_TRANSACTIONS
    .filter((tx) => tx.status === "Success" && tx.type === "Invoice Payment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleApprove = (id: string, name: string) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    alert(`Success! Tutor ${name} has been verified successfully.`);
  };

  const handleReject = (id: string, name: string) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    alert(`Tutor ${name}'s verification request was rejected.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            Admin Overview
          </h2>
          <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
            System health, registrations, verifications, and financial logs.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Total Users */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              Total Members
            </span>
            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-[#0F5B47] dark:text-[#188c6e]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              {totalUsers}
            </span>
            <div className="mt-2 text-xs font-bold text-zinc-400 flex gap-2">
              <span>{totalTutors} Tutors</span>
              <span>•</span>
              <span>{totalStudents} Students</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Pending Applications */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              Pending Verifications
            </span>
            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-orange-500">
              <FileCheck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              {verifications.length}
            </span>
            <div className="mt-2 text-xs font-bold text-orange-500 flex items-center gap-1">
              <Clock size={14} />
              <span>Requires review</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Active Tuitions */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              Tuition Listings
            </span>
            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-indigo-500">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              {MOCK_ADMIN_TUITION_POSTS.length}
            </span>
            <div className="mt-2 text-xs font-bold text-zinc-400">
              {MOCK_ADMIN_TUITION_POSTS.filter((p) => p.status === "Active").length} Active Listings
            </div>
          </div>
        </div>

        {/* Stat 4: Revenue Collected */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              Total Invoiced
            </span>
            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-emerald-500">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              ৳ {totalRevenue.toLocaleString()}
            </span>
            <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1">
              <TrendingUp size={14} />
              <span>Platform billing volume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Verifications & Active Tuitions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Verifications Panel */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Pending Tutor Applications ({verifications.length})
              </h3>
              <Link
                href={ROUTES.DASHBOARD.VERIFICATIONS}
                className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {verifications.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
                No pending verifications. All clear!
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {verifications.map((tutor) => (
                  <div key={tutor.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {tutor.tutorName}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {tutor.institution} — {tutor.department} ({tutor.yearOfStudy})
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tutor.subjects.map((subj) => (
                          <span
                            key={subj}
                            className="inline-block rounded-md bg-zinc-50 px-2 py-0.5 text-[10px] font-bold text-zinc-655 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {subj}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        onClick={() => handleApprove(tutor.id, tutor.tutorName)}
                        className="rounded-xl bg-[#0F5B47]/10 hover:bg-[#0F5B47]/20 text-[#0F5B47] dark:bg-[#188c6e]/10 dark:hover:bg-[#188c6e]/20 dark:text-[#188c6e] p-2 text-xs font-bold transition-all flex items-center gap-1"
                        title="Approve Tutor"
                      >
                        <UserCheck size={16} />
                        <span className="hidden sm:inline">Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(tutor.id, tutor.tutorName)}
                        className="rounded-xl bg-red-50 hover:bg-red-100 text-red-655 dark:bg-red-950/20 dark:hover:bg-red-950/30 dark:text-red-400 p-2 text-xs font-bold transition-all flex items-center gap-1"
                        title="Reject Tutor"
                      >
                        <XCircle size={16} />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Tuition Posts Panel */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Recent Tuitions
            </h3>
            <Link
              href={ROUTES.DASHBOARD.TUITIONS}
              className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] hover:underline flex items-center gap-1"
            >
              Manage <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {tuitions.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-zinc-100 p-4 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase">
                    {post.classLevel}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                      post.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : post.status === "Paused"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">
                  {post.studentName}
                </h4>
                <p className="text-xs text-[#0F5B47] dark:text-[#188c6e] font-semibold mt-1">
                  {post.subjects.join(", ")}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-zinc-400 border-t border-zinc-50 dark:border-zinc-800/50 pt-2.5">
                  <span>৳ {post.budget}/mo</span>
                  <span>{post.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
