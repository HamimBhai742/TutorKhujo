import React from "react";
import Image from "next/image";
import SearchForm from "./SearchForm";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-black py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-6 flex flex-col space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight animate-fade-in-up">
                Find the right tutor,{" "}
                <span className="text-[#0F5B47] dark:text-[#188c6e] relative">
                  easily.
                </span>
              </h1>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed animate-fade-in-up delay-100">
                Connecting guardians with verified tutors across Bangladesh for
                personalized home and online learning.
              </p>
            </div>

            {/* Search Form Container */}
            <div className="w-full max-w-2xl animate-fade-in-up delay-200">
              <SearchForm />
            </div>

            {/* Social Proof / Avatars */}
            <div className="flex items-center space-x-3 pt-2 animate-fade-in-up delay-300">
              <div className="flex -space-x-3 overflow-hidden">
                {/* Styled CSS avatars for tutors */}
                <div className="inline-flex h-9 w-9 rounded-full ring-2 ring-white dark:ring-black bg-teal-600 items-center justify-center text-white text-xs font-bold font-sans">
                  M
                </div>
                <div className="inline-flex h-9 w-9 rounded-full ring-2 ring-white dark:ring-black bg-orange-500 items-center justify-center text-white text-xs font-bold font-sans">
                  S
                </div>
                <div className="inline-flex h-9 w-9 rounded-full ring-2 ring-white dark:ring-black bg-indigo-600 items-center justify-center text-white text-xs font-bold font-sans">
                  A
                </div>
              </div>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                Joined by{" "}
                <span className="font-bold text-[#0F5B47] dark:text-[#188c6e]">
                  2,000+
                </span>{" "}
                verified tutors
              </p>
            </div>
          </div>

          {/* Right Image/Illustration Column */}
          <div className="lg:col-span-6 flex justify-center animate-float">
            <div className="relative w-full max-w-lg md:max-w-xl aspect-[1.2] rounded-3xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800">
              <Image
                src="/images/hero-tutor.png"
                alt="Tutor teaching a student illustration"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
