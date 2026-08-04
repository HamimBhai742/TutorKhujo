"use client";

import React from "react";
import Image from "next/image";
import SearchForm from "./SearchForm";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-black py-16 md:py-28 transition-colors duration-300">
      {/* Premium Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      
      {/* Floating Animated Ambient Blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-teal-500/10 dark:bg-[#188c6e]/5 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 dark:bg-orange-650/5 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none [animation-delay:2s]" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col space-y-8">
            <div className="space-y-6">
              <ScrollReveal variant="slide-up" delay={100} duration={800}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                  Find the right tutor,{" "}
                  <span className="relative inline-block text-[#0F5B47] dark:text-[#188c6e] hover:scale-105 transition-transform duration-350 cursor-default">
                    easily.
                    <span className="absolute left-0 bottom-1 w-full h-1.5 md:h-2 bg-amber-500/30 -z-10 rounded-full animate-width-reveal" />
                  </span>
                </h1>
              </ScrollReveal>
              
              <ScrollReveal variant="slide-up" delay={200} duration={800}>
                <p className="text-base sm:text-lg md:text-xl text-zinc-650 dark:text-zinc-400 max-w-xl leading-relaxed">
                  Connecting guardians with verified tutors across Bangladesh for
                  personalized home and online learning.
                </p>
              </ScrollReveal>
            </div>

            {/* Search Form Container */}
            <ScrollReveal variant="slide-up" delay={300} duration={800}>
              <div className="w-full max-w-2xl">
                <SearchForm />
              </div>
            </ScrollReveal>

            {/* Social Proof / Avatars */}
            <ScrollReveal variant="slide-up" delay={400} duration={800}>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-3 overflow-hidden">
                  <div className="inline-flex h-10 w-10 rounded-full ring-2 ring-white dark:ring-black bg-teal-600 items-center justify-center text-white text-xs font-bold shadow-md hover:-translate-y-1 transition-transform cursor-pointer">
                    M
                  </div>
                  <div className="inline-flex h-10 w-10 rounded-full ring-2 ring-white dark:ring-black bg-orange-500 items-center justify-center text-white text-xs font-bold shadow-md hover:-translate-y-1 transition-transform cursor-pointer">
                    S
                  </div>
                  <div className="inline-flex h-10 w-10 rounded-full ring-2 ring-white dark:ring-black bg-indigo-600 items-center justify-center text-white text-xs font-bold shadow-md hover:-translate-y-1 transition-transform cursor-pointer">
                    A
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-400">
                  Joined by{" "}
                  <span className="font-extrabold text-[#0F5B47] dark:text-[#188c6e] relative">
                    2,000+
                  </span>{" "}
                  verified tutors
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Image/Illustration Column */}
          <div className="lg:col-span-6 flex justify-center">
            <ScrollReveal variant="scale" delay={300} duration={1000} className="w-full max-w-lg md:max-w-xl">
              <div className="relative w-full aspect-[1.2] rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm group cursor-pointer animate-float">
                {/* Glowing border inside */}
                <div className="absolute inset-0 bg-linear-to-tr from-[#0F5B47]/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                {/* Visual back-glow */}
                <div className="absolute -inset-2 bg-linear-to-r from-teal-500 to-amber-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-700 -z-20" />
                <Image
                  src="/images/hero-tutor.png"
                  alt="Tutor teaching a student illustration"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
