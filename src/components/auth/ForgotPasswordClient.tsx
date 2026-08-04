/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Mail,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle,
  Clock
} from "lucide-react";

type RecoveryStep = 1 | 2;

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(59);
  const [isResendActive, setIsResendActive] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Refs for OTP input navigation
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start OTP timer when step 2 is reached
  useEffect(() => {
    if (step !== 2 || isResendActive) return;

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

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message || "OTP code sent to your email.");
      setStep(2);
      setOtpTimer(59);
      setIsResendActive(false);
      setOtp(Array(6).fill(""));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to request password reset. Please try again.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message || "Verification OTP sent successfully.");
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

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/verify-reset-otp", { email, otpCode });
      const { resetToken } = response.data.data;
      
      // Redirect to reset password page with parameters
      router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Invalid OTP code. Please try again.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-tr from-[#eef2f7] to-[#e4e9f2] dark:from-zinc-950 dark:to-zinc-900 flex flex-col font-sans justify-between transition-colors duration-200">
      
      {/* Tiny Header */}
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
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-white/50 dark:border-zinc-800/80 rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-6">
          
          {/* Header Info */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 text-[#0F5B47] dark:text-[#188c6e]">
              <GraduationCap className="w-8 h-8" />
              <span className="text-2xl font-black tracking-tight">TutorKhujo</span>
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight pt-2">
              {step === 1 ? "Forgot Password" : "Verify OTP"}
            </h2>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              {step === 1 
                ? "Enter your email address to receive a 6-digit password reset OTP code." 
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-[#0F5B47] dark:text-[#188c6e] text-xs md:text-sm font-semibold flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center space-x-2 transition-all duration-200 text-xs md:text-sm mt-6 cursor-pointer"
              >
                <span>{isLoading ? "Sending..." : "Send OTP"}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs md:text-sm font-bold text-[#0F5B47] dark:text-[#188c6e] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back to Log In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase text-center block">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex justify-between items-center max-w-xs mx-auto gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-10 h-12 text-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
                    />
                  ))}
                </div>
              </div>

              {/* OTP countdown timer or resend button */}
              <div className="flex items-center justify-center text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                {isResendActive ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-[#F26A1B] hover:text-[#db5b14] hover:underline cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                ) : (
                  <span className="flex items-center space-x-1.5 font-medium">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>Resend code in <strong className="text-zinc-800 dark:text-white font-bold">{otpTimer}s</strong></span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#0F5B47] hover:bg-[#0c4a39] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all duration-200 text-xs md:text-sm cursor-pointer"
              >
                <KeyRound className="w-4.5 h-4.5 mr-1" />
                <span>{isLoading ? "Verifying..." : "Verify OTP"}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl text-xs md:text-sm transition-colors cursor-pointer"
              >
                Change Email Address
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center text-[10px] font-bold text-zinc-400 dark:text-zinc-555 tracking-widest uppercase">
        TutorKhujo &bull; Password Recovery
      </footer>

    </div>
  );
}
