"use client";

import React, { useState, useEffect } from "react";
import { Scale, BookOpen, ShieldCheck, HelpCircle, FileText, ArrowRight, Check } from "lucide-react";

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "eligibility", label: "2. Eligibility & Accounts" },
  { id: "roles", label: "3. Tutors vs. Students / Guardians" },
  { id: "fees-payments", label: "4. Fees & Payment Terms" },
  { id: "conduct", label: "5. Code of Conduct" },
  { id: "ip", label: "6. Intellectual Property" },
  { id: "disclaimers", label: "7. Disclaimers & Liabilities" },
  { id: "termination", label: "8. Account Termination" },
  { id: "governing-law", label: "9. Governing Law" },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-955 font-sans transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#063b2f] via-[#0F5B47] to-[#04211a] text-white py-16 px-6 md:px-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(60,208,112,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-white/10">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Terms of Service
          </h1>
          <p className="text-zinc-200/90 text-sm md:text-base max-w-xl mx-auto">
            Please read these terms carefully before using the TutorKhujo platform. By using our platform, you agree to these terms.
          </p>
          <div className="text-xs text-zinc-350 pt-2 font-medium">
            Last Updated: August 27, 2026
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Sticky Left Sidebar for Desktop */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-905 dark:text-white text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-505">
                Table of Contents
              </h3>
              <nav className="flex flex-col space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left text-xs py-2 px-3.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                      activeSection === section.id
                        ? "bg-teal-50 dark:bg-teal-950/30 text-[#0F5B47] dark:text-[#188c6e] translate-x-1"
                        : "text-zinc-555 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Support Card */}
            <div className="bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-zinc-900 dark:to-zinc-900 border border-orange-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-955/20 text-[#F26A1B] flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Have Questions?</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Our legal and support teams are here to help you clear up any confusion.
                </p>
              </div>
              <button className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F26A1B] hover:text-[#db5b14] transition-colors cursor-pointer">
                <span>Contact Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Scrollable Terms Content */}
        <main className="lg:col-span-9 space-y-12">
          {/* Mobile TOC Pill-nav */}
          <div className="lg:hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-8 overflow-x-auto whitespace-nowrap flex space-x-2 scrollbar-none">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`inline-block text-xs py-1.5 px-3 rounded-full font-bold transition-all cursor-pointer ${
                  activeSection === section.id
                    ? "bg-[#0F5B47] text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-[2.5rem] shadow-sm p-6 md:p-10 lg:p-12 space-y-12 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
            
            {/* 1. Introduction */}
            <section id="introduction" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <FileText className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">1. Introduction</h2>
              </div>
              <p>
                Welcome to <strong>TutorKhujo</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of the TutorKhujo website, mobile application, and related services (collectively, the &quot;Platform&quot;).
              </p>
              <p>
                By registering an account, accessing, or using our Platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms, as well as our Privacy Policy. If you do not agree to these Terms, please do not access or use the Platform.
              </p>
              <div className="p-4 bg-teal-50/50 dark:bg-teal-955/10 rounded-2xl border border-teal-100 dark:border-teal-900/50 text-xs md:text-sm text-teal-850 dark:text-teal-400">
                <strong>Important Notice:</strong> TutorKhujo functions as a marketplace and matching directory. We facilitate connections between students/guardians and qualified tutors. We do not employ tutors directly, nor are we responsible for their performance.
              </div>
            </section>

            {/* 2. Eligibility & Accounts */}
            <section id="eligibility" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">2. Eligibility & Accounts</h2>
              </div>
              <p>
                To create an account and use TutorKhujo, you must meet the following criteria:
              </p>
              <ul className="space-y-2.5 pl-2">
                {[
                  "You must be at least 18 years old to create a tutor account or register as a guardian.",
                  "If you are a student under 18, your parent or legal guardian must register and supervise the account.",
                  "All registration details provided (Name, Mobile, Email, Qualifications) must be fully accurate, honest, and kept up-to-date.",
                  "You are entirely responsible for protecting your account passwords and credentials."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="text-zinc-655 dark:text-zinc-300 text-xs md:text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Tutors vs. Students / Guardians */}
            <section id="roles" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <BookOpen className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">3. Tutors vs. Students / Guardians</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-150 dark:border-zinc-800 space-y-3">
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-base">For Tutors</h3>
                  <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Tutors represent themselves as independent professionals. By registering, tutors agree that they possess the certifications, degrees, and capabilities they claim. Tutors must pass mandatory profile verification steps before receiving tuition matching requests.
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-3xl border border-zinc-150 dark:border-zinc-800 space-y-3">
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-base">For Students / Guardians</h3>
                  <p className="text-xs md:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed">
                    Guardians and students use the platform to post tuition job requirements, view verified profiles, and request matchings. Guardians are responsible for verifying a tutor&apos;s original documents (NID, university ID, credentials) in person before finalized hiring.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Fees & Payment Terms */}
            <section id="fees-payments" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <FileText className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">4. Fees & Payment Terms</h2>
              </div>
              <p>
                TutorKhujo charging models apply based on user tier and status:
              </p>
              <ul className="space-y-3 pl-2">
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Matching Platform Charge:</strong> Tutors might be charged a one-time placement commission fee or sub-percentage fee upon securing a tuition deal through our system.
                </li>
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Direct Fees:</strong> Tution fees are agreed upon between the tutor and the student/guardian directly. TutorKhujo does not hold or escrow recurring tuition payments unless explicitly facilitated by our payment portal.
                </li>
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Refunds:</strong> Placement and match fees paid to TutorKhujo are only refundable in the event that the match fails within a designated trial period (e.g., 3 days of starting), subject to investigation.
                </li>
              </ul>
            </section>

            {/* 5. Code of Conduct */}
            <section id="conduct" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">5. Code of Conduct</h2>
              </div>
              <p>
                To maintain a safe and productive environment, all users agree to behave professionally and strictly avoid the following actions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Falsifying degrees, institutions, or identity documents.",
                  "Harassing, discriminating, or displaying improper behavior during tutoring sessions.",
                  "Using student contact information for off-platform marketing/spamming.",
                  "Canceling confirmed tuition jobs repeatedly without valid notice."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F26A1B] mt-2 shrink-0"></span>
                    <span className="text-zinc-655 dark:text-zinc-400 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Intellectual Property */}
            <section id="ip" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <BookOpen className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">6. Intellectual Property</h2>
              </div>
              <p>
                All elements of the Platform, including layouts, graphics, branding, software code, databases, logos, and UI designs, are the intellectual property of TutorKhujo and are protected by copyrights and local intellectual property laws of Bangladesh.
              </p>
            </section>

            {/* 7. Disclaimers & Liabilities */}
            <section id="disclaimers" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Scale className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">7. Disclaimers & Liabilities</h2>
              </div>
              <p>
                TUTORKHUJO PROVIDES ITS PLATFORM AND SERVICES ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE MAKE NO EXPRESS OR IMPLIED WARRANTIES ABOUT THE SYSTEM STABILITY, THE TRUTHFULNESS OF ALL PROFILES, OR THE ACADEMIC PROGRESS OF STUDENTS.
              </p>
              <p>
                We shall not be liable for any direct, indirect, incidental, or consequential damages resulting from tutor-student mismatches, academic performance, off-platform payment disputes, or safety incidents during home/online tutoring sessions.
              </p>
            </section>

            {/* 8. Account Termination */}
            <section id="termination" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">8. Account Termination</h2>
              </div>
              <p>
                We reserve the right to suspend or permanently terminate your account, delete your profile, and block your mobile number and email from future registrations if you violate these Terms, provide false academic records, or perform actions that harm the community&apos;s trust.
              </p>
            </section>

            {/* 9. Governing Law */}
            <section id="governing-law" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <FileText className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">9. Governing Law</h2>
              </div>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the People&apos;s Republic of Bangladesh. Any legal actions or disputes related to the Platform will be subject to the exclusive jurisdiction of the courts located in Dhaka, Bangladesh.
              </p>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
