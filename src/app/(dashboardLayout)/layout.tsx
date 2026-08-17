"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  User,
  Sliders,
  Inbox,
  BookOpen,
  Calendar,
  MessageSquare,
  FileText,
  FileCheck
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { TakaIcon } from "@/components/shared/TakaIcon";

import api, { SOCKET_URL } from "@/lib/api";

function SidebarNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = React.useState<number>(0);
  
  const currentTab = searchParams.get("tab") || "overview";

  React.useEffect(() => {
    if (!user || user.role === "admin") return;

    let active = true;

    const fetchUnread = async () => {
      try {
        const res = await api.get("/messages/conversations");
        const raw = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.data || []);
        if (active) {
          const totalUnread = raw.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0);
          setUnreadMessages(totalUnread);
        }
      } catch (_) {}
    };

    fetchUnread();

    import("socket.io-client").then(({ io }) => {
      if (!active) return;
      const token = localStorage.getItem("token");
      const socket = io(SOCKET_URL, { auth: { token } });

      socket.on("incoming_message", () => {
        if (active) {
          setUnreadMessages((prev) => prev + 1);
        }
      });

      socket.on("messages_read", () => {
        if (active) {
          fetchUnread();
        }
      });

      return () => {
        socket.disconnect();
      };
    });

    return () => {
      active = false;
    };
  }, [user]);

  // Clear or refresh unread count when switching to messages tab
  React.useEffect(() => {
    if (currentTab === "messages") {
      setUnreadMessages(0);
    }
  }, [currentTab]);

  const navigation = user?.role === "tutor"
    ? [
        { name: "Overview", href: "/dashboard", active: currentTab === "overview", icon: LayoutDashboard },
        { name: "Tuition Requests", href: "/dashboard?tab=requests", active: currentTab === "requests", icon: Inbox },
        { name: "Messages", href: "/dashboard?tab=messages", active: currentTab === "messages", icon: MessageSquare, badge: unreadMessages },
        { name: "Active Tuitions", href: "/dashboard?tab=active", active: currentTab === "active", icon: BookOpen },
        { name: "Earnings & Payments", href: "/dashboard?tab=earnings", active: currentTab === "earnings", icon: TakaIcon },
        { name: "Availability Slots", href: "/dashboard?tab=availability", active: currentTab === "availability", icon: Calendar },
      ]
    : user?.role === "student"
    ? [
        { name: "Overview", href: "/dashboard", active: currentTab === "overview", icon: LayoutDashboard },
        { name: "My Tuition Posts", href: "/dashboard?tab=posts", active: currentTab === "posts", icon: FileText },
        { name: "Tutor Applications", href: "/dashboard?tab=applications", active: currentTab === "applications", icon: Users },
        { name: "Messages", href: "/dashboard?tab=messages", active: currentTab === "messages", icon: MessageSquare, badge: unreadMessages },
        { name: "Active Tutors", href: "/dashboard?tab=active-tutors", active: currentTab === "active-tutors", icon: BookOpen },
        { name: "Payment Invoices", href: "/dashboard?tab=invoices", active: currentTab === "invoices", icon: TakaIcon },
      ]
    : [
        { name: "Overview", href: ROUTES.DASHBOARD.HOME, active: pathname === ROUTES.DASHBOARD.HOME, icon: LayoutDashboard },
        { name: "Users", href: ROUTES.DASHBOARD.USERS, active: pathname === ROUTES.DASHBOARD.USERS, icon: Users },
        { name: "Tutor Verifications", href: ROUTES.DASHBOARD.VERIFICATIONS, active: pathname === ROUTES.DASHBOARD.VERIFICATIONS, icon: FileCheck },
        { name: "Tuition Posts", href: ROUTES.DASHBOARD.TUITIONS, active: pathname === ROUTES.DASHBOARD.TUITIONS, icon: FileText },
        { name: "Payments & Invoices", href: ROUTES.DASHBOARD.PAYMENTS, active: pathname === ROUTES.DASHBOARD.PAYMENTS, icon: TakaIcon },
        { name: "Settings", href: ROUTES.DASHBOARD.SETTINGS, active: pathname === ROUTES.DASHBOARD.SETTINGS, icon: Settings },
      ];

  return (
    <nav className="flex-1 space-y-1 px-4 py-6">
      {navigation.map((item) => {
        const isActive = item.active;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive
                ? "bg-[#0F5B47] text-white dark:bg-[#188c6e] dark:text-white shadow-sm"
                : "text-zinc-655 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            <Icon size={18} />
            <span className="flex-1">{item.name}</span>
            {Boolean(item.badge && item.badge > 0) && (
              <span className="bg-[#F26A1B] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              TutorKhujo
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <Suspense fallback={<div className="flex-1 px-4 py-6 text-xs text-zinc-400 font-semibold">Loading...</div>}>
          <SidebarNavigation />
        </Suspense>

        {/* Sidebar Footer */}
        <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
          {user?.role === "tutor" && (
            <Link
              href="/tutor-onboarding"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#F26A1B]/10 hover:bg-[#F26A1B]/20 text-[#F26A1B] px-4 py-2.5 text-xs font-bold transition-all mb-3 text-center"
            >
              <Sliders size={14} />
              <span>Update Tutor Profile</span>
            </Link>
          )}
          <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <User size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                  {user?.name || "Admin User"}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user?.email || "admin@basione.com"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Spacer to push controls to the right */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-all"
              aria-label="Toggle theme"
            >
              <Sun size={20} className="hidden dark:block" />
              <Moon size={20} className="block dark:hidden" />
            </button>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
