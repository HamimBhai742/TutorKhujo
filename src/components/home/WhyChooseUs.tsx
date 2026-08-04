"use client";

import React from "react";
import { ShieldCheck, Wallet, Home, Heart } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function WhyChooseUs() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Verified Tutors",
      description:
        "Every tutor on our platform undergoes a rigorous verification process for your peace of mind.",
      colorClass: "bg-teal-50 dark:bg-teal-950/20 text-[#0F5B47] dark:text-[#188c6e]",
      hoverBorder: "hover:border-teal-500/25 dark:hover:border-teal-500/10 hover:shadow-teal-500/5",
    },
    {
      icon: Wallet,
      title: "Flexible Budget",
      description:
        "Find tutors that match your budget. Transparent pricing with no hidden middleman fees.",
      colorClass: "bg-orange-50 dark:bg-orange-950/20 text-orange-650 dark:text-orange-450",
      hoverBorder: "hover:border-orange-500/25 dark:hover:border-orange-500/10 hover:shadow-orange-500/5",
    },
    {
      icon: Home,
      title: "Home or Online",
      description:
        "Choose the mode of learning that suits your schedule. In-person or digital classrooms available.",
      colorClass: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400",
      hoverBorder: "hover:border-indigo-500/25 dark:hover:border-indigo-500/10 hover:shadow-indigo-500/5",
    },
    {
      icon: Heart,
      title: "Trusted by Guardians",
      description:
        "Join thousands of satisfied parents who have found success with our curated network of mentors.",
      colorClass: "bg-rose-50 dark:bg-rose-950/20 text-rose-650 dark:text-rose-455",
      hoverBorder: "hover:border-rose-500/25 dark:hover:border-rose-500/10 hover:shadow-rose-500/5",
    },
  ];

  return (
    <section className="py-12 md:py-28 bg-blue-50/30 dark:bg-zinc-950/10 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title with teal underline */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <ScrollReveal variant="slide-up" className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Why choose TutorKhujo?
            </h2>
            <div className="w-20 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <ScrollReveal
                key={idx}
                variant="slide-up"
                delay={idx * 100}
                duration={700}
                className="w-full flex"
              >
                <div
                  className={`bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col space-y-5 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-350 w-full group cursor-default ${card.hoverBorder}`}
                >
                  {/* Icon box */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-305 ${card.colorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-zinc-850 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
