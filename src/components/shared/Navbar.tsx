"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Menu, X, Sun, Moon, LogOut, AlertTriangle } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Find a Tutor", href: "/tutors" },
    { label: "Tuition Jobs", href: "/tuition-jobs" },
    { label: "Become a Tutor", href: "/become-tutor" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
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

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 focus:outline-none cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0F5B47] text-white font-extrabold text-sm flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#0F5B47] dark:hover:text-[#188c6e] hidden xl:inline">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-40">
                      <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm font-bold text-zinc-800 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[8px] font-extrabold uppercase tracking-widest text-[#0F5B47] dark:text-[#188c6e] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                          {user.role}
                        </span>
                      </div>
                      {user.role === "tutor" && (
                        <Link
                          href="/tutor-onboarding"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm font-bold text-[#F26A1B] hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                        >
                          Profile
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-[#0F5B47] text-white font-extrabold text-sm flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800 dark:text-white">{user.name}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  {user.role === "tutor" && (
                    <Link
                      href="/tutor-onboarding"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 text-sm font-bold text-[#F26A1B] hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-colors"
                    >
                      Profile
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full text-center py-3 border border-red-200 dark:border-red-900/40 text-red-600 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/85 rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4 space-y-4 hover:scale-[1.01] transition-transform duration-200">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Confirm Logout</h3>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Are you sure you want to log out from your TutorKhujo account?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs md:text-sm rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await logout();
                  window.location.href = "/";
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
