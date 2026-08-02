import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header containing title and 'View all' link */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Popular Subjects
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-1">
              Find experts in the most requested fields
            </p>
          </div>
          <Link
            href="/subjects"
            className="flex items-center gap-1 text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] font-semibold text-sm md:text-base transition-colors group cursor-pointer"
          >
            View all subjects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Subjects Grid */}
        <div className="flex flex-wrap gap-3 md:gap-4">
          {subjects.map((subject, idx) => (
            <div
              key={idx}
              className="px-6 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 shadow-sm cursor-pointer hover:shadow transition-all duration-200 hover:-translate-y-0.5"
            >
              {subject}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
