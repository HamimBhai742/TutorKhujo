"use client";

import React from "react";
import { MapPin, ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { MOCK_TUITION_POSTS } from "@/data/dashboard";

export default function LatestTuitions() {
  // Show first 3 tuition posts
  const tuitions = MOCK_TUITION_POSTS.slice(0, 3);

  return (
    <section className="py-12 md:py-28 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <ScrollReveal variant="slide-up" delay={50} className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white uppercase tracking-tight">
              Latest Tuition Openings
            </h2>
            <div className="w-20 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
            <p className="text-sm text-zinc-550 dark:text-zinc-450 mt-4 max-w-xl">
              Apply to the most recent tuition job postings directly submitted by parents and students.
            </p>
          </ScrollReveal>
        </div>

        {/* Tuition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tuitions.map((post, idx) => (
            <ScrollReveal
              key={post.id}
              variant="slide-up"
              delay={idx * 150}
              duration={800}
              className="w-full h-full flex"
            >
              <div
                className="bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1.5 hover:border-teal-500/25 dark:hover:border-[#188c6e]/30 transition-all duration-350 relative overflow-hidden group w-full h-full"
              >
                {/* Accent hover top bar glow */}
                <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-teal-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="space-y-5">
                  {/* Top Badge & Date */}
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e]">
                      {post.classLevel}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                      {post.date}
                    </span>
                  </div>

                  {/* Header Title */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors duration-200 line-clamp-1">
                      {post.subjects.join(", ")} Tutor Needed
                    </h3>
                    <p className="text-xs font-semibold text-zinc-550 dark:text-zinc-405 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {post.location}
                    </p>
                  </div>

                  {/* Details block */}
                  <div className="grid grid-cols-2 gap-4 bg-zinc-100/50 dark:bg-zinc-900/60 p-3.5 rounded-xl text-xs font-semibold text-zinc-650 dark:text-zinc-400 border border-zinc-200/20">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                        Frequency
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{post.frequency}</span>
                      </div>
                    </div>
                    <div className="space-y-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase block tracking-wider">
                        Mode
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{post.mode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subjects pill lists */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {post.subjects.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-150/40 dark:border-zinc-800"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer price & apply */}
                <div className="pt-5 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between mt-6">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-550 block uppercase font-bold tracking-wider">
                      Offered Salary
                    </span>
                    <span className="text-base font-extrabold text-[#0F5B47] dark:text-[#188c6e]">
                      ৳ {post.budget.toLocaleString()}/mo
                    </span>
                  </div>

                  <Link
                    href="/tuition-jobs"
                    className="inline-flex items-center gap-1 px-3.5 py-2 bg-[#0F5B47] hover:bg-[#0b4737] dark:bg-[#188c6e] dark:hover:bg-[#14755c] text-white text-xs font-extrabold uppercase rounded-xl transition-all shadow-3xs group/btn hover:scale-105"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Tuitions Link */}
        <div className="text-center mt-14">
          <ScrollReveal variant="fade" delay={300}>
            <Link
              href="/tuition-jobs"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] dark:hover:text-[#1ca682] transition-colors group cursor-pointer"
            >
              <span>Browse all available tuition jobs in Dhaka</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
