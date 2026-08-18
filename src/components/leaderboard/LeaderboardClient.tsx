"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  Star,
  ShieldCheck,
  Zap,
  BookOpen,
  MapPin,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  ChevronRight,
  UserCheck
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Tutor, MOCK_TUTORS, mapDbTutorToFrontend } from "@/data/tutors";
import api from "@/lib/api";

const CATEGORIES = ["All Categories", "Mathematics", "Physics", "Chemistry", "English", "Biology"];

export default function LeaderboardClient() {
  const [realTutors, setRealTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");

  useEffect(() => {
    let active = true;
    api
      .get("/user/tutors")
      .then((res) => {
        if (active && res.data?.data && res.data.data.length > 0) {
          const mapped = res.data.data.map(mapDbTutorToFrontend);
          setRealTutors(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load leaderboard tutors:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const allTutors = useMemo(() => {
    if (realTutors.length > 0) {
      const realIds = new Set(realTutors.map((t) => t.id));
      return [...realTutors, ...MOCK_TUTORS.filter((t) => !realIds.has(t.id))];
    }
    return MOCK_TUTORS;
  }, [realTutors]);

  const filteredRankedTutors = useMemo(() => {
    let list = [...allTutors];
    if (selectedCategory !== "All Categories") {
      list = list.filter((t) =>
        t.subjects.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }
    // Sort by rating desc, then reviews desc, then verified
    list.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
    return list;
  }, [allTutors, selectedCategory]);

  const topThree = filteredRankedTutors.slice(0, 3);
  const remainingRanks = filteredRankedTutors.slice(3);

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-black transition-colors duration-300 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-500/10 via-teal-500/5 to-transparent pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-150/60 dark:border-zinc-900">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-6">
            <Link href="/" className="hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/tutors" className="hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors">
              Tutors
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-800 dark:text-zinc-200">Leaderboard</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Hall of Fame & Top Educators</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
              TutorKhojo <span className="bg-linear-to-r from-amber-500 via-orange-500 to-teal-500 bg-clip-text text-transparent">Educator Leaderboard</span> 👑
            </h1>

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Discover our top-ranked verified tutors across Dhaka. Ranked strictly by student feedback, verified subject expertise, lesson completion rates, and responsiveness.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0F5B47] text-white shadow-md shadow-teal-900/20"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl mt-12 space-y-16">
        {/* Top 3 Podium Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
            ))}
          </div>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500 animate-bounce" />
                <span>Top 3 Champions ({selectedCategory})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <ScrollReveal variant="slide-up" delay={150} className="w-full">
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 text-xs font-black border border-zinc-200 dark:border-zinc-800">
                      🥈 Rank #2
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl ${topThree[1].avatarBg} text-white text-xl font-extrabold flex items-center justify-center shadow-md`}>
                        {topThree[1].initials}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">{topThree[1].name}</h3>
                        <p className="text-xs text-zinc-500 font-semibold">{topThree[1].university}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-4">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{topThree[1].rating.toFixed(1)} Rating</span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-500">{topThree[1].reviewsCount} reviews</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {topThree[1].subjects.slice(0, 3).map((sub, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                          {sub}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/tutors/${topThree[1].id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-[#0F5B47] hover:text-white dark:bg-zinc-900 dark:hover:bg-[#188c6e] text-zinc-800 dark:text-zinc-200 text-xs font-extrabold rounded-xl transition-all"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </ScrollReveal>
              )}

              {/* Rank 1 (Gold / Crown - Highlighted Center) */}
              {topThree[0] && (
                <ScrollReveal variant="slide-up" delay={50} className="w-full md:-translate-y-4">
                  <div className="bg-linear-to-b from-amber-500/15 via-white to-white dark:from-amber-500/10 dark:via-zinc-950 dark:to-zinc-950 border-2 border-amber-400 dark:border-amber-600/60 rounded-3xl p-7 relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
                    <div className="absolute top-0 right-0 left-0 h-1.5 bg-linear-to-r from-amber-400 via-orange-500 to-amber-400" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-md uppercase">
                      👑 Rank #1 • Champion
                    </div>
                    <div className="flex items-center gap-4 mb-5 pt-2">
                      <div className={`w-18 h-18 rounded-2xl ${topThree[0].avatarBg} text-white text-2xl font-black flex items-center justify-center shadow-lg ring-4 ring-amber-400/40`}>
                        {topThree[0].initials}
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Tutor of the Month</span>
                        <h3 className="font-black text-lg text-zinc-900 dark:text-white">{topThree[0].name}</h3>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">{topThree[0].university}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-black text-amber-500 mb-5 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="text-zinc-900 dark:text-white">{topThree[0].rating.toFixed(1)}</span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">100% On-Time Attendance</span>
                    </div>
                    <div className="space-y-1.5 mb-6">
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Specializations:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {topThree[0].subjects.map((sub, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-lg text-xs font-extrabold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/tutors/${topThree[0].id}`}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0F5B47] hover:bg-[#0c4a39] text-white text-xs font-black rounded-xl transition-all shadow-md shadow-teal-900/20 cursor-pointer"
                    >
                      <span>Book Free Demo Class With Rank #1</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </ScrollReveal>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <ScrollReveal variant="slide-up" delay={250} className="w-full">
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-black border border-orange-200 dark:border-orange-900/40">
                      🥉 Rank #3
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl ${topThree[2].avatarBg} text-white text-xl font-extrabold flex items-center justify-center shadow-md`}>
                        {topThree[2].initials}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">{topThree[2].name}</h3>
                        <p className="text-xs text-zinc-500 font-semibold">{topThree[2].university}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-4">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{topThree[2].rating.toFixed(1)} Rating</span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-500">{topThree[2].reviewsCount} reviews</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {topThree[2].subjects.slice(0, 3).map((sub, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                          {sub}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/tutors/${topThree[2].id}`}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-[#0F5B47] hover:text-white dark:bg-zinc-900 dark:hover:bg-[#188c6e] text-zinc-800 dark:text-zinc-200 text-xs font-extrabold rounded-xl transition-all"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </section>
        )}

        {/* Full Leaderboard Table (Ranks 4+) */}
        {remainingRanks.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />
              <span>Full Ranked Directory</span>
            </h2>

            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl overflow-hidden shadow-xs divide-y divide-zinc-150 dark:divide-zinc-850">
              {remainingRanks.map((tutor, idx) => {
                const rankNumber = idx + 4;
                return (
                  <div
                    key={tutor.id}
                    className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-8 text-center text-base font-black text-zinc-400 dark:text-zinc-600">
                        #{rankNumber}
                      </span>
                      <div className={`w-12 h-12 rounded-2xl ${tutor.avatarBg} text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-xs`}>
                        {tutor.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-white truncate">
                            {tutor.name}
                          </h4>
                          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] text-[10px] font-black border border-teal-100 dark:border-teal-900/40">
                            {tutor.badge}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-semibold truncate mt-0.5">
                          {tutor.university} • {tutor.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-850">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-500">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span className="text-zinc-800 dark:text-zinc-200">{tutor.rating.toFixed(1)}</span>
                        <span className="text-zinc-400 font-normal text-[11px]">({tutor.reviewsCount})</span>
                      </div>

                      <div className="hidden lg:block text-right">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 block">Expected Fee</span>
                        <span className="text-xs font-black text-zinc-900 dark:text-white">৳ {tutor.salary.toLocaleString()}/mo</span>
                      </div>

                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-[#0F5B47] hover:text-white dark:bg-zinc-900 dark:hover:bg-[#188c6e] text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* How Leaderboard Works */}
        <section className="bg-linear-to-r from-teal-500/10 via-amber-500/10 to-transparent border border-teal-200/60 dark:border-zinc-800 p-8 md:p-10 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#0F5B47] dark:text-[#188c6e]" />
            <h3 className="text-xl font-black text-zinc-900 dark:text-white">
              How Does Leaderboard Ranking Work?
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5 bg-white/80 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800">
              <span className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider block">01. Rating</span>
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">Student Review Score</h4>
              <p className="text-xs text-zinc-500">Verified feedback and continuous 5-star ratings from parents and students.</p>
            </div>
            <div className="space-y-1.5 bg-white/80 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">02. Responsiveness</span>
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">Quick Chat & Acceptance</h4>
              <p className="text-xs text-zinc-500">Tutors who answer matched tuition inquiries in under 1 hour.</p>
            </div>
            <div className="space-y-1.5 bg-white/80 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800">
              <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider block">03. Verification</span>
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">NID & Academic Checks</h4>
              <p className="text-xs text-zinc-500">Full identity and institutional ID verification approved by our team.</p>
            </div>
            <div className="space-y-1.5 bg-white/80 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-800">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">04. Reliability</span>
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">Class Attendance</h4>
              <p className="text-xs text-zinc-500">Zero unexcused cancellations and regular monthly progress reports.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
