/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Pause,
  Play,
  XCircle,
  Trash2,
  MapPin
} from "lucide-react";
import { TakaIcon } from "@/components/shared/TakaIcon";
import { AdminTuitionPost } from "@/data/adminDashboard";
import api from "@/lib/api";

export default function AdminTuitionsClient() {
  const [posts, setPosts] = useState<AdminTuitionPost[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/tuitions");
      const mappedPosts = response.data.data.map((p: any) => ({
        id: p.id,
        studentName: p.student?.name || "N/A",
        classLevel: p.classLevel,
        subjects: p.subjects,
        budget: p.budget,
        mode: p.mode,
        frequency: p.frequency,
        location: p.location,
        status: p.status,
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "N/A",
      }));
      setPosts(mappedPosts);
    } catch (err: any) {
      console.error("Error fetching tuitions:", err);
      setError(
        err.response?.data?.message || 
        "Failed to retrieve tuition posts from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await api.get("/tuitions");
        if (active) {
          const mappedPosts = response.data.data.map((p: any) => ({
            id: p.id,
            studentName: p.student?.name || "N/A",
            classLevel: p.classLevel,
            subjects: p.subjects,
            budget: p.budget,
            mode: p.mode,
            frequency: p.frequency,
            location: p.location,
            status: p.status,
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "N/A",
          }));
          setPosts(mappedPosts);
        }
      } catch (err: any) {
        if (active) {
          console.error("Error fetching tuitions:", err);
          setError(
            err.response?.data?.message || 
            "Failed to retrieve tuition posts from backend."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: "Active" | "Paused" | "Closed", action: "toggle" | "close") => {
    let newStatus: string;
    if (action === "close") {
      newStatus = "Closed";
    } else {
      newStatus = currentStatus === "Active" ? "Paused" : "Active";
    }

    try {
      await api.patch(`/tuitions/${id}/status`, { status: newStatus });
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus as any } : p))
      );
      alert(`Post status updated.`);
    } catch (err: any) {
      console.error("Error updating tuition status:", err);
      alert(err.response?.data?.message || "Failed to update tuition post status.");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this tuition listing?")) {
      try {
        await api.delete(`/tuitions/${id}`);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        alert("Post deleted successfully.");
      } catch (err: any) {
        console.error("Error deleting tuition post:", err);
        alert(err.response?.data?.message || "Failed to delete tuition post.");
      }
    }
  };
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesMode = modeFilter === "all" || p.mode === modeFilter;
    return matchesSearch && matchesStatus && matchesMode;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
          Tuition Listings Moderation
        </h2>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
          Monitor tuition posts listed by students. Review details, check requirements, pause/activate, or delete listings.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-850 dark:bg-zinc-900">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by student name, subject or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#0F5B47] focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-[#188c6e]"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none"
            >
              <option value="all">All Modes</option>
              <option value="Home">Home Tuition</option>
              <option value="Online">Online Tuition</option>
              <option value="Both">Both Modes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Tuition Cards */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900 shadow-sm">
          <svg
            className="h-10 w-10 animate-spin text-[#0F5B47] dark:text-[#188c6e]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400">
            Retrieving tuition listings...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-150 bg-red-50/20 p-8 text-center dark:border-red-950/20 dark:bg-red-950/10">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-4 rounded-xl bg-[#0F5B47] hover:bg-[#0c4a39] px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
          >
            Reload Listings
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-zinc-450 dark:text-zinc-500 font-semibold bg-white border border-zinc-200 dark:border-zinc-850 rounded-2xl">
              No tuition posts match the criteria.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      {post.classLevel}
                    </span>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        post.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : post.status === "Paused"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                          : "bg-zinc-100 text-zinc-655 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-white">
                    {post.studentName}
                  </h3>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-md bg-zinc-50 px-2 py-0.5 text-xs font-bold text-[#0F5B47] dark:bg-zinc-800 dark:text-[#188c6e]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2.5 border-t border-b border-zinc-100 dark:border-zinc-800/80 py-3.5 text-xs font-bold text-zinc-655 dark:text-zinc-350">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-zinc-400" />
                      <span>{post.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TakaIcon size={16} className="text-zinc-400" />
                      <span>৳ {post.budget}/month — {post.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-zinc-400" />
                      <span>Teaching Mode: {post.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-zinc-400 font-bold border-t border-zinc-50 dark:border-zinc-800/50 pt-4">
                  <span>Created {post.createdAt}</span>

                  <div className="flex items-center gap-2">
                    {post.status !== "Closed" && (
                      <>
                        <button
                          onClick={() => handleToggleStatus(post.id, post.status, "toggle")}
                          className="rounded-xl border border-zinc-150 p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all dark:border-zinc-800 dark:text-zinc-450 dark:hover:bg-zinc-850 dark:hover:text-white"
                          title={post.status === "Active" ? "Pause Post" : "Activate Post"}
                        >
                          {post.status === "Active" ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(post.id, post.status, "close")}
                          className="rounded-xl border border-zinc-150 p-2 text-red-655 hover:bg-red-50 hover:text-red-750 transition-all dark:border-zinc-800 dark:text-red-400 dark:hover:bg-red-950/20"
                          title="Close Post"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="rounded-xl border border-zinc-150 p-2 text-zinc-400 hover:bg-red-50 hover:text-red-655 transition-all dark:border-zinc-800 dark:hover:bg-red-950/20"
                      title="Delete Post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
