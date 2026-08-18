/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Socket } from "socket.io-client";
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
  Zap,
  Info,
  CalendarDays,
  Search,
  ArrowLeft,
  Send,
  MessageSquare,
  Loader2,
  Edit3,
  Trash2,
  Ban,
  ShieldCheck,
  Smile,
  MoreHorizontal,
  Share2,
  Target
} from "lucide-react";
import { TakaIcon } from "@/components/shared/TakaIcon";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import ShareProfileModal from "@/components/tutors/ShareProfileModal";
import QuickApplyModal from "@/components/tuitions/QuickApplyModal";
import {
  TuitionRequest,
  ActiveTuition,
  Payout,
  ChatContact,
  ChatMessage,
  MessageReactionItem
} from "@/data/dashboard";
import api, { SOCKET_URL } from "@/lib/api";

export default function TutorDashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "overview";

  // States to make the dashboard dynamic
  const [requests, setRequests] = useState<TuitionRequest[]>([]);
  const [activeTuitions, setActiveTuitions] = useState<ActiveTuition[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [chats, setChats] = useState<ChatContact[]>([]);
  const [activeChatId, setActiveChatIdState] = useState<string>("");
  const [newMessageText, setNewMessageText] = useState<string>("");
  const [chatMobileView, setChatMobileView] = useState<"list" | "chat">("list");
  const [chatSearch, setChatSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedJobForQuickApply, setSelectedJobForQuickApply] = useState<any | null>(null);
  const [isQuickApplyOpen, setIsQuickApplyOpen] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [myUserId, setMyUserId] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>("");
  const [isEditingSaving, setIsEditingSaving] = useState<boolean>(false);
  const [activeReactionPickerMsgId, setActiveReactionPickerMsgId] = useState<string | null>(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);
  const [showDeleteConvModal, setShowDeleteConvModal] = useState<boolean>(false);
  const socketRef = React.useRef<Socket | null>(null);
  const activeChatIdRef = React.useRef<string>(""); // ref to avoid socket reconnect on chat switch
  const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  // Keeps state and ref in sync, clears unread badge, and marks conversation read
  const setActiveChatId = useCallback((id: string) => {
    activeChatIdRef.current = id;
    setActiveChatIdState(id);
    setChatMobileView("chat");
    setEditingMessageId(null);
    setEditingMessageText("");

    // Join conversation room
    socketRef.current?.emit("join_conversation", id);

    // Immediately clear unread badge in local state & notify counterparty via socket
    setChats((prev) => {
      const conv = prev.find((c) => c.id === id);
      if (conv?.recipientId) {
        socketRef.current?.emit("mark_read", {
          conversationId: id,
          recipientId: conv.recipientId,
        });
      }
      return prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c));
    });

    // Mark as read in backend
    api.patch(`/messages/read/${id}`).catch(() => {});
  }, []);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const isMessageEligibleForAction = (createdAt?: string | Date) => {
    if (!createdAt) return true;
    const age = now - new Date(createdAt).getTime();
    return age <= 30 * 60 * 1000;
  };

  const handleEditMessage = async (msgId: string) => {
    if (!editingMessageText.trim() || isEditingSaving) return;
    try {
      setIsEditingSaving(true);
      await api.patch(`/messages/${msgId}`, { content: editingMessageText.trim() });
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: c.messages?.map((m) =>
                  m.id === msgId ? { ...m, content: editingMessageText.trim() } : m
                ),
              }
            : c
        )
      );
      setEditingMessageId(null);
      setEditingMessageText("");
    } catch {
    } finally {
      setIsEditingSaving(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    try {
      await api.delete(`/messages/${msgId}`);
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                messages: c.messages?.filter((m) => m.id !== msgId),
              }
            : c
        )
      );
    } catch {}
  };

  const REACTION_EMOJIS = ["❤️", "👍", "😂", "😮", "😢", "🔥"];

  const handleToggleReaction = async (msgId: string, emoji: string) => {
    if (!activeChatId) return;
    setActiveReactionPickerMsgId(null);

    // Optimistically update reactions
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: c.messages?.map((m) => {
              if (m.id === msgId) {
                const currentReactions = m.reactions || [];
                const existingIdx = currentReactions.findIndex((r) => r.userId === myUserId);
                let newReactions: MessageReactionItem[];
                if (existingIdx >= 0) {
                  if (currentReactions[existingIdx].emoji === emoji) {
                    newReactions = currentReactions.filter((_, idx) => idx !== existingIdx);
                  } else {
                    newReactions = currentReactions.map((r, idx) =>
                      idx === existingIdx ? { ...r, emoji } : r
                    );
                  }
                } else {
                  newReactions = [...currentReactions, { userId: myUserId, emoji }];
                }
                return { ...m, reactions: newReactions };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );

    try {
      const res = await api.post(`/messages/${msgId}/react`, { emoji });
      if (res.data?.data) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  messages: c.messages?.map((m) =>
                    m.id === msgId ? { ...m, reactions: res.data.data } : m
                  ),
                }
              : c
          )
        );
      }
    } catch {}
  };

  const handleDeleteConversation = async () => {
    if (!activeChatId) return;
    try {
      await api.delete(`/messages/conversations/${activeChatId}`);
      setChats((prev) => prev.filter((c) => c.id !== activeChatId));
      setActiveChatIdState("");
      activeChatIdRef.current = "";
      setShowDeleteConvModal(false);
    } catch {}
  };

  const handleToggleBlock = async () => {
    if (!activeChatId) return;
    try {
      const res = await api.patch(`/messages/conversations/block/${activeChatId}`);
      const updated = res.data.data;
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, isBlocked: updated.isBlocked, blockedById: updated.blockedById }
            : c
        )
      );
    } catch {}
  };

  // Availability matrix state
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["Morning", "Afternoon", "Evening"];
  const [availability, setAvailability] = useState<Record<string, Record<string, boolean>>>({
    Morning: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    Afternoon: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false },
    Evening: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: true, Sun: true }
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [applicationsRes, transactionsRes, userRes, convRes] = await Promise.all([
        api.get("/tuitions/tutor/my-applied"),
        api.get("/payments/my-transactions"),
        api.get("/user/me"),
        api.get("/messages/conversations"),
      ]);

      const applications = applicationsRes.data.data;

      // 1. Map Requests (Pending or Shortlisted applications)
      const mappedRequests = applications
        .filter((app: any) => app.status === "Pending" || app.status === "Shortlisted")
        .map((app: any) => ({
          id: app.id,
          studentName: app.tuitionPost?.student?.name || "N/A",
          subject: app.tuitionPost?.subjects?.join(", ") || "N/A",
          classLevel: app.tuitionPost?.classLevel || "N/A",
          location: app.tuitionPost?.location || "N/A",
          salary: app.tuitionPost?.budget || 0,
          mode: app.tuitionPost?.mode || "Home",
          frequency: app.tuitionPost?.frequency || "3 Days / Week",
          status: app.status,
          date: app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "N/A",
        }));
      setRequests(mappedRequests);

      // 2. Map Active Tuitions (Hired applications)
      const mappedActive = applications
        .filter((app: any) => app.status === "Hired")
        .map((app: any) => ({
          id: app.id,
          studentName: app.tuitionPost?.student?.name || "N/A",
          subject: app.tuitionPost?.subjects?.join(", ") || "N/A",
          classLevel: app.tuitionPost?.classLevel || "N/A",
          location: app.tuitionPost?.location || "N/A",
          salary: app.tuitionPost?.budget || 0,
          mode: app.tuitionPost?.mode || "Home",
          frequency: app.tuitionPost?.frequency || "3 Days / Week",
          status: "Active",
          progress: "Trigonometry & Optics completed. Preparing for yearly tests.",
          startDate: app.updatedAt ? new Date(app.updatedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "N/A",
          nextSession: "Today at 5:00 PM",
        }));
      setActiveTuitions(mappedActive);

      // 3. Map Payouts
      setPayouts(transactionsRes.data.data);

      // 4. Load Availability
      const dbAvailability = userRes.data.data.availability;
      if (dbAvailability) {
        setAvailability(dbAvailability);
      }

      // 5. Load conversations
      const conversations = convRes.data.data;
      setChats(conversations);
      if (conversations.length > 0) {
        setActiveChatId(conversations[0].id);
      }
      setMyUserId(userRes.data.data.id);
    } catch (err: any) {
      console.error("Error loading tutor dashboard data:", err);
      setError("Failed to retrieve dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [setActiveChatId]);

   useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchDashboardData();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchDashboardData]);

  const fetchMessages = useCallback(async (convId: string, signal?: { isCancelled: boolean }) => {
    try {
      setMessagesLoading(true);
      const res = await api.get(`/messages/${convId}`);
      const data = res.data?.data;
      const messageList = Array.isArray(data) ? data : (data?.messages || []);
      const isBlocked = data?.isBlocked;
      const blockedById = data?.blockedById;

      if (!signal?.isCancelled) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: messageList,
                  isBlocked: isBlocked !== undefined ? isBlocked : c.isBlocked,
                  blockedById: blockedById !== undefined ? blockedById : c.blockedById,
                }
              : c
          )
        );
      }
    } catch (err) {
      if (!signal?.isCancelled) {
        console.error("Error loading chat messages:", err);
      }
    } finally {
      if (!signal?.isCancelled) {
        setMessagesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const signal = { isCancelled: false };
    if (activeChatId) {
      Promise.resolve().then(() => {
        if (!signal.isCancelled) {
          fetchMessages(activeChatId, signal);
        }
      });
    }
    return () => {
      signal.isCancelled = true;
    };
  }, [activeChatId, fetchMessages]);

  // Auto scroll to bottom whenever active chat messages or typing status updates
  const activeChatForScroll = chats.find((c) => c.id === activeChatId);
  const isTypingForScroll = activeChatId ? typingUsers[activeChatId] : false;

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom("smooth");
    }, 60);
    return () => clearTimeout(timer);
  }, [activeChatForScroll?.messages?.length, activeChatId, isTypingForScroll, messagesLoading]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let handleFocus: (() => void) | null = null;

    import("socket.io-client").then(({ io }) => {
      const token = localStorage.getItem("token");
      const socket = io(SOCKET_URL, {
        auth: { token }, // JWT verified server-side
      });
      socketRef.current = socket;

      // Online status listeners
      socket.on("online_users", (userIds: string[]) => {
        setOnlineUsers(new Set(userIds));
      });

      socket.on("user_online", ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => new Set(prev).add(userId));
      });

      socket.on("user_offline", ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      });

      // Request active online users immediately and poll every 3 seconds
      socket.emit("get_online_users");
      interval = setInterval(() => {
        socket.emit("get_online_users");
      }, 3000);

      handleFocus = () => socket.emit("get_online_users");
      window.addEventListener("focus", handleFocus);

      // Typing status listener
      socket.on("typing_status", (payload: { conversationId: string; senderId: string; isTyping: boolean }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [payload.conversationId]: payload.isTyping,
        }));
      });

      // Read receipts listener
      socket.on("messages_read", (payload: { conversationId: string }) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === payload.conversationId
              ? {
                  ...c,
                  messages: c.messages?.map((m) => ({ ...m, isRead: true })),
                }
              : c
          )
        );
      });

      // Message edit/update listener
      socket.on("message_updated", (payload: { messageId: string; conversationId: string; content: string }) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === payload.conversationId
              ? {
                  ...c,
                  messages: c.messages?.map((m) =>
                    m.id === payload.messageId ? { ...m, content: payload.content } : m
                  ),
                }
              : c
          )
        );
      });

      // Message delete listener
      socket.on("message_deleted", (payload: { messageId: string; conversationId: string }) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === payload.conversationId
              ? {
                  ...c,
                  messages: c.messages?.filter((m) => m.id !== payload.messageId),
                }
              : c
          )
        );
      });

      // Conversation deleted listener
      socket.on("conversation_deleted", (payload: { conversationId: string }) => {
        setChats((prev) => prev.filter((c) => c.id !== payload.conversationId));
        if (activeChatIdRef.current === payload.conversationId) {
          setActiveChatIdState("");
          activeChatIdRef.current = "";
        }
      });

      // Block status listener
      socket.on("block_status_changed", (payload: { conversationId: string; isBlocked: boolean; blockedById?: string }) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === payload.conversationId
              ? { ...c, isBlocked: payload.isBlocked, blockedById: payload.blockedById }
              : c
          )
        );
      });

      // Reaction updated listener
      socket.on("message_reaction_updated", (payload: { messageId: string; conversationId: string; reactions: MessageReactionItem[] }) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === payload.conversationId
              ? {
                  ...c,
                  messages: c.messages?.map((m) =>
                    m.id === payload.messageId ? { ...m, reactions: payload.reactions } : m
                  ),
                }
              : c
          )
        );
      });

      // Incoming message listener (with strict deduplication)
      socket.on("incoming_message", (payload: any) => {
        const currentActiveChatId = activeChatIdRef.current;
        const isCurrentActive = payload.conversationId === currentActiveChatId;

        // If currently viewing this chat, automatically mark as read on backend & via socket
        if (isCurrentActive) {
          api.patch(`/messages/read/${payload.conversationId}`).catch(() => {});
          if (payload.senderId) {
            socket.emit("mark_read", {
              conversationId: payload.conversationId,
              recipientId: payload.senderId,
            });
          }
        }

        setChats((prev) =>
          prev.map((c) => {
            if (c.id === payload.conversationId) {
              const existingList = c.messages || [];
              const isAlreadyInList = existingList.some((m) => m.id === payload.id);
              const updatedMessages = isAlreadyInList
                ? existingList
                : isCurrentActive
                ? [
                    ...existingList,
                    {
                      id: payload.id,
                      sender: payload.sender,
                      content: payload.content,
                      time: payload.time,
                      createdAt: payload.createdAt,
                    },
                  ]
                : existingList;

              return {
                ...c,
                lastMessage: payload.content,
                time: payload.time,
                unreadCount: isCurrentActive ? 0 : (c.unreadCount || 0) + (isAlreadyInList ? 0 : 1),
                messages: updatedMessages,
              };
            }
            return c;
          })
        );
      });
    });

    return () => {
      if (interval) clearInterval(interval);
      if (handleFocus) window.removeEventListener("focus", handleFocus);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // activeChatId removed from deps — captured via ref instead

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChatId) return;

    const textToSend = newMessageText.trim();
    setNewMessageText("");

    try {
      const res = await api.post("/messages", {
        conversationId: activeChatId,
        content: textToSend,
      });

      const newMsg: ChatMessage = {
        id: res.data.data.id,
        sender: "tutor",
        content: textToSend,
        createdAt: res.data.data.createdAt || new Date().toISOString(),
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              lastMessage: textToSend,
              time: "Just Now",
              messages: [
                ...(c.messages?.filter((m) => m.id !== newMsg.id) || []),
                newMsg,
              ],
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  const handleToggleAvailability = (time: string, day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [time]: {
        ...prev[time],
        [day]: !prev[time][day]
      }
    }));
  };

  const handleSaveAvailability = async () => {
    try {
      await api.patch("/user/me", { availability });
      alert("Availability preferences saved successfully!");
    } catch (err: any) {
      console.error("Error saving availability:", err);
      alert(err.response?.data?.message || "Failed to save availability preferences.");
    }
  };

  const handleAcceptRequest = async (req: TuitionRequest) => {
    try {
      await api.patch(`/tuitions/applications/${req.id}/status`, { status: "Hired" });
      alert(`Success! You have accepted the tuition request from ${req.studentName}.`);
      fetchDashboardData();
    } catch (err: any) {
      console.error("Error accepting application:", err);
      alert(err.response?.data?.message || "Failed to accept match request.");
    }
  };

  const handleDeclineRequest = async (id: string) => {
    try {
      await api.patch(`/tuitions/applications/${id}/status`, { status: "Rejected" });
      alert("Request declined successfully.");
      fetchDashboardData();
    } catch (err: any) {
      console.error("Error declining application:", err);
      alert(err.response?.data?.message || "Failed to decline match request.");
    }
  };

  const totalEarnings = payouts
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-900 dark:bg-zinc-950 shadow-sm animate-pulse">
        <svg
          className="h-12 w-12 animate-spin text-[#0F5B47] dark:text-[#188c6e]"
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
          Loading Tutor Dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-150 bg-red-50/20 p-8 text-center dark:border-red-950/20 dark:bg-red-950/10">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 rounded-xl bg-[#0F5B47] hover:bg-[#0c4a39] px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
        >
          Reload Dashboard Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            {currentTab === "overview" && "Dashboard Overview"}
            {currentTab === "requests" && "Tuition Requests"}
            {currentTab === "active" && "Active Tuitions"}
            {currentTab === "earnings" && "Earnings & Payments"}
            {currentTab === "availability" && "Availability Grid"}
          </h2>
          <p className="text-sm font-semibold text-[#5F6E6B] dark:text-zinc-400 mt-1">
            {currentTab === "overview" && "Manage classes, schedules, and monitor search rankings."}
            {currentTab === "requests" && "Review student matches and accept client requests."}
            {currentTab === "active" && "Track current student courses and session histories."}
            {currentTab === "earnings" && "Review payouts, current balances, and accounting logs."}
            {currentTab === "availability" && "Control your teaching schedule availability."}
          </p>
        </div>
      </div>

      {/* Grid Stats (Renders on Overview, Active, and Earnings Tabs) */}
      {(currentTab === "overview" || currentTab === "active" || currentTab === "earnings") && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat 1: Active Tuitions */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Active Tuitions
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-[#0F5B47] dark:text-[#188c6e]">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                {activeTuitions.length}
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400">
                Ongoing commitments
              </div>
            </div>
          </div>

          {/* Stat 2: Monthly Earnings */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Monthly Earnings
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-emerald-500">
                <TakaIcon size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                ৳ {totalEarnings.toLocaleString()}
              </span>
              <div className="mt-2 text-xs font-bold text-emerald-555 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>Real-time earnings summary</span>
              </div>
            </div>
          </div>

          {/* Stat 3: Hours Taught */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Hours Taught
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-orange-500">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                36 Hours
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400">
                Delivered sessions
              </div>
            </div>
          </div>

          {/* Stat 4: Profile Rating */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                Profile views
              </span>
              <div className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800/80 text-blue-500">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
                142
              </span>
              <div className="mt-2 text-xs font-bold text-zinc-400 flex items-center gap-0.5">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                <span>4.9 Average rating</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL 1: OVERVIEW --- */}
      {currentTab === "overview" && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left - Today's Schedule checklist */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />
                Today&apos;s Sessions
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0F5B47] dark:text-[#188c6e] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                August 04
              </span>
            </div>

            <div className="space-y-4">
              {activeTuitions.map((t) => (
                <div key={t.id} className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-200">
                        Class with {t.studentName}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {t.subject} &bull; {t.classLevel}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 block">
                      5:00 PM
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] text-[9px] font-extrabold uppercase mt-1 inline-block">
                      {t.mode === "Both" ? "In-Person" : t.mode}
                    </span>
                  </div>
                </div>
              ))}
              {activeTuitions.length === 0 && (
                <div className="text-center py-8 text-zinc-400 text-sm font-semibold">
                  No classes scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Right - Pending Requests summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* New requests summary card */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                <h3 className="text-base font-black text-zinc-900 dark:text-white">
                  Pending Invites ({requests.length})
                </h3>
                <button
                  onClick={() => router.push("/dashboard?tab=requests")}
                  className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] hover:text-[#0b4334] dark:hover:text-[#1ca682] cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {requests.slice(0, 2).map((req) => (
                  <div key={req.id} className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 p-4 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                          {req.studentName}
                        </h4>
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                          {req.subject} ({req.classLevel})
                        </p>
                      </div>
                      <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e]">
                        ৳ {req.salary.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDeclineRequest(req.id)}
                        className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="px-3 py-1.5 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-6 text-zinc-400 text-xs font-semibold">
                    No new tuition requests.
                  </div>
                )}
              </div>
            </div>

            {/* Fast Response rate card */}
            <div className="bg-[#0F5B47] dark:bg-[#188c6e]/90 text-white rounded-3xl p-6 shadow-xs flex gap-4 items-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-white/5 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-350">
                <Zap className="w-32 h-32 stroke-[3px]" />
              </div>
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="space-y-1 relative z-10">
                <h4 className="text-xs font-black uppercase tracking-wider text-white/70">
                  Search Rank Status
                </h4>
                <p className="text-[11px] font-extrabold text-white/90 leading-relaxed">
                  Your profile has 85% search visibility this week. Complete more active sessions to boost your ranking!
                </p>
              </div>
            </div>

            {/* Feature 4: Gamification & Profile Completion Meter */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>Profile Completeness Meter</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0F5B47]/10 text-[#0F5B47] dark:text-[#188c6e] text-[10px] font-extrabold">
                      85% Complete
                    </span>
                  </h4>
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Reach 100% to unlock Priority Listing (Rank at top of search).
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-200/50">
                <div className="bg-gradient-to-r from-teal-500 to-orange-500 h-full rounded-full w-[85%] transition-all duration-500" />
              </div>

              {/* Action Checklist */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Educational Qualifications
                  </span>
                  <span className="text-[10px] text-zinc-400">Done</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                    + Upload Varsity ID / NID
                  </span>
                  <button
                    onClick={() => router.push("/tutor-onboarding")}
                    className="text-[10px] font-bold text-[#F26A1B] hover:underline cursor-pointer"
                  >
                    +15% Complete
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 4: Referral Program & Reward Points Widget */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/50 dark:border-amber-900/30 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-sm">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                      Refer a Friend & Earn
                    </h4>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                      500 Reward Points Balance
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Invite fellow tutors or students using your link. Get bonus credits for every verified registration.
              </p>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value="https://tutorkhujo.com/register?ref=TK-892XFA"
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-bold focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("https://tutorkhujo.com/register?ref=TK-892XFA");
                    alert("Referral link copied to clipboard!");
                  }}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tutor={{
          id: myUserId || "tutor-1",
          name: "Alex Richardson",
          department: "Mathematics & Science",
          university: "Stanford University",
          rating: 4.9,
        }}
      />

      {/* --- PANEL 2: REQUESTS --- */}
      {currentTab === "requests" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req.id} className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">
                      {req.studentName}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-500 text-[9px] font-extrabold uppercase">
                      New Matches
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      {req.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                      {req.subject}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {req.frequency} &bull; {req.mode}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-555 block uppercase font-bold tracking-wider">
                      Offered Salary
                    </span>
                    <span className="text-base font-black text-[#0F5B47] dark:text-[#188c6e]">
                      ৳ {req.salary.toLocaleString()}/mo
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/30 rounded-xl transition-all cursor-pointer"
                      title="Decline Offer"
                    >
                      <X className="w-4 h-4 stroke-[3px]" />
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-12 text-zinc-400 text-sm font-semibold">
                No pending tuition requests at this time.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PANEL 3: SMART MATCHED JOBS --- */}
      {currentTab === "matched_jobs" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-900">
            <div>
              <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#F26A1B]" />
                <span>Smart Matched Jobs (স্মার্ট টিউশন নোটিফিকেশন)</span>
              </h2>
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-1">
                Real-time tuition leads matched with your preferred location, subjects, and salary requirements.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-955/30 text-emerald-600 font-extrabold text-xs rounded-full border border-emerald-200/50 w-fit">
              Location & Budget Matched
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                id: "tuition-match-1",
                classLevel: "Class 9 (NCTB English Version)",
                subjects: ["Physics", "Higher Math"],
                budget: 8000,
                location: "Mirpur 10, Dhaka",
                matchScore: 98,
                studentName: "Rahim Chowdhury",
                frequency: "3 Days / Week",
                mode: "Student's Home",
              },
              {
                id: "tuition-match-2",
                classLevel: "HSC 2nd Year",
                subjects: ["Chemistry", "Biology"],
                budget: 10000,
                location: "Dhanmondi, Dhaka",
                matchScore: 92,
                studentName: "Nusrat Jahan",
                frequency: "4 Days / Week",
                mode: "Home & Online",
              },
              {
                id: "tuition-match-3",
                classLevel: "O-Level (Edexcel)",
                subjects: ["Physics"],
                budget: 12000,
                location: "Uttara Sector 4, Dhaka",
                matchScore: 88,
                studentName: "Tanvir Ahmed",
                frequency: "3 Days / Week",
                mode: "Online Only",
              },
            ].map((job) => (
              <div
                key={job.id}
                className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-teal-500/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">
                      {job.classLevel}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      🎯 {job.matchScore}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                      {job.subjects.join(", ")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {job.frequency} &bull; {job.mode}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-555 block uppercase font-bold tracking-wider">
                      Budget
                    </span>
                    <span className="text-base font-black text-[#0F5B47] dark:text-[#188c6e]">
                      ৳ {job.budget.toLocaleString()}/mo
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedJobForQuickApply(job);
                      setIsQuickApplyOpen(true);
                    }}
                    className="px-5 py-2.5 bg-[#F26A1B] hover:bg-[#db5b14] text-white text-xs font-extrabold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Quick Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Apply Modal */}
      {selectedJobForQuickApply && (
        <QuickApplyModal
          isOpen={isQuickApplyOpen}
          onClose={() => {
            setIsQuickApplyOpen(false);
            setSelectedJobForQuickApply(null);
          }}
          job={selectedJobForQuickApply}
        />
      )}

      {/* --- PANEL 2.5: MESSAGES --- */}
      {currentTab === "messages" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-xs h-[72vh] min-h-130 max-h-180 flex flex-col transition-colors duration-300">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
                <MessageSquare className="w-8 h-8 text-[#0F5B47] dark:text-[#188c6e]" />
              </div>
              <h4 className="text-base font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">No conversations yet</h4>
              <p className="text-xs font-semibold text-[#5F6E6B] dark:text-zinc-500 max-w-sm mt-1.5 leading-relaxed">
                Your inbox is empty. Once students shortlist your applications or message you directly, those chat channels will appear here.
              </p>
            </div>
          ) : (
            <div className="flex h-full w-full overflow-hidden">
              {/* Left: Chat Contacts List */}
              <div className={`${
                chatMobileView === "chat" ? "hidden" : "flex"
              } md:flex w-full md:w-80 border-r border-zinc-150/80 dark:border-zinc-900 flex-col shrink-0 bg-white dark:bg-zinc-950`}>
                
                {/* Search Header */}
                <div className="p-4 border-b border-zinc-150/60 dark:border-zinc-900 space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      Conversations
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {chats.filter((c) => (c.unreadCount || 0) > 0).length > 0 && (
                        <span className="bg-[#F26A1B] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                          {chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0)} unread
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-800 dark:text-white transition-all duration-200"
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
                      const isOnline = chat.recipientId ? onlineUsers.has(chat.recipientId) : false;
                      const isTyping = typingUsers[chat.id];

                      return (
                        <button
                          key={chat.id}
                          onClick={() => {
                            setActiveChatId(chat.id);
                            setChatMobileView("chat");
                          }}
                          className={`w-full text-left p-4 flex gap-3 items-center transition-all duration-200 border-l-4 cursor-pointer ${
                            isActive
                              ? "bg-[#0F5B47]/5 dark:bg-[#188c6e]/5 border-[#0F5B47] dark:border-[#188c6e]"
                              : "border-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div className={`w-10 h-10 rounded-full ${chat.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}>
                              {chat.studentName.charAt(0).toUpperCase()}
                            </div>
                            {isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full ring-1 ring-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-xs font-black text-zinc-850 dark:text-white truncate flex items-center gap-1.5">
                                <span>{chat.studentName}</span>
                                {chat.isBlocked && (
                                  <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                                    Blocked
                                  </span>
                                )}
                              </h4>
                              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold shrink-0">
                                {chat.time}
                              </span>
                            </div>
                            <p className={`text-[10px] truncate font-medium ${
                              isTyping
                                ? "text-emerald-600 dark:text-emerald-400 font-bold animate-pulse"
                                : "text-zinc-500 dark:text-zinc-450"
                            }`}>
                              {isTyping ? "typing..." : chat.lastMessage}
                            </p>
                          </div>
                          {(chat.unreadCount || 0) > 0 && (
                            <span className="w-5 h-5 rounded-full bg-[#F26A1B] text-white text-[9px] font-black flex items-center justify-center shrink-0 shadow-xs">
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
                const currentChat = chats.find((c) => c.id === activeChatId);
                const isOnline = currentChat?.recipientId ? onlineUsers.has(currentChat.recipientId) : false;
                const isTyping = currentChat ? typingUsers[currentChat.id] : false;
                const isBlockedByMe = currentChat?.isBlocked && currentChat?.blockedById === myUserId;

                if (!currentChat) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/10 text-zinc-400 text-sm font-semibold p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                      <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Select a conversation</p>
                      <p className="text-xs text-zinc-400 mt-1">Choose a student chat thread from the left to start messaging.</p>
                    </div>
                  );
                }

                return (
                  <div className={`${
                    chatMobileView === "list" ? "hidden" : "flex"
                  } md:flex flex-1 flex-col h-full bg-zinc-50/30 dark:bg-zinc-900/10`}>
                    
                    {/* Active Chat Header */}
                    <div className="px-5 py-3.5 bg-white dark:bg-zinc-950 border-b border-zinc-150/60 dark:border-zinc-900 flex items-center justify-between shrink-0 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChatMobileView("list")}
                          className="md:hidden p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                        </button>
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full ${currentChat.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}>
                            {currentChat.studentName.charAt(0).toUpperCase()}
                          </div>
                          {currentChat.isBlocked ? (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white dark:border-zinc-950 rounded-full ring-1 ring-rose-400" />
                          ) : isOnline ? (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full ring-1 ring-emerald-400" />
                          ) : null}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-zinc-850 dark:text-white leading-tight">
                            {currentChat.studentName}
                          </h4>
                          {currentChat.isBlocked ? (
                            <span className="text-[10px] font-black flex items-center gap-1.5 mt-0.5 text-rose-600 dark:text-rose-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              {isBlockedByMe ? "Blocked by you • Chat suspended" : "You are blocked • Chat suspended"}
                            </span>
                          ) : isTyping ? (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 mt-0.5">
                              <span className="inline-flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </span>
                              <span>typing...</span>
                            </span>
                          ) : (
                            <span className={`text-[10px] font-bold flex items-center gap-1.5 mt-0.5 ${
                              isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
                              {isOnline ? "Online • Student" : "Offline • Student"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-2">
                        {currentChat.isBlocked ? (
                          isBlockedByMe ? (
                            <button
                              onClick={handleToggleBlock}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black shadow-2xs"
                              title="Unblock Contact"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <div className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg text-[10px] font-black flex items-center gap-1">
                              <Ban className="w-3.5 h-3.5 text-rose-500" />
                              <span>Blocked</span>
                            </div>
                          )
                        ) : (
                          <button
                            onClick={handleToggleBlock}
                            className="p-2 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                            title="Block Contact"
                          >
                            <Ban className="w-4 h-4" />
                            <span className="hidden sm:inline text-[11px]">Block</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {messagesLoading ? (
                        /* WhatsApp / Messenger Skeleton Message Loader */
                        <div className="space-y-4 py-6 animate-pulse">
                          <div className="flex justify-start">
                            <div className="w-56 h-12 bg-zinc-200 dark:bg-zinc-850 rounded-2xl rounded-bl-xs" />
                          </div>
                          <div className="flex justify-end">
                            <div className="w-64 h-14 bg-emerald-200/50 dark:bg-emerald-950/40 rounded-2xl rounded-br-xs" />
                          </div>
                          <div className="flex justify-start">
                            <div className="w-48 h-10 bg-zinc-200 dark:bg-zinc-850 rounded-2xl rounded-bl-xs" />
                          </div>
                          <div className="flex justify-end">
                            <div className="w-52 h-11 bg-emerald-200/50 dark:bg-emerald-950/40 rounded-2xl rounded-br-xs" />
                          </div>
                          <div className="flex items-center justify-center gap-2 pt-2 text-zinc-400 text-xs font-semibold">
                            <Loader2 className="w-4 h-4 animate-spin text-[#0F5B47] dark:text-[#188c6e]" />
                            <span>Loading conversation...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {currentChat.messages?.map((msg) => {
                            const isTutor = msg.sender === "tutor";
                            const isEditingThis = editingMessageId === msg.id;
                            const isEligible = isMessageEligibleForAction(msg.createdAt);

                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col group ${isTutor ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-1 duration-200`}
                              >
                                {isEditingThis ? (
                                  <div className="flex items-center gap-2 max-w-md w-full bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border-2 border-[#0F5B47] shadow-md animate-in fade-in zoom-in-95 duration-150">
                                    <input
                                      type="text"
                                      value={editingMessageText}
                                      onChange={(e) => setEditingMessageText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isEditingSaving) handleEditMessage(msg.id);
                                        if (e.key === "Escape" && !isEditingSaving) setEditingMessageId(null);
                                      }}
                                      disabled={isEditingSaving}
                                      autoFocus
                                      className="flex-1 px-3 py-1.5 bg-transparent text-xs font-semibold outline-hidden text-zinc-900 dark:text-white"
                                    />
                                    <button
                                      onClick={() => handleEditMessage(msg.id)}
                                      disabled={isEditingSaving || !editingMessageText.trim()}
                                      className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl cursor-pointer transition-all shrink-0 flex items-center justify-center"
                                      title="Save Changes"
                                    >
                                      {isEditingSaving ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setEditingMessageId(null)}
                                      disabled={isEditingSaving}
                                      className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl cursor-pointer transition-all shrink-0"
                                      title="Cancel"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className={`relative flex items-center gap-1.5 ${isTutor ? "flex-row-reverse" : "flex-row"}`}>
                                    {/* 3-Dot Options Button on hover */}
                                    {!currentChat.isBlocked && (
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 relative">
                                        <button
                                          onClick={() => {
                                            setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id);
                                            setActiveReactionPickerMsgId(null);
                                          }}
                                          className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                                          title="More options"
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>

                                        {/* 3-Dot Dropdown Menu */}
                                        {activeMenuMsgId === msg.id && (
                                          <>
                                            <div
                                              className="fixed inset-0 z-20 cursor-default"
                                              onClick={() => setActiveMenuMsgId(null)}
                                            />
                                            <div
                                              className={`absolute bottom-full mb-1 ${
                                                isTutor ? "right-0" : "left-0"
                                              } w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150`}
                                            >
                                              <button
                                                onClick={() => {
                                                  setActiveReactionPickerMsgId(msg.id);
                                                  setActiveMenuMsgId(null);
                                                }}
                                                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 flex items-center gap-2 cursor-pointer"
                                              >
                                                <Smile className="w-3.5 h-3.5 text-amber-500" />
                                                <span>React</span>
                                              </button>

                                              {isTutor && isEligible && (
                                                <>
                                                  <button
                                                    onClick={() => {
                                                      setEditingMessageId(msg.id);
                                                      setEditingMessageText(msg.content);
                                                      setActiveMenuMsgId(null);
                                                    }}
                                                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 flex items-center gap-2 cursor-pointer"
                                                  >
                                                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Edit</span>
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteMessage(msg.id);
                                                      setActiveMenuMsgId(null);
                                                    }}
                                                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                    <span>Unsend</span>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}

                                    {/* Floating Messenger Emoji Reaction Bar & Bubble */}
                                    <div className="relative">
                                      {activeReactionPickerMsgId === msg.id && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-20 cursor-default"
                                            onClick={() => setActiveReactionPickerMsgId(null)}
                                          />
                                          <div
                                            className={`absolute bottom-full mb-2 ${
                                              isTutor ? "right-0" : "left-0"
                                            } flex items-center gap-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-full px-2.5 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150`}
                                          >
                                            {REACTION_EMOJIS.map((emo) => {
                                              const hasMyReaction = msg.reactions?.some(
                                                (r) => r.userId === myUserId && r.emoji === emo
                                              );
                                              return (
                                                <button
                                                  key={emo}
                                                  onClick={() => handleToggleReaction(msg.id, emo)}
                                                  className={`w-7 h-7 flex items-center justify-center rounded-full hover:scale-135 active:scale-110 transition-transform cursor-pointer text-base ${
                                                    hasMyReaction
                                                      ? "bg-emerald-100 dark:bg-emerald-950/80 scale-115 shadow-2xs"
                                                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                  }`}
                                                  title={emo}
                                                >
                                                  {emo}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </>
                                      )}

                                      {/* Message Bubble with Press & Hold (Long Press) / Context Menu */}
                                      <div
                                        onTouchStart={() => {
                                          if (!currentChat.isBlocked) {
                                            longPressTimerRef.current = setTimeout(() => {
                                              setActiveReactionPickerMsgId(msg.id);
                                              setActiveMenuMsgId(null);
                                            }, 450);
                                          }
                                        }}
                                        onTouchEnd={() => {
                                          if (longPressTimerRef.current) {
                                            clearTimeout(longPressTimerRef.current);
                                            longPressTimerRef.current = null;
                                          }
                                        }}
                                        onTouchMove={() => {
                                          if (longPressTimerRef.current) {
                                            clearTimeout(longPressTimerRef.current);
                                            longPressTimerRef.current = null;
                                          }
                                        }}
                                        onContextMenu={(e) => {
                                          e.preventDefault();
                                          if (!currentChat.isBlocked) {
                                            setActiveReactionPickerMsgId(msg.id);
                                          }
                                        }}
                                        className={`max-w-md px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-2xs select-none transition-all ${
                                          isTutor
                                            ? "bg-[#0F5B47] text-white dark:bg-[#188c6e] rounded-br-xs"
                                            : "bg-white dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-xs"
                                        }`}
                                      >
                                        {msg.content}
                                      </div>

                                      {/* Reaction Badges Pill */}
                                      {(() => {
                                        if (!msg.reactions || msg.reactions.length === 0) return null;
                                        const grouped: { [emoji: string]: { count: number; hasMine: boolean } } = {};
                                        msg.reactions.forEach((r) => {
                                          if (!grouped[r.emoji]) {
                                            grouped[r.emoji] = { count: 0, hasMine: false };
                                          }
                                          grouped[r.emoji].count += 1;
                                          if (r.userId === myUserId) {
                                            grouped[r.emoji].hasMine = true;
                                          }
                                        });

                                        return (
                                          <div
                                            className={`absolute -bottom-2.5 ${
                                              isTutor ? "right-2" : "left-2"
                                            } flex items-center gap-1 z-10`}
                                          >
                                            {Object.entries(grouped).map(([emo, data]) => (
                                              <button
                                                key={emo}
                                                onClick={() => handleToggleReaction(msg.id, emo)}
                                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-black border shadow-2xs cursor-pointer transition-all hover:scale-105 ${
                                                  data.hasMine
                                                    ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50"
                                                }`}
                                                title={data.hasMine ? "You reacted (click to remove)" : "Click to react"}
                                              >
                                                <span>{emo}</span>
                                                {data.count > 1 && <span className="text-[9px]">{data.count}</span>}
                                              </button>
                                            ))}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-1 mt-1 px-1 text-[9px] font-bold text-zinc-400">
                                  <span>{msg.time}</span>
                                  {isTutor && (
                                    <span className={msg.isRead ? "text-emerald-500 font-bold" : "text-zinc-400"}>
                                      {msg.isRead ? "✓✓" : "✓"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Real-time Messenger-style typing bubble */}
                          {isTyping && !currentChat.isBlocked && (
                            <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                              <div className={`w-7 h-7 rounded-full ${currentChat.avatarBg || "bg-emerald-600"} text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs mb-1 shrink-0`}>
                                {currentChat.studentName.charAt(0).toUpperCase()}
                              </div>
                              <div className="bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          )}

                          {/* Auto scroll anchor */}
                          <div ref={messagesEndRef} className="h-0 w-full" />
                        </>
                      )}
                    </div>

                    {/* Chat Input or Blocked Banner */}
                    {currentChat.isBlocked ? (
                      <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border-t border-amber-200/50 dark:border-amber-900/40 flex flex-col sm:flex-row items-center justify-center gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
                          <Ban className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>
                            {currentChat.blockedById === myUserId
                              ? "You have blocked this contact. Unblock to send and receive messages."
                              : "You cannot send messages to this contact because you have been blocked."}
                          </span>
                        </div>
                        {currentChat.blockedById === myUserId && (
                          <button
                            onClick={handleToggleBlock}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
                          >
                            Unblock Contact
                          </button>
                        )}
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                          if (socketRef.current && currentChat?.id) {
                            socketRef.current.emit("typing_stop", {
                              conversationId: currentChat.id,
                              recipientId: currentChat.recipientId,
                            });
                          }
                          handleSendMessage(e);
                        }}
                        className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-150/60 dark:border-zinc-900 flex gap-2.5 items-center shrink-0"
                      >
                        <input
                          type="text"
                          placeholder="Write a message..."
                          value={newMessageText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewMessageText(val);
                            if (socketRef.current && currentChat?.id) {
                              socketRef.current.emit("typing_start", {
                                conversationId: currentChat.id,
                                recipientId: currentChat.recipientId,
                              });
                              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                              typingTimeoutRef.current = setTimeout(() => {
                                socketRef.current?.emit("typing_stop", {
                                  conversationId: currentChat.id,
                                  recipientId: currentChat.recipientId,
                                });
                              }, 1500);
                            }
                          }}
                          className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-2xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-900 dark:text-white"
                          required
                        />
                        <button
                          type="submit"
                          disabled={!newMessageText.trim()}
                          className="px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] disabled:opacity-50 text-white text-xs font-extrabold uppercase rounded-2xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                          title="Send Message"
                        >
                          <Send className="w-3.5 h-3.5 text-white" />
                          <span>Send</span>
                        </button>
                      </form>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* --- PANEL 3: ACTIVE TUITIONS --- */}
      {currentTab === "active" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="space-y-6">
            {activeTuitions.map((t) => (
              <div key={t.id} className="p-6 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl flex flex-col gap-4">
                
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-150/30 dark:border-zinc-900/40">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">
                      {t.studentName}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {t.subject} &bull; {t.classLevel}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] text-[9px] font-extrabold uppercase">
                      {t.status}
                    </span>
                    <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
                      ৳ {t.salary.toLocaleString()}/mo
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
                      {t.frequency} ({t.mode === "Both" ? "Home/Online" : t.mode})
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      Start Date
                    </span>
                    <p className="text-zinc-850 dark:text-zinc-200">
                      {t.startDate}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-bold tracking-wider">
                      Next Session
                    </span>
                    <p className="text-[#0F5B47] dark:text-[#188c6e] font-bold">
                      {t.nextSession}
                    </p>
                  </div>
                </div>

                {/* Class Progress */}
                <div className="bg-blue-50/20 dark:bg-blue-955/5 border border-blue-100/50 dark:border-blue-900/10 p-4 rounded-xl flex gap-3 items-start mt-2">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-800 dark:text-blue-400 uppercase font-bold tracking-wider">
                      Current Course Progress
                    </span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-450 leading-relaxed font-semibold">
                      {t.progress}
                    </p>
                  </div>
                </div>

              </div>
            ))}
            {activeTuitions.length === 0 && (
              <div className="text-center py-12 text-zinc-400 text-sm font-semibold">
                No active tuition classes under tracking.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PANEL 4: EARNINGS & PAYMENTS --- */}
      {currentTab === "earnings" && (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Left - Earnings Summary */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-900">
              Payout History
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900 text-[10px] font-black text-zinc-400 dark:text-zinc-555 uppercase tracking-wider">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                  {payouts.map((pay) => (
                    <tr key={pay.id} className="border-b border-zinc-100/50 dark:border-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white">
                        {pay.description}
                      </td>
                      <td className="py-4 px-4">{pay.date}</td>
                      <td className="py-4 px-4">{pay.method}</td>
                      <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white">
                        ৳ {pay.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] uppercase">
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right - Payment Setup Settings */}
          <div className="lg:col-span-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            <div>
              <h3 className="text-base md:text-lg font-black text-zinc-900 dark:text-white mb-2">
                Payout Settings
              </h3>
              <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 leading-relaxed">
                Add or modify bank details and mobile financial services accounts.
              </p>
            </div>

            <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-900 pt-4 text-xs font-bold">
              <div className="flex justify-between items-center">
                <span className="text-zinc-450 dark:text-zinc-500">Primary Method</span>
                <span className="text-[#0F5B47] dark:text-[#188c6e]">bKash (Personal)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-450 dark:text-zinc-500">Account Number</span>
                <span className="text-zinc-800 dark:text-zinc-200">017XXXXXX42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-450 dark:text-zinc-500">Processing Rate</span>
                <span className="text-zinc-800 dark:text-zinc-200">Instant payout</span>
              </div>
            </div>

            <button className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer">
              Modify Details
            </button>
          </div>

        </div>
      )}

      {/* --- PANEL 5: AVAILABILITY SLOTS --- */}
      {currentTab === "availability" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base md:text-lg font-black text-zinc-900 dark:text-white mb-2">
              Teaching Availability Matrix
            </h3>
            <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 leading-relaxed">
              Check or uncheck the slots when you are available for classes. Changes will update on your public profile search criteria.
            </p>
          </div>

          <div className="overflow-x-auto border border-zinc-150/60 dark:border-zinc-900 rounded-2xl">
            <table className="w-full text-center border-collapse min-w-160">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-900 text-xs font-black text-zinc-600 dark:text-zinc-400">
                  <th className="py-4 px-4 text-left font-black w-32 border-r border-zinc-150 dark:border-zinc-900">
                    Slot Time
                  </th>
                  {days.map((day) => (
                    <th key={day} className="py-4 px-2 uppercase font-black">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time) => (
                  <tr key={time} className="border-b border-zinc-150/40 dark:border-zinc-900/40 last:border-b-0 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="py-4 px-4 text-left font-black text-xs text-zinc-800 dark:text-zinc-200 border-r border-zinc-150 dark:border-zinc-900">
                      {time}
                    </td>
                    {days.map((day) => {
                      const checked = availability[time]?.[day] || false;
                      return (
                        <td key={day} className="py-3 px-2">
                          <label className="flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleAvailability(time, day)}
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 ${
                                checked
                                  ? "border-[#0F5B47] dark:border-[#188c6e] bg-[#0F5B47] dark:bg-[#188c6e] text-white"
                                  : "border-zinc-200 dark:border-zinc-800 hover:border-teal-500/50 dark:bg-zinc-900/30"
                              }`}
                            >
                              {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                            </div>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSaveAvailability}
              className="px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Schedule Preferences
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Conversation */}
      <ConfirmationModal
        isOpen={showDeleteConvModal}
        title="Delete Entire Conversation?"
        message="This will permanently delete this conversation and all messages for both parties. This action cannot be undone."
        confirmText="Delete Conversation"
        variant="danger"
        onConfirm={handleDeleteConversation}
        onClose={() => setShowDeleteConvModal(false)}
      />

    </div>
  );
}
