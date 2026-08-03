/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Lock,
  GraduationCap,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') || '';
  const resetToken = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationError = (!email || !resetToken)
    ? 'Invalid reset request. Missing required parameters. Please request a new OTP code.'
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !resetToken) {
      setError('Missing email or reset token. Please request a new OTP.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || 'Password reset failed. Please request a new OTP code.';
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
              Reset Password
            </h2>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              Enter your new secure password below to update your account.
            </p>
          </div>

          {/* Error Notification */}
          {(error || validationError) && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              <span>{error || validationError}</span>
            </div>
          )}

          {/* Success Notification */}
          {success && (
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-[#0F5B47] dark:text-[#188c6e] text-xs md:text-sm font-semibold flex items-start">
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Password Reset Successfully!</p>
                <p className="text-[10px] mt-0.5 opacity-90">
                  Redirecting you to the login page...
                </p>
              </div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={!email || !resetToken}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={!email || !resetToken}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !resetToken}
                className="w-full py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center space-x-2 transition-all duration-200 text-xs md:text-sm mt-6 cursor-pointer"
              >
                <span>{isLoading ? 'Saving...' : 'Update Password'}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          )}

          {success && (
            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-xs md:text-sm font-bold text-[#0F5B47] dark:text-[#188c6e] hover:underline"
              >
                Click here if you are not automatically redirected
              </Link>
            </div>
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
