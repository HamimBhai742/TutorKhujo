"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign 
} from "lucide-react";

export default function DashboardOverview() {
  const { user } = useAuth();

  const stats = [
    {
      name: "Total Users",
      value: "1,248",
      change: "+12.3%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Active Orders",
      value: "45",
      change: "+8.1%",
      changeType: "positive",
      icon: ShoppingBag,
    },
    {
      name: "Conversion Rate",
      value: "4.8%",
      change: "-1.2%",
      changeType: "negative",
      icon: TrendingUp,
    },
    {
      name: "Revenue",
      value: "$12,450",
      change: "+24.5%",
      changeType: "positive",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Heading */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome back, {user?.name || "Admin"}!
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Here is what is happening with your store today.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.name}
                </span>
                <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {stat.value}
                </span>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-zinc-400">from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Card Mock */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Sales Performance
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            A visual overview of monthly sales trends.
          </p>
          <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200 dark:bg-zinc-850 dark:border-zinc-800">
            <span className="text-sm text-zinc-400">
              Chart visualization goes here
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Realtime events logged across the dashboard.
          </p>
          <div className="mt-6 space-y-4">
            {[
              { text: "New user registered", time: "2 min ago" },
              { text: "Order #4592 completed", time: "10 min ago" },
              { text: "Server configuration updated", time: "1 hour ago" },
              { text: "Database backup finished", time: "4 hours ago" },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0 last:pb-0 dark:border-zinc-850"
              >
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {activity.text}
                </span>
                <span className="text-xs text-zinc-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
