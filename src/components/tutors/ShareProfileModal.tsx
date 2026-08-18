"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2, ShieldCheck, Star } from "lucide-react";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    id: string;
    name: string;
    department?: string;
    university?: string;
    rating?: number;
    initials?: string;
    avatarBg?: string;
  };
}

export default function ShareProfileModal({ isOpen, onClose, tutor }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://tutorkhujo.com";
  const profileUrl = `${currentOrigin}/tutors/${tutor.id}`;
  const shareText = `Check out ${tutor.name}'s Tutor Profile on TutorKhujo! Qualified tutor for home & online classes.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      bgColor: "bg-emerald-500 hover:bg-emerald-600 text-white",
      link: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${profileUrl}`)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
      ),
    },
    {
      name: "Facebook",
      bgColor: "bg-blue-600 hover:bg-blue-700 text-white",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      bgColor: "bg-sky-700 hover:bg-sky-800 text-white",
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">
              Share Tutor Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio Card Preview */}
        <div className="p-4 rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-150/60 dark:border-zinc-800 flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl ${tutor.avatarBg || "bg-[#0F5B47]"} flex items-center justify-center text-white text-xl font-black shrink-0 shadow-md`}>
            {tutor.initials || tutor.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate">
                {tutor.name}
              </h4>
              <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500 stroke-white shrink-0" />
            </div>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {tutor.department || "University Tutor"} • {tutor.university || "TutorKhujo Verified"}
            </p>
            <div className="flex items-center space-x-1 text-amber-500 text-[11px] font-extrabold mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{tutor.rating ? tutor.rating.toFixed(1) : "4.9"} Top Rated Tutor</span>
            </div>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block pl-1">
            Share Directly Via
          </label>
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl ${option.bgColor} font-extrabold text-xs transition-all shadow-xs space-y-1.5`}
              >
                {option.icon}
                <span>{option.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Direct Link Copy Input */}
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
          <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block pl-1">
            Copy Portfolio Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={profileUrl}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-bold focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-[#0F5B47] hover:bg-[#0c4838] dark:bg-[#188c6e] text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center space-x-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
