"use client";

import React, { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";

export default function SearchForm() {
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [focusedField, setFocusedField] = useState<"subject" | "location" | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { subject, location });
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col md:flex-row items-center w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl md:rounded-full p-2 gap-2 md:gap-0 transition-all duration-300 ${
        focusedField 
          ? "shadow-lg shadow-teal-500/5 ring-2 ring-teal-500/20 border-teal-500 dark:border-[#188c6e]" 
          : "shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {/* Subject Input */}
      <div 
        className={`flex items-center flex-1 w-full px-4 py-3 md:py-2 border-b border-zinc-100 dark:border-zinc-800 md:border-b-0 md:border-r border-solid transition-colors duration-200 ${
          focusedField === "subject" ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""
        }`}
      >
        <Search 
          className={`w-5 h-5 mr-3 shrink-0 transition-all duration-300 ${
            focusedField === "subject" 
              ? "text-[#0F5B47] dark:text-[#188c6e] scale-110 rotate-3" 
              : "text-zinc-400"
          }`} 
        />
        <input
          type="text"
          placeholder="Subject (e.g. Physics)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onFocus={() => setFocusedField("subject")}
          onBlur={() => setFocusedField(null)}
          className="w-full bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-450"
        />
      </div>

      {/* Location Input */}
      <div 
        className={`flex items-center flex-1 w-full px-4 py-3 md:py-2 transition-colors duration-200 ${
          focusedField === "location" ? "bg-zinc-50/50 dark:bg-zinc-800/20" : ""
        }`}
      >
        <MapPin 
          className={`w-5 h-5 mr-3 shrink-0 transition-all duration-300 ${
            focusedField === "location" 
              ? "text-[#0F5B47] dark:text-[#188c6e] scale-110 animate-bounce" 
              : "text-zinc-400"
          }`} 
        />
        <input
          type="text"
          placeholder="Location (e.g. Dhaka)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onFocus={() => setFocusedField("location")}
          onBlur={() => setFocusedField(null)}
          className="w-full bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-450"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] active:scale-98 text-white font-semibold text-sm rounded-xl md:rounded-full transition-all duration-200 shadow-md hover:shadow-lg shrink-0 flex items-center justify-center gap-2 group/btn cursor-pointer"
      >
        <span>Search Tutors</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </form>
  );
}
