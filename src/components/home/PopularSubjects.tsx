"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function PopularSubjects() {
  const subjects = [
    "Math",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "ICT",
    "Arabic",
    "Accounting",
  ];

  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header containing title and 'View all' link */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <ScrollReveal variant="slide-up" delay={50} className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Popular Subjects
            </h2>
            <p className="text-sm md:text-base text-zinc-550 dark:text-zinc-450">
              Find experts in the most requested fields
            </p>
          </ScrollReveal>
          
          <ScrollReveal variant="fade" delay={200}>
            <Link
              href="/subjects"
              className="flex items-center gap-1.5 text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] dark:hover:text-[#1ca682] font-semibold text-sm md:text-base transition-colors group cursor-pointer"
            >
              <span>View all subjects</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Subjects Grid */}
        <div className="flex flex-wrap gap-3 md:gap-4">
          {subjects.map((subject, idx) => (
            <ScrollReveal
              key={idx}
              variant="scale"
              delay={idx * 60}
              duration={400}
            >
              <div
                className="px-6 py-3.5 bg-white dark:bg-zinc-900/50 hover:bg-teal-50/20 dark:hover:bg-[#188c6e]/5 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 shadow-xs cursor-pointer hover:shadow-md hover:shadow-teal-500/5 hover:-translate-y-1 hover:border-[#0F5B47]/30 dark:hover:border-[#188c6e]/30 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-all duration-300"
              >
                {subject}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
