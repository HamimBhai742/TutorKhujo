import React from "react";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative overflow-hidden bg-linear-to-br from-[#0F5B47] to-[#0A3D2F] dark:from-[#0b4234] dark:to-[#052119] rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white shadow-xl">
          {/* Subtle background decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to excel in your studies?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-teal-100/90 max-w-xl leading-relaxed">
              Post your tutoring requirement for free and let qualified tutors
              reach out to you.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto pt-2">
              <Link
                href="/post-requirement"
                className="w-full sm:w-auto px-8 py-4 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-bold text-sm md:text-base rounded-full shadow-md transition-colors text-center cursor-pointer"
              >
                Post a Requirement
              </Link>
              <Link
                href="/tutors"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white hover:bg-white/10 text-white font-bold text-sm md:text-base rounded-full transition-colors text-center cursor-pointer"
              >
                Browse Tutors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
