import React from "react";
import { Clock, MapPin, User, Trash2, Video, BadgeCheck, BookOpen } from "lucide-react";

interface PreferencesStepProps {
  tuitionModes: string[];
  handleToggleTuitionMode: (mode: string) => void;
  subjects: string[];
  handleAddSubject: (subject: string) => void;
  handleRemoveSubject: (subject: string) => void;
  subjectSearch: string;
  setSubjectSearch: (val: string) => void;
  salary: number;
  setSalary: (salary: number) => void;
  availability: Record<string, Record<string, boolean>>;
  handleToggleAvailability: (time: string, day: string) => void;
  days: string[];
  times: string[];
  subjectSuggestions: string[];
  videoIntroUrl: string;
  setVideoIntroUrl: (url: string) => void;
  curriculums: string[];
  handleToggleCurriculum: (curr: string) => void;
  specializations: string[];
  handleToggleSpecialization: (spec: string) => void;
}

const AVAILABLE_CURRICULUMS = [
  "NCTB (Bangla Medium)",
  "NCTB (English Version)",
  "English Medium (Edexcel)",
  "English Medium (Cambridge)",
  "Admission Test (Engineering/Varsity/Medical)",
  "Religious / Madrasah"
];

const AVAILABLE_SPECIALIZATIONS = [
  "Physics Specialist",
  "Math Olympiad Coach",
  "BUET Admission Focus",
  "Medical Admission Focus",
  "O/A Level Expert",
  "English Spoken & Grammar",
  "Creative Science Projects"
];

export default function PreferencesStep({
  tuitionModes,
  handleToggleTuitionMode,
  subjects,
  handleAddSubject,
  handleRemoveSubject,
  subjectSearch,
  setSubjectSearch,
  salary,
  setSalary,
  availability,
  handleToggleAvailability,
  days,
  times,
  subjectSuggestions,
  videoIntroUrl,
  setVideoIntroUrl,
  curriculums,
  handleToggleCurriculum,
  specializations,
  handleToggleSpecialization
}: PreferencesStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Teaching Preferences & Credibility
        </h1>
        <p className="text-sm text-zinc-555 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Set your curriculum specializations, demo video intro, availability, and salary requirements to stand out.
        </p>
      </div>

      {/* Demo Video Intro */}
      <div className="space-y-3 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-teal-50/10 dark:bg-zinc-900/30">
        <div className="flex items-center space-x-2">
          <Video className="w-5 h-5 text-[#0F5B47] dark:text-teal-400" />
          <h3 className="text-xs font-bold text-zinc-800 dark:text-white uppercase tracking-wider">
            Demo Class / Video Intro Link (Optional)
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Add a 30-60 sec YouTube or Vimeo video link introducing yourself or showcasing a short teaching demo to boost conversions.
        </p>
        <input
          type="url"
          value={videoIntroUrl}
          onChange={(e) => setVideoIntroUrl(e.target.value)}
          placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
        />
      </div>

      {/* Board & Curriculum Specialization */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 pl-1">
          <BookOpen className="w-4 h-4 text-[#0F5B47] dark:text-teal-400" />
          <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
            Board & Curriculum Specialization
          </h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {AVAILABLE_CURRICULUMS.map((curr) => {
            const isSelected = curriculums.includes(curr);
            return (
              <button
                type="button"
                key={curr}
                onClick={() => handleToggleCurriculum(curr)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0F5B47] text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {curr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Specialization Badges */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 pl-1">
          <BadgeCheck className="w-4 h-4 text-[#F26A1B]" />
          <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
            Specialization Badges
          </h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {AVAILABLE_SPECIALIZATIONS.map((spec) => {
            const isSelected = specializations.includes(spec);
            return (
              <button
                type="button"
                key={spec}
                onClick={() => handleToggleSpecialization(spec)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#F26A1B] text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                {isSelected ? "★ " : "+ "}
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tuition Modes */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider pl-1">
          Preferred Tuition Mode
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Online", desc: "Conduct sessions via video call", icon: Clock },
            { name: "Student's Home", desc: "Travel to student's location", icon: MapPin },
            { name: "Tutor's Home", desc: "Student comes to your place", icon: User }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = tuitionModes.includes(mode.name);
            return (
              <div
                key={mode.name}
                onClick={() => handleToggleTuitionMode(mode.name)}
                className={`p-5 rounded-3xl border-2 cursor-pointer flex flex-col items-center justify-between text-center transition-all ${
                  isSelected
                    ? "border-[#0F5B47] bg-teal-50/20 dark:border-teal-500 dark:bg-teal-955/10 text-zinc-800 dark:text-white"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50/30"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center mb-3">
                  <Icon className={`w-5 h-5 ${isSelected ? "text-[#0F5B47] dark:text-teal-400" : "text-zinc-400"}`} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-800 dark:text-white">{mode.name}</h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-400 mt-1 leading-normal max-w-40">{mode.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Expertise */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider pl-1">
          Subject Expertise
        </h3>
        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4">
          
          {/* Selected Tags list */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <div
                key={sub}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#0F5B47] text-white rounded-full text-xs font-semibold"
              >
                <span>{sub}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(sub)}
                  className="hover:bg-teal-900 p-0.5 rounded-full"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {subjects.length === 0 && (
              <span className="text-xs text-zinc-400 pl-1 italic">No subjects selected yet.</span>
            )}
          </div>

          {/* Subject Input */}
          <div className="relative">
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubject(subjectSearch);
                }
              }}
              placeholder="Search and add subjects... (press Enter to add custom)"
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-855 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
            />
          </div>

          {/* Suggestions Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Suggested:</span>
            {subjectSuggestions
              .filter((s) => !subjects.includes(s))
              .map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => handleAddSubject(s)}
                  className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-650 dark:text-zinc-300 text-xs rounded-full font-medium transition-colors"
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Weekly Availability Table Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider pl-1">
          Weekly Availability
        </h3>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-125 border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 py-3.5 text-left font-bold text-zinc-555 dark:text-zinc-300 w-32">Time of Day</th>
                  {days.map((day) => (
                    <th key={day} className="px-3 py-3.5 text-center font-bold text-zinc-555 dark:text-zinc-300">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time) => (
                  <tr key={time} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <td className="px-4 py-4 font-semibold text-zinc-700 dark:text-zinc-300 capitalize">{time}</td>
                    {days.map((day) => {
                      const isChecked = availability[time]?.[day] || false;
                      return (
                        <td key={day} className="px-3 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAvailability(time, day)}
                            className="w-4 h-4 accent-[#F26A1B] cursor-pointer"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expected Salary Range Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pl-1">
          <h3 className="text-xs font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider">
            Expected Salary
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl px-3 py-1.5 max-w-45">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-555 mr-1.5">BDT</span>
              <input
                type="number"
                min={500}
                value={salary || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSalary(val);
                }}
                onBlur={() => {
                  if (!salary || salary < 500) {
                    setSalary(500);
                  }
                }}
                className="w-full bg-transparent focus:outline-none text-xs md:text-sm font-bold text-zinc-850 dark:text-white"
              />
              <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 ml-1.5">/ month</span>
            </div>
          </div>
        </div>
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-4 bg-zinc-50/20 dark:bg-zinc-900/30">
          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={salary >= 500 && salary <= 50000 ? salary : 5000}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#F26A1B]"
          />
          <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wide">
            <span>BDT 500</span>
            <span>BDT 50,000+</span>
          </div>
          {salary < 500 && (
            <p className="text-[10px] text-red-500 font-semibold pl-1">
              * Minimum expected salary is BDT 500 per month
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
