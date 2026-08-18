"use client";

import React, { useState, useEffect } from "react";
import { Star, MapPin, BookOpen, ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { Tutor, MOCK_TUTORS, mapDbTutorToFrontend } from "@/data/tutors";
import api from "@/lib/api";

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState<Tutor[]>(() => MOCK_TUTORS.slice(0, 3));

  useEffect(() => {
    let active = true;
    api
      .get("/user/tutors")
      .then((res) => {
        if (active && res.data?.data && res.data.data.length > 0) {
          const mapped = res.data.data.map(mapDbTutorToFrontend);
          setTutors(mapped.slice(0, 3));
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-12 md:py-28 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <ScrollReveal variant="slide-up" delay={50} className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Featured Verified Tutors
            </h2>
            <div className="w-20 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
            <p className="text-sm text-zinc-550 dark:text-zinc-450 mt-4 max-w-xl">
              Book a free trial class with our most requested and highly rated verified tutors.
            </p>
          </ScrollReveal>
        </div>

        {/* Tutor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor, idx) => (
            <ScrollReveal
              key={idx}
              variant="slide-up"
              delay={idx * 150}
              duration={800}
              className="w-full h-full flex"
            >
              <div
                className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1.5 hover:border-teal-500/25 dark:hover:border-[#188c6e]/30 transition-all duration-350 relative overflow-hidden group w-full h-full"
              >
                {/* Accent hover top bar glow */}
                <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-teal-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] border border-teal-100 dark:border-teal-900/60">
                    <Award className="w-3.5 h-3.5" />
                    {tutor.badge}
                  </span>
                </div>

                {/* Header Info */}
                <div className="flex items-center space-x-4">
                  {/* Avatar with initials */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${tutor.avatarBg} flex items-center justify-center text-white text-lg font-extrabold shadow-md shrink-0 group-hover:scale-105 transition-transform duration-350`}
                  >
                    {tutor.initials}
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors duration-200">
                      {tutor.name}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-605 dark:text-zinc-400">
                      {tutor.university}
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-550">
                      {tutor.department}
                    </p>
                  </div>
                </div>

                {/* Ratings */}
                <div className="flex items-center space-x-2 text-sm text-zinc-505 dark:text-zinc-405">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500 animate-pulse" />
                    <span className="ml-1 font-extrabold text-zinc-900 dark:text-white">
                      {tutor.rating.toFixed(1)}
                    </span>
                  </div>
                  <span>•</span>
                  <span>({tutor.reviewsCount} reviews)</span>
                </div>

                {/* Subjects */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Subjects:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.subjects.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/20"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer info: Price & Booking */}
                <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-550 block uppercase font-bold tracking-wider">
                      Expected Salary
                    </span>
                    <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                      ৳ {tutor.salary.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="flex flex-col items-end text-right space-y-0.5">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-550 block uppercase font-bold tracking-wider">
                      Preference
                    </span>
                    <span className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {tutor.location} ({tutor.mode})
                    </span>
                  </div>
                </div>

                {/* View Profile Action */}
                <Link
                  href={`/tutors/${tutor.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-100 hover:bg-[#0F5B47] dark:bg-zinc-800 dark:hover:bg-[#188c6e] hover:text-white dark:hover:text-white text-zinc-850 dark:text-zinc-205 font-bold text-sm rounded-xl transition-all duration-200 group/btn shadow-xs hover:shadow-md active:scale-98 cursor-pointer"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Tutors Link */}
        <div className="text-center mt-14">
          <ScrollReveal variant="fade" delay={300}>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] dark:hover:text-[#1ca682] transition-colors group cursor-pointer"
            >
              <span>Browse all verified tutors in your area</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
