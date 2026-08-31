"use client";

import React, { useState, useEffect } from "react";
import { Shield, Lock, Eye, Users, Settings, Database, Mail, Check } from "lucide-react";

const sections = [
  { id: "collect", label: "1. Information We Collect" },
  { id: "use-info", label: "2. How We Use Information" },
  { id: "share-info", label: "3. How We Share Information" },
  { id: "data-security", label: "4. Data Security & Storage" },
  { id: "cookies", label: "5. Cookies & Tracking" },
  { id: "third-party", label: "6. Third-Party Integrations" },
  { id: "rights", label: "7. Your Privacy Rights" },
  { id: "changes", label: "8. Policy Changes" },
  { id: "contact", label: "9. Contact Us" },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("collect");

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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#063b2f] via-[#0F5B47] to-[#04211a] text-white py-16 px-6 md:px-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(60,208,112,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-white/10">
            <Shield className="w-3.5 h-3.5 animate-pulse" />
            <span>Privacy Protection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-zinc-200/90 text-sm md:text-base max-w-xl mx-auto">
            Your trust is our priority. Learn how we handle, store, and protect your personal information on TutorKhujo.
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
                        ? "bg-teal-50 dark:bg-teal-955/30 text-[#0F5B47] dark:text-[#188c6e] translate-x-1"
                        : "text-zinc-550 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Privacy Alert */}
            <div className="bg-linear-to-br from-orange-50 to-orange-100/50 dark:from-zinc-900 dark:to-zinc-900 border border-orange-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/20 text-[#F26A1B] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Security Assured</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We use advanced SSL/TLS encryption schemas and store database passwords securely.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Scrollable Privacy Content */}
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
            
            {/* 1. Information We Collect */}
            <section id="collect" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Database className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">1. Information We Collect</h2>
              </div>
              <p>
                We collect information to provide a superior, verified tutoring network matching experience. This includes:
              </p>
              <ul className="space-y-3.5 pl-2">
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Account Profile Data:</strong> Full Name, Email Address, Mobile Number, Gender, and Account Role (Student, Guardian, or Tutor).
                </li>
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Tutor Academic Credentials:</strong> Certificates, degrees, curriculum vitae (CV), university identification cards, national identification card (NID) images, and background qualification metrics submitted for verification.
                </li>
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Tuition Post Details:</strong> Class tier, preferred subjects, location, expected salary, and specific scheduling comments.
                </li>
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Technical Usage Data:</strong> IP Address, browser type, device information, and platform access logs.
                </li>
              </ul>
            </section>

            {/* 2. How We Use Information */}
            <section id="use-info" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Eye className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">2. How We Use Information</h2>
              </div>
              <p>
                We utilize your personal data to power our tutoring operations under these categories:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "To match students/guardians with appropriate tutors based on location, subjects, and pricing parameters.",
                  "To run security checks and verify the credibility of tutors prior to unlocking profiles.",
                  "To send OTP codes for authentication checks and notification updates via SMS and Email.",
                  "To refine system algorithms, layouts, database performance, and dashboard structures."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-3 bg-zinc-50 dark:bg-zinc-955 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="text-zinc-650 dark:text-zinc-300 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. How We Share Information */}
            <section id="share-info" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Users className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">3. How We Share Information</h2>
              </div>
              <p>
                TutorKhujo is built on community transparency. However, we do not sell or distribute your private contact details for commercial spamming. Information sharing occurs strictly as follows:
              </p>
              <ul className="space-y-3 pl-2">
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Matching visibility:</strong> When a tutor applies to a tuition job, the posting guardian will be granted visibility of the tutor&apos;s verified profile, education details, and rating records.
                </li>
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Contact disclosure:</strong> Contact numbers are only shared between a tutor and guardian after they agree to start a communication match, or when a matching proposal is approved.
                </li>
                <li className="text-xs md:text-sm">
                  <strong className="text-zinc-900 dark:text-white">Legal mandates:</strong> We will release account data to government authorities if required by law or to protect against physical harm, fraud, or violations of platform policies.
                </li>
              </ul>
            </section>

            {/* 4. Data Security & Storage */}
            <section id="data-security" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Lock className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">4. Data Security & Storage</h2>
              </div>
              <p>
                The security of your personal data is vital to us. We store information on secured cloud databases with restricted access levels. Sensitive records (such as passwords) are hashed using strong cryptographic schemas.
              </p>
              <p>
                Please remember that no transmission method over the Internet or electronic storage system is 100% secure. While we strive to use commercially acceptable means to protect your personal details, we cannot guarantee absolute database security.
              </p>
            </section>

            {/* 5. Cookies & Tracking */}
            <section id="cookies" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Settings className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">5. Cookies & Tracking</h2>
              </div>
              <p>
                We use cookies and equivalent local storage tokens to keep you logged in across browser sessions, preserve your dashboard configuration preferences, and monitor platform performance metrics. You can choose to disable cookies in your web browser, but some features of the Platform may not function correctly as a result.
              </p>
            </section>

            {/* 6. Third-Party Integrations */}
            <section id="third-party" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Users className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">6. Third-Party Integrations</h2>
              </div>
              <p>
                We collaborate with selected third-party service providers to handle critical features:
              </p>
              <ul className="space-y-2.5 pl-2 text-xs md:text-sm">
                <li>• <strong>Google Sign-In API:</strong> Used for quick authentication, allowing users to register or login using their verified Google identity credentials.</li>
                <li>• <strong>SMS Gateway Providers:</strong> Used to deliver critical verification codes and matches to your mobile device.</li>
                <li>• <strong>Payment Gateways:</strong> Used to securely manage fee invoices. All card numbers or credentials are held strictly on the payment provider&apos;s secure platform, not ours.</li>
              </ul>
            </section>

            {/* 7. Your Privacy Rights */}
            <section id="rights" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Shield className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">7. Your Privacy Rights</h2>
              </div>
              <p>
                Depending on your geographic location, you hold specific rights regarding your personal information, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Accessing and reviewing the personal details we hold about you.",
                  "Correcting or updating inaccurate profile info via your settings panel.",
                  "Requesting complete deletion of your account and related historical profiles.",
                  "Withdrawing consent for notifications or email marketing alerts."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-3 bg-zinc-50 dark:bg-zinc-955 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F26A1B] mt-2 shrink-0"></span>
                    <span className="text-zinc-650 dark:text-zinc-450 text-xs">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 italic pt-2">
                * Note: Verification files (e.g. NID copies) uploaded by tutors cannot be modified while verification is in progress. Account deletion requests will be completed within 30 days.
              </p>
            </section>

            {/* 8. Policy Changes */}
            <section id="changes" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Settings className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">8. Policy Changes</h2>
              </div>
              <p>
                We may revise this Privacy Policy periodically to reflect new matching features, security improvements, or regulatory updates. We will notify you of substantial changes by updating the &quot;Last Updated&quot; date at the top of this document or by sending you a notification.
              </p>
            </section>

            {/* 9. Contact Us */}
            <section id="contact" className="space-y-4 scroll-mt-28">
              <div className="flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <Mail className="w-5 h-5" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight">9. Contact Us</h2>
              </div>
              <p>
                If you have questions, feedback, or concerns regarding your private data and cookies on our system, feel free to contact our privacy desk:
              </p>
              <div className="p-5 bg-teal-50/50 dark:bg-teal-955/10 rounded-3xl border border-teal-100 dark:border-teal-900/50 space-y-2 text-xs md:text-sm">
                <div><strong className="text-teal-900 dark:text-teal-350">Email:</strong> privacy@tutorkhujo.com</div>
                <div><strong className="text-teal-900 dark:text-teal-350">Address:</strong> Level 5, Education Hub building, Gulshan, Dhaka 1212, Bangladesh</div>
                <div><strong className="text-teal-900 dark:text-teal-350">Hotline:</strong> +880 1700-000000</div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
