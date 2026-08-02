import React from "react";
import Link from "next/link";
import { Globe, Share2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: "Find a Tutor", href: "/tutors" },
      { label: "Become a Tutor", href: "/become-tutor" },
      { label: "How it works", href: "#how-it-works" },
    ],
    Resources: [
      { label: "FAQ", href: "/faq" },
      { label: "Tutor Guidelines", href: "/guidelines" },
      { label: "Help Center", href: "/help" },
    ],
    Legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Contact Us", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-blue-50/20 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-zinc-100 dark:border-zinc-900">
          {/* Logo & Description Column */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-xl md:text-2xl font-extrabold text-[#0F5B47] dark:text-[#188c6e] tracking-tight cursor-pointer"
            >
              TutorKhujo
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Building a brighter future through quality education and trusted
              mentorship in Bangladesh.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links], idx) => (
              <div key={idx} className="flex flex-col space-y-4">
                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  {category}
                </h4>
                <ul className="flex flex-col space-y-2.5">
                  {links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {currentYear} TutorKhujo. All rights reserved. Trusted mentorship
            for a brighter future.
          </p>

          {/* Settings / Actions */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-[#0F5B47] dark:hover:text-[#188c6e] cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 hover:text-[#0F5B47] dark:hover:text-[#188c6e] cursor-pointer">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
