/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import api from "@/lib/api";
import {
  Globe,
  GraduationCap,
  Presentation,
  ArrowRight,
  Sparkles
} from "lucide-react";

type UserRole = "student" | "tutor";

export default function WhoAreYouClient() {
  const { user, updateUser, loading } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If auth loading is complete and user is not logged in, redirect to login
    if (!loading && !user) {
      window.location.href = ROUTES.LOGIN;
    }
  }, [user, loading]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError("");

    try {
      // Update role and set isFirstLogin to false on the backend
      const response = await api.patch("/user/me", {
        role: role,
        isFirstLogin: false,
      });

      const updatedUser = response.data.data;
      
      // Update local auth context
      updateUser({
        role: updatedUser.role,
        isFirstLogin: updatedUser.isFirstLogin,
      });

      // Redirect depending on chosen role
      if (role === "tutor") {
        window.location.href = "/tutor-onboarding";
      } else {
        window.location.href = ROUTES.HOME;
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-955 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0F5B47]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-955 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-805 py-4 px-6 md:px-12 flex items-center justify-between z-10">
        <Link
          href="/"
          className="text-xl md:text-2xl font-extrabold text-[#0F5B47] dark:text-[#188c6e] tracking-tight"
        >
          TutorKhujo
        </Link>
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-1.5 text-sm font-medium text-zinc-650 dark:text-zinc-300 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors cursor-pointer">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </button>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="flex-1 flex flex-col md:grid md:grid-cols-2">
        {/* Left panel - Green brand intro */}
        <div className="relative bg-linear-to-br from-[#063b2f] via-[#0F5B47] to-[#04211a] text-white p-8 md:p-16 lg:p-24 flex flex-col justify-between overflow-hidden">
          {/* Background design elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3cd070]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f26a1b]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          {/* Top Badge */}
          <div className="z-10 self-start mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-emerald-300 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#f26a1b] mr-2"></span>
              Next-Gen Learning
            </span>
          </div>

          {/* Main Text */}
          <div className="z-10 max-w-lg my-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Unlock your potential with{" "}
              <span className="text-[#A9F3C6] underline decoration-wavy decoration-[#3cd070] decoration-1 underline-offset-4">
                expert guidance.
              </span>
            </h1>
            <p className="text-zinc-200/90 text-sm md:text-base leading-relaxed">
              Join a global community of learners and educators. Whether you're seeking knowledge or sharing it, your journey starts here.
            </p>
          </div>

          {/* Social Trust / Avatars */}
          <div className="z-10 mt-12 flex items-center space-x-4">
            <div className="flex -space-x-3">
              <Image
                className="rounded-full border-2 border-[#0F5B47] object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                alt="User 1"
                width={40}
                height={40}
              />
              <Image
                className="rounded-full border-2 border-[#0F5B47] object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="User 2"
                width={40}
                height={40}
              />
              <Image
                className="rounded-full border-2 border-[#0F5B47] object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                alt="User 3"
                width={40}
                height={40}
              />
            </div>
            <div>
              <p className="text-sm font-bold">10k+ Active Users</p>
              <p className="text-xs text-zinc-300">Trusting our platform daily</p>
            </div>
          </div>
        </div>

        {/* Right panel - Selector */}
        <div className="bg-white dark:bg-zinc-950 p-8 md:p-16 lg:p-24 flex flex-col justify-between">
          <div className="max-w-md w-full mx-auto my-auto space-y-8">
            {/* Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center text-[#0F5B47] dark:text-[#188c6e] shadow-sm">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>

            {/* Headings */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Who are you?
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Select your role to help us customize your dashboard and experience.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Cards */}
            <div className="space-y-4">
              {/* Guardian / Student Card */}
              <div
                onClick={() => handleRoleSelect("student")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  role === "student"
                    ? "border-[#0F5B47] bg-teal-50/30 dark:border-[#188c6e] dark:bg-[#188c6e]/5 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-[#0F5B47] dark:text-teal-400 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                      I'm a Guardian / Student
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      I want to find the perfect tutor for my learning needs.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    role === "student"
                      ? "border-[#0F5B47] bg-[#0F5B47] dark:border-[#188c6e] dark:bg-[#188c6e]"
                      : "border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400"
                  }`}
                >
                  {role === "student" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>

              {/* Tutor Card */}
              <div
                onClick={() => handleRoleSelect("tutor")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  role === "tutor"
                    ? "border-[#f26a1b] bg-orange-50/30 dark:border-[#f26a1b] dark:bg-[#f26a1b]/5 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-[#f26a1b] flex items-center justify-center">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                      I'm a Tutor
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      I want to share my knowledge and grow my teaching career.
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    role === "tutor"
                      ? "border-[#f26a1b] bg-[#f26a1b]"
                      : "border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400"
                  }`}
                >
                  {role === "tutor" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Saving..." : "Continue"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Footer inside selector container */}
          <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-505 space-y-2 md:space-y-0">
            <p>© 2026 TutorKhujo. Empowering education globally.</p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:underline">Terms</Link>
              <Link href="#" className="hover:underline">Privacy</Link>
              <Link href="#" className="hover:underline">Contact</Link>
              <Link href="#" className="hover:underline">Help Center</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
