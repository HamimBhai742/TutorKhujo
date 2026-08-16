/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Clock,
  MapPin,
  Check,
  X,
  TrendingUp,
  Info,
  CalendarDays,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Pause,
  Play,
  Sparkles,
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { TakaIcon } from "@/components/shared/TakaIcon";
import api from "@/lib/api";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import {
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

  // Dynamic States from Backend
  const [posts, setPosts] = useState<TuitionPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Other dynamic/interactive tab states
  const [applications, setApplications] = useState<TutorApplication[]>(MOCK_TUTOR_APPLICATIONS);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [chats, setChats] = useState<ChatContact[]>(MOCK_CHATS);
  
  const [activeChatId, setActiveChatId] = useState<string>("chat-1");
  const [newMessageText, setNewMessageText] = useState<string>("");
  const [chatSearch, setChatSearch] = useState<string>("");

  // Post Tuition Form & Modal States
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form Fields
  const [classLevel, setClassLevel] = useState<string>("");
  const [subjects, setSubjects] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [mode, setMode] = useState<"Home" | "Online" | "Both">("Home");
  const [frequency, setFrequency] = useState<string>("3 Days / Week");
  const [location, setLocation] = useState<string>("");
  const [genderPreference, setGenderPreference] = useState<string>("Any");
  const [extraNotes, setExtraNotes] = useState<string>("");

  // Confirmation Modal state when publishing
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Delete Confirmation Modal state
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean;
    postId: string | null;
    postTitle: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: "",
  });

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch student's tuition posts from backend
  const fetchMyPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const response = await api.get("/tuitions/my-posts");
      const rawPosts = response.data?.data || [];

      const formatted: TuitionPost[] = rawPosts.map((p: any) => ({
        id: p.id,
        classLevel: p.classLevel,
        subjects: Array.isArray(p.subjects) ? p.subjects : [p.subjects],
        budget: p.budget,
        mode: p.mode,
        frequency: p.frequency,
        location: p.location,
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
    } catch (err: any) {
      console.error("Failed to load tuition posts:", err);
      showToast("error", err?.response?.data?.message || "Failed to load tuition posts from server.");
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      try {
        const response = await api.get("/tuitions/my-posts");
        if (ignore) return;
        const rawPosts = response.data?.data || [];

        const formatted: TuitionPost[] = rawPosts.map((p: any) => ({
          id: p.id,
          classLevel: p.classLevel,
          subjects: Array.isArray(p.subjects) ? p.subjects : [p.subjects],
          budget: p.budget,
          mode: p.mode,
          frequency: p.frequency,
          location: p.location,
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
      } catch (err: any) {
        if (ignore) return;
        console.error("Failed to load tuition posts:", err);
        showToast("error", err?.response?.data?.message || "Failed to load tuition posts from server.");
      } finally {
        if (!ignore) {
          setLoadingPosts(false);
        }
      }
    };

    loadPosts();

    return () => {
      ignore = true;
    };
  }, []);

  // Open Create Form
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditingPostId(null);
    setClassLevel("");
    setSubjects("");
    setBudget("");
    setMode("Home");
    setFrequency("3 Days / Week");
    setLocation("");
    setGenderPreference("Any");
    setExtraNotes("");
    setShowPostModal(true);
  };

  // Open Edit Form
  const handleOpenEditModal = (post: TuitionPost) => {
    setIsEditing(true);
    setEditingPostId(post.id);
    setClassLevel(post.classLevel);
    setSubjects(post.subjects.join(", "));
    setBudget(post.budget.toString());
    setMode(post.mode);
    setFrequency(post.frequency);
    setLocation(post.location);
    setGenderPreference("Any");
    setExtraNotes("");
    setShowPostModal(true);
  };

  // Step 1: Pre-validate and show confirmation modal
  const handleProceedToConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classLevel.trim() || !subjects.trim() || !budget.trim() || !location.trim()) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    if (isEditing) {
      // In edit mode, save directly or confirm
      handleSaveEditPost();
    } else {
      // In create mode, display detailed confirmation preview
      setShowPostModal(false);
      setShowConfirmModal(true);
    }
  };

  // Step 2: Final submit to backend (Create)
  const handleConfirmCreatePost = async () => {
    try {
      setActionLoading(true);
      const payload = {
        title: classLevel.trim(),
        classLevel: classLevel.trim(),
        subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
        budget: parseInt(budget, 10),
        mode,
        frequency,
        location: location.trim(),
        genderPreference,
        extraNotes: extraNotes.trim() || undefined,
      };

      const response = await api.post("/tuitions", payload);
      const newCreated = response.data?.data;

      if (newCreated) {
        const formattedNew: TuitionPost = {
          id: newCreated.id,
          classLevel: newCreated.classLevel,
          subjects: newCreated.subjects,
          budget: newCreated.budget,
          mode: newCreated.mode,
          frequency: newCreated.frequency,
          location: newCreated.location,
          status: newCreated.status,
          date: "Just Now",
        };
        setPosts((prev) => [formattedNew, ...prev]);
      } else {
        await fetchMyPosts();
      }

      setShowConfirmModal(false);
      showToast("success", "Tuition requirement posted successfully! Tutors can now view and apply.");
    } catch (err: any) {
      console.error("Error creating tuition post:", err);
      showToast("error", err?.response?.data?.message || "Failed to post tuition requirement.");
    } finally {
      setActionLoading(false);
    }
  };

  // Step 2 (Edit): Update post in backend
  const handleSaveEditPost = async () => {
    if (!editingPostId) return;
    try {
      setActionLoading(true);
      const payload = {
        title: classLevel.trim(),
        classLevel: classLevel.trim(),
        subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
        budget: parseInt(budget, 10),
        mode,
        frequency,
        location: location.trim(),
        genderPreference,
        extraNotes: extraNotes.trim() || undefined,
      };

      const response = await api.patch(`/tuitions/${editingPostId}`, payload);
      const updated = response.data?.data;

      if (updated) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPostId
              ? {
                  ...p,
                  classLevel: updated.classLevel,
                  subjects: updated.subjects,
                  budget: updated.budget,
                  mode: updated.mode,
                  frequency: updated.frequency,
                  location: updated.location,
                  status: updated.status,
                }
              : p
          )
        );
      } else {
        await fetchMyPosts();
      }

      setShowPostModal(false);
      showToast("success", "Tuition post updated successfully!");
    } catch (err: any) {
      console.error("Error updating tuition post:", err);
      showToast("error", err?.response?.data?.message || "Failed to update tuition post.");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Status (Pause / Resume)
  const handleToggleStatus = async (post: TuitionPost) => {
    const newStatus = post.status === "Active" ? "Paused" : "Active";
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
      );

      await api.patch(`/tuitions/${post.id}/status`, { status: newStatus });
      showToast("success", `Tuition post has been ${newStatus.toLowerCase()}.`);
    } catch (err: any) {
      // Rollback on error
      fetchMyPosts();
      showToast("error", err?.response?.data?.message || "Failed to update status.");
    }
  };

  // Open Delete Confirmation
  const handlePromptDelete = (post: TuitionPost) => {
    setDeleteModalConfig({
      isOpen: true,
      postId: post.id,
      postTitle: post.classLevel,
    });
  };

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteModalConfig.postId) return;
    try {
      setActionLoading(true);
      await api.delete(`/tuitions/${deleteModalConfig.postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== deleteModalConfig.postId));
      setDeleteModalConfig({ isOpen: false, postId: null, postTitle: "" });
      showToast("success", "Tuition post deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting post:", err);
      showToast("error", err?.response?.data?.message || "Failed to delete tuition post.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleHireTutor = (app: TutorApplication) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Hired" as const } : a))
    );
    showToast("success", `Congratulations! You have hired ${app.tutorName}. Their class tracker has been activated.`);
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-bold animate-in slide-in-from-top-4 duration-200 ${
          toastMessage.type === "success"
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
            : "bg-rose-50 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800"
        }`}>
          {toastMessage.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

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
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyPosts}
              disabled={loadingPosts}
              title="Refresh posts"
              className="p-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingPosts ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-5 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Tuition Job</span>
            </button>
          </div>
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

          {/* Stat 2: Open Posts (Dynamic Count from Backend) */}
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
                {loadingPosts ? "..." : posts.filter((p) => p.status === "Active").length}
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

      {/* --- PANEL 2: MY TUITION POSTS (FULLY DYNAMIC FROM BACKEND) --- */}
      {currentTab === "posts" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          
          {/* Posts List Loading State */}
          {loadingPosts && (
            <div className="space-y-4 py-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl animate-pulse flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-2/3"></div>
                  </div>
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-md w-28"></div>
                </div>
              ))}
            </div>
          )}

          {/* Posts List */}
          {!loadingPosts && (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-300 dark:hover:border-zinc-750 transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-black text-zinc-900 dark:text-white">
                        {post.classLevel}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          post.status === "Active"
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e]"
                            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                        }`}
                      >
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
                    
                    {/* Action buttons: Pause/Resume + EDIT + Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                        title={post.status === "Active" ? "Pause applications" : "Resume applications"}
                      >
                        {post.status === "Active" ? (
                          <>
                            <Pause className="w-3 h-3 text-amber-500" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-emerald-500" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(post)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                        title="Edit post details"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handlePromptDelete(post)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-16 px-4 bg-zinc-50/30 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-3xl space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0F5B47]/10 dark:bg-[#188c6e]/10 text-[#0F5B47] dark:text-[#188c6e] flex items-center justify-center">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-zinc-900 dark:text-white">
                      No tuition posts published yet
                    </h4>
                    <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 max-w-sm mx-auto">
                      Post your tuition requirement with subjects and budget to start receiving applications from verified tutors.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Tuition Job</span>
                  </button>
                </div>
              )}
            </div>
          )}
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
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                        {app.tutorName}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        app.status === "Pending" ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600" :
                        app.status === "Hired" ? "bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e]" :
                        "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500">
                      {app.institution} &bull; {app.subject}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                  <span className="text-sm font-black text-zinc-900 dark:text-white">
                    ৳ {app.salaryBid.toLocaleString()}/mo
                  </span>
                  {app.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleHireTutor(app)}
                        className="px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                      >
                        Hire Tutor
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PANEL 4: MESSAGES --- */}
      {currentTab === "messages" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-137.5">
          {/* Chat list */}
          <div className="md:col-span-4 border-r border-zinc-100 dark:border-zinc-900 p-4 space-y-4">
            <input
              type="text"
              placeholder="Search conversations..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white"
            />
            <div className="space-y-2">
              {chats.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-colors flex items-center gap-3 ${
                    activeChatId === c.id
                      ? "bg-[#0F5B47]/10 dark:bg-[#188c6e]/10 border border-[#0F5B47]/20 dark:border-[#188c6e]/20"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${c.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                    {c.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate">
                      {c.studentName}
                    </h4>
                    <p className="text-[10px] font-medium text-zinc-450 dark:text-zinc-500 truncate mt-0.5">
                      {c.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat Conversation */}
          <div className="md:col-span-8 flex flex-col justify-between p-6">
            <div className="space-y-4 overflow-y-auto max-h-100">
              {chats.find(c => c.id === activeChatId)?.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "student" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl text-xs font-semibold ${
                      m.sender === "student"
                        ? "bg-[#0F5B47] text-white rounded-br-xs"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-xs"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[9px] font-bold text-zinc-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white text-xs font-extrabold uppercase rounded-xl transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- PANEL 5: ACTIVE TUTORS --- */}
      {currentTab === "active-tutors" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-900">
            Hired & Active Educators
          </h3>
          <div className="space-y-4">
            <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center">
                    Z
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white">Zara Tabassum</h4>
                    <p className="text-xs font-bold text-zinc-450">Chemistry &bull; HSC (1st Year)</p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e]">৳ 8,000/mo</span>
              </div>
              <div className="bg-blue-50/20 dark:bg-blue-955/5 border border-blue-100/50 dark:border-blue-900/10 p-4 rounded-xl flex gap-3 items-start">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] text-blue-800 dark:text-blue-400 uppercase font-bold tracking-wider">
                    Tutor Progress Logs
                  </span>
                  <p className="text-xs text-zinc-650 dark:text-zinc-450 font-semibold leading-relaxed">
                    Chemical Bonds completed. Started Organic Chemistry basic concepts. Preparing for weekly model test.
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

      {/* ========================================================================= */}
      {/* 1. POST / EDIT TUITION FORM MODAL */}
      {/* ========================================================================= */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowPostModal(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto space-y-6 z-10 animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0F5B47]/10 dark:bg-[#188c6e]/10 text-[#0F5B47] dark:text-[#188c6e] flex items-center justify-center">
                  {isEditing ? <Edit3 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    {isEditing ? "Edit Tuition Job" : "Post a Tuition Job"}
                  </h3>
                  <p className="text-[11px] font-semibold text-zinc-400">
                    {isEditing ? "Update your requirements and salary budget" : "Specify your class, subjects, and preferences"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProceedToConfirmation} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <span>Class Level</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Class 10 (SSC)"
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <span>Salary Budget (৳/mo)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                  <span>Subjects (Comma separated)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Higher Mathematics, Physics"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Tuition Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "Home" | "Online" | "Both")}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white cursor-pointer transition-colors"
                  >
                    <option value="Home">In-Person (Home)</option>
                    <option value="Online">Online</option>
                    <option value="Both">Both (Hybrid)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Weekly Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white cursor-pointer transition-colors"
                  >
                    <option value="1 Day / Week">1 Day / Week</option>
                    <option value="2 Days / Week">2 Days / Week</option>
                    <option value="3 Days / Week">3 Days / Week</option>
                    <option value="4 Days / Week">4 Days / Week</option>
                    <option value="5 Days / Week">5 Days / Week</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <span>Location Address</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Dhaka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Tutor Gender Preference</label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white cursor-pointer transition-colors"
                  >
                    <option value="Any">Any Gender</option>
                    <option value="Male">Male Tutor Preferred</option>
                    <option value="Female">Female Tutor Preferred</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Special Requirements / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need teacher with strong background in Cambridge/Edexcel curriculum..."
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white transition-colors resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-extrabold uppercase tracking-wide rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : isEditing ? (
                    <span>Save Changes</span>
                  ) : (
                    <span>Review & Post &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. POST CONFIRMATION PREVIEW MODAL */}
      {/* ========================================================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => !actionLoading && setShowConfirmModal(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl p-6 md:p-8 w-full max-w-lg mx-auto space-y-6 z-10 animate-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#0F5B47] dark:text-[#188c6e] flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[3px]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Confirm Tuition Post
                  </h3>
                  <p className="text-xs font-semibold text-zinc-400">
                    Review your requirement details before publishing
                  </p>
                </div>
              </div>
              <button
                onClick={() => !actionLoading && setShowConfirmModal(false)}
                disabled={actionLoading}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Card */}
            <div className="p-5 bg-zinc-50/70 dark:bg-zinc-850/50 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0F5B47] dark:text-[#188c6e]">
                    Class / Grade
                  </span>
                  <h4 className="text-base font-black text-zinc-900 dark:text-white mt-0.5">
                    {classLevel}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                    Monthly Salary
                  </span>
                  <p className="text-base font-black text-[#0F5B47] dark:text-[#188c6e] mt-0.5">
                    ৳ {parseInt(budget || "0", 10).toLocaleString()} <span className="text-[10px] font-bold text-zinc-400">/mo</span>
                  </p>
                </div>
              </div>

              {/* Subject Badges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Required Subjects:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.split(",").map((s) => s.trim()).filter(Boolean).map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-extrabold rounded-lg shadow-2xs"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs">
                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-350 font-semibold">
                  <MapPin className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e] shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-350 font-semibold">
                  <Clock className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e] shrink-0" />
                  <span>{frequency}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-350 font-semibold">
                  <BookOpen className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e] shrink-0" />
                  <span>{mode} Mode</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-650 dark:text-zinc-350 font-semibold">
                  <Users className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e] shrink-0" />
                  <span>{genderPreference} Gender</span>
                </div>
              </div>

              {extraNotes && (
                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-500 font-medium">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">Note: </span>
                  {extraNotes}
                </div>
              )}
            </div>

            {/* Alert note */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl flex items-center gap-2.5 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Verified educators matching this requirement will immediately receive notifications.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowPostModal(true);
                }}
                disabled={actionLoading}
                className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                &larr; Back to Edit
              </button>

              <button
                type="button"
                onClick={handleConfirmCreatePost}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>Confirm & Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <ConfirmationModal
        isOpen={deleteModalConfig.isOpen}
        onClose={() => setDeleteModalConfig({ isOpen: false, postId: null, postTitle: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Tuition Post"
        message={`Are you sure you want to delete "${deleteModalConfig.postTitle}"? Any existing tutor applications for this job will be archived.`}
        confirmText="Delete Post"
        variant="danger"
        isLoading={actionLoading}
      />

    </div>
  );
}
