import React from "react";
import { ShieldCheck, Wallet, Home, Heart } from "lucide-react";

export default function WhyChooseUs() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Verified Tutors",
      description:
        "Every tutor on our platform undergoes a rigorous verification process for your peace of mind.",
    },
    {
      icon: Wallet,
      title: "Flexible Budget",
      description:
        "Find tutors that match your budget. Transparent pricing with no hidden middleman fees.",
    },
    {
      icon: Home,
      title: "Home or Online",
      description:
        "Choose the mode of learning that suits your schedule. In-person or digital classrooms available.",
    },
    {
      icon: Heart,
      title: "Trusted by Guardians",
      description:
        "Join thousands of satisfied parents who have found success with our curated network of mentors.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-blue-50/30 dark:bg-zinc-950/10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title with teal underline */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Why choose TutorKhujo?
          </h2>
          <div className="w-24 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col space-y-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon box */}
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-[#0F5B47] dark:text-[#188c6e] shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {card.description}
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
