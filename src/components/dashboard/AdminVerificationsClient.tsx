/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  FileX,
  Search,
  Download,
  AlertCircle,
  CheckCircle,
  Eye
} from "lucide-react";
import { TutorVerification } from "@/data/adminDashboard";
import api from "@/lib/api";

export default function AdminVerificationsClient() {
  const [verifications, setVerifications] = useState<TutorVerification[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<TutorVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await api.get("/user/verifications");
        if (active) {
          setVerifications(response.data.data);
        }
      } catch (err: any) {
        if (active) {
          console.error("Error fetching verifications:", err);
          setError(
            err.response?.data?.message || 
            "Failed to retrieve tutor verification applications."
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

  const handleStatusChange = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      await api.patch(`/user/${id}/verify`, { status: newStatus });
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
      );
      if (selectedApp?.id === id) {
        setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      alert(`Application has been marked as ${newStatus}.`);
    } catch (err: any) {
      console.error("Error updating verification status:", err);
      alert(err.response?.data?.message || "Failed to update verification status.");
    }
  };
  const filteredApps = verifications.filter((v) => {
    const matchesSearch =
      v.tutorName.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.institution.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
          Tutor Verifications
        </h2>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
          Review academic transcripts, verification credentials, and approve/reject tutor onboarding applications.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-850 dark:bg-zinc-900">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#0F5B47] focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-[#188c6e]"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full md:w-auto justify-between">
            <span className="text-xs font-bold text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none"
            >
              <option value="all">All Applications</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Table & Details Drawer Side-by-Side if selected) */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Table List (takes up full width if no selection, otherwise 2 columns) */}
        <div className={`${selectedApp ? "lg:col-span-2" : "lg:col-span-3"} rounded-2xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900 shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
              <thead className="bg-zinc-50 text-xs font-black uppercase tracking-wider text-zinc-450 dark:bg-zinc-950 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Tutor Details</th>
                  <th className="px-6 py-4">Institution</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-md w-24 mb-2" />
                        <div className="h-3 bg-zinc-150 dark:bg-zinc-800 rounded-md w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-md w-32 mb-2" />
                        <div className="h-3 bg-zinc-150 dark:bg-zinc-800 rounded-md w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-md w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-zinc-200 dark:bg-zinc-850 rounded-full w-16" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-8 bg-zinc-200 dark:bg-zinc-850 rounded-md w-8 inline-block" />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-650 dark:text-red-450 font-bold">
                      {error}
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all ${
                        selectedApp?.id === app.id ? "bg-zinc-50 dark:bg-zinc-800/50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">
                            {app.tutorName}
                          </div>
                          <div className="text-xs text-zinc-400 dark:text-zinc-500">
                            {app.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-zinc-700 dark:text-zinc-300">
                            {app.institution}
                          </div>
                          <div className="text-xs text-zinc-400 dark:text-zinc-500">
                            {app.department}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-450 dark:text-zinc-500">
                        {app.submissionDate}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            app.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : app.status === "Rejected"
                              ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                              : "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="rounded-xl bg-zinc-50 hover:bg-zinc-100 hover:text-zinc-900 p-2 text-zinc-400 transition-all dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-white"
                          title="Review Application"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Application Review Panel */}
        {selectedApp && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Application Review
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                  Full Name & Email
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {selectedApp.tutorName}
                </p>
                <p className="text-xs text-zinc-500">{selectedApp.email}</p>
              </div>

              <div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                  Institution & Study Status
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  {selectedApp.institution}
                </p>
                <p className="text-xs text-zinc-550 dark:text-zinc-400">
                  {selectedApp.department} ({selectedApp.yearOfStudy})
                </p>
              </div>

              <div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                  Specialized Subjects
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedApp.subjects.map((subj) => (
                    <span
                      key={subj}
                      className="rounded-md bg-zinc-50 px-2 py-0.5 text-xs font-bold text-zinc-655 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {subj}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-50 dark:border-zinc-800 pt-4 space-y-3">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                  Uploaded Documents
                </span>
                {/* Transcript link */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-150 p-3 text-xs dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-300">Transcript/ID:</span>
                    <span className="text-zinc-450 truncate max-w-30">{selectedApp.certificateUrl}</span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("Downloading file: " + selectedApp.certificateUrl); }}
                    className="text-[#0F5B47] dark:text-[#188c6e] font-black flex items-center gap-1 hover:underline"
                  >
                    <Download size={14} />
                  </a>
                </div>

                {/* NID link */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-150 p-3 text-xs dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-300">NID Card:</span>
                    <span className="text-zinc-450 truncate max-w-30">{selectedApp.nidCardUrl}</span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("Downloading file: " + selectedApp.nidCardUrl); }}
                    className="text-[#0F5B47] dark:text-[#188c6e] font-black flex items-center gap-1 hover:underline"
                  >
                    <Download size={14} />
                  </a>
                </div>
              </div>
            </div>

            {selectedApp.status === "Pending" && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                <button
                  onClick={() => handleStatusChange(selectedApp.id, "Approved")}
                  className="rounded-xl bg-[#0F5B47] hover:bg-[#0F5B47]/90 text-white dark:bg-[#188c6e] dark:hover:bg-[#188c6e]/90 p-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FileCheck size={16} />
                  Approve Verification
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp.id, "Rejected")}
                  className="rounded-xl bg-red-50 hover:bg-red-100 text-red-655 dark:bg-red-950/20 dark:hover:bg-red-950/30 dark:text-red-400 p-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <FileX size={16} />
                  Reject & Notify
                </button>
              </div>
            )}

            {selectedApp.status !== "Pending" && (
              <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                selectedApp.status === "Approved"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
              }`}>
                {selectedApp.status === "Approved" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>This application has already been {selectedApp.status.toLowerCase()}.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
