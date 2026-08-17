/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  UserCheck,
  UserX,
  Trash2,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { AdminUser } from "@/data/adminDashboard";
import api from "@/lib/api";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom confirmation modal state configuration
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning" | "success" | "info";
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/user");
      const rawData = response.data?.data;
      const userList = Array.isArray(rawData) ? rawData : (rawData?.data || []);
      
      // Map API user object to AdminUser layout compatibility
      const mappedUsers: AdminUser[] = userList.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        mobile: u.mobile || "N/A",
        isVerified: u.isVerified,
        joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "N/A",
      }));
      
      setUsers(mappedUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message || 
        "Failed to retrieve user accounts from the server. Please verify your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchUsers();
    });
  }, []);

  const handleToggleBlock = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    try {
      setActionLoading(true);
      await api.patch(`/user/${id}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus as any } : u))
      );
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      console.error("Error toggling user status:", err);
      alert(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVerification = async (id: string, currentVal: boolean) => {
    const nextVal = !currentVal;
    try {
      setActionLoading(true);
      await api.patch(`/user/${id}/status`, { isVerified: nextVal });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isVerified: nextVal } : u))
      );
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      console.error("Error toggling user verification:", err);
      alert(err.response?.data?.message || "Failed to update verification status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setActionLoading(true);
      await api.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "Failed to delete user account.");
    } finally {
      setActionLoading(false);
    }
  };

  // Open configured modals
  const openBlockModal = (user: AdminUser) => {
    const isBlocking = user.status !== "blocked";
    setModalConfig({
      isOpen: true,
      title: isBlocking ? "Block User Account" : "Activate User Account",
      message: `Are you sure you want to ${isBlocking ? "block" : "unblock"} ${user.name}? This will ${
        isBlocking ? "suspend their access and privileges" : "restore their access permissions"
      } immediately.`,
      confirmText: isBlocking ? "Suspend Account" : "Activate Account",
      variant: isBlocking ? "danger" : "success",
      onConfirm: () => handleToggleBlock(user.id, user.status),
    });
  };

  const openVerifyModal = (user: AdminUser) => {
    const isVerifying = !user.isVerified;
    setModalConfig({
      isOpen: true,
      title: isVerifying ? "Grant Verification status" : "Revoke Verification status",
      message: `Are you sure you want to ${isVerifying ? "verify" : "unverify"} ${user.name}? Verified users get a badge on their profile and list priority.`,
      confirmText: isVerifying ? "Verify User" : "Remove Verification",
      variant: isVerifying ? "success" : "warning",
      onConfirm: () => handleToggleVerification(user.id, user.isVerified),
    });
  };

  const openDeleteModal = (user: AdminUser) => {
    setModalConfig({
      isOpen: true,
      title: "Permanently Delete Account",
      message: `Are you sure you want to delete ${user.name} (${user.email})? All associated records, profiles, and listings will be permanently deleted. This action is irreversible.`,
      confirmText: "Delete Account",
      variant: "danger",
      onConfirm: () => handleDeleteUser(user.id),
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.mobile && u.mobile.includes(search));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
          Users Management
        </h2>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
          Review details, toggle status, and manage platform membership permissions.
        </p>
      </div>

      {/* Filters & Actions Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-850 dark:bg-zinc-900">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#0F5B47] focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-[#188c6e]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900">
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
          <p className="text-sm font-bold text-zinc-550 dark:text-zinc-400">
            Retrieving users records from database...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-150 bg-red-50/20 p-8 text-center dark:border-red-950/20 dark:bg-red-950/10">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 rounded-xl bg-[#0F5B47] hover:bg-[#0c4a39] px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
          >
            Reload Records
          </button>
        </div>
      ) : (
        /* Users Data Table */
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-855 dark:bg-zinc-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
              <thead className="bg-zinc-50 text-xs font-black uppercase tracking-wider text-zinc-450 dark:bg-zinc-950 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                      No users matched the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-zinc-400 dark:text-zinc-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
                              : user.role === "tutor"
                              ? "bg-[#0F5B47]/10 text-[#0F5B47] dark:bg-[#188c6e]/10 dark:text-[#188c6e]"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-700 dark:text-zinc-350">
                        {user.mobile}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openVerifyModal(user)}
                          className={`flex items-center gap-1.5 text-xs font-bold transition-all hover:opacity-80 ${
                            user.isVerified
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-zinc-400 dark:text-zinc-500"
                          }`}
                        >
                          {user.isVerified ? (
                            <>
                              <ShieldCheck size={16} />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert size={16} />
                              <span>Unverified</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : user.status === "blocked"
                              ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-450 dark:text-zinc-500">
                        {user.joinedDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openBlockModal(user)}
                            className={`rounded-xl p-2 transition-all cursor-pointer ${
                              user.status === "blocked"
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                            }`}
                            title={user.status === "blocked" ? "Unblock User" : "Block User"}
                          >
                            {user.status === "blocked" ? <UserCheck size={16} /> : <UserX size={16} />}
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="rounded-xl bg-zinc-50 hover:bg-red-50 hover:text-red-650 p-2 text-zinc-400 transition-all dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:hover:text-red-400 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal overlay */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        variant={modalConfig.variant}
        isLoading={actionLoading}
      />
    </div>
  );
}
