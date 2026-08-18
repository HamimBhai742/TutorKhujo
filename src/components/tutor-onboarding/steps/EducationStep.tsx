import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { BANGLADESH_QUALIFICATIONS } from "@/data/qualifications";

interface Qualification {
  id: string;
  level: string;
  institution: string;
  subject: string;
  result: string;
  passingYear: string;
}

interface EducationStepProps {
  qualifications: Qualification[];
  handleAddQualification: () => void;
  handleUpdateQualification: (id: string, field: keyof Qualification, value: string) => void;
  handleDeleteQualification: (id: string) => void;
}

export default function EducationStep({
  qualifications,
  handleAddQualification,
  handleUpdateQualification,
  handleDeleteQualification
}: EducationStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Academic Background
        </h1>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Tell us about your educational qualifications. This helps build trust with students and guardians by verifying your expertise.
        </p>
      </div>

      {/* Qualification Cards Container */}
      <div className="space-y-6">
        {qualifications.map((qual, index) => (
          <div
            key={qual.id}
            className="relative p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/20 dark:bg-zinc-900/30 space-y-6"
          >
            {/* Left color bar */}
            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-[#0F5B47] dark:bg-[#188c6e]"></div>

            {/* Header bar within qualification box */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-[#0F5B47] dark:text-teal-400 tracking-wider">
                {index === 0 ? "Primary Qualification" : `Qualification #${index + 1}`}
              </span>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteQualification(qual.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level of Education */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 tracking-wider pl-1 uppercase">
                  Level of Education
                </label>
                <select
                  value={qual.level}
                  onChange={(e) => handleUpdateQualification(qual.id, "level", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm appearance-none cursor-pointer"
                >
                  <option value="Secondary">Secondary (SSC / O-Level)</option>
                  <option value="Higher Secondary">Higher Secondary (HSC / A-Level)</option>
                  <option value="Bachelor's Degree">{"Bachelor's Degree (BSc / BA / BBA)"}</option>
                  <option value="Master's Degree">{"Master's Degree (MSc / MA / MBA)"}</option>
                  <option value="PhD">PhD / Doctorate</option>
                </select>
              </div>

              {/* Institution Name */}
              <div className="space-y-1">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 tracking-wider uppercase">
                    Institution Name
                  </label>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={qual.institution}
                    onChange={(e) => handleUpdateQualification(qual.id, "institution", e.target.value)}
                    placeholder="e.g. University of Dhaka / BUET / North South University"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleUpdateQualification(qual.id, "institution", e.target.value);
                      }
                    }}
                    value=""
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="">-- Quick select top Bangladesh institution --</option>
                    {BANGLADESH_QUALIFICATIONS.map((group) => (
                      <optgroup key={group.category} label={group.category}>
                        {group.options.map((opt) => (
                          <option key={opt.value} value={opt.label}>
                            {opt.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject / Dept */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 tracking-wider pl-1 uppercase">
                  Subject / Department
                </label>
                <input
                  type="text"
                  value={qual.subject}
                  onChange={(e) => handleUpdateQualification(qual.id, "subject", e.target.value)}
                  placeholder="e.g. Mathematics & Pedagogy"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                />
              </div>

              {/* Result & Passing Year (Grid inside col) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-555 dark:text-zinc-400 tracking-wider pl-1 uppercase">
                    Result / CGPA
                  </label>
                  <input
                    type="text"
                    value={qual.result}
                    onChange={(e) => handleUpdateQualification(qual.id, "result", e.target.value)}
                    placeholder="e.g. 3.92"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-555 dark:text-zinc-400 tracking-wider pl-1 uppercase">
                    Passing Year
                  </label>
                  <select
                    value={qual.passingYear}
                    onChange={(e) => handleUpdateQualification(qual.id, "passingYear", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm appearance-none cursor-pointer"
                  >
                    {Array.from({ length: 30 }, (_, i) => 2005 + i).map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Qualification Button */}
        <button
          type="button"
          onClick={handleAddQualification}
          className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-zinc-200 hover:border-[#0F5B47] dark:border-zinc-800 dark:hover:border-teal-500 rounded-3xl text-zinc-500 hover:text-[#0F5B47] dark:hover:text-teal-400 transition-all font-semibold text-xs md:text-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Another Qualification</span>
        </button>
      </div>
    </div>
  );
}
