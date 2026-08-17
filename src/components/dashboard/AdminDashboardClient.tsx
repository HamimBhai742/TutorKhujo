/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  FileCheck,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  UserCheck,
  Clock,
} from "lucide-react";
import { TakaIcon } from "@/components/shared/TakaIcon";
import { TutorVerification, AdminTuitionPost } from "@/data/adminDashboard";
import { ROUTES } from "@/constants/routes";
import api from "@/lib/api";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    pendingVerifications: 0,
    totalTuitions: 0,
    activeTuitions: 0,
    totalRevenue: 0,
  });
  const [verifications, setVerifications] = useState<TutorVerification[]>([]);
  const [tuitions, setTuitions] = useState<AdminTuitionPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, verificationsRes, tuitionsRes] = await Promise.all([
          api.get("/user/admin-stats"),
          api.get("/user/verifications"),
          api.get("/tuitions?limit=3"),
        ]);
        
        setStats(statsRes.data.data);
        
        // Filter pending verifications
        setVerifications(
          verificationsRes.data.data.filter((v: any) => v.status === "Pending")
        );
        
        // Map tuition posts
        const mappedTuitions = tuitionsRes.data.data.map((p: any) => ({
          id: p.id,
          studentName: p.student?.name || "N/A",
          classLevel: p.classLevel,
          subjects: p.subjects,
          budget: p.budget,
          mode: p.mode,
          frequency: p.frequency,
          location: p.location,
          status: p.status,
          createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "N/A",
        }));
        setTuitions(mappedTuitions);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    try {
      await api.patch(`/user/${id}/verify`, { status: "Approved" });
      setVerifications((prev) => prev.filter((v) => v.id !== id));
      setStats((prev: any) => ({
        ...prev,
        pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
        totalTutors: prev.totalTutors + 1 // if verified they count as active verified tutor
      }));
      alert(`Success! Tutor ${name} has been verified successfully.`);
    } catch (err: any) {
      console.error("Error verifying tutor:", err);
      alert(err.response?.data?.message || "Failed to approve verification request.");
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await api.patch(`/user/${id}/verify`, { status: "Rejected" });
      setVerifications((prev) => prev.filter((v) => v.id !== id));
      setStats((prev: any) => ({
        ...prev,
        pendingVerifications: Math.max(0, prev.pendingVerifications - 1)
      }));
      alert(`Tutor ${name}'s verification request was rejected.`);
    } catch (err: any) {
      console.error("Error rejecting tutor:", err);
      alert(err.response?.data?.message || "Failed to reject verification request.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Title Header Skeleton */}
        <div>
          <div className="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-md w-48 animate-pulse" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-96 mt-2 animate-pulse" />
        </div>

        {/* KPI Stats Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-850 dark:bg-zinc-900 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded-md w-24" />
                <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-8 bg-zinc-300 dark:bg-zinc-700 rounded-md w-16" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Verifications Panel Skeleton */}
          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-850 dark:bg-zinc-900 animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-zinc-350 dark:bg-zinc-750 rounded-md w-48" />
              <div className="h-4 bg-zinc-250 dark:bg-zinc-800 rounded-md w-16" />
            </div>
            <div className="space-y-4 divide-y divide-zinc-100 dark:divide-zinc-800">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="pt-4 first:pt-0 flex justify-between items-center">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded-md w-1/3" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2" />
                    <div className="flex gap-1.5 mt-2">
                      <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-12" />
                      <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-20 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-20 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tuition Posts Panel Skeleton */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-850 dark:bg-zinc-900 animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-zinc-350 dark:bg-zinc-750 rounded-md w-32" />
              <div className="h-4 bg-zinc-250 dark:bg-zinc-800 rounded-md w-16" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-12" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-12" />
                  </div>
                  <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded-md w-2/3" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2" />
                  <div className="flex justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800/50">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {stats.totalUsers}
            </span>
            <div className="mt-2 text-xs font-bold text-zinc-400 flex gap-2">
              <span>{stats.totalTutors} Tutors</span>
              <span>•</span>
              <span>{stats.totalStudents} Students</span>
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
              {stats.pendingVerifications}
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
              {stats.totalTuitions}
            </span>
            <div className="mt-2 text-xs font-bold text-zinc-400">
              {stats.activeTuitions} Active Listings
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
              <TakaIcon size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              ৳ {stats.totalRevenue.toLocaleString()}
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
