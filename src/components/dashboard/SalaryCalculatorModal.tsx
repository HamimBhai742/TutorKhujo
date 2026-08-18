"use client";

import React, { useState } from "react";
import { X, Calculator, Sparkles } from "lucide-react";

interface SalaryCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCATIONS = [
  "Dhanmondi, Dhaka",
  "Gulshan / Banani, Dhaka",
  "Uttara, Dhaka",
  "Mirpur, Dhaka",
  "Mohammadpur, Dhaka",
  "Banasree / Rampura, Dhaka",
  "Bashundhara R/A, Dhaka",
  "Chittagong City",
  "Sylhet City",
  "Rajshahi City",
];

const CLASS_LEVELS = [
  "Class 1 - 5 (Primary)",
  "Class 6 - 8 (Junior High)",
  "Class 9 - 10 (NCTB SSC)",
  "HSC 1st/2nd Year",
  "O-Level (Cambridge/Edexcel)",
  "A-Level (Cambridge/Edexcel)",
  "University Admission Test Prep",
];

const FREQUENCIES = ["2 Days / Week", "3 Days / Week", "4 Days / Week", "5 Days / Week"];

export default function SalaryCalculatorModal({ isOpen, onClose }: SalaryCalculatorModalProps) {
  const [location, setLocation] = useState<string>(LOCATIONS[0]);
  const [classLevel, setClassLevel] = useState<string>(CLASS_LEVELS[2]);
  const [frequency, setFrequency] = useState<string>(FREQUENCIES[1]);

  if (!isOpen) return null;

  // Real-time calculation logic
  const calculateRate = () => {
    let base = 5500;

    if (location.includes("Gulshan") || location.includes("Banani") || location.includes("Uttara") || location.includes("Bashundhara")) {
      base += 2500;
    } else if (location.includes("Dhanmondi")) {
      base += 2000;
    } else if (location.includes("Mirpur") || location.includes("Mohammadpur")) {
      base += 1000;
    }

    if (classLevel.includes("HSC") || classLevel.includes("A-Level") || classLevel.includes("Admission")) {
      base += 3000;
    } else if (classLevel.includes("Class 9") || classLevel.includes("O-Level")) {
      base += 1500;
    }

    if (frequency.includes("4 Days")) base += 1500;
    if (frequency.includes("5 Days")) base += 2500;

    const min = base - 500;
    const max = base + 2000;
    const avg = base + 750;

    return { min, max, avg };
  };

  const { min, max, avg } = calculateRate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-50 dark:bg-orange-955/30 text-[#F26A1B] rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900 dark:text-white">
                Market Standard Fee Calculator
              </h3>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Average tuition salary rates across Bangladesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block pl-1">
              Select Area / Location
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class Level */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block pl-1">
              Select Class / Curriculum
            </label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
            >
              {CLASS_LEVELS.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block pl-1">
              Teaching Frequency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCIES.map((freq) => (
                <button
                  type="button"
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    frequency === freq
                      ? "border-[#0F5B47] bg-teal-50 dark:bg-teal-955/20 text-[#0F5B47] dark:text-teal-400 font-extrabold"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-5 rounded-2xl bg-linear-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-200 dark:border-teal-900/30 text-center space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Recommended Market Standard Fee Range
          </span>
          <div className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
            ৳ {min.toLocaleString()} - ৳ {max.toLocaleString()} <span className="text-xs font-bold text-zinc-400">/ month</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-semibold">
            Average standard rate: <strong className="text-[#0F5B47] dark:text-[#188c6e]">৳ {avg.toLocaleString()} BDT</strong>
          </p>
        </div>

        {/* Close Action */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white font-extrabold text-xs rounded-2xl shadow-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
