"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Star,
  MapPin,
  BookOpen,
  SlidersHorizontal,
  X,
  ChevronDown,
  Award,
  ArrowRight,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface Tutor {
  id: string;
  name: string;
  avatarBg: string;
  initials: string;
  university: string;
  department: string;
  rating: number;
  reviewsCount: number;
  subjects: string[];
  classLevels: string[];
  location: string;
  city: string;
  salary: number;
  mode: "Home" | "Online" | "Both";
  badge: string;
  gender: "Male" | "Female";
}

const MOCK_TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Ahsan Habib",
    avatarBg: "bg-emerald-600 dark:bg-emerald-700",
    initials: "AH",
    university: "Dhaka University (DU)",
    department: "B.Sc in Mathematics",
    rating: 4.9,
    reviewsCount: 32,
    subjects: ["Mathematics", "Physics"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Dhanmondi",
    city: "Dhaka",
    salary: 5000,
    mode: "Both",
    badge: "Top Rated",
    gender: "Male"
  },
  {
    id: "2",
    name: "Nusrat Jahan",
    avatarBg: "bg-teal-600 dark:bg-teal-700",
    initials: "NJ",
    university: "Dhaka University (DU)",
    department: "B.A in English Literature",
    rating: 4.8,
    reviewsCount: 21,
    subjects: ["English", "Biology"],
    classLevels: ["Class 1-5", "Class 6-9", "SSC"],
    location: "Banani",
    city: "Dhaka",
    salary: 6500,
    mode: "Online",
    badge: "Verified Expert",
    gender: "Female"
  },
  {
    id: "3",
    name: "Tamvir Ahmed",
    avatarBg: "bg-blue-600 dark:bg-blue-700",
    initials: "TA",
    university: "BUET",
    department: "B.Sc in Computer Science (CSE)",
    rating: 4.7,
    reviewsCount: 15,
    subjects: ["Mathematics", "Physics"],
    classLevels: ["SSC", "HSC"],
    location: "Uttara",
    city: "Dhaka",
    salary: 4500,
    mode: "Home",
    badge: "Popular",
    gender: "Male"
  },
  {
    id: "4",
    name: "Farhana Akter",
    avatarBg: "bg-rose-600 dark:bg-rose-700",
    initials: "FA",
    university: "North South University (NSU)",
    department: "B.Sc in Biochemistry",
    rating: 5.0,
    reviewsCount: 42,
    subjects: ["Chemistry", "Biology"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Gulshan",
    city: "Dhaka",
    salary: 8000,
    mode: "Home",
    badge: "Top Rated",
    gender: "Female"
  },
  {
    id: "5",
    name: "Saiful Islam",
    avatarBg: "bg-indigo-600 dark:bg-indigo-700",
    initials: "SI",
    university: "BUET",
    department: "B.Sc in Electrical Engineering (EEE)",
    rating: 4.8,
    reviewsCount: 29,
    subjects: ["Physics", "Mathematics"],
    classLevels: ["SSC", "HSC"],
    location: "Mirpur",
    city: "Dhaka",
    salary: 5500,
    mode: "Both",
    badge: "Verified Expert",
    gender: "Male"
  },
  {
    id: "6",
    name: "Sabrina Yasmin",
    avatarBg: "bg-orange-600 dark:bg-orange-700",
    initials: "SY",
    university: "Dhaka University (DU)",
    department: "M.A in English Literature",
    rating: 4.8,
    reviewsCount: 19,
    subjects: ["English"],
    classLevels: ["Class 1-5", "Class 6-9", "SSC", "HSC"],
    location: "Banasree",
    city: "Dhaka",
    salary: 7000,
    mode: "Online",
    badge: "Popular",
    gender: "Female"
  },
  {
    id: "7",
    name: "Tanvir Rahman",
    avatarBg: "bg-sky-600 dark:bg-sky-700",
    initials: "TR",
    university: "Dhaka Medical College (DMC)",
    department: "MBBS (Final Year)",
    rating: 4.9,
    reviewsCount: 11,
    subjects: ["Biology", "Chemistry"],
    classLevels: ["SSC", "HSC"],
    location: "Mohammadpur",
    city: "Dhaka",
    salary: 6000,
    mode: "Home",
    badge: "Verified Expert",
    gender: "Male"
  },
  {
    id: "8",
    name: "Anika Tabassum",
    avatarBg: "bg-purple-600 dark:bg-purple-700",
    initials: "AT",
    university: "North South University (NSU)",
    department: "B.Sc in Microbiology",
    rating: 4.9,
    reviewsCount: 26,
    subjects: ["Biology", "English"],
    classLevels: ["Class 1-5", "Class 6-9", "SSC"],
    location: "Bashundhara",
    city: "Dhaka",
    salary: 7500,
    mode: "Both",
    badge: "Top Rated",
    gender: "Female"
  },
  {
    id: "9",
    name: "Kazi Nafis",
    avatarBg: "bg-cyan-600 dark:bg-cyan-700",
    initials: "KN",
    university: "IUT",
    department: "B.Sc in Mechanical Engineering",
    rating: 4.6,
    reviewsCount: 8,
    subjects: ["Mathematics", "Physics"],
    classLevels: ["Class 6-9", "SSC"],
    location: "Wari",
    city: "Dhaka",
    salary: 5000,
    mode: "Online",
    badge: "Popular",
    gender: "Male"
  },
  {
    id: "10",
    name: "Tasnim Alam",
    avatarBg: "bg-fuchsia-600 dark:bg-fuchsia-700",
    initials: "TA",
    university: "BRAC University",
    department: "B.Sc in Physics",
    rating: 4.9,
    reviewsCount: 14,
    subjects: ["Physics", "Mathematics"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Dhanmondi",
    city: "Dhaka",
    salary: 7000,
    mode: "Home",
    badge: "Top Rated",
    gender: "Female"
  },
  {
    id: "11",
    name: "Rafid Al-Hasan",
    avatarBg: "bg-violet-600 dark:bg-violet-700",
    initials: "RH",
    university: "MIST",
    department: "B.Sc in Civil Engineering",
    rating: 4.7,
    reviewsCount: 12,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    classLevels: ["SSC", "HSC"],
    location: "Mirpur",
    city: "Dhaka",
    salary: 4800,
    mode: "Both",
    badge: "Verified Expert",
    gender: "Male"
  },
  {
    id: "12",
    name: "Sumaiya Afrin",
    avatarBg: "bg-pink-600 dark:bg-pink-700",
    initials: "SA",
    university: "Dhaka University (DU)",
    department: "B.Sc in Chemistry",
    rating: 4.8,
    reviewsCount: 17,
    subjects: ["Chemistry", "Mathematics"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Banani",
    city: "Dhaka",
    salary: 5200,
    mode: "Online",
    badge: "Popular",
    gender: "Female"
  }
];

const LOCATIONS = ["Dhaka", "Dhanmondi", "Banani", "Uttara", "Gulshan", "Mirpur", "Banasree", "Mohammadpur", "Bashundhara", "Wari"];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English", "Biology"];
const CLASS_LEVELS = ["Class 1-5", "Class 6-9", "SSC", "HSC"];

export default function TutorsClient() {
  // Filters State
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Dhaka");
  const [maxSalary, setMaxSalary] = useState<number>(15000);
  const [teachingMode, setTeachingMode] = useState<"All" | "Home" | "Online" | "Both">("All");
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Track filter state changes during render to avoid synchronous state updates in useEffect
  const [prevFilters, setPrevFilters] = useState({
    selectedSubjects,
    selectedClasses,
    selectedLocation,
    maxSalary,
    teachingMode,
    sortBy,
  });

  const filtersChanged =
    selectedSubjects !== prevFilters.selectedSubjects ||
    selectedClasses !== prevFilters.selectedClasses ||
    selectedLocation !== prevFilters.selectedLocation ||
    maxSalary !== prevFilters.maxSalary ||
    teachingMode !== prevFilters.teachingMode ||
    sortBy !== prevFilters.sortBy;

  if (filtersChanged) {
    setPrevFilters({
      selectedSubjects,
      selectedClasses,
      selectedLocation,
      maxSalary,
      teachingMode,
      sortBy,
    });
    setIsFiltering(true);
  }

  // Trigger temporary shimmer loader when filters change
  useEffect(() => {
    if (!isFiltering) return;
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [isFiltering, prevFilters]);

  // Handle resets
  const handleResetFilters = () => {
    setSelectedSubjects([]);
    setSelectedClasses([]);
    setSelectedLocation("Dhaka");
    setMaxSalary(15000);
    setTeachingMode("All");
    setSortBy("relevance");
    setCurrentPage(1);
    setIsDrawerOpen(false);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubjects.length > 0) count += 1;
    if (selectedClasses.length > 0) count += 1;
    if (selectedLocation !== "Dhaka") count += 1;
    if (maxSalary !== 15000) count += 1;
    if (teachingMode !== "All") count += 1;
    return count;
  }, [selectedSubjects, selectedClasses, selectedLocation, maxSalary, teachingMode]);

  // Filter and Sort tutors
  const filteredTutors = useMemo(() => {
    let result = [...MOCK_TUTORS];

    // Subject Filter
    if (selectedSubjects.length > 0) {
      result = result.filter((tutor) =>
        tutor.subjects.some((sub) => selectedSubjects.includes(sub))
      );
    }

    // Class Level Filter
    if (selectedClasses.length > 0) {
      result = result.filter((tutor) =>
        tutor.classLevels.some((cl) => selectedClasses.includes(cl))
      );
    }

    // Location Filter
    if (selectedLocation !== "Dhaka") {
      result = result.filter(
        (tutor) => tutor.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    // Salary Filter
    result = result.filter((tutor) => tutor.salary <= maxSalary);

    // Teaching Mode Filter
    if (teachingMode !== "All") {
      if (teachingMode === "Both") {
        result = result.filter((tutor) => tutor.mode === "Both");
      } else {
        result = result.filter(
          (tutor) => tutor.mode === teachingMode || tutor.mode === "Both"
        );
      }
    }

    // Sorting
    if (sortBy === "salary-asc") {
      result.sort((a, b) => a.salary - b.salary);
    } else if (sortBy === "salary-desc") {
      result.sort((a, b) => b.salary - a.salary);
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedSubjects, selectedClasses, selectedLocation, maxSalary, teachingMode, sortBy]);

  // Paginated tutors
  const paginatedTutors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTutors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTutors, currentPage]);

  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
    setCurrentPage(1);
  };

  const toggleClass = (classLevel: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classLevel) ? prev.filter((c) => c !== classLevel) : [...prev, classLevel]
    );
    setCurrentPage(1);
  };

  // Sidebar Filter Form JSX component
  const filterFormContent = () => (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
          Filters
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-teal-650 hover:text-teal-700 dark:text-[#188c6e] dark:hover:text-[#1ca682] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        )}
      </div>

      {/* Subjects */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Subjects
        </label>
        <div className="flex flex-col gap-2.5">
          {SUBJECTS.map((sub) => {
            const checked = selectedSubjects.includes(sub);
            return (
              <label
                key={sub}
                className="flex items-center space-x-3 text-sm text-zinc-650 dark:text-zinc-355 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSubject(sub)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                      checked
                        ? "border-[#0F5B47] dark:border-[#188c6e] bg-[#0F5B47] dark:bg-[#188c6e] text-white"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-teal-500/50 dark:bg-zinc-900/40"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </div>
                </div>
                <span className="font-medium group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {sub}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Class Levels */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Class Level
        </label>
        <div className="flex flex-col gap-2.5">
          {CLASS_LEVELS.map((cl) => {
            const checked = selectedClasses.includes(cl);
            return (
              <label
                key={cl}
                className="flex items-center space-x-3 text-sm text-zinc-655 dark:text-zinc-350 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleClass(cl)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                      checked
                        ? "border-[#0F5B47] dark:border-[#188c6e] bg-[#0F5B47] dark:bg-[#188c6e] text-white"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-teal-500/50 dark:bg-zinc-900/40"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </div>
                </div>
                <span className="font-medium group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {cl}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-555">
          Location
        </label>
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-4 pr-10 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-zinc-850 dark:text-zinc-200 focus:outline-none focus:border-[#0F5B47] dark:focus:border-[#188c6e] appearance-none transition-colors cursor-pointer"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "Dhaka" ? "Dhaka (All Area)" : loc}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-550 pointer-events-none" />
        </div>
      </div>

      {/* Monthly Fee */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
            Monthly Fee
          </label>
          <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e]">
            ৳ 3,000 - {maxSalary.toLocaleString()}
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={3000}
            max={15000}
            step={500}
            value={maxSalary}
            onChange={(e) => {
              setMaxSalary(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full accent-[#0F5B47] dark:accent-[#188c6e] h-1.5 bg-zinc-200 dark:bg-zinc-850 rounded-lg cursor-pointer appearance-none transition-all duration-200"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 dark:text-zinc-555 font-bold uppercase tracking-wider">
            <span>3K BDT</span>
            <span>15K BDT</span>
          </div>
        </div>
      </div>

      {/* Teaching Mode */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Teaching Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["All", "Home", "Online"] as const).map((mode) => {
            const active = teachingMode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  setTeachingMode(mode);
                  setCurrentPage(1);
                }}
                className={`py-2.5 px-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-[#0F5B47]/10 dark:bg-[#188c6e]/15 text-[#0F5B47] dark:text-[#188c6e] border border-[#0F5B47]/20 dark:border-[#188c6e]/30"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                }`}
              >
                {mode === "All" ? "Both" : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile-Only Apply Button */}
      <button
        onClick={() => setIsDrawerOpen(false)}
        className="w-full lg:hidden py-4 bg-[#0F5B47] hover:bg-[#0c4b3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-black text-sm rounded-xl transition-all duration-300 shadow-md shadow-teal-500/10 cursor-pointer"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-black transition-colors duration-300 pb-20">
      {/* Banner Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-12 md:py-16 transition-colors duration-300">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="container mx-auto px-4 max-w-7xl">
          <ScrollReveal variant="slide-up" delay={50} duration={700}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0F5B47]/8 dark:bg-[#188c6e]/12 text-[#0F5B47] dark:text-[#188c6e] border border-[#0F5B47]/15 dark:border-[#188c6e]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Verified Learning
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                  Find the Perfect Tutor
                </h1>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-450 max-w-2xl leading-relaxed">
                  Browse verified educators matching your custom academic criteria in your community.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400 dark:text-zinc-500 font-medium border-l border-zinc-200 dark:border-zinc-800 pl-8">
                <div>
                  <span className="block text-2xl font-black text-zinc-850 dark:text-zinc-200 leading-tight">120+</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-550 block mt-0.5">Top Tutors</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-zinc-850 dark:text-zinc-200 leading-tight">24/7</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-550 block mt-0.5">Online Support</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-7xl mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 p-6 rounded-2xl shadow-xs transition-colors duration-300">
            {filterFormContent()}
          </aside>

          {/* Results Area */}
          <section className="col-span-12 lg:col-span-9 flex flex-col space-y-6">
            
            {/* Toolbar Header */}
            <div className="flex items-center justify-between bg-white dark:bg-zinc-950 border border-zinc-150/50 dark:border-zinc-900 p-4 rounded-2xl shadow-xs transition-colors duration-300">
              <div className="space-y-0.5">
                <h2 className="text-base md:text-lg font-black text-zinc-800 dark:text-zinc-200 tracking-tight">
                  {isFiltering ? (
                    <span className="animate-pulse">Searching tutors...</span>
                  ) : (
                    <span>
                      {filteredTutors.length} tutor{filteredTutors.length !== 1 && "s"} found in {selectedLocation}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 font-normal">
                  Showing matches optimized for your active preferences
                </p>
              </div>

              <div className="flex items-center gap-3.5">
                {/* Mobile Drawer Trigger */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-750 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F5B47] dark:text-[#188c6e]" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#0F5B47] dark:bg-[#188c6e] text-white flex items-center justify-center text-[10px] font-black leading-none">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort Option */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-3.5 pr-8 py-2.5 bg-zinc-555 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-750 dark:text-zinc-300 focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="salary-asc">Salary: Low to High</option>
                    <option value="salary-desc">Salary: High to Low</option>
                    <option value="rating-desc">Rating: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tutors Cards Grid */}
            {isFiltering ? (
              // Shimmer Loading Skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-2xl p-6 space-y-6 animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-250 dark:bg-zinc-850" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-md w-2/3" />
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded-md w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded-md w-1/3" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-zinc-200 dark:bg-zinc-850 rounded-md w-16" />
                        <div className="h-6 bg-zinc-200 dark:bg-zinc-850 rounded-md w-20" />
                      </div>
                    </div>
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-850 rounded-xl w-full pt-4 border-t border-zinc-100 dark:border-zinc-900" />
                  </div>
                ))}
              </div>
            ) : filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTutors.map((tutor, idx) => (
                  <ScrollReveal
                    key={tutor.id}
                    variant="slide-up"
                    delay={idx * 75}
                    duration={600}
                    className="w-full flex"
                  >
                    <div
                      className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-2xl p-6 flex flex-col space-y-5 shadow-xs hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1 hover:border-teal-500/20 dark:hover:border-[#188c6e]/30 transition-all duration-350 relative overflow-hidden group w-full cursor-default"
                    >
                      {/* Top accent glow line */}
                      <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-teal-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      {/* Header Avatar and Rating */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={`w-13 h-13 rounded-2xl ${tutor.avatarBg} flex items-center justify-center text-white text-base font-extrabold shadow-md shrink-0 group-hover:scale-105 transition-transform duration-350`}
                          >
                            {tutor.initials}
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors duration-200">
                              {tutor.name}
                            </h3>
                            <div className="text-xs text-zinc-400 dark:text-zinc-550 flex items-center gap-1 mt-0.5">
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span className="truncate max-w-32.5 font-semibold">{tutor.university}</span>
                            </div>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] border border-teal-100/50 dark:border-teal-900/40">
                          <Award className="w-3 h-3 shrink-0" />
                          {tutor.badge}
                        </span>
                      </div>

                      {/* Ratings Summary */}
                      <div className="flex items-center space-x-2 text-xs font-bold text-zinc-500 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/60 p-2.5 rounded-xl">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500 animate-pulse mr-0.5" />
                          <span className="text-zinc-800 dark:text-zinc-200">{tutor.rating.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>{tutor.reviewsCount} reviews</span>
                      </div>

                      {/* Subjects & Class Levels */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-455 dark:text-zinc-550">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Subjects & Levels:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {tutor.subjects.map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-100/70 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/20"
                            >
                              {sub}
                            </span>
                          ))}
                          {tutor.classLevels.slice(0, 2).map((lvl, lIdx) => (
                            <span
                              key={lIdx}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-100/70 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200/20 border-dashed"
                            >
                              {lvl}
                            </span>
                          ))}
                          {tutor.classLevels.length > 2 && (
                            <span className="text-[10px] font-bold text-zinc-400 self-center pl-1">
                              +{tutor.classLevels.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 flex items-center justify-between mt-auto">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-555 block uppercase font-bold tracking-wider">
                            Expected Salary
                          </span>
                          <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                            ৳ {tutor.salary.toLocaleString()}/mo
                          </span>
                        </div>

                        <div className="flex flex-col items-end text-right space-y-0.5">
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-555 block uppercase font-bold tracking-wider">
                            Preference
                          </span>
                          <span className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {tutor.location} ({tutor.mode})
                          </span>
                        </div>
                      </div>

                      {/* View Profile Action button */}
                      <button className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-[#0F5B47] dark:bg-zinc-900 dark:hover:bg-[#188c6e] hover:text-white dark:hover:text-white text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl transition-all duration-200 group/btn shadow-2xs hover:shadow-md cursor-pointer">
                        <span>View Full Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.75" />
                      </button>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-2xl shadow-xs transition-colors duration-300">
                <SlidersHorizontal className="w-12 h-12 text-zinc-300 dark:text-zinc-700 animate-bounce mb-4" />
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                  No Tutors Found
                </h3>
                <p className="text-sm text-zinc-450 dark:text-zinc-500 mt-2 max-w-sm text-center">
                  Try tweaking or resetting your filters to discover matching educators in your area.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#0F5B47] hover:bg-[#0b4334] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !isFiltering && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-655 dark:text-zinc-350 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  const active = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-extrabold text-xs transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-[#0F5B47] dark:bg-[#188c6e] text-white shadow-xs"
                          : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-655 dark:text-zinc-350 disabled:opacity-40 disabled:hover:bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Drawer (Bottom Sheet) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer container */}
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-zinc-950 rounded-t-3xl p-6 overflow-y-auto transition-transform duration-300 ease-out shadow-2xl border-t border-zinc-100 dark:border-zinc-900 ${
            isDrawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Header handle element */}
          <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6" />

          {/* Close button */}
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Filter form content */}
          {filterFormContent()}
        </div>
      </div>
    </div>
  );
}
