"use client";

import React, { useEffect, useRef, useState } from "react";
import { Users, GraduationCap, BookOpen, Star } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface CounterProps {
  value: string;
  duration?: number;
}

// Sub-component to handle numeric counting animation on scroll intersection
function AnimatedCounter({ value, duration = 1500 }: CounterProps) {
  const cleanCommas = value.replace(/,/g, "");
  const numMatch = cleanCommas.match(/[\d.]+/);
  const numberStr = numMatch ? numMatch[0] : "";

  const [displayVal, setDisplayVal] = useState(() => (numMatch ? "0" : value));
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  // If value prop changes, reset/adjust state
  if (value !== prevValue) {
    setPrevValue(value);
    setDisplayVal(numMatch ? "0" : value);
    setHasAnimated(false);
  }

  useEffect(() => {
    if (!numberStr) {
      return;
    }

    const targetNumber = parseFloat(numberStr);
    const matchIndex = cleanCommas.indexOf(numberStr);
    const prefix = cleanCommas.slice(0, matchIndex);
    const suffix = cleanCommas.slice(matchIndex + numberStr.length);
    const isDecimal = numberStr.includes(".");
    const hasCommas = value.includes(",");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuad easing
            const easeProgress = progress * (2 - progress);
            const currentVal = targetNumber * easeProgress;

            let formattedVal = "";
            if (isDecimal) {
              formattedVal = currentVal.toFixed(1);
            } else {
              const rounded = Math.floor(currentVal);
              if (hasCommas) {
                formattedVal = rounded.toLocaleString();
              } else {
                formattedVal = String(rounded);
              }
            }

            setDisplayVal(`${prefix}${formattedVal}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayVal(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [value, duration, hasAnimated, numberStr, cleanCommas]);

  return <span ref={elementRef}>{displayVal}</span>;
}

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: "2,000+",
      label: "Verified Tutors",
      description: "Background and credentials thoroughly checked",
      colorClass: "bg-teal-50 dark:bg-teal-950/20 text-[#0F5B47] dark:text-[#188c6e]",
    },
    {
      icon: GraduationCap,
      value: "10,000+",
      label: "Students Matched",
      description: "Successful connections established nationwide",
      colorClass: "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-450",
    },
    {
      icon: BookOpen,
      value: "150+",
      label: "Subjects & Skills",
      description: "Academic courses, coding, languages, and music",
      colorClass: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Parent Satisfaction",
      description: "Average rating based on recent reviews",
      colorClass: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-550",
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-white dark:bg-black border-y border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <ScrollReveal
                key={idx}
                variant="slide-up"
                delay={idx * 100}
                duration={700}
                className="w-full"
              >
                <div
                  className="flex items-start space-x-5 p-6 rounded-2xl bg-white dark:bg-zinc-900/10 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800/80 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 group cursor-default"
                >
                  {/* Icon wrapper */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${stat.colorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <div className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm font-bold text-zinc-850 dark:text-zinc-200">
                      {stat.label}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                      {stat.description}
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
