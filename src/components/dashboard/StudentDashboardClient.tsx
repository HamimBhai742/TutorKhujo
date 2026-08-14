"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Clock,
  MapPin,
  Check,
  X,
  TrendingUp,
  Star,
  Info,
  CalendarDays,
  Search,
  ArrowLeft,
  Send,
  FileText,
  Plus
} from "lucide-react";
import { TakaIcon } from "@/components/shared/TakaIcon";
import {
  MOCK_TUITION_POSTS,
  MOCK_TUTOR_APPLICATIONS,
  MOCK_INVOICES,
  MOCK_CHATS,
  TuitionPost,
  TutorApplication,
  Invoice,
  ChatContact,
  ChatMessage
} from "@/data/dashboard";

export default function StudentDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "overview";

  // Dynamic States
  const [posts, setPosts] = useState<TuitionPost[]>(MOCK_TUITION_POSTS);
  const [applications, setApplications] = useState<TutorApplication[]>(MOCK_TUTOR_APPLICATIONS);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [chats, setChats] = useState<ChatContact[]>(MOCK_CHATS);
  
  const [activeChatId, setActiveChatId] = useState<string>("chat-1");
  const [newMessageText, setNewMessageText] = useState<string>("");
  const [chatMobileView, setChatMobileView] = useState<"list" | "chat">("list");
  const [chatSearch, setChatSearch] = useState<string>("");

  // Post tuition state
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [newClassLevel, setNewClassLevel] = useState<string>("");
  const [newSubjects, setNewSubjects] = useState<string>("");
  const [newBudget, setNewBudget] = useState<string>("");
  const [newMode, setNewMode] = useState<"Home" | "Online" | "Both">("Home");
  const [newFrequency, setNewFrequency] = useState<string>("3 Days / Week");
  const [newLocation, setNewLocation] = useState<string>("");

  // Actions
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassLevel || !newSubjects || !newBudget || !newLocation) return;

    const newPost: TuitionPost = {
      id: `post-${Date.now()}`,
      classLevel: newClassLevel,
      subjects: newSubjects.split(",").map((s) => s.trim()),
      budget: parseInt(newBudget) || 5000,
      mode: newMode,
      frequency: newFrequency,
      location: newLocation,
      status: "Active",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    };

    setPosts((prev) => [newPost, ...prev]);
    setShowPostModal(false);
    
    // Reset Form
    setNewClassLevel("");
    setNewSubjects("");
    setNewBudget("");
    setNewMode("Home");
    setNewLocation("");
    
    alert("Success! Your tuition requirement has been posted. Tutors will start applying soon.");
  };

  const handleHireTutor = (app: TutorApplication) => {
    // 1. Update application status
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Hired" as const } : a))
    );
    alert(`Congratulations! You have hired ${app.tutorName}. Their class tracker has been activated.`);
  };

  const handleRejectTutor = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    alert("Application rejected.");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      content: newMessageText.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: newMessageText.trim(),
            time: "Just Now",
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );

    setNewMessageText("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            {currentTab === "overview" && "Student Overview"}
            {currentTab === "posts" && "My Tuition Posts"}
            {currentTab === "applications" && "Tutor Applications"}
            {currentTab === "messages" && "Messages Inbox"}
            {currentTab === "active-tutors" && "Active Tutors"}
            {currentTab === "invoices" && "Invoices & Billing"}
          </h2>
          <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
            {currentTab === "overview" && "Monitor active lessons, review applicant teachers, and manage fee billing."}
            {currentTab === "posts" && "Track requirements published for tuition positions."}
            {currentTab === "applications" && "Review credentials of teachers applying to help your children."}
            {currentTab === "messages" && "Initiate real-time communications with shortlisted/active tutors."}
            {currentTab === "active-tutors" && "Track study progress, log sessions, and check attendance."}
            {currentTab === "invoices" && "Review payment logs, invoices, and bank receipt archives."}
          </p>
        </div>

        {currentTab === "posts" && (
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Tuition Job</span>
          </button>
        )}
      </div>

      {/* Grid Stats (Renders on Overview, Posts, and Invoices Tabs) */}
      {(currentTab === "overview" || currentTab === "posts" || currentTab === "invoices") && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1: Active Tutors */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Active Tutors
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-[#0F5B47] dark:text-[#188c6e]">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                {applications.filter((a) => a.status === "Hired").length + 2}
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400">
                Hired educators
              </div>
            </div>
          </div>

          {/* Stat 2: Open Posts */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Open Posts
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-blue-500">
                <FileText size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                {posts.filter((p) => p.status === "Active").length}
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400">
                Active job vacancies
              </div>
            </div>
          </div>

          {/* Stat 3: Hours Learned */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Hours Learned
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-orange-500">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                24 Hours
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400">
                Lessons completed
              </div>
            </div>
          </div>

          {/* Stat 4: Fees Paid */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Fees Paid
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-emerald-500">
                <TakaIcon size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                ৳ 13,500
              </span>
              <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>July payouts total</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL 1: OVERVIEW --- */}
      {currentTab === "overview" && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left - Tutor Applications summary */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />
                Recent Applicants ({applications.filter(a => a.status === "Pending").length})
              </h3>
              <button
                onClick={() => router.push("/dashboard?tab=applications")}
                className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] dark:hover:text-[#1ca682] cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-4">
              {applications.filter(a => a.status === "Pending").slice(0, 3).map((app) => (
                <div key={app.id} className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-full ${app.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                      {app.tutorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-200 leading-tight">
                        {app.tutorName}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-550 mt-0.5">
                        {app.institution} &bull; {app.subject}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                      ৳ {app.salaryBid.toLocaleString()}/mo
                    </span>
                    <button
                      onClick={() => handleHireTutor(app)}
                      className="px-2.5 py-1 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white text-[9px] font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Hire
                    </button>
                  </div>
                </div>
              ))}
              {applications.filter(a => a.status === "Pending").length === 0 && (
                <div className="text-center py-8 text-zinc-450 text-sm font-semibold">
                  No pending tutor applications.
                </div>
              )}
            </div>
          </div>

          {/* Right - Study Schedule & Post CTA */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Today's Schedule Card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                <h3 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-zinc-450" />
                  Today&apos;s Lessons
                </h3>
                <span className="text-[9px] font-extrabold uppercase bg-orange-50 dark:bg-orange-950/20 text-[#F26A1B] px-2 py-0.5 rounded-full">
                  August 04
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                      Chemistry with Zara
                    </h4>
                    <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                      Organic Chemistry Basic
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e] shrink-0">
                    4:30 PM
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Post CTA Banner */}
            <div className="bg-[#0F5B47] dark:bg-[#188c6e]/90 text-white rounded-3xl p-6 shadow-xs flex gap-4 items-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-white/5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-350">
                <FileText className="w-32 h-32 stroke-[3px]" />
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white/70">
                    Need another tutor?
                  </h4>
                  <p className="text-[11px] font-extrabold text-white/90 leading-relaxed">
                    Publish your tuition requirements to let qualified teachers search and apply.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/dashboard?tab=posts")}
                  className="px-4 py-2 bg-white hover:bg-zinc-100 text-[#0F5B47] text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Create Posting
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- PANEL 2: MY TUITION POSTS --- */}
      {currentTab === "posts" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">
                      {post.classLevel}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      post.status === "Active"
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e]"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                    }`}>
                      {post.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      {post.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                      {post.subjects.join(", ")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {post.frequency} &bull; {post.mode}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                      Budget Range
                    </span>
                    <span className="text-base font-black text-[#0F5B47] dark:text-[#188c6e]">
                      ৳ {post.budget.toLocaleString()}/mo
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPosts((prev) => prev.map(p => p.id === post.id ? { ...p, status: p.status === "Active" ? "Paused" as const : "Active" as const } : p))}
                      className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-450 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                    >
                      {post.status === "Active" ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => setPosts((prev) => prev.filter(p => p.id !== post.id))}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12 text-zinc-400 text-sm font-semibold">
                You haven&apos;t published any tuition job postings.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PANEL 3: TUTOR APPLICATIONS --- */}
      {currentTab === "applications" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-full ${app.avatarBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                    {app.tutorName.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-zinc-900 dark:text-white">
                        {app.tutorName}
                      </h3>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {app.rating}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {app.institution} &bull; {app.subject}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                      Expected Fee
                    </span>
                    <span className="text-base font-black text-[#0F5B47] dark:text-[#188c6e]">
                      ৳ {app.salaryBid.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {app.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleRejectTutor(app.id)}
                          className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4 stroke-[3px]" />
                        </button>
                        <button
                          onClick={() => {
                            // Shortlist redirect to message
                            setActiveChatId("chat-1");
                            router.push("/dashboard?tab=messages");
                          }}
                          className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-extrabold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => handleHireTutor(app)}
                          className="px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                          <span>Hire</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e] bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-xl uppercase tracking-wider">
                        {app.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PANEL 4: MESSAGES --- */}
      {currentTab === "messages" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-xs flex h-[70vh] min-h-125 max-h-170 transition-colors duration-300">
          
          {/* Left: Chat Contacts List */}
          <div className={`${
            chatMobileView === "chat" ? "hidden" : "flex"
          } md:flex w-full md:w-80 border-r border-zinc-150/80 dark:border-zinc-900 flex-col shrink-0 bg-white dark:bg-zinc-950`}>
            
            {/* Search Header */}
            <div className="p-4 border-b border-zinc-150/60 dark:border-zinc-900 space-y-3 shrink-0">
              <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                Conversations
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutors..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] focus:ring-2 focus:ring-[#0F5B47]/10 dark:focus:ring-[#188c6e]/10 text-zinc-800 dark:text-white transition-all duration-200"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Contacts loop */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/50 dark:divide-zinc-900/40">
              {chats
                .filter((c) => c.studentName.toLowerCase().includes(chatSearch.toLowerCase()))
                .map((chat) => {
                  const isActive = chat.id === activeChatId;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setActiveChatId(chat.id);
                        setChatMobileView("chat");
                        setChats((prev) =>
                          prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
                        );
                      }}
                      className={`w-full text-left p-4 flex gap-3 items-center transition-all duration-200 border-l-4 cursor-pointer ${
                        isActive
                          ? "bg-[#0F5B47]/5 dark:bg-[#188c6e]/5 border-[#0F5B47] dark:border-[#188c6e]"
                          : "border-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full ${chat.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                        {chat.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="text-xs text-zinc-850 dark:text-white leading-tight font-black">
                            {chat.studentName}
                          </h4>
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-555 shrink-0">
                            {chat.time}
                          </span>
                        </div>
                        <p className="text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 truncate leading-normal">
                          {chat.lastMessage}
                        </p>
                      </div>

                      {chat.unreadCount > 0 && (
                        <span className="w-4.5 h-4.5 rounded-full bg-[#F26A1B] text-white text-[8px] font-black flex items-center justify-center shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              {chats.filter((c) => c.studentName.toLowerCase().includes(chatSearch.toLowerCase())).length === 0 && (
                <div className="text-center py-12 text-zinc-400 text-xs font-semibold">
                  No conversations found.
                </div>
              )}
            </div>
          </div>

          {/* Right: Active Chat conversation box */}
          {(() => {
            const activeChat = chats.find((c) => c.id === activeChatId);
            if (!activeChat) {
              return (
                <div className="flex-1 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 text-zinc-400 text-sm font-semibold">
                  Select a chat conversation to start messaging.
                </div>
              );
            }

            return (
              <div className={`${
                chatMobileView === "list" ? "hidden" : "flex"
              } md:flex flex-1 flex-col h-full bg-zinc-50/30 dark:bg-zinc-900/10`}>
                
                {/* Active Chat Header */}
                <div className="px-4 py-3 bg-white dark:bg-zinc-950 border-b border-zinc-150/60 dark:border-zinc-900 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setChatMobileView("list")}
                    className="md:hidden p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                  </button>
                  <div className={`w-9 h-9 rounded-full ${activeChat.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                    {activeChat.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs text-zinc-850 dark:text-white leading-tight font-extrabold">
                      {activeChat.studentName}
                    </h4>
                    <span className="text-[9px] text-[#0F5B47] dark:text-[#188c6e] font-black uppercase tracking-wider block mt-0.5">
                      Online &bull; Tutor
                    </span>
                  </div>
                </div>

                {/* Messages logs area */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                  <div className="space-y-4 mt-auto">
                    {activeChat.messages.map((msg) => {
                      const isStudent = msg.sender === "student";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isStudent ? "justify-end" : "justify-start"} items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                          {!isStudent && (
                            <div className={`w-6 h-6 rounded-full ${activeChat.avatarBg} text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs mb-1`}>
                              {activeChat.studentName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="max-w-[75%] space-y-1">
                            <div
                              className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                                isStudent
                                  ? "bg-[#0F5B47] text-white dark:bg-[#188c6e] rounded-br-none shadow-xs"
                                  : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-3xs"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <span className={`text-[8px] font-bold text-zinc-400 block ${isStudent ? "text-right" : "text-left"}`}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Input Area */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-150/60 dark:border-zinc-900 flex gap-2.5 items-center shrink-0"
                >
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] focus:ring-2 focus:ring-[#0F5B47]/10 dark:focus:ring-[#188c6e]/10 text-zinc-850 dark:text-white transition-all duration-200"
                    required
                  />
                  <button
                    type="submit"
                    className="p-3 bg-[#F26522] hover:bg-[#d9551a] text-white rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>

              </div>
            );
          })()}

        </div>
      )}

      {/* --- PANEL 5: ACTIVE TUTORS --- */}
      {currentTab === "active-tutors" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="space-y-6">
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-200">
              
              {/* Header profile */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-150/30 dark:border-zinc-900/40">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Zara Tabassum
                  </h3>
                  <p className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                    Chemistry &bull; HSC (1st Year)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] text-[9px] font-extrabold uppercase">
                    Active
                  </span>
                  <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
                    ৳ 8,000/mo
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-bold tracking-wider">
                    Schedule Details
                  </span>
                  <p className="text-zinc-850 dark:text-zinc-200">
                    3 Days / Week (Home)
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-555 uppercase font-bold tracking-wider">
                    Start Date
                  </span>
                  <p className="text-zinc-850 dark:text-zinc-200">
                    Mar 01, 2026
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-555 uppercase font-bold tracking-wider">
                    Next Session
                  </span>
                  <p className="text-[#0F5B47] dark:text-[#188c6e] font-bold">
                    Tomorrow at 4:30 PM
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-blue-50/20 dark:bg-blue-955/5 border border-blue-100/50 dark:border-blue-900/10 p-4 rounded-xl flex gap-3 items-start mt-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] text-blue-800 dark:text-blue-400 uppercase font-bold tracking-wider">
                    Tutor Progress logs
                  </span>
                  <p className="text-xs text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">
                    Chemical Bonds completed. Started Organic Chemistry basic concepts. Preparing for weekly test.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- PANEL 6: INVOICES --- */}
      {currentTab === "invoices" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-900">
            Payment Receipts
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-900 text-[10px] font-black text-zinc-450 dark:text-zinc-555 uppercase tracking-wider">
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Pay Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-zinc-100/50 dark:border-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white">
                      {inv.billingMonth}
                    </td>
                    <td className="py-4 px-4">{inv.description}</td>
                    <td className="py-4 px-4">{inv.date}</td>
                    <td className="py-4 px-4">{inv.method}</td>
                    <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white">
                      ৳ {inv.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] uppercase">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- POST JOB MODAL --- */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto space-y-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                Post a Tuition Job
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">Class Level</label>
                  <input
                    type="text"
                    placeholder="e.g. Class 10 (SSC)"
                    value={newClassLevel}
                    onChange={(e) => setNewClassLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">Salary Budget (BDT/mo)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">Subjects (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Physics, Chemistry"
                  value={newSubjects}
                  onChange={(e) => setNewSubjects(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">Tuition Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as "Home" | "Online" | "Both")}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white cursor-pointer"
                  >
                    <option value="Home">In-Person (Home)</option>
                    <option value="Online">Online</option>
                    <option value="Both">Both (Hybrid)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">Weekly Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white cursor-pointer"
                  >
                    <option value="1 Day / Week">1 Day / Week</option>
                    <option value="2 Days / Week">2 Days / Week</option>
                    <option value="3 Days / Week">3 Days / Week</option>
                    <option value="4 Days / Week">4 Days / Week</option>
                    <option value="5 Days / Week">5 Days / Week</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-550 dark:text-zinc-400 uppercase tracking-wide">Location Address</label>
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
