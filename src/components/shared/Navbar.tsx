"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Find a Tutor", href: "/tutors" },
    { label: "Become a Tutor", href: "/become-tutor" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo and Nav Links */}
          <div className="flex items-center space-x-8 md:space-x-12">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl md:text-2xl font-extrabold text-[#0F5B47] dark:text-[#188c6e] tracking-tight cursor-pointer"
            >
              TutorKhujo
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-zinc-500 hover:text-[#0F5B47] dark:text-zinc-400 dark:hover:text-[#188c6e] p-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>

            {/* Language Switcher */}
            <button
              className="text-zinc-500 hover:text-[#0F5B47] dark:text-zinc-400 dark:hover:text-[#188c6e] p-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-colors cursor-pointer"
              aria-label="Language switcher"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Login Link */}
            <Link
              href="/login"
              className="text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors cursor-pointer"
            >
              Login
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-bold text-sm rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-zinc-500 dark:text-zinc-400 p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>

            <button
              className="text-zinc-500 dark:text-zinc-400 p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 rounded-full transition-colors cursor-pointer"
              aria-label="Language switcher"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-700 dark:text-zinc-200 p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="lg:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black py-6 px-4 space-y-6 transition-all duration-300">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-zinc-600 dark:text-zinc-300 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4 flex flex-col space-y-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 text-zinc-700 dark:text-zinc-200 font-bold hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-bold rounded-xl shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
