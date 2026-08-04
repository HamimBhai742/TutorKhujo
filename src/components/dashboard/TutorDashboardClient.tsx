"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  DollarSign,
  Clock,
  MapPin,
  Check,
  X,
  TrendingUp,
  Star,
  Zap,
  Info,
  CalendarDays
} from "lucide-react";
import {
  MOCK_REQUESTS,
  MOCK_ACTIVE_TUITIONS,
  MOCK_PAYOUTS,
  TuitionRequest,
  ActiveTuition,
  Payout
} from "@/data/dashboard";

export default function TutorDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "overview";

  // States to make the dashboard dynamic
  const [requests, setRequests] = useState<TuitionRequest[]>(MOCK_REQUESTS);
  const [activeTuitions, setActiveTuitions] = useState<ActiveTuition[]>(MOCK_ACTIVE_TUITIONS);
  const [payouts] = useState<Payout[]>(MOCK_PAYOUTS);

  // Availability matrix state
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["Morning", "Afternoon", "Evening"];
  const [availability, setAvailability] = useState<Record<string, Record<string, boolean>>>({
    Morning: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    Afternoon: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false },
    Evening: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: true, Sun: true }
  });

  const handleToggleAvailability = (time: string, day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [time]: {
        ...prev[time],
        [day]: !prev[time][day]
      }
    }));
  };

  // Actions
  const handleAcceptRequest = (req: TuitionRequest) => {
    // 1. Update requests list
    setRequests((prev) => prev.filter((r) => r.id !== req.id));

    // 2. Add to active tuitions
    const newActive: ActiveTuition = {
      id: `act-${Date.now()}`,
      studentName: req.studentName,
      subject: req.subject,
      classLevel: req.classLevel,
      location: req.location,
      salary: req.salary,
      mode: req.mode,
      frequency: req.frequency,
      status: "Active",
      progress: "Onboarding completed. Initial session schedule pending.",
      startDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
      nextSession: "First session pending scheduler"
    };
    setActiveTuitions((prev) => [newActive, ...prev]);
    alert(`Success! You have accepted the tuition request from ${req.studentName}. They will be notified via SMS.`);
  };

  const handleDeclineRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    alert("Request declined successfully.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            {currentTab === "overview" && "Dashboard Overview"}
            {currentTab === "requests" && "Tuition Requests"}
            {currentTab === "active" && "Active Tuitions"}
            {currentTab === "earnings" && "Earnings & Payments"}
            {currentTab === "availability" && "Availability Grid"}
          </h2>
          <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
            {currentTab === "overview" && "Manage classes, schedules, and monitor search rankings."}
            {currentTab === "requests" && "Review student matches and accept client requests."}
            {currentTab === "active" && "Track current student courses and session histories."}
            {currentTab === "earnings" && "Review payouts, current balances, and accounting logs."}
            {currentTab === "availability" && "Control your teaching schedule availability."}
          </p>
        </div>
      </div>

      {/* Grid Stats (Renders on Overview, Active, and Earnings Tabs) */}
      {(currentTab === "overview" || currentTab === "active" || currentTab === "earnings") && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1: Active Tuitions */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Active Tuitions
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-[#0F5B47] dark:text-[#188c6e]">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                {activeTuitions.length}
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400">
                Ongoing commitments
              </div>
            </div>
          </div>

          {/* Stat 2: Monthly Earnings */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Monthly Earnings
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-emerald-500">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                ৳ 24,500
              </span>
              <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>+12.5% vs last month</span>
              </div>
            </div>
          </div>

          {/* Stat 3: Hours Taught */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Hours Taught
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-orange-500">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                36 Hours
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400">
                Delivered sessions
              </div>
            </div>
          </div>

          {/* Stat 4: Profile Rating */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Profile views
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-blue-500">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                142
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400 flex items-center gap-0.5">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                <span>4.9 Average rating</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL 1: OVERVIEW --- */}
      {currentTab === "overview" && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left - Today's Schedule checklist */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />
                Today&apos;s Sessions
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F5B47] dark:text-[#188c6e] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                August 04
              </span>
            </div>

            <div className="space-y-4">
              {activeTuitions.map((t) => (
                <div key={t.id} className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-200">
                        Class with {t.studentName}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {t.subject} &bull; {t.classLevel}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 block">
                      5:00 PM
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] text-[9px] font-extrabold uppercase mt-1 inline-block">
                      {t.mode === "Both" ? "In-Person" : t.mode}
                    </span>
                  </div>
                </div>
              ))}
              {activeTuitions.length === 0 && (
                <div className="text-center py-8 text-zinc-400 text-sm font-semibold">
                  No classes scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Right - Pending Requests summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* New requests summary card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                <h3 className="text-base font-black text-zinc-900 dark:text-white">
                  Pending Invites ({requests.length})
                </h3>
                <button
                  onClick={() => router.push("/dashboard?tab=requests")}
                  className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] dark:hover:text-[#1ca682] cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {requests.slice(0, 2).map((req) => (
                  <div key={req.id} className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 p-4 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                          {req.studentName}
                        </h4>
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                          {req.subject} ({req.classLevel})
                        </p>
                      </div>
                      <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e]">
                        ৳ {req.salary.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="px-3 py-1.5 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-xs font-semibold">
                    No new tuition requests.
                  </div>
                )}
              </div>
            </div>

            {/* Fast Response rate card */}
            <div className="bg-[#0F5B47] dark:bg-[#188c6e]/90 text-white rounded-3xl p-6 shadow-xs flex gap-4 items-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-white/5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-350">
                <Zap className="w-32 h-32 stroke-[3px]" />
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="space-y-1 relative z-10">
                <h4 className="text-xs font-black uppercase tracking-wider text-white/70">
                  Search Rank Status
                </h4>
                <p className="text-[11px] font-extrabold text-white/90 leading-relaxed">
                  Your profile has 85% search visibility this week. Complete more active sessions to boost your ranking!
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- PANEL 2: REQUESTS --- */}
      {currentTab === "requests" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req.id} className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">
                      {req.studentName}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-500 text-[9px] font-extrabold uppercase">
                      New Matches
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      {req.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                      {req.subject}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {req.frequency} &bull; {req.mode}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-555 block uppercase font-bold tracking-wider">
                      Offered Salary
                    </span>
                    <span className="text-base font-black text-[#0F5B47] dark:text-[#188c6e]">
                      ৳ {req.salary.toLocaleString()}/mo
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                      title="Decline Offer"
                    >
                      <X className="w-4 h-4 stroke-[3px]" />
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-12 text-zinc-400 text-sm font-semibold">
                No pending tuition requests at this time.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PANEL 3: ACTIVE TUITIONS --- */}
      {currentTab === "active" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="space-y-6">
            {activeTuitions.map((t) => (
              <div key={t.id} className="p-6 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col gap-4">
                
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-150/30 dark:border-zinc-900/40">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">
                      {t.studentName}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {t.subject} &bull; {t.classLevel}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] text-[9px] font-extrabold uppercase">
                      {t.status}
                    </span>
                    <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
                      ৳ {t.salary.toLocaleString()}/mo
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      Schedule Details
                    </span>
                    <p className="text-zinc-850 dark:text-zinc-200">
                      {t.frequency} ({t.mode === "Both" ? "Home/Online" : t.mode})
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      Start Date
                    </span>
                    <p className="text-zinc-850 dark:text-zinc-200">
                      {t.startDate}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      Next Session
                    </span>
                    <p className="text-[#0F5B47] dark:text-[#188c6e] font-bold">
                      {t.nextSession}
                    </p>
                  </div>
                </div>

                {/* Class Progress */}
                <div className="bg-blue-50/20 dark:bg-blue-955/5 border border-blue-100/50 dark:border-blue-900/10 p-4 rounded-xl flex gap-3 items-start mt-2">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-800 dark:text-blue-400 uppercase font-bold tracking-wider">
                      Current Course Progress
                    </span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-450 leading-relaxed font-semibold">
                      {t.progress}
                    </p>
                  </div>
                </div>

              </div>
            ))}
            {activeTuitions.length === 0 && (
              <div className="text-center py-12 text-zinc-400 text-sm font-semibold">
                No active tuition classes under tracking.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PANEL 4: EARNINGS & PAYMENTS --- */}
      {currentTab === "earnings" && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left - Earnings Summary */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-900">
              Payout History
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900 text-[10px] font-black text-zinc-400 dark:text-zinc-555 uppercase tracking-wider">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                  {payouts.map((pay) => (
                    <tr key={pay.id} className="border-b border-zinc-100/50 dark:border-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white">
                        {pay.description}
                      </td>
                      <td className="py-4 px-4">{pay.date}</td>
                      <td className="py-4 px-4">{pay.method}</td>
                      <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white">
                        ৳ {pay.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] uppercase">
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right - Payment Setup Settings */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            <div>
              <h3 className="text-base md:text-lg font-black text-zinc-900 dark:text-white mb-2">
                Payout Settings
              </h3>
              <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 leading-relaxed">
                Add or modify bank details and mobile financial services accounts.
              </p>
            </div>

            <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-4 text-xs font-bold">
              <div className="flex justify-between items-center">
                <span className="text-zinc-450 dark:text-zinc-500">Primary Method</span>
                <span className="text-[#0F5B47] dark:text-[#188c6e]">bKash (Personal)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-450 dark:text-zinc-500">Account Number</span>
                <span className="text-zinc-800 dark:text-zinc-200">017XXXXXX42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-450 dark:text-zinc-500">Processing Rate</span>
                <span className="text-zinc-800 dark:text-zinc-200">Instant payout</span>
              </div>
            </div>

            <button className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">
              Modify Details
            </button>
          </div>

        </div>
      )}

      {/* --- PANEL 5: AVAILABILITY SLOTS --- */}
      {currentTab === "availability" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base md:text-lg font-black text-zinc-900 dark:text-white mb-2">
              Teaching Availability Matrix
            </h3>
            <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 leading-relaxed">
              Check or uncheck the slots when you are available for classes. Changes will update on your public profile search criteria.
            </p>
          </div>

          <div className="overflow-x-auto border border-zinc-150/60 dark:border-zinc-900 rounded-2xl">
            <table className="w-full text-center border-collapse min-w-160">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-900 text-xs font-black text-zinc-600 dark:text-zinc-400">
                  <th className="py-4 px-4 text-left font-black w-32 border-r border-zinc-150 dark:border-zinc-900">
                    Slot Time
                  </th>
                  {days.map((day) => (
                    <th key={day} className="py-4 px-2 uppercase font-black">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time) => (
                  <tr key={time} className="border-b border-zinc-150/40 dark:border-zinc-900/40 last:border-b-0 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="py-4 px-4 text-left font-black text-xs text-zinc-800 dark:text-zinc-200 border-r border-zinc-150 dark:border-zinc-900">
                      {time}
                    </td>
                    {days.map((day) => {
                      const checked = availability[time]?.[day] || false;
                      return (
                        <td key={day} className="py-3 px-2">
                          <label className="flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleAvailability(time, day)}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                                checked
                                  ? "border-[#0F5B47] dark:border-[#188c6e] bg-[#0F5B47] dark:bg-[#188c6e] text-white"
                                  : "border-zinc-200 dark:border-zinc-800 hover:border-teal-500/50 dark:bg-zinc-900/30"
                              }`}
                            >
                              {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                            </div>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => alert("Availability preferences saved successfully!")}
              className="px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Schedule Preferences
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
