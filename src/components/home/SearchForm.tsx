"use client";

import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";

export default function SearchForm() {
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic will go here
    console.log("Searching for:", { subject, location });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row items-center w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl md:rounded-full p-2 shadow-sm gap-2 md:gap-0"
    >
      {/* Subject Input */}
      <div className="flex items-center flex-1 w-full px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 md:border-b-0 md:border-r border-solid">
        <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Subject (e.g. Physics)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </div>

      {/* Location Input */}
      <div className="flex items-center flex-1 w-full px-4 py-2">
        <MapPin className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Location (e.g. Dhaka)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-medium text-sm rounded-xl md:rounded-full transition-all duration-200 shadow-sm shrink-0 cursor-pointer"
      >
        Search Tutors
      </button>
    </form>
  );
}
