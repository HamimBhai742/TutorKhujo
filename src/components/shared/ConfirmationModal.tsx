"use client";

import React, { useEffect } from "react";
import { X, AlertTriangle, CheckCircle2, Info, AlertOctagon } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  isLoading = false,
}: ConfirmationModalProps) {
  // Prevent scrolling background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Icon and theme selection based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertOctagon className="text-red-600 dark:text-red-400" size={24} />,
          iconBg: "bg-red-50 dark:bg-red-950/30",
          btnColor: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
          border: "border-red-100 dark:border-red-950/50",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={24} />,
          iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
          btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
          border: "border-emerald-100 dark:border-emerald-950/50",
        };
      case "info":
        return {
          icon: <Info className="text-blue-600 dark:text-blue-400" size={24} />,
          iconBg: "bg-blue-50 dark:bg-blue-950/30",
          btnColor: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
          border: "border-blue-100 dark:border-blue-950/50",
        };
      case "warning":
      default:
        return {
          icon: <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />,
          iconBg: "bg-amber-50 dark:bg-amber-950/30",
          btnColor: "bg-[#0F5B47] hover:bg-[#0c4a39] text-white focus:ring-[#0c4a39]",
          border: "border-amber-100 dark:border-amber-950/50",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with backdrop-blur */}
      <div
        className="fixed inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all transform scale-100 animate-in zoom-in-95 duration-200 ${styles.border}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className={`shrink-0 rounded-2xl p-3 ${styles.iconBg}`}>
            {styles.icon}
          </div>

          {/* Text Content */}
          <div className="flex-1 mt-1">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${styles.btnColor}`}
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
