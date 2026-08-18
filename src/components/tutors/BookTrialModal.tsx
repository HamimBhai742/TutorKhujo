"use client";

import React, { useState } from "react";
import { X, Calendar, CheckCircle, Loader2 } from "lucide-react";

interface BookTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    id: string;
    name: string;
    department?: string;
    university?: string;
  };
  onSuccess?: () => void;
}

const TIME_SLOTS = [
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM",
  "08:00 PM - 09:00 PM",
];

export default function BookTrialModal({ isOpen, onClose, tutor, onSuccess }: BookTrialModalProps) {
  const [minDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[1]);
  const [subject, setSubject] = useState<string>("Physics");
  const [classLevel, setClassLevel] = useState<string>("Class 9 (NCTB)");
  const [notes, setNotes] = useState<string>("Interested in 1st free trial class to assess student baseline.");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Simulate API call for trial booking
      await new Promise((res) => setTimeout(res, 800));

      setSuccessMsg("1st Free Trial Class Booked Successfully!");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch {
      setErrorMsg("Failed to book trial session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-955/30 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              100% Free • No Commitment
            </span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mt-1">
              Book 1st Free Trial Class with {tutor.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-black text-zinc-900 dark:text-white">
              {successMsg}
            </h4>
            <p className="text-xs font-bold text-zinc-400">
              {tutor.name} has been notified via instant chat and SMS alert.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-955/30 border border-red-200 text-red-600 text-xs font-bold rounded-2xl">
                {errorMsg}
              </div>
            )}

            {/* Preferred Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block pl-1">
                Preferred Trial Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={minDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
                required
              />
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block pl-1">
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      selectedSlot === slot
                        ? "border-[#0F5B47] bg-teal-50 dark:bg-teal-955/30 text-[#0F5B47] dark:text-teal-400 font-black"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject & Class */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block pl-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block pl-1">
                  Class Level
                </label>
                <input
                  type="text"
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-bold focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block pl-1">
                Note for Tutor
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-semibold focus:outline-none resize-none"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-extrabold text-xs rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-teal-500/20 flex items-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Confirm Free Demo Class</span>
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
