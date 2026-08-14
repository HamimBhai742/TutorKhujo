"use client";

import React, { useState } from "react";
import {
  Search,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { MOCK_ADMIN_TRANSACTIONS, AdminTransaction } from "@/data/adminDashboard";

export default function AdminPaymentsClient() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>(MOCK_ADMIN_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.reference.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalInvoiced = transactions
    .filter((t) => t.type === "Invoice Payment" && t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayouts = transactions
    .filter((t) => t.type === "Tutor Payout" && t.status === "Success")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayouts = transactions
    .filter((t) => t.type === "Tutor Payout" && t.status === "Pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleProcessPayout = (id: string, name: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Success" } : t))
    );
    alert(`Success! Payout to tutor ${name} has been processed.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
          Payments & Invoices
        </h2>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
          Monitor tuition payments from students and process pending payout balances to tutors.
        </p>
      </div>

      {/* Financial KPI Widgets */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Metric 1: Total Received */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              Total Invoiced Revenue
            </span>
            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-emerald-500">
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              ৳ {totalInvoiced.toLocaleString()}
            </span>
            <div className="mt-2 text-xs font-bold text-emerald-500">
              Success payments from students
            </div>
          </div>
        </div>

        {/* Metric 2: Total Payouts */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              Payouts Disbursed
            </span>
            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-blue-500">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              ৳ {totalPayouts.toLocaleString()}
            </span>
            <div className="mt-2 text-xs font-bold text-blue-550 dark:text-blue-400">
              Paid out successfully to tutors
            </div>
          </div>
        </div>

        {/* Metric 3: Pending Payouts */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
              Outstanding Payouts
            </span>
            <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-orange-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              ৳ {pendingPayouts.toLocaleString()}
            </span>
            <div className="mt-2 text-xs font-bold text-orange-500">
              Awaiting admin processing
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-850 dark:bg-zinc-900">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by user or transaction ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#0F5B47] focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-[#188c6e]"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none"
            >
              <option value="all">All Types</option>
              <option value="Invoice Payment">Student Payments</option>
              <option value="Tutor Payout">Tutor Payouts</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-zinc-500 dark:text-zinc-400">
            <thead className="bg-zinc-50 text-xs font-black uppercase tracking-wider text-zinc-450 dark:bg-zinc-950 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          {tx.type === "Invoice Payment" ? (
                            <span className="text-emerald-650 flex items-center gap-0.5">
                              <ArrowDownLeft size={14} /> Student Inflow
                            </span>
                          ) : (
                            <span className="text-blue-650 flex items-center gap-0.5">
                              <ArrowUpRight size={14} /> Tutor Outflow
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-400 dark:text-zinc-500">
                          Ref: {tx.reference}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-zinc-700 dark:text-zinc-355">
                          {tx.userName}
                        </div>
                        <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase">
                          {tx.userRole}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-450 dark:text-zinc-500">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-zinc-900 dark:text-white">
                        ৳ {tx.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-655 dark:text-zinc-300">
                      {tx.method}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          tx.status === "Success"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : tx.status === "Pending"
                            ? "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.type === "Tutor Payout" && tx.status === "Pending" ? (
                        <button
                          onClick={() => handleProcessPayout(tx.id, tx.userName)}
                          className="rounded-xl bg-[#0F5B47] hover:bg-[#0F5B47]/90 text-white dark:bg-[#188c6e] dark:hover:bg-[#188c6e]/90 px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 ml-auto"
                        >
                          <RefreshCw size={12} className="animate-spin-hover" />
                          Process Payout
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
