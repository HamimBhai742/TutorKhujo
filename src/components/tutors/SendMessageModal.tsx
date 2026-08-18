"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Send,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Sparkles,
  GraduationCap,
  LogIn,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    id: string;
    name: string;
    avatarBg?: string;
    initials?: string;
    university?: string;
    department?: string;
    subjects?: string[];
  };
  onSuccess?: (conversationId: string) => void;
}

export default function SendMessageModal({
  isOpen,
  onClose,
  tutor,
  onSuccess,
}: SendMessageModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [subject, setSubject] = useState<string>(() => tutor.subjects?.[0] || "General Tuition");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [sentConvId, setSentConvId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickTemplates = [
    `Hi ${tutor.name}, I am interested in hiring you for ${subject}. Could you please let me know your available schedule?`,
    `Hello! I need tuition assistance for Class 9/10 NCTB curriculum in ${subject}. Are you available for home/online tutoring?`,
    `Hi! I saw your profile and would like to discuss teaching methodology and weekly class frequency.`,
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg("Please write a message before sending.");
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/tutors/${tutor.id}`);
      return;
    }

    if (user.id === tutor.id) {
      setErrorMsg("You cannot send a message request to your own profile.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // 1. Create or retrieve conversation
      const convRes = await api.post("/messages/conversations", {
        otherUserId: tutor.id,
        tutorId: tutor.id,
      });

      const conversationId = convRes.data?.data?.id;

      if (!conversationId) {
        throw new Error("Failed to initialize conversation");
      }

      // 2. Send the message
      const fullContent = subject && subject !== "General Tuition"
        ? `[Inquiry: ${subject}]\n${message.trim()}`
        : message.trim();

      await api.post("/messages", {
        conversationId,
        content: fullContent,
      });

      setSentConvId(conversationId);
      if (onSuccess) onSuccess(conversationId);
    } catch (err: any) {
      console.error("Error sending message request:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to send message request. Please ensure you are logged in and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToMessages = () => {
    onClose();
    router.push(`/dashboard?tab=messages`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#0F5B47]/10 dark:bg-[#188c6e]/20 text-[#0F5B47] dark:text-[#188c6e] rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Message Request
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Connect directly with {tutor.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {sentConvId ? (
          /* Success State */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-75">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-zinc-900 dark:text-white">
                Message Request Sent! 🎉
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Your message has been delivered to <strong>{tutor.name}</strong>. You can view replies and continue chatting in your dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleGoToMessages}
                className="flex-1 py-3 px-4 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Go to Messages Chat</span>
              </button>

              <button
                onClick={onClose}
                className="py-3 px-5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : !user ? (
          /* Non-Authenticated Prompt */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-[#F26A1B] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <LogIn className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-zinc-900 dark:text-white">
                Login to Message {tutor.name}
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Please log in or create a student/parent account to send message requests and chat directly with verified tutors.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => router.push(`/login?redirect=/tutors/${tutor.id}`)}
                className="w-full py-3.5 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Send Message</span>
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Create New Account
              </button>
            </div>
          </div>
        ) : (
          /* Main Message Form */
          <form onSubmit={handleSend} className="p-6 space-y-5">
            {/* Tutor Header Info Card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-zinc-50 dark:bg-zinc-900/80 rounded-2xl border border-zinc-150 dark:border-zinc-850">
              <div
                className={`w-12 h-12 rounded-xl ${tutor.avatarBg || "bg-[#0F5B47]"} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}
              >
                {tutor.initials || tutor.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white truncate">
                  {tutor.name}
                </h4>
                <p className="text-xs text-zinc-500 font-semibold truncate flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>{tutor.university || "Verified Educator"}</span>
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Subject Selector */}
            {tutor.subjects && tutor.subjects.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                  Select Subject / Topic:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.subjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        subject === sub
                          ? "bg-[#0F5B47] text-white shadow-xs"
                          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quick Starter Messages:</span>
              </span>
              <div className="space-y-1.5">
                {quickTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(template)}
                    className="w-full text-left p-2.5 bg-zinc-50 hover:bg-teal-50/50 dark:bg-zinc-900/40 dark:hover:bg-teal-950/20 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors cursor-pointer truncate block font-medium"
                  >
                    &ldquo;{template}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Your Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Write your inquiry for ${tutor.name}... (e.g. Class level, area, preferred time)`}
                rows={4}
                required
                className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex-1 py-3 bg-[#0F5B47] hover:bg-[#0c4a39] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
