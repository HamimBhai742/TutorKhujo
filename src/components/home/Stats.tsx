import React from "react";
import { Users, GraduationCap, BookOpen, Star } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: "2,000+",
      label: "Verified Tutors",
      description: "Background and credentials thoroughly checked",
    },
    {
      icon: GraduationCap,
      value: "10,000+",
      label: "Students Matched",
      description: "Successful connections established nationwide",
    },
    {
      icon: BookOpen,
      value: "150+",
      label: "Subjects & Skills",
      description: "Academic courses, coding, languages, and music",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Parent Satisfaction",
      description: "Average rating based on recent reviews",
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-black border-y border-zinc-100 dark:border-zinc-900 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-all duration-300"
              >
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-[#0F5B47] dark:text-[#188c6e] shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {stat.label}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
