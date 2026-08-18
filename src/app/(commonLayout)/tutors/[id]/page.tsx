"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Check,
  Info,
  Zap,
  ChevronRight,
  ShieldCheck,
  Video,
  Play,
  Award,
  Share2,
  TrendingUp,
  MessageSquarePlus,
  BadgeCheck,
  Lock,
  Calendar
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ShareProfileModal from "@/components/tutors/ShareProfileModal";
import BookTrialModal from "@/components/tutors/BookTrialModal";
import { MOCK_TUTORS } from "@/data/tutors";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TutorDetailPage({ params }: PageProps) {
  const { id } = use(params);
  
  // Find the tutor by ID
  const tutor = MOCK_TUTORS.find((t) => t.id === id);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBookTrialOpen, setIsBookTrialOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  if (!tutor) {
    notFound();
  }

  // Get similar tutors (excluding current tutor)
  const similarTutors = MOCK_TUTORS.filter((t) => t.id !== tutor.id).slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviewSuccessMsg("Thank you! Your review has been submitted as a Verified Student.");
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSuccessMsg("");
      setNewComment("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-black transition-colors duration-300 pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href="/tutors" className="hover:text-[#0F5B47] dark:hover:text-[#188c6e] transition-colors">
              Find a Tutor
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-zinc-800 dark:text-zinc-200 truncate">{tutor.name}</span>
          </nav>

          {/* Top Share Profile Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500/40 text-zinc-700 dark:text-zinc-200 font-extrabold text-xs rounded-2xl shadow-xs transition-all cursor-pointer w-fit"
          >
            <Share2 className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
            <span>Share Profile Card</span>
          </button>
        </div>

        {/* Hero Card */}
        <ScrollReveal variant="slide-up" delay={50} duration={700}>
          <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-8 mb-8 shadow-xs relative overflow-hidden group">
            {/* Top accent glow line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-teal-500 to-orange-500" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              {/* Profile Avatar with Verified Badge */}
              <div className="relative shrink-0">
                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full ${tutor.avatarBg} flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-lg relative group-hover:scale-102 transition-transform duration-350`}>
                  {tutor.initials}
                </div>
                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white dark:border-zinc-950 shadow-md">
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[3px]" />
                </div>
              </div>

              {/* Main Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                    <span>{tutor.name}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                      Verified Tutor
                    </span>
                  </h1>
                  <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] border border-teal-100/50 dark:border-teal-900/40 w-fit mx-auto md:mx-0 shrink-0 whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {tutor.rating.toFixed(1)} ({tutor.reviewsCount} reviews)
                  </span>
                </div>

                {/* Subtitle / Attributes */}
                <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm font-semibold text-zinc-550 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                    {tutor.location}, {tutor.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-zinc-400 shrink-0" />
                    {tutor.subjects.join(", ")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-zinc-400 shrink-0" />
                    {tutor.mode === "Both" ? "Home & Online" : tutor.mode === "Online" ? "Online Only" : "Home Tutoring"}
                  </span>
                </div>

                {/* Curriculum & Specialization Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-955/20 text-[#0F5B47] dark:text-[#188c6e] text-xs font-bold border border-teal-100 dark:border-teal-900/30">
                    NCTB (English Version)
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-955/20 text-[#0F5B47] dark:text-[#188c6e] text-xs font-bold border border-teal-100 dark:border-teal-900/30">
                    Edexcel O/A Level
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-955/20 text-[#F26A1B] text-xs font-bold border border-orange-100 dark:border-orange-900/30 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Physics Specialist
                  </span>
                </div>

                {/* target details grid */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-900 max-w-2xl">
                  <div className="space-y-1">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                      Monthly Fee
                    </span>
                    <span className="text-lg md:text-2xl font-black text-[#0F5B47] dark:text-[#188c6e] block leading-none">
                      ৳ {tutor.salary?.toLocaleString()}
                      <span className="text-xs font-bold text-zinc-450 dark:text-zinc-555 ml-1">BDT</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 dark:text-zinc-550 block uppercase font-bold tracking-wider">
                      Levels
                    </span>
                    <span className="text-sm md:text-lg font-black text-zinc-800 dark:text-zinc-200 block leading-tight">
                      {tutor.classLevels.join(", ")}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] md:text-[10px] text-zinc-400 dark:text-zinc-550 block uppercase font-bold tracking-wider">
                      Target Exams
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tutor.classLevels.filter(l => ["SSC", "HSC"].includes(l)).map(exam => (
                        <span key={exam} className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-extrabold uppercase">
                          {exam}
                        </span>
                      ))}
                      {tutor.classLevels.filter(l => ["SSC", "HSC"].includes(l)).length === 0 && (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-extrabold uppercase">
                          School
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature 2: Success Stats Summary Cards */}
        <ScrollReveal variant="slide-up" delay={70}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-955/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Successful Tuitions
                </span>
                <span className="text-lg md:text-xl font-black text-zinc-900 dark:text-white block mt-0.5">
                  5+ Confirmed
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-955/30 text-[#0F5B47] dark:text-[#188c6e] rounded-2xl shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Response Rate
                </span>
                <span className="text-lg md:text-xl font-black text-zinc-900 dark:text-white block mt-0.5">
                  100% Fast Saara
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-955/30 text-amber-500 rounded-2xl shrink-0">
                <Star className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Student Rating
                </span>
                <span className="text-lg md:text-xl font-black text-zinc-900 dark:text-white block mt-0.5">
                  {tutor.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-955/30 text-[#F26A1B] rounded-2xl shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Teaching Exp
                </span>
                <span className="text-lg md:text-xl font-black text-zinc-900 dark:text-white block mt-0.5">
                  3+ Years
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Main Info) */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
            
            {/* Demo Class / Video Intro Section */}
            <ScrollReveal variant="slide-up" delay={80}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Video className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white">
                      Demo Class & Intro Video
                    </h2>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/50">
                    60 Sec Overview
                  </span>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center group cursor-pointer shadow-inner">
                  {/* Video Thumbnail Background */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 z-10" />
                  <div className="z-20 text-center space-y-3 p-4">
                    <div className="w-16 h-16 rounded-full bg-[#F26A1B] text-white flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-base md:text-lg">
                        Watch {tutor.name.split(" ")[0]}&apos;s Interactive Teaching Demo
                      </h4>
                      <p className="text-zinc-300 text-xs font-semibold">
                        Preview teaching style, problem-solving approach, and communication skills
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            {/* About Card */}
            <ScrollReveal variant="slide-up" delay={100}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
                <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white mb-4">
                  About
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed">
                  {tutor.about || `I am an experienced tutor specializing in ${tutor.subjects.join(" and ")}. I focus on conceptual understanding, solving students' queries, and creating mock test plans to ensure standard results.`}
                </p>
              </div>
            </ScrollReveal>

            {/* Education Card */}
            <ScrollReveal variant="slide-up" delay={150}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
                <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white mb-6">
                  Education
                </h2>
                <div className="flex flex-col gap-6">
                  {tutor.education?.map((edu, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-[#0F5B47] dark:text-[#188c6e] rounded-2xl shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm md:text-base font-extrabold text-zinc-900 dark:text-white">
                          {edu.degree}
                        </h4>
                        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold">
                          {edu.institution}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-[#0F5B47] dark:text-[#188c6e] rounded-2xl shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm md:text-base font-extrabold text-zinc-900 dark:text-white">
                          {tutor.department}
                        </h4>
                        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold">
                          {tutor.university}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 2: Verified Student Reviews Card */}
            <ScrollReveal variant="slide-up" delay={200}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                      <span>Verified Student Reviews</span>
                      <span className="text-xs px-2.5 py-0.5 bg-amber-50 dark:bg-amber-955/30 text-amber-600 font-bold rounded-full">
                        {tutor.rating.toFixed(1)} ★
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Feedback from students and parents who hired {tutor.name.split(" ")[0]} through TutorKhujo.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Write Review</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tutor.reviews?.map((review, idx) => (
                    <div key={idx} className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-150/40 dark:border-zinc-900/60 p-5 rounded-2xl flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-xs md:text-sm font-black text-zinc-900 dark:text-white leading-none">
                              {review.reviewer}
                            </h4>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-955/30 px-1.5 py-0.5 rounded-full border border-emerald-200/40">
                              <Check className="w-2.5 h-2.5" /> Verified Student
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-555 mt-1.5 block">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg text-[10px] font-black">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                          <span>{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-zinc-650 dark:text-zinc-350 text-xs md:text-sm italic leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  )) || (
                    <div className="col-span-2 text-center py-6 text-zinc-400 text-sm font-semibold">
                      No review messages posted yet. Be the first to leave feedback!
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column (Sidebar Widgets) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            
            {/* Contact Tutor Widget */}
            <ScrollReveal variant="slide-up" delay={250}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-black text-zinc-900 dark:text-white mb-2">
                    Contact This Tutor
                  </h3>
                  <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 leading-relaxed">
                    Available for immediate booking for both in-person and online classes.
                  </p>
                </div>

                <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-4 text-xs font-bold">
                  {/* Phone Masking Display */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 space-y-1 text-center">
                    <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">
                      Direct Mobile Number
                    </span>
                    <div className="text-sm font-black text-zinc-900 dark:text-white flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#F26A1B]" />
                      <span>+880 1712-*** ***</span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-semibold block">
                      🔒 Phone number visible to confirmed students
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-450 dark:text-zinc-500">Class Frequency</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{tutor.classFrequency || "3 Days / Week"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-450 dark:text-zinc-500">Trial Class</span>
                    <span className="text-[#0F5B47] dark:text-[#188c6e] font-extrabold">{tutor.trialClass || "Free First Class"}</span>
                  </div>
                </div>

                {/* Feature 6: Book 1st Free Demo Class Button */}
                <button
                  onClick={() => setIsBookTrialOpen(true)}
                  className="w-full py-3.5 bg-[#F26A1B] hover:bg-[#db5b14] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book 1st Free Demo Class</span>
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
                  <span>Share Profile Link</span>
                </button>

                <div className="bg-blue-50/50 dark:bg-blue-955/10 border border-blue-100/50 dark:border-blue-900/30 p-4 rounded-2xl flex gap-3 items-start">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-blue-800/80 dark:text-blue-400/80 leading-relaxed">
                    Your request will be sent to the tutor. Once accepted, you will receive their contact details via SMS and Email.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Fast Response Widget */}
            <ScrollReveal variant="slide-up" delay={300}>
              <div className="bg-[#0F5B47] dark:bg-[#188c6e]/90 text-white rounded-3xl p-6 shadow-xs flex gap-4 items-start relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-white/5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-350">
                  <Zap className="w-32 h-32 stroke-[3px]" />
                </div>
                <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                  <Zap className="w-5 h-5 fill-white text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white/70">
                    Fast Response
                  </h4>
                  <p className="text-[11px] font-extrabold text-white/90 leading-relaxed">
                    {tutor.name.split(" ")[0]} usually responds within 2 hours to new student requests.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom Section: Similar Tutors */}
        <ScrollReveal variant="slide-up" delay={350}>
          <div className="mt-20 border-t border-zinc-150 dark:border-zinc-900 pt-16">
            <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-10 tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />
              Similar Tutors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarTutors.map((simTutor) => (
                <div key={simTutor.id} className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-5 flex flex-col gap-4 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-teal-500/25 transition-all duration-300 relative overflow-hidden group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${simTutor.avatarBg} flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0 group-hover:scale-102 transition-transform duration-300`}>
                      {simTutor.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate">
                        {simTutor.name}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                        {simTutor.university}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-zinc-800 dark:text-zinc-200">{simTutor.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-zinc-400 dark:text-zinc-650">({simTutor.reviewsCount} reviews)</span>
                  </div>

                  <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 line-clamp-1 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                    {simTutor.department}
                  </p>

                  <div className="flex items-center justify-between mt-auto border-t border-zinc-100 dark:border-zinc-900 pt-3">
                    <span className="text-xs font-black text-zinc-900 dark:text-white">
                      ৳ {simTutor.salary?.toLocaleString()}/mo
                    </span>
                    <Link
                      href={`/tutors/${simTutor.id}`}
                      className="text-[10px] font-black text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] dark:hover:text-[#1ca682] flex items-center gap-0.5 group/btn"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tutor={tutor}
      />

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">
              Write a Review for {tutor.name}
            </h3>
            {reviewSuccessMsg ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-955/30 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-2xl text-center">
                {reviewSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating ? "fill-amber-500 text-amber-500" : "text-zinc-300 dark:text-zinc-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Your Written Review
                  </label>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience regarding punctuality, teaching clarity, and progress..."
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 text-xs font-bold text-zinc-500 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Book 1st Free Trial Class Modal */}
      <BookTrialModal
        isOpen={isBookTrialOpen}
        onClose={() => setIsBookTrialOpen(false)}
        tutor={{
          id: tutor.id,
          name: tutor.name,
          department: tutor.department,
          university: tutor.university,
        }}
      />
    </div>
  );
}
