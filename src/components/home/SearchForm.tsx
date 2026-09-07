"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight, X, Loader2, BookOpen, Sparkles } from "lucide-react";

// Curated comprehensive subjects across Bangladesh curriculum & skills
const POPULAR_SUBJECTS = [
  "Mathematics",
  "Higher Mathematics",
  "General Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "English Literature",
  "English Spoken & Grammar",
  "Bangla",
  "ICT (Computer & Tech)",
  "Accounting",
  "Finance & Banking",
  "Business Studies",
  "Economics",
  "Statistics",
  "General Science",
  "Social Science (BGS)",
  "Arabic / Quran Learning",
  "Islamic Studies",
  "Computer Programming (Python/C++)",
  "History",
  "Geography",
  "Psychology",
  "Law",
  "Art & Drawing"
];

// Popular Bangladesh districts and key Dhaka residential hubs
const POPULAR_LOCATIONS = [
  { displayName: "Dhanmondi, Dhaka", subTitle: "Dhaka Division" },
  { displayName: "Mirpur, Dhaka", subTitle: "Mirpur 1-14, Dhaka" },
  { displayName: "Uttara, Dhaka", subTitle: "Sectors 1-18, Dhaka" },
  { displayName: "Gulshan, Dhaka", subTitle: "Gulshan 1 & 2, Dhaka" },
  { displayName: "Banani, Dhaka", subTitle: "Dhaka Division" },
  { displayName: "Mohammadpur, Dhaka", subTitle: "Dhaka Division" },
  { displayName: "Bashundhara R/A, Dhaka", subTitle: "Dhaka Division" },
  { displayName: "Badda, Dhaka", subTitle: "Middle/North Badda, Dhaka" },
  { displayName: "Mohakhali, Dhaka", subTitle: "DOHS & Mohakhali, Dhaka" },
  { displayName: "Malibagh, Dhaka", subTitle: "Dhaka Division" },
  { displayName: "Moghbazar, Dhaka", subTitle: "Dhaka Division" },
  { displayName: "Farmgate, Dhaka", subTitle: "Tejgaon, Dhaka" },
  { displayName: "Motijheel, Dhaka", subTitle: "Commercial Area, Dhaka" },
  { displayName: "Khilgaon, Dhaka", subTitle: "Taltola & Khilgaon, Dhaka" },
  { displayName: "Rampura, Dhaka", subTitle: "Banasree & Rampura, Dhaka" },
  { displayName: "Chittagong", subTitle: "Chittagong Division" },
  { displayName: "Sylhet", subTitle: "Sylhet Division" },
  { displayName: "Rajshahi", subTitle: "Rajshahi Division" },
  { displayName: "Khulna", subTitle: "Khulna Division" },
  { displayName: "Barishal", subTitle: "Barishal Division" },
  { displayName: "Rangpur", subTitle: "Rangpur Division" },
  { displayName: "Comilla", subTitle: "Chittagong Division" },
  { displayName: "Gazipur", subTitle: "Dhaka Division" },
  { displayName: "Narayanganj", subTitle: "Dhaka Division" },
];

interface LocationItem {
  displayName: string;
  subTitle?: string;
}

export default function SearchForm() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [focusedField, setFocusedField] = useState<"subject" | "location" | null>(null);

  // Subject dropdown state
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(-1);

  // Location dropdown state
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
  const [dynamicLocations, setDynamicLocations] = useState<LocationItem[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const containerRef = useRef<HTMLFormElement>(null);
  const locationDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered Subject Suggestions
  const subjectSuggestions = useMemo(() => {
    const q = subject.trim().toLowerCase();
    if (!q) {
      return POPULAR_SUBJECTS.slice(0, 8);
    }
    return POPULAR_SUBJECTS.filter((s) => s.toLowerCase().includes(q)).slice(0, 8);
  }, [subject]);

  // Combined Location Suggestions (Local + Dynamic API)
  const locationSuggestions = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) {
      return POPULAR_LOCATIONS.slice(0, 8);
    }
    if (dynamicLocations.length > 0) {
      return dynamicLocations;
    }
    return POPULAR_LOCATIONS.filter(
      (l) => l.displayName.toLowerCase().includes(q) || (l.subTitle && l.subTitle.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [location, dynamicLocations]);

  // Dynamic Location Fetch from /api/locations
  useEffect(() => {
    const q = location.trim();
    if (q.length < 2) {
      setDynamicLocations([]);
      return;
    }

    if (locationDebounceRef.current) {
      clearTimeout(locationDebounceRef.current);
    }

    locationDebounceRef.current = setTimeout(async () => {
      try {
        setIsLocationLoading(true);
        const res = await fetch(`/api/locations?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
            setDynamicLocations(json.data);
          }
        }
      } catch (err) {
        console.warn("Location fetch error:", err);
      } finally {
        setIsLocationLoading(false);
      }
    }, 250);

    return () => {
      if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current);
    };
  }, [location]);

  // Click outside listener to dismiss dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSubjectOpen(false);
        setIsLocationOpen(false);
        setFocusedField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form Submit Handler
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubjectOpen(false);
    setIsLocationOpen(false);

    const params = new URLSearchParams();
    if (subject.trim()) {
      params.set("subject", subject.trim());
    }
    if (location.trim()) {
      params.set("location", location.trim());
    }

    const queryStr = params.toString();
    router.push(queryStr ? `/tutors?${queryStr}` : "/tutors");
  };

  // Subject Keyboard Navigation
  const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSubjectOpen || subjectSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSubjectIndex((prev) => (prev < subjectSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSubjectIndex((prev) => (prev > 0 ? prev - 1 : subjectSuggestions.length - 1));
    } else if (e.key === "Enter") {
      if (selectedSubjectIndex >= 0 && selectedSubjectIndex < subjectSuggestions.length) {
        e.preventDefault();
        setSubject(subjectSuggestions[selectedSubjectIndex]);
        setIsSubjectOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsSubjectOpen(false);
    }
  };

  // Location Keyboard Navigation
  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isLocationOpen || locationSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedLocationIndex((prev) => (prev < locationSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedLocationIndex((prev) => (prev > 0 ? prev - 1 : locationSuggestions.length - 1));
    } else if (e.key === "Enter") {
      if (selectedLocationIndex >= 0 && selectedLocationIndex < locationSuggestions.length) {
        e.preventDefault();
        setLocation(locationSuggestions[selectedLocationIndex].displayName);
        setIsLocationOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsLocationOpen(false);
    }
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSearch}
      className={`relative z-30 flex flex-col md:flex-row items-center w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl md:rounded-full p-2 gap-2 md:gap-0 transition-all duration-300 ${
        focusedField
          ? "shadow-xl ring-2 ring-[#0F5B47]/20 border-[#0F5B47] dark:border-[#188c6e]"
          : "shadow-md hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {/* 1. Subject Input & Autocomplete */}
      <div className="relative flex-1 w-full">
        <div
          className={`flex items-center w-full px-4 py-3 md:py-2 border-b border-zinc-100 dark:border-zinc-800 md:border-b-0 md:border-r border-solid rounded-xl md:rounded-none transition-colors duration-200 ${
            focusedField === "subject" ? "bg-zinc-50/70 dark:bg-zinc-800/30" : ""
          }`}
        >
          <Search
            className={`w-5 h-5 mr-3 shrink-0 transition-all duration-300 ${
              focusedField === "subject"
                ? "text-[#0F5B47] dark:text-[#188c6e] scale-110"
                : "text-zinc-400"
            }`}
          />
          <input
            type="text"
            placeholder="Subject (e.g. Physics, Math)"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setIsSubjectOpen(true);
              setSelectedSubjectIndex(-1);
            }}
            onFocus={() => {
              setFocusedField("subject");
              setIsSubjectOpen(true);
              setIsLocationOpen(false);
            }}
            onKeyDown={handleSubjectKeyDown}
            className="w-full bg-transparent text-sm focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-medium"
          />

          {subject && (
            <button
              type="button"
              onClick={() => {
                setSubject("");
                setIsSubjectOpen(true);
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer rounded-full ml-1"
              title="Clear subject"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Subject Suggestions Dropdown */}
        {isSubjectOpen && (
          <div className="absolute top-full mt-2 left-0 w-full md:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-850/60 flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0F5B47]" />
                {subject.trim() ? "Suggested Subjects" : "Popular Subjects"}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">Select or type</span>
            </div>

            {subjectSuggestions.length > 0 ? (
              <ul className="py-1 max-h-60 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {subjectSuggestions.map((item, index) => {
                  const isSelected = index === selectedSubjectIndex;
                  return (
                    <li
                      key={item}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSubject(item);
                        setIsSubjectOpen(false);
                        // Move focus to location if empty
                        if (!location) {
                          setFocusedField("location");
                          setIsLocationOpen(true);
                        }
                      }}
                      className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#0F5B47] dark:text-emerald-300 font-bold"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-[#0F5B47] shrink-0" />
                        <span className="text-xs">{item}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">Subject</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center">
                <p className="text-xs text-zinc-500">No preset subject matching &quot;{subject}&quot;.</p>
                <p className="text-[11px] text-[#0F5B47] dark:text-emerald-400 font-semibold mt-1">
                  You can still search for &quot;{subject}&quot;!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Location Input & Autocomplete */}
      <div className="relative flex-1 w-full">
        <div
          className={`flex items-center w-full px-4 py-3 md:py-2 rounded-xl md:rounded-none transition-colors duration-200 ${
            focusedField === "location" ? "bg-zinc-50/70 dark:bg-zinc-800/30" : ""
          }`}
        >
          <MapPin
            className={`w-5 h-5 mr-3 shrink-0 transition-all duration-300 ${
              focusedField === "location"
                ? "text-[#0F5B47] dark:text-[#188c6e] scale-110"
                : "text-zinc-400"
            }`}
          />
          <input
            type="text"
            placeholder="Location (e.g. Dhanmondi, Mirpur)"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setIsLocationOpen(true);
              setSelectedLocationIndex(-1);
            }}
            onFocus={() => {
              setFocusedField("location");
              setIsLocationOpen(true);
              setIsSubjectOpen(false);
            }}
            onKeyDown={handleLocationKeyDown}
            className="w-full bg-transparent text-sm focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-medium"
          />

          {isLocationLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-[#0F5B47] animate-spin ml-1 shrink-0" />
          ) : location ? (
            <button
              type="button"
              onClick={() => {
                setLocation("");
                setIsLocationOpen(true);
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer rounded-full ml-1"
              title="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Location Suggestions Dropdown */}
        {isLocationOpen && (
          <div className="absolute top-full mt-2 left-0 w-full md:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-850/60 flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0F5B47]" />
                {location.trim() ? "Matching Locations" : "Popular Locations"}
              </span>
              {isLocationLoading && (
                <span className="text-[10px] text-[#0F5B47] font-semibold animate-pulse">
                  Searching...
                </span>
              )}
            </div>

            {locationSuggestions.length > 0 ? (
              <ul className="py-1 max-h-60 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {locationSuggestions.map((item, index) => {
                  const isSelected = index === selectedLocationIndex;
                  return (
                    <li
                      key={`${item.displayName}-${index}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLocation(item.displayName);
                        setIsLocationOpen(false);
                      }}
                      className={`px-4 py-2.5 flex items-start gap-2.5 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#0F5B47] dark:text-emerald-300"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-[#0F5B47] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{item.displayName}</p>
                        {item.subTitle && (
                          <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                            {item.subTitle}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center">
                <p className="text-xs text-zinc-500">No preset location matching &quot;{location}&quot;.</p>
                <p className="text-[11px] text-[#0F5B47] dark:text-emerald-400 font-semibold mt-1">
                  You can still search for &quot;{location}&quot;!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto px-8 py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] active:scale-98 text-white font-bold text-sm rounded-xl md:rounded-full transition-all duration-200 shadow-md hover:shadow-lg shrink-0 flex items-center justify-center gap-2 group/btn cursor-pointer"
      >
        <span>Search Tutors</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </form>
  );
}
