"use client";

import React from "react";
import { Search, Users, BookOpen } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search Tutors",
      description:
        "Browse through our pool of expert tutors based on your subject and location.",
      colorClass: "bg-teal-50 dark:bg-teal-950/20 text-[#0F5B47] dark:text-[#188c6e] border-teal-100 dark:border-teal-900/30",
    },
    {
      icon: Users,
      title: "Connect & Chat",
      description:
        "Chat with your preferred tutor, discuss requirements, and finalize terms.",
      colorClass: "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-450 border-orange-100 dark:border-orange-900/30",
    },
    {
      icon: BookOpen,
      title: "Start Learning",
      description:
        "Start your personalized learning journey either at home or in online classes.",
      colorClass: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            How it works
          </h2>
          <div className="w-16 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
        </div>

        {/* Steps Grid Container with lines */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-10 left-[16.6%] right-[16.6%] border-t-2 border-dashed border-teal-200 dark:border-teal-900/35 -z-10" />

          {/* Mobile connecting line */}
          <div className="md:hidden absolute top-8 bottom-8 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-teal-200 dark:border-teal-900/30 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <ScrollReveal
                  key={idx}
                  variant="slide-up"
                  delay={idx * 200}
                  duration={800}
                  className="w-full"
                >
                  <div
                    className="flex flex-col items-center text-center space-y-5 md:space-y-6 group cursor-default"
                  >
                    {/* Stylized Icon Circle */}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border ${step.colorClass}`}>
                      <IconComponent className="w-7 h-7 md:w-9 md:h-9" />
                    </div>

                    <div className="space-y-2.5 md:space-y-3">
                      <h3 className="text-xl font-bold text-zinc-850 dark:text-zinc-100 group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors duration-200">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-zinc-650 dark:text-zinc-400 max-w-xs leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
