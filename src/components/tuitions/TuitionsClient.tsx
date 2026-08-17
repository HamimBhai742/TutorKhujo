/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
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
  Check,
  Search,
  Calendar,
  Briefcase,
  TrendingUp,
  Clock,
  Send,
  Building,
  UserCheck,
  Loader2
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { TakaIcon } from "@/components/shared/TakaIcon";
import { MOCK_TUITION_POSTS, TuitionPost } from "@/data/dashboard";

import api from "@/lib/api";

const LOCATIONS = [
  "All Dhaka",
  "Dhanmondi",
  "Banani",
  "Uttara",
  "Gulshan",
  "Mirpur",
  "Banasree",
  "Mohammadpur",
  "Bashundhara",
  "Wari"
];
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English", "Biology", "General Science", "Higher Mathematics"];
const CLASS_LEVELS = ["Class 1-5", "Class 6-9", "Class 10 (SSC)", "HSC"];

export default function TuitionsClient() {
  // Main Data State
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("All Dhaka");
  const [maxSalary, setMaxSalary] = useState<number>(12000);
  const [teachingMode, setTeachingMode] = useState<"All" | "Home" | "Online" | "Both">("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<TuitionPost | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);

  // Application form state
  const [bidAmount, setBidAmount] = useState<string>("");
  const [proposalText, setProposalText] = useState<string>("");
  const [isSubmittingApply, setIsSubmittingApply] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch live tuition posts and tutor's applied posts from backend
  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await api.get("/tuitions?status=Active");
        const raw = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.data || []);
        const formatted: TuitionPost[] = raw.map((p: any) => ({
          id: p.id,
          classLevel: p.classLevel,
          subjects: Array.isArray(p.subjects) ? p.subjects : [p.subjects],
          budget: p.budget,
          mode: p.mode,
          frequency: p.frequency,
          location: p.location,
          genderPreference: p.genderPreference,
          tutorQualification: p.tutorQualification,
          extraNotes: p.extraNotes,
          status: p.status,
          date: p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })
            : "Recently",
        }));
        setPosts(formatted);

        // Try to fetch tutor's applied jobs
        try {
          const appliedRes = await api.get("/tuitions/tutor/my-applied");
          const appliedApps = appliedRes.data?.data || [];
          setAppliedJobIds(appliedApps.map((a: any) => a.tuitionPostId));
        } catch (_) {
          // Not logged in as tutor or unauthenticated, ignore silently
        }
      } catch (err) {
        console.error("Failed to load public tuition posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPublicPosts();
  }, []);

  // Loading state simulation on filter changes
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsFiltering(true);
    }, 0);
    const endTimer = setTimeout(() => {
      setIsFiltering(false);
    }, 300);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [searchQuery, selectedSubjects, selectedClasses, selectedLocation, maxSalary, teachingMode]);

  // Handle resets
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSubjects([]);
    setSelectedClasses([]);
    setSelectedLocation("All Dhaka");
    setMaxSalary(12000);
    setTeachingMode("All");
    setCurrentPage(1);
    setIsDrawerOpen(false);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count += 1;
    if (selectedSubjects.length > 0) count += 1;
    if (selectedClasses.length > 0) count += 1;
    if (selectedLocation !== "All Dhaka") count += 1;
    if (maxSalary !== 12000) count += 1;
    if (teachingMode !== "All") count += 1;
    return count;
  }, [searchQuery, selectedSubjects, selectedClasses, selectedLocation, maxSalary, teachingMode]);

  // Filter and Sort tuitions
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search Query (location, class, subjects)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.classLevel.toLowerCase().includes(q) ||
          post.location.toLowerCase().includes(q) ||
          post.subjects.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Subject Filter
    if (selectedSubjects.length > 0) {
      result = result.filter((post) =>
        post.subjects.some((sub) => selectedSubjects.includes(sub))
      );
    }

    // Class Level Filter
    if (selectedClasses.length > 0) {
      result = result.filter((post) =>
        selectedClasses.some((cl) => post.classLevel.includes(cl))
      );
    }

    // Location Filter
    if (selectedLocation !== "All Dhaka") {
      result = result.filter(
        (post) => post.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Salary Filter
    result = result.filter((post) => post.budget <= maxSalary);

    // Teaching Mode Filter
    if (teachingMode !== "All") {
      if (teachingMode === "Both") {
        result = result.filter((post) => post.mode === "Both");
      } else {
        result = result.filter(
          (post) => post.mode === teachingMode || post.mode === "Both"
        );
      }
    }

    return result;
  }, [posts, searchQuery, selectedSubjects, selectedClasses, selectedLocation, maxSalary, teachingMode]);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

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

  const handleOpenApply = (job: TuitionPost) => {
    setSelectedJob(job);
    setBidAmount(job.budget.toString());
    setProposalText("");
    setErrorMessage(null);
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      setIsSubmittingApply(true);
      setErrorMessage(null);

      await api.post(`/tuitions/${selectedJob.id}/apply`, {
        salaryBid: Number(bidAmount) || selectedJob.budget,
        proposal: proposalText.trim(),
      });

      setAppliedJobIds((prev) => [...prev, selectedJob.id]);
      setShowApplyModal(false);
      setShowSuccessToast(true);

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
    } catch (err: any) {
      console.error("Apply error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to submit application. Please make sure you are logged in as a tutor.";
      setErrorMessage(msg);
    } finally {
      setIsSubmittingApply(false);
    }
  };

  // Stats computation
  const stats = useMemo(() => {
    const activeCount = posts.filter(p => p.status === "Active").length;
    const avgSalary = Math.round(posts.reduce((sum, p) => sum + p.budget, 0) / posts.length) || 6000;
    const locationCount = new Set(posts.map(p => p.location.split(",")[0].trim())).size;
    return { activeCount, avgSalary, locationCount };
  }, [posts]);

  // Sidebar Filter Form JSX component
  const filterFormContent = () => (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
          <SlidersHorizontal className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
          Filters
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-[#188c6e] dark:hover:text-[#1ca682] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        )}
      </div>

      {/* Subjects */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Subjects
        </label>
        <div className="flex flex-col gap-2.5">
          {SUBJECTS.map((sub) => {
            const checked = selectedSubjects.includes(sub);
            return (
              <label
                key={sub}
                className="flex items-center space-x-3 text-sm text-zinc-650 dark:text-zinc-350 cursor-pointer group"
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
                        : "border-zinc-200 dark:border-zinc-800 hover:border-[#0F5B47] dark:bg-zinc-900/40"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </div>
                </div>
                <span className="font-semibold group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {sub}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Class Levels */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Class Level
        </label>
        <div className="flex flex-col gap-2.5">
          {CLASS_LEVELS.map((cl) => {
            const checked = selectedClasses.includes(cl);
            return (
              <label
                key={cl}
                className="flex items-center space-x-3 text-sm text-zinc-650 dark:text-zinc-350 cursor-pointer group"
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
                        : "border-zinc-200 dark:border-zinc-800 hover:border-[#0F5B47] dark:bg-zinc-900/40"
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                  </div>
                </div>
                <span className="font-semibold group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {cl}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Locations Dropdown */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Location
        </label>
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-4 pr-10 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white appearance-none cursor-pointer"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Teaching Mode */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
          Teaching Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["All", "Home", "Online", "Both"].map((mode) => {
            const isActive = teachingMode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  setTeachingMode(mode as any);
                  setCurrentPage(1);
                }}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0F5B47]/10 dark:bg-[#188c6e]/10 border-[#0F5B47] dark:border-[#188c6e] text-[#0F5B47] dark:text-[#188c6e]"
                    : "border-zinc-250/60 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 text-zinc-650 dark:text-zinc-450"
                }`}
              >
                {mode === "Both" ? "Both (Hybrid)" : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Monthly Budget */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550">
            Max Budget
          </label>
          <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e]">
            ৳ {maxSalary.toLocaleString()}/mo
          </span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="3000"
            max="15000"
            step="500"
            value={maxSalary}
            onChange={(e) => {
              setMaxSalary(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full accent-[#0F5B47] dark:accent-[#188c6e] bg-zinc-200 dark:bg-zinc-800 h-1 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
            <span>৳ 3,000</span>
            <span>৳ 15,000</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16 space-y-12 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <ScrollReveal>
        <div className="relative rounded-[2.5rem] overflow-hidden bg-radial from-[#126b53] to-[#0A4234] text-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 border border-[#178568]">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-wider font-extrabold text-teal-200 border border-white/5">
              <Sparkles className="w-3 h-3 text-amber-350 fill-amber-350" />
              Tutor Job Openings
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase">
              Find Your Next <br />
              <span className="text-amber-300">Tuition Class</span>
            </h2>
            <p className="text-sm font-semibold text-teal-100/90 max-w-lg leading-relaxed">
              Explore active job requests posted directly by students and parents in Dhaka. Apply with your profile, set bids, and chat directly.
            </p>
          </div>
          
          {/* Dashboard Quick Stats */}
          <div className="grid grid-cols-3 gap-6 bg-black/15 backdrop-blur-md border border-white/10 rounded-3xl p-6 shrink-0 md:min-w-85">
            <div className="text-center space-y-1">
              <span className="text-2xl font-black text-amber-300 leading-none">
                {stats.activeCount}
              </span>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-teal-150">
                Active Vacancies
              </p>
            </div>
            <div className="text-center space-y-1 border-x border-white/10 px-4">
              <span className="text-2xl font-black text-amber-300 leading-none">
                ৳{Math.round(stats.avgSalary / 100) / 10}k
              </span>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-teal-150">
                Avg. Budget
              </p>
            </div>
            <div className="text-center space-y-1">
              <span className="text-2xl font-black text-amber-300 leading-none">
                {stats.locationCount}
              </span>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-teal-150">
                Locations
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Main content search grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left sidebar filters (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-2xs">
          {filterFormContent()}
        </aside>

        {/* Right Content Area */}
        <section className="lg:col-span-9 space-y-6">
          
          {/* Search bar & filter controls */}
          <div className="flex gap-3 items-center w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by class, location, or subject..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 text-xs font-semibold rounded-2xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] focus:ring-2 focus:ring-[#0F5B47]/10 text-zinc-850 dark:text-white transition-all duration-200"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Filters Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl text-xs font-extrabold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition-colors cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F26A1B] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400 dark:text-zinc-500 mr-1">
                Active:
              </span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-350 rounded-lg text-xs font-semibold">
                  Query: {searchQuery}
                  <button onClick={() => setSearchQuery("")} className="cursor-pointer">
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedLocation !== "All Dhaka" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-355 rounded-lg text-xs font-semibold">
                  Location: {selectedLocation}
                  <button onClick={() => setSelectedLocation("All Dhaka")} className="cursor-pointer">
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedSubjects.map((sub) => (
                <span key={sub} className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-355 rounded-lg text-xs font-semibold">
                  {sub}
                  <button onClick={() => toggleSubject(sub)} className="cursor-pointer">
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              ))}

              {selectedClasses.map((cl) => (
                <span key={cl} className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-355 rounded-lg text-xs font-semibold">
                  {cl}
                  <button onClick={() => toggleClass(cl)} className="cursor-pointer">
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              ))}

              {teachingMode !== "All" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-355 rounded-lg text-xs font-semibold">
                  Mode: {teachingMode}
                  <button onClick={() => setTeachingMode("All")} className="cursor-pointer">
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              )}

              {maxSalary !== 12000 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-355 rounded-lg text-xs font-semibold">
                  Budget ≤ ৳{maxSalary.toLocaleString()}
                  <button onClick={() => setMaxSalary(12000)} className="cursor-pointer">
                    <X className="w-3.5 h-3.5 hover:text-red-500" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Cards listing layout */}
          {isFiltering ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 space-y-4 animate-pulse">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-zinc-150 dark:bg-zinc-905 rounded w-full"></div>
                    <div className="h-4 bg-zinc-150 dark:bg-zinc-905 rounded w-5/6"></div>
                  </div>
                  <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full pt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                {paginatedPosts.map((job) => {
                  const hasApplied = appliedJobIds.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-4xl p-6 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 flex flex-col justify-between hover:scale-[1.01] relative group"
                    >
                      <div className="space-y-4">
                        {/* Class level and date badge */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-[#0F5B47] dark:text-[#188c6e] tracking-wider block bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full w-max">
                              {job.classLevel}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 block mt-1">
                            {job.date}
                          </span>
                        </div>

                        {/* Location and subjects details */}
                        <div className="space-y-2">
                          <h3 className="text-base font-black text-zinc-900 dark:text-white leading-snug">
                            Need Tutor for {job.subjects.join(", ")}
                          </h3>
                          <div className="space-y-1.5 text-xs text-zinc-550 dark:text-zinc-400 font-semibold">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                              <span>{job.frequency} &bull; {job.mode}</span>
                            </div>
                          </div>
                        </div>

                        {/* Subjects tag list */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.subjects.map((sub, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-bold bg-zinc-50 dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 px-2 py-0.5 rounded-lg"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>

                        {/* Preferred Qualification Badge if specified by student */}
                        {job.tutorQualification && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 px-2.5 py-1 rounded-lg">
                            <GraduationCap className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <span>Req: {job.tutorQualification}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Salary & apply */}
                      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-zinc-450 uppercase font-black tracking-wide block">
                            Offered Salary
                          </span>
                          <span className="text-base font-black text-[#0F5B47] dark:text-[#188c6e]">
                            ৳ {job.budget.toLocaleString()}/mo
                          </span>
                        </div>

                        {hasApplied ? (
                          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider">
                            <UserCheck className="w-4 h-4 stroke-[3px]" />
                            Applied
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenApply(job)}
                            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#0F5B47] hover:bg-[#0b4737] dark:bg-[#188c6e] dark:hover:bg-[#14755c] text-white text-xs font-extrabold uppercase rounded-xl transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            Apply Now
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty state */}
              {filteredPosts.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] space-y-4">
                  <Briefcase className="w-12 h-12 text-zinc-350 dark:text-zinc-650 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-zinc-800 dark:text-zinc-200 uppercase">
                      No tuition jobs match
                    </h4>
                    <p className="text-xs font-bold text-zinc-450 dark:text-zinc-550 max-w-md mx-auto leading-relaxed">
                      We couldn&apos;t find any job request matching your filter queries. Try adjusting your location, salary slider or search term.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-[#0F5B47] dark:text-[#188c6e] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* 3. Pagination panel */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-150/40 dark:border-zinc-900 pt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-extrabold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-xs font-black text-zinc-450 dark:text-zinc-550">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-extrabold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </section>
      </div>

      {/* 4. Drawer modal overlay (Mobile Filters) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-xs">
          <div
            className="absolute inset-0"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-full bg-white dark:bg-zinc-950 h-full p-6 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-550 dark:text-zinc-450 absolute right-4 top-4 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-4 flex-1">
              {filterFormContent()}
            </div>
          </div>
        </div>
      )}

      {/* 5. Job Application Modal Form */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-4xl shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto space-y-5 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  Apply for Tuition Position
                </h3>
                <span className="text-[10px] font-black text-[#0F5B47] dark:text-[#188c6e] uppercase">
                  {selectedJob.classLevel} &bull; {selectedJob.location.split(",")[0]}
                </span>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs font-bold">
              
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl space-y-1.5 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-wide block">
                  Offered Salary Budget:
                </span>
                <span className="text-sm font-black text-zinc-800 dark:text-zinc-200 block">
                  ৳ {selectedJob.budget.toLocaleString()} BDT / month
                </span>
              </div>

              {/* Salary Bid Price */}
              <div className="space-y-1">
                <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">
                  Your Demanded Salary (BDT/mo)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white"
                    required
                  />
                  <TakaIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Application Proposal Text */}
              <div className="space-y-1">
                <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">
                  Write short proposal / pitch message
                </label>
                <textarea
                  placeholder="Introduce yourself, mention your relevant experience, university, and why you are a good match for this tuition position..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white leading-relaxed resize-none"
                  required
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  disabled={isSubmittingApply}
                  className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApply}
                  className="px-6 py-3 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmittingApply ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification for successful apply */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F5B47] text-white py-4 px-6 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 animate-in slide-in-from-bottom duration-300">
          <div className="p-1 bg-white/20 rounded-lg">
            <Check className="w-4 h-4 text-white stroke-[3px]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase">Application Submitted!</p>
            <p className="text-[10px] text-teal-150 font-bold mt-0.5">
              The student/parent has been notified. They will contact you shortly.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
