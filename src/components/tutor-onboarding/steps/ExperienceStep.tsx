/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Briefcase, Trash, Plus } from "lucide-react";

interface ExperienceEntry {
  id: string;
  title: string;
  institution: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface ExperienceStepProps {
  totalYearsExp: string;
  setTotalYearsExp: (exp: string) => void;
  experiences: ExperienceEntry[];
  handleAddExperience: () => void;
  handleUpdateExperience: (id: string, field: keyof ExperienceEntry, value: any) => void;
  handleDeleteExperience: (id: string) => void;
}

export default function ExperienceStep({
  totalYearsExp,
  setTotalYearsExp,
  experiences,
  handleAddExperience,
  handleUpdateExperience,
  handleDeleteExperience
}: ExperienceStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Teaching Experience
        </h1>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Share your professional background to help students trust your expertise. Your experience helps you stand out to potential learners.
        </p>
      </div>

      {/* Total Experience years select */}
      <div className="p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/20 dark:bg-zinc-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider pl-1">
            TOTAL YEARS OF EXPERIENCE
          </label>
          <select
            value={totalYearsExp}
            onChange={(e) => setTotalYearsExp(e.target.value)}
            className="w-full md:w-80 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm appearance-none cursor-pointer"
          >
            <option value="No Experience">No Experience (Fresh Graduate)</option>
            <option value="Less than 1 year">Less than 1 year</option>
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5+ years">5+ years</option>
          </select>
        </div>
        <div className="text-right">
          <span className="text-4xl font-extrabold text-[#F26A1B]">Step 4/4</span>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">Finalizing Profile</p>
        </div>
      </div>

      {/* Experience entries block */}
      <div className="space-y-6">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="relative p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/20 dark:bg-zinc-900/30 space-y-6"
          >
            {/* Left icon wrapper */}
            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-teal-600"></div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-955/30 flex items-center justify-center text-[#0F5B47]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-zinc-800 dark:text-white">Experience Entry</span>
              </div>
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-xl transition-all cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => handleUpdateExperience(exp.id, "title", e.target.value)}
                  placeholder="e.g. Mathematics Teacher"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                />
              </div>

              {/* Institution Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                  Institution / Platform Name
                </label>
                <input
                  type="text"
                  value={exp.institution}
                  onChange={(e) => handleUpdateExperience(exp.id, "institution", e.target.value)}
                  placeholder="e.g. Dhaka Science Academy"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider pl-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={exp.endDate}
                  disabled={exp.isCurrent}
                  onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm disabled:opacity-50"
                />
              </div>

              {/* Current Checkbox */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs md:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={(e) => handleUpdateExperience(exp.id, "isCurrent", e.target.checked)}
                    className="w-4 h-4 accent-[#F26A1B] cursor-pointer"
                  />
                  <span>I am currently working here</span>
                </label>
              </div>

              {/* Description */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider pl-1">
                  Description & Achievements
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                  rows={3}
                  placeholder="Briefly describe your key responsibilities and any student successes..."
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm resize-none"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Experience Button */}
        <button
          type="button"
          onClick={handleAddExperience}
          className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-zinc-200 hover:border-[#0F5B47] dark:border-zinc-800 dark:hover:border-teal-500 rounded-3xl text-zinc-500 hover:text-[#0F5B47] dark:hover:text-teal-400 transition-all font-semibold text-xs md:text-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Another Experience</span>
        </button>
      </div>
    </div>
  );
}
