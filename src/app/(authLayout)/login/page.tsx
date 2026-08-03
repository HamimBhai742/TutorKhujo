"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import {
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users,
  Compass
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Mock user login
    login("mock-token-12345", {
      id: "1",
      name: "Basione Admin",
      email,
      role: "admin",
    });
    
    // Redirect to dashboard
    window.location.href = ROUTES.DASHBOARD.HOME;
  };

  // Google Continue handler
  const handleGoogleLogin = () => {
    login("google-mock-token", {
      id: "g1",
      name: "Google User",
      email: "google.user@gmail.com",
      role: "student",
    });
    window.location.href = ROUTES.DASHBOARD.HOME;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#eef2f7] to-[#e4e9f2] dark:from-zinc-950 dark:to-zinc-900 flex flex-col font-sans justify-between transition-colors duration-200">
      
      {/* Tiny Header for Login page */}
      <header className="py-4 px-6 md:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-extrabold text-[#0F5B47] dark:text-[#188c6e] tracking-tight"
        >
          TutorKhujo
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
          
          {/* Left Column - Login Card */}
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-white/50 dark:border-zinc-800/80 rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-6">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <GraduationCap className="w-8 h-8" />
                <span className="text-2xl font-black tracking-tight">TutorKhujo</span>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest">
                Bangladesh's Premier Learning Network
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight pt-2">
                Welcome back
              </h2>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                Log in to continue your journey.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-450 dark:text-zinc-500">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@tutor.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] font-bold text-[#F26A1B] hover:text-[#db5b14] hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-450 dark:text-zinc-500">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                  />
                </div>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center space-x-2 transition-all duration-200 text-xs md:text-sm mt-6 cursor-pointer"
              >
                <span>Log In</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
                OR
              </span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 bg-white dark:bg-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-semibold rounded-xl text-xs md:text-sm shadow-sm flex items-center justify-center space-x-3 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Signup redirect */}
            <div className="text-center text-xs md:text-sm text-zinc-500 dark:text-zinc-400 pt-2">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#F26A1B] hover:text-[#db5b14] hover:underline"
              >
                Sign up
              </Link>
            </div>

          </div>

          {/* Right Column - Dashboard / Bookshelf UI Card (desktop only) */}
          <div className="hidden lg:col-span-6 lg:flex flex-col items-center justify-center p-8 relative">
            
            {/* Soft decorative background glow */}
            <div className="absolute w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -top-10 -right-10"></div>
            <div className="absolute w-72 h-72 bg-orange-550/5 rounded-full blur-3xl -bottom-10 -left-10"></div>

            {/* Interactive Bookshelf UI Mockup */}
            <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-[2rem] border border-white dark:border-zinc-800 shadow-2xl p-6 w-full max-w-[420px] space-y-6 hover:-translate-y-2 transition-transform duration-300">
              
              {/* Card Header inside mockup */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F5B47] text-white flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-xs">Knowledge Library</h4>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Explore and expand</p>
                  </div>
                </div>
                <span className="text-[10px] bg-teal-50 dark:bg-teal-950 text-[#0F5B47] dark:text-teal-400 font-bold px-2 py-1 rounded-full border border-teal-100 dark:border-teal-900">
                  Online Live
                </span>
              </div>

              {/* Graphic representation of bookshelf/books */}
              <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-100 dark:border-zinc-900 flex justify-around items-end h-40 relative">
                
                {/* Book 1 */}
                <div className="w-7 bg-gradient-to-t from-red-600 to-red-400 rounded-t h-28 hover:scale-105 transition-transform flex items-center justify-center shadow-md">
                  <span className="text-[7px] text-white font-bold uppercase rotate-90 whitespace-nowrap">Physics</span>
                </div>
                {/* Book 2 */}
                <div className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t h-32 hover:scale-105 transition-transform flex items-center justify-center shadow-md">
                  <span className="text-[7px] text-white font-bold uppercase rotate-90 whitespace-nowrap">Maths</span>
                </div>
                {/* Book 3 */}
                <div className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t h-20 hover:scale-105 transition-transform flex items-center justify-center shadow-md">
                  <span className="text-[7px] text-white font-bold uppercase rotate-90 whitespace-nowrap">Chem</span>
                </div>
                {/* Book 4 */}
                <div className="w-7 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t h-24 hover:scale-105 transition-transform flex items-center justify-center shadow-md">
                  <span className="text-[7px] text-white font-bold uppercase rotate-90 whitespace-nowrap">English</span>
                </div>
                {/* Book 5 */}
                <div className="w-8 bg-gradient-to-t from-indigo-650 to-indigo-400 rounded-t h-28 hover:scale-105 transition-transform flex items-center justify-center shadow-md">
                  <span className="text-[7px] text-white font-bold uppercase rotate-90 whitespace-nowrap">Coding</span>
                </div>

                {/* Shelf line */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-b"></div>
              </div>

              {/* Quick statistics in dashboard card */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-900">
                  <Users className="w-4.5 h-4.5 text-[#F26A1B] mx-auto mb-1" />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-505 font-bold uppercase">Tutors</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-white mt-0.5">2,500+</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-900">
                  <Compass className="w-4.5 h-4.5 text-teal-500 mx-auto mb-1" />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-505 font-bold uppercase">Regions</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-white mt-0.5">64 Dist</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-900">
                  <GraduationCap className="w-4.5 h-4.5 text-blue-500 mx-auto mb-1" />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-505 font-bold uppercase">Rating</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-white mt-0.5">4.9/5.0</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer at bottom */}
      <footer className="py-6 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-[10px] font-bold text-zinc-450 dark:text-zinc-505 tracking-widest uppercase">
        <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
        <span className="hidden md:inline text-zinc-300 dark:text-zinc-800">•</span>
        <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
        <span className="hidden md:inline text-zinc-300 dark:text-zinc-800">•</span>
        <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Help</Link>
      </footer>

    </div>
  );
}
