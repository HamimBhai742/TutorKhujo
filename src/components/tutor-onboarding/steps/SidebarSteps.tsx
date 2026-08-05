import React from "react";
import { User, GraduationCap, Sliders, Briefcase, Check } from "lucide-react";

interface SidebarStepsProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  fullName: string;
}

export default function SidebarSteps({ activeStep, setActiveStep }: SidebarStepsProps) {
  const steps = [
    { number: 1, label: "Personal Info", icon: User },
    { number: 2, label: "Education", icon: GraduationCap },
    { number: 3, label: "Preferences", icon: Sliders },
    { number: 4, label: "Experience", icon: Briefcase }
  ];

  return (
    <nav className="flex flex-col space-y-3">
      {steps.map((stepItem) => {
        const Icon = stepItem.icon;
        const isCompleted = stepItem.number < activeStep;
        const isActive = stepItem.number === activeStep;

        return (
          <button
            key={stepItem.number}
            onClick={() => setActiveStep(stepItem.number)}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
              isActive
                ? "border-[#F26A1B] bg-orange-50/20 text-[#F26A1B] font-bold shadow-xs dark:bg-orange-950/10"
                : isCompleted
                ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50/10 text-[#0F5B47] dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? "bg-[#F26A1B] text-white"
                : isCompleted
                ? "bg-emerald-500 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-400"
            }`}>
              {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span className="text-xs md:text-sm font-semibold">{stepItem.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
