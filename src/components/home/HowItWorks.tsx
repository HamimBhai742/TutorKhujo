import React from "react";
import { Search, Users, BookOpen } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search",
      description:
        "Browse through our pool of expert tutors based on your subject and location.",
    },
    {
      icon: Users,
      title: "Connect",
      description:
        "Chat with your preferred tutor, discuss requirements, and finalize terms.",
    },
    {
      icon: BookOpen,
      title: "Learn",
      description:
        "Start your personalized learning journey either at home or in online classes.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-zinc-50/50 dark:bg-zinc-950/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-extrabold text-center text-zinc-900 dark:text-white mb-12 md:mb-16">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center space-y-4 md:space-y-6 group"
              >
                {/* Stylized Icon Circle */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-[#0F5B47] dark:text-[#188c6e] group-hover:scale-105 transition-all duration-300 shadow-sm border border-blue-100/50 dark:border-blue-900/30">
                  <IconComponent className="w-7 h-7 md:w-9 md:h-9" />
                </div>

                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xs leading-relaxed">
                    {step.description}
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
