"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api, { SOCKET_URL } from "@/lib/api";

import type { Socket } from "socket.io-client";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    let active = true;

    Promise.resolve().then(() => {
      if (active) {
        fetchNotifications();
      }
    });

    // Setup real-time Socket.io listener
    import("socket.io-client").then(({ io }) => {
      if (!active) return;

      const token = localStorage.getItem("token");
      const socket = io(SOCKET_URL, {
        auth: { token }, // JWT verified server-side — no more insecure userId in query
      });
      socketRef.current = socket;

      socket.on("new_notification", (newNotif: NotificationItem) => {
        setNotifications((prev) => [newNotif, ...prev]);
        
        // Show HTML5 desktop notification if permission is granted
        if (Notification.permission === "granted") {
          new Notification(newNotif.title, {
            body: newNotif.message,
            icon: "/favicon.ico",
          });
        }
      });
    });

    // Request browser notification permissions
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    return () => {
      active = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-150/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-all cursor-pointer"
        aria-label="View notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-zinc-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 overflow-hidden rounded-2xl border border-zinc-150 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/40">
            <h3 className="text-sm font-black text-zinc-800 dark:text-white uppercase tracking-tight">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] font-bold text-[#0F5B47] hover:text-[#0c4a39] dark:text-[#188c6e] dark:hover:text-[#178569] cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#0F5B47] dark:text-[#188c6e]" />
                <span className="text-xs font-semibold">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                <p className="text-xs font-semibold">You have no notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-4 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 cursor-pointer relative ${
                    !n.isRead ? "bg-[#0F5B47]/5 dark:bg-[#188c6e]/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-zinc-850 dark:text-white leading-tight">
                        {n.title}
                      </h4>
                      <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[9px] font-bold text-zinc-400 block mt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#F26A1B] shrink-0 mt-1" />
                    )}
                  </div>

                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => setIsOpen(false)}
                      className="absolute inset-0 z-10"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 p-2 text-center bg-zinc-50/30 dark:bg-zinc-900/10">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-extrabold text-zinc-450 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350 block uppercase tracking-wider py-1"
            >
              View dashboard overview
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
