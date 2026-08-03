/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import api from "@/lib/api";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import {
  Globe,
  GraduationCap,
  Presentation,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  UserPlus,
  Lock,
  Shield,
  Mail,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";

type SignupStep = 1 | 2 | 3;
type UserRole = "student" | "tutor";

export default function SignupClient() {
  const { login } = useAuth();
  
  // State
  const [step, setStep] = useState<SignupStep>(1);
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    mobile?: string;
  }>({});
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(59);
  const [isResendActive, setIsResendActive] = useState(false);

  // Refs for OTP input navigation
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    error: googleError,
    renderGoogleButton,
    scriptLoaded,
  } = useGoogleAuth(role);

  useEffect(() => {
    if (scriptLoaded && step === 2) {
      renderGoogleButton("google-signup-btn");
    }
  }, [scriptLoaded, step, renderGoogleButton]);

  // Start OTP timer when step 3 is reached
  useEffect(() => {
    if (step !== 3 || isResendActive) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          setIsResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, isResendActive]);

  const resetOtpTimer = async () => {
    setError("");
    try {
      await api.post("/auth/resend-otp", { email });
      setOtpTimer(59);
      setIsResendActive(false);
      setOtp(Array(6).fill(""));
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 50);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to resend OTP. Please try again.";
      setError(errMsg);
    }
  };

  // Handlers
  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleStep1Submit = () => {
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; email?: string; password?: string; mobile?: string } = {};

    // Validate Name
    if (!name.trim()) {
      errors.name = "Full name is required";
    }

    // Validate Email
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Validate Password
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Validate Mobile
    let formattedMobile = "";
    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else {
      // Strip all non-digit characters
      const cleanNum = mobile.replace(/\D/g, "");
      let localNum = cleanNum;
      
      // If starts with country code, strip it
      if (localNum.startsWith("880")) {
        localNum = localNum.substring(3);
      } else if (localNum.startsWith("+880")) {
        localNum = localNum.substring(4);
      }

      const regex11 = /^01[3-9]\d{8}$/;
      const regex10 = /^1[3-9]\d{8}$/;

      if (regex11.test(localNum)) {
        formattedMobile = localNum.substring(1);
      } else if (regex10.test(localNum)) {
        formattedMobile = localNum;
      } else {
        errors.mobile = "Please enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX or 17XXXXXXXX)";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setError("");
    try {
      await api.post("/auth/register", { name, email, password, mobile: formattedMobile, role });
      setStep(3);
      setOtpTimer(59);
      setIsResendActive(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errMsg);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    setError("");
    try {
      const response = await api.post("/auth/verify-otp", { email, otpCode });
      const { accessToken, user } = response.data.data;
      
      login(accessToken, user);
      
      // Redirect to onboarding if tutor, otherwise to home page
      if (user?.role === "tutor") {
        window.location.href = "/tutor-onboarding";
      } else {
        window.location.href = ROUTES.HOME;
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Invalid OTP code. Please try again.";
      setError(errMsg);
    }
  };

  // Active combined error
  const activeError = error || googleError;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-200">
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
          <Link
            href="/login"
            className="text-sm font-bold text-zinc-700 dark:text-zinc-200 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors"
          >
            Login
          </Link>
          <button
            onClick={() => setStep(1)}
            className="px-5 py-2 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-bold text-xs md:text-sm rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* STEP 1: Who Are You? */}
      {step === 1 && (
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
                  onClick={handleStep1Submit}
                  className="w-full py-4 bg-[#5F6E6B] hover:bg-[#4E5B58] dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer"
                >
                  <span>Continue to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Lower Actions */}
              <div className="flex items-center justify-between text-sm font-semibold text-zinc-500 dark:text-zinc-400 pt-4">
                <Link
                  href="/"
                  className="flex items-center space-x-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Link>
                <button
                  onClick={() => setStep(2)}
                  className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              </div>
            </div>

            {/* Footer inside selector container */}
            <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 dark:text-zinc-505 space-y-2 md:space-y-0">
              <p>© 2024 TutorKhujo. Empowering education globally.</p>
              <div className="flex space-x-4">
                <Link href="#" className="hover:underline">Terms</Link>
                <Link href="#" className="hover:underline">Privacy</Link>
                <Link href="#" className="hover:underline">Contact</Link>
                <Link href="#" className="hover:underline">Help Center</Link>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* STEP 2: Create Account Form */}
      {step === 2 && (
        <main className="flex-1 bg-linear-to-tr from-[#eef2f7] to-[#e4e9f2] dark:from-zinc-950 dark:to-zinc-900 p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
            
            {/* Left Card form */}
            <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-white/50 dark:border-zinc-800/80 rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-6">
              
              {/* Logo / Header inside card */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                  <GraduationCap className="w-8 h-8" />
                  <span className="text-2xl font-black tracking-tight">TutorKhujo</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-955 dark:text-white tracking-tight">
                  Create your account
                </h2>
                <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                  Join Bangladesh's premier learning network
                </p>
              </div>

              {/* Role Toggle Switcher */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
                  Choose your role
                </label>
                <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl relative">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer z-10 ${
                      role === "student"
                        ? "bg-white dark:bg-zinc-700 text-[#0F5B47] dark:text-white shadow-sm"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    Guardian/Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("tutor")}
                    className={`py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer z-10 ${
                      role === "tutor"
                        ? "bg-white dark:bg-zinc-700 text-[#0F5B47] dark:text-white shadow-sm"
                        : "text-zinc-505 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    Tutor
                  </button>
                </div>
              </div>

              {/* Google Sign-up */}
              <div className="flex justify-center w-full min-h-11">
                <div id="google-signup-btn" className="w-full flex justify-center"></div>
              </div>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
                <span className="px-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-550 tracking-wider uppercase">
                  OR REGISTER MANUALLY
                </span>
                <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              {/* Form fields */}
              <form onSubmit={handleStep2Submit} noValidate className="space-y-4">
                {activeError && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold">
                    {activeError}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 text-xs md:text-sm ${
                      formErrors.name
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500"
                        : "border-zinc-200 dark:border-zinc-800 focus:ring-[#0F5B47]"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) {
                        setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 text-xs md:text-sm ${
                      formErrors.email
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500"
                        : "border-zinc-200 dark:border-zinc-800 focus:ring-[#0F5B47]"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formErrors.password) {
                          setFormErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
                      placeholder="Create a password"
                      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 pr-10 text-xs md:text-sm ${
                        formErrors.password
                          ? "border-red-500 dark:border-red-500 focus:ring-red-500"
                          : "border-zinc-200 dark:border-zinc-800 focus:ring-[#0F5B47]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                    Mobile Number
                  </label>
                  <div className={`flex rounded-xl overflow-hidden border transition-all ${
                    formErrors.mobile
                      ? "border-red-500 dark:border-red-500 ring-2 ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-[#0F5B47]"
                  }`}>
                    <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 text-zinc-600 dark:text-zinc-300 text-xs md:text-sm font-semibold flex items-center border-r border-zinc-200 dark:border-zinc-800">
                      +880
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (formErrors.mobile) {
                          setFormErrors((prev) => ({ ...prev, mobile: undefined }));
                        }
                      }}
                      placeholder="1XXX-XXXXXX"
                      className="flex-1 px-4 py-3 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none text-xs md:text-sm"
                    />
                  </div>
                  {formErrors.mobile && (
                    <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1">
                      {formErrors.mobile}
                    </p>
                  )}
                </div>

                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">
                  * A 4-digit OTP will be sent for email and phone verification.
                </p>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center space-x-2 transition-all duration-200 text-xs md:text-sm mt-6 cursor-pointer"
                >
                  <span>Create Account</span>
                  <UserPlus className="w-4 h-4" />
                </button>
              </form>

              {/* Login redirection */}
              <div className="text-center text-xs md:text-sm text-zinc-550 dark:text-zinc-400 pt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#F26A1B] hover:text-[#db5b14] hover:underline"
                >
                  Log in
                </Link>
              </div>

              {/* Secure footer inside card */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center space-x-6">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-505 tracking-wider uppercase">
                  Secure Access
                </span>
                <div className="flex space-x-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-105 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-zinc-105 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side Illustration (desktop only) */}
            <div className="hidden lg:col-span-5 lg:flex flex-col items-center justify-center relative p-8">
              {/* Circular Backdrop wireframes */}
              <div className="absolute w-100 h-100 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center animate-spin [animation-duration:80s]">
                <div className="w-75 h-75 rounded-full border border-dashed border-zinc-202/80 dark:border-zinc-800/80"></div>
              </div>

              {/* Graphic card showcasing mock platform feature */}
              <div className="relative bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/80 dark:border-zinc-800/80 shadow-xl overflow-hidden w-full max-w-85 p-4 flex flex-col space-y-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-full h-40 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden relative">
                  <Image
                    className="object-cover opacity-90"
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400"
                    alt="Virtual classroom mockup"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="space-y-1 px-1">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Empowering Next-Gen</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">Access real-time schedules, interactive screens and tracked records.</p>
                </div>
              </div>

              {/* Floating Badge 1: Verified Tutors */}
              <div className="absolute top-12 left-6 bg-teal-500 text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg flex items-center space-x-1.5 animate-float hover:scale-105 transition-all">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Tutors</span>
              </div>

              {/* Floating Badge 2: Live Tracking */}
              <div className="absolute bottom-16 right-0 bg-[#F26A1B] text-white font-bold text-xs py-2.5 px-4 rounded-full shadow-lg flex items-center space-x-1.5 animate-float delay-200 hover:scale-105 transition-all">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></div>
                <span>Live Tracking</span>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* STEP 3: OTP Verification */}
      {step === 3 && (
        <main className="flex-1 bg-linear-to-tr from-[#eef2f7] to-[#e4e9f2] dark:from-zinc-950 dark:to-zinc-900 p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            
            {/* Logo at top */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
                <GraduationCap className="w-8 h-8" />
                <span className="text-2xl font-black tracking-tight">TutorKhujo</span>
              </div>
              <p className="text-xs text-zinc-550 dark:text-zinc-400">
                Empowering the next generation of learners.
              </p>
            </div>

            {/* Verification Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-4xl shadow-2xl p-8 md:p-10 space-y-6">
              
              {/* Envelope Icon */}
              <div className="mx-auto w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-teal-400 flex items-center justify-center shadow-sm">
                <Mail className="w-6 h-6 animate-bounce" />
              </div>

              {/* Card Header */}
              <div className="text-center space-y-1.5">
                <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  Verify your email
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-70 mx-auto leading-relaxed">
                  We have sent a verification code to <span className="font-bold text-zinc-800 dark:text-zinc-200">{email}</span>.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                
                {/* OTP Input Grid */}
                <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-12 h-14 text-center text-xl font-bold bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-[#F26A1B] focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition-all shadow-inner text-zinc-955 dark:text-white"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center space-x-1.5 transition-all text-xs md:text-sm cursor-pointer"
                >
                  <span>Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Resend OTP */}
              <div className="text-center flex flex-col items-center space-y-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Didn't receive code?
                </span>
                {isResendActive ? (
                  <button
                    onClick={resetOtpTimer}
                    className="text-xs font-bold text-[#F26A1B] hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                ) : (
                  <div className="flex items-center space-x-1 text-xs text-zinc-400 dark:text-zinc-500 font-semibold bg-zinc-50 dark:bg-zinc-950 px-3 py-1 rounded-full border border-zinc-100 dark:border-zinc-850">
                    <Clock className="w-3.5 h-3.5 animate-spin text-[#F26A1B]" />
                    <span>Resend (in {otpTimer}s)</span>
                  </div>
                )}
              </div>

              {/* Bottom links */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change email / phone number</span>
                </button>
              </div>

            </div>

          </div>
        </main>
      )}
    </div>
  );
}
