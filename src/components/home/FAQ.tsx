"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I request a tutor on TutorKhujo?",
      answer:
        "Simply click on 'Find a Tutor' or use our search bar to filter tutors by class, subject, and area. Once you find a suitable match, you can request a demo class. Alternatively, you can submit a tutor request, and our matching team will connect you with the best available tutors within 24 to 48 hours.",
    },
    {
      question: "Is there any registration or matching fee for guardians?",
      answer:
        "No, there is absolutely no registration or matching fee for guardians/parents. Our tutoring matching service is completely free for students and guardians. You only pay the monthly tuition fee agreed upon with the tutor.",
    },
    {
      question: "What is the verification process for tutors?",
      answer:
        "To ensure safety and quality education, we require all tutors to submit their NID/Passport, university ID card, and academic certificates. Our verification team reviews these credentials manually. Only successfully verified tutors receive the 'Verified' badge on their profiles.",
    },
    {
      question: "What if the matched tutor is not a good fit after starting?",
      answer:
        "If you are not satisfied with the tutor's performance after the trial classes, you can inform us immediately. We will arrange a replacement tutor matching your requirements as quickly as possible.",
    },
    {
      question: "How are payments handled between guardians and tutors?",
      answer:
        "To ensure transparency and trust, we recommend paying through our platform secure checkout or directly according to the mutually agreed monthly plan. We also provide support in case of payment disputes for verified contracts.",
    },
  ];

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <ScrollReveal variant="slide-up" className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-[#0F5B47] dark:text-[#188c6e] mb-4 shadow-xs">
              <HelpCircle className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
          </ScrollReveal>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <ScrollReveal
                key={idx}
                variant="slide-up"
                delay={idx * 80}
                duration={605}
                className="w-full"
              >
                <div
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-zinc-900/20 ${
                    isOpen 
                      ? "border-teal-500/25 dark:border-[#188c6e]/30 shadow-md shadow-teal-500/5 bg-zinc-50/30 dark:bg-zinc-900/40" 
                      : "border-zinc-150 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => handleToggle(idx)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-zinc-850 dark:text-zinc-100 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors duration-250 cursor-pointer"
                  >
                    <span className="text-sm md:text-base pr-4 select-none">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#0F5B47] dark:text-[#188c6e]" : ""
                      }`}
                    />
                  </button>

                  {/* Accordion Content (Modern Grid height transition) */}
                  <div
                    className={`grid transition-all duration-350 ease-in-out overflow-hidden ${
                      isOpen 
                        ? "grid-rows-[1fr] opacity-100 border-t border-zinc-100 dark:border-zinc-800/60" 
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="p-6 text-xs md:text-sm text-zinc-555 dark:text-zinc-400 leading-relaxed font-normal">
                        {faq.answer}
                      </p>
                    </div>
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
