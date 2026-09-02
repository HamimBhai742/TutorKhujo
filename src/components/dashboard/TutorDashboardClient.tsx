/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Shield,
  Smile,
  MoreHorizontal,
  MoreVertical,
  User,
  Target,
  Calculator,
  FileText,
  Plus,
  Printer,
  AlertTriangle,
  Download,
} from "lucide-react";
import { TakaIcon } from "@/components/shared/TakaIcon";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import ShareProfileModal from "@/components/tutors/ShareProfileModal";
import QuickApplyModal from "@/components/tuitions/QuickApplyModal";
import InvoiceModal from "@/components/dashboard/InvoiceModal";
import CorporateInvoiceModal from "@/components/invoice/InvoiceModal";
import BuyPointsModal from "@/components/points/BuyPointsModal";
import SalaryCalculatorModal from "@/components/dashboard/SalaryCalculatorModal";
import ProfileClient from "@/components/dashboard/ProfileClient";
import {
  TuitionRequest,
  ActiveTuition,
  Payout,
  ChatContact,
  ChatMessage,
  MessageReactionItem
} from "@/data/dashboard";
import api, { SOCKET_URL } from "@/lib/api";

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const ChatAvatar: React.FC<{
  src?: string | null;
  name?: string;
  className?: string;
  textClassName?: string;
  bgClassName?: string;
}> = ({
  src,
  name,
  className = "w-10 h-10",
  textClassName = "text-xs font-black",
  bgClassName = "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200",
}) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const isValidSrc = Boolean(
    src &&
      typeof src === "string" &&
      src.trim().length > 0 &&
      !src.includes("null") &&
      !src.includes("undefined") &&
      !src.includes("default.png") &&
      (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"))
  );

  if (isValidSrc && !imgError) {
    return (
      <div
        className={`${className} rounded-full overflow-hidden shrink-0 border border-zinc-200/60 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 relative`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src!}
          alt={name || "User"}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-full ${bgClassName} ${textClassName} flex items-center justify-center shrink-0 border border-zinc-200/60 dark:border-zinc-700 select-none shadow-2xs`}
    >
      <span>{initials}</span>
    </div>
  );
};

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
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [selectedCorporateTrx, setSelectedCorporateTrx] = useState<string | null>(null);
  const [isCorporateInvoiceOpen, setIsCorporateInvoiceOpen] = useState<boolean>(false);
  const [isBuyPointsOpen, setIsBuyPointsOpen] = useState<boolean>(false);
  const [isSalaryCalcOpen, setIsSalaryCalcOpen] = useState<boolean>(false);
  const [classLogs, setClassLogs] = useState<any[]>([
    { id: "log-1", date: "2026-08-18", durationHours: 1.5, topicsCovered: "Physics Chapter 4 - Gravitation & Circular Motion", status: "Completed" },
    { id: "log-2", date: "2026-08-16", durationHours: 2.0, topicsCovered: "Higher Math - Integration & Calculus Exercises", status: "Completed" },
  ]);
  const [tuitionPayments] = useState<any[]>([
    { id: "pay-101", studentName: "Rahim Chowdhury", subject: "Physics & Higher Math", classLevel: "Class 9 NCTB", month: "August 2026", amount: 8000, status: "Paid", paymentMethod: "bKash", paidAt: "2026-08-05" },
    { id: "pay-102", studentName: "Nusrat Jahan", subject: "Chemistry", classLevel: "HSC 2nd Year", month: "August 2026", amount: 10000, status: "Pending" },
  ]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [myUserId, setMyUserId] = useState<string>("");
  const [myUserName, setMyUserName] = useState<string>("Me");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState<string>("");
  const [isEditingSaving, setIsEditingSaving] = useState<boolean>(false);
  const [activeReactionPickerMsgId, setActiveReactionPickerMsgId] = useState<string | null>(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState<boolean>(false);
  const [showDeleteConvModal, setShowDeleteConvModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: "success" | "error" | "info", text: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage({ type, text });
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const socketRef = React.useRef<Socket | null>(null);
  const activeChatIdRef = React.useRef<string>(""); // ref to avoid socket reconnect on chat switch
  const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

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

  const formatChatDateLabel = (dateStr?: string | Date): string => {
    if (!dateStr) return "Today";
    const msgDate = new Date(dateStr);
    if (isNaN(msgDate.getTime())) return "Today";
    const today = new Date();

    if (msgDate.toDateString() === today.toDateString()) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return msgDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: msgDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
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
      showToast("success", "Message updated");
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to update message");
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
      showToast("success", "Message unsent");
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to delete message");
    }
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
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to update reaction");
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeChatId) return;
    try {
      await api.delete(`/messages/conversations/${activeChatId}`);
      setChats((prev) => prev.filter((c) => c.id !== activeChatId));
      setActiveChatIdState("");
      activeChatIdRef.current = "";
      setShowDeleteConvModal(false);
      showToast("success", "Conversation deleted");
    } catch {
      showToast("error", "Failed to delete conversation");
    }
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
      showToast("success", updated.isBlocked ? "Contact blocked" : "Contact unblocked");
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Failed to update block status");
    }
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

      const [applicationsRes, transactionsRes, userRes, convRes] = await Promise.allSettled([
        api.get("/tuitions/tutor/my-applied"),
        api.get("/payments/my-transactions"),
        api.get("/user/me"),
        api.get("/messages/conversations"),
      ]);

      // 1. Map Requests & Active Tuitions
      if (applicationsRes.status === "fulfilled") {
        const applications = applicationsRes.value.data?.data || [];

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
      }

      // 2. Map Payouts
      if (transactionsRes.status === "fulfilled") {
        setPayouts(transactionsRes.value.data?.data || []);
      }

      // 3. Load User profile & Availability
      if (userRes.status === "fulfilled") {
        const userData = userRes.value.data?.data;
        if (userData) {
          if (userData.availability) {
            setAvailability(userData.availability);
          }
          if (userData.id) {
            setMyUserId(userData.id);
          }
          if (userData.name || userData.fullName) {
            setMyUserName(userData.name || userData.fullName);
          }
        }
      }

      // 4. Load conversations
      if (convRes.status === "fulfilled") {
        const conversations = convRes.value.data?.data || [];
        setChats(conversations);
        if (conversations.length > 0) {
          setActiveChatId(conversations[0].id);
        }
      }

      // If everything failed, only then show error
      if (
        applicationsRes.status === "rejected" &&
        transactionsRes.status === "rejected" &&
        userRes.status === "rejected" &&
        convRes.status === "rejected"
      ) {
        setError("Failed to retrieve dashboard data.");
      }
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
      showToast("error", "Failed to send message.");
    }
  };

  const handleToggleAvailability = (time: string, day: string) => {
    setAvailability((prev) => {
      const current = prev || {};
      const timeObj = current[time] || {};
      return {
        ...current,
        [time]: {
          ...timeObj,
          [day]: !timeObj[day]
        }
      };
    });
  };

  const handleSaveAvailability = async () => {
    try {
      await api.patch("/user/me", { availability });
      showToast("success", "Availability preferences saved successfully!");
    } catch (err: any) {
      console.error("Error saving availability:", err);
      showToast("error", err.response?.data?.message || "Failed to save availability preferences.");
    }
  };

  const handleAcceptRequest = async (req: TuitionRequest) => {
    try {
      await api.patch(`/tuitions/applications/${req.id}/status`, { status: "Hired" });
      showToast("success", `Success! You have accepted the tuition request from ${req.studentName}.`);
      fetchDashboardData();
    } catch (err: any) {
      console.error("Error accepting application:", err);
      showToast("error", err.response?.data?.message || "Failed to accept match request.");
    }
  };

  const handleDeclineRequest = async (id: string) => {
    try {
      await api.patch(`/tuitions/applications/${id}/status`, { status: "Rejected" });
      showToast("info", "Request declined successfully.");
      fetchDashboardData();
    } catch (err: any) {
      console.error("Error declining application:", err);
      showToast("error", err.response?.data?.message || "Failed to decline match request.");
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-sm font-bold animate-in slide-in-from-top-4 duration-200 ${
          toastMessage.type === "success"
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
            : toastMessage.type === "error"
            ? "bg-rose-50 dark:rose-950/90 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800"
            : "bg-blue-50 dark:bg-blue-950/90 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
        }`}>
          {toastMessage.type === "success" && (
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          {toastMessage.type === "error" && (
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          {toastMessage.type === "info" && (
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            {currentTab === "overview" && "Dashboard Overview"}
            {currentTab === "requests" && "Tuition Requests"}
            {currentTab === "active" && "Active Tuitions"}
            {currentTab === "earnings" && "Earnings & Payments"}
            {currentTab === "availability" && "Availability Grid"}
            {currentTab === "profile" && "Profile Settings"}
          </h2>
          <p className="text-sm font-semibold text-[#5F6E6B] dark:text-zinc-400 mt-1">
            {currentTab === "overview" && "Manage classes, schedules, and monitor search rankings."}
            {currentTab === "requests" && "Review student matches and accept client requests."}
            {currentTab === "active" && "Track current student courses and session histories."}
            {currentTab === "earnings" && "Review payouts, current balances, and accounting logs."}
            {currentTab === "availability" && "Control your teaching schedule availability."}
            {currentTab === "profile" && "Manage your personal details, credentials, preferences, and documents."}
          </p>
        </div>

        {/* Feature 5: Market Fee Calculator Trigger Button */}
        <button
          onClick={() => setIsSalaryCalcOpen(true)}
          className="px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 text-zinc-800 dark:text-zinc-200 text-xs font-extrabold rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer w-fit shrink-0"
        >
          <Calculator className="w-4 h-4 text-[#F26A1B]" />
          <span>Market Standard Fee Calculator</span>
        </button>
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

            {/* Feature 5: Class Log & Attendance Tracker */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
                    <span>Tuition Attendance & Class Log</span>
                  </h4>
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                    Track completed class hours and topics for your active tuitions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const topic = prompt("Enter topics covered today (e.g. Physics Chapter 4 exercises):");
                    if (topic) {
                      setClassLogs((prev) => [
                        {
                          id: `log-${Date.now()}`,
                          date: new Date().toISOString().split("T")[0],
                          durationHours: 1.5,
                          topicsCovered: topic,
                          status: "Completed",
                        },
                        ...prev,
                      ]);
                      alert("Class session logged successfully!");
                    }
                  }}
                  className="px-3 py-1.5 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white text-[11px] font-extrabold rounded-xl shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Today&apos;s Class
                </button>
              </div>

              <div className="space-y-2.5">
                {classLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-zinc-50/60 dark:bg-zinc-900/40 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-zinc-850 dark:text-zinc-200 block">
                        {log.topicsCovered}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold">
                        {log.date} &bull; {log.durationHours} Hours Session
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-955/30 text-emerald-600 font-black text-[9px] uppercase rounded-full shrink-0">
                      ✓ {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 5: Monthly Tuition Payment Tracker */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                    <TakaIcon className="w-4 h-4 text-emerald-500" />
                    <span>Monthly Payment Tracker & Receipts</span>
                  </h4>
                  <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                    Track paid/pending student fees and generate digital invoices.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {tuitionPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-4 bg-zinc-50/60 dark:bg-zinc-900/40 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-zinc-900 dark:text-white">
                          {pay.studentName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold">({pay.month})</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold block">
                        {pay.subject} &bull; {pay.classLevel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-850">
                      <span className="font-black text-[#0F5B47] dark:text-[#188c6e] text-sm">
                        ৳ {pay.amount.toLocaleString()}
                      </span>
                      
                      <button
                        onClick={() => {
                          setSelectedInvoice(pay);
                          setIsInvoiceOpen(true);
                        }}
                        className="px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500 text-zinc-700 dark:text-zinc-300 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3 text-[#0F5B47]" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                <div className="bg-linear-to-r from-teal-500 to-orange-500 h-full rounded-full w-[85%] transition-all duration-500" />
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
            <div className="bg-linear-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/50 dark:border-amber-900/30 rounded-3xl p-6 shadow-xs space-y-4">
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

      {/* Invoice Digital Receipt Modal */}
      {selectedInvoice && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      )}

      {/* Market Standard Salary Calculator Modal */}
      <SalaryCalculatorModal
        isOpen={isSalaryCalcOpen}
        onClose={() => setIsSalaryCalcOpen(false)}
      />

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
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/60 dark:divide-zinc-900/40">
                  {chats
                    .filter((c) => c.studentName.toLowerCase().includes(chatSearch.toLowerCase()))
                    .map((chat) => {
                      const isActive = chat.id === activeChatId;
                      const isOnline = chat.recipientId ? onlineUsers.has(chat.recipientId) : false;
                      const isTyping = typingUsers[chat.id];
                      const avatarUrl = chat.profilePic || chat.avatar;

                      return (
                        <button
                          key={chat.id}
                          onClick={() => {
                            setActiveChatId(chat.id);
                            setChatMobileView("chat");
                          }}
                          className={`w-full text-left p-3.5 flex gap-3 items-center transition-all duration-150 border-l-4 cursor-pointer ${
                            isActive
                              ? "bg-[#0F5B47]/8 dark:bg-[#188c6e]/10 border-[#0F5B47] dark:border-[#188c6e]"
                              : "border-transparent hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30"
                          }`}
                        >
                          <div className="relative shrink-0">
                            <ChatAvatar
                              src={avatarUrl}
                              name={chat.studentName}
                              className="w-10 h-10"
                              textClassName="text-xs font-black"
                            />
                            {isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white dark:border-zinc-950 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                                {chat.studentName}
                              </h4>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium shrink-0">
                                {chat.time}
                              </span>
                            </div>
                            <p className={`text-[11px] truncate ${
                              isTyping
                                ? "text-[#0F5B47] dark:text-emerald-400 font-bold animate-pulse"
                                : "text-zinc-500 dark:text-zinc-400"
                            }`}>
                              {isTyping ? "typing..." : chat.lastMessage}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Right: Active Chat conversation box */}
              {(() => {
                const currentChat = chats.find((c) => c.id === activeChatId);
                const isOnline = currentChat?.recipientId ? onlineUsers.has(currentChat.recipientId) : false;
                const isTyping = currentChat ? typingUsers[currentChat.id] : false;
                const isBlockedByMe = currentChat?.isBlocked && currentChat?.blockedById === myUserId;
                const activeAvatarUrl = currentChat?.profilePic || currentChat?.avatar;

                if (!currentChat) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-zinc-900/10 text-zinc-400 text-sm font-semibold p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                      <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Select a conversation</p>
                      <p className="text-xs text-zinc-400 mt-1">Choose a student chat thread from the left to start messaging.</p>
                    </div>
                  );
                }

                return (
                  <div className={`${
                    chatMobileView === "list" ? "hidden" : "flex"
                  } md:flex flex-1 flex-col h-full bg-[#FAFAFA] dark:bg-zinc-950`}>
                    
                    {/* Active Chat Header */}
                    <div className="px-4 py-3 bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-900 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChatMobileView("list")}
                          className="md:hidden p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          <ChatAvatar
                            src={activeAvatarUrl}
                            name={currentChat.studentName}
                            className="w-10 h-10"
                            textClassName="text-xs font-black"
                          />
                          {currentChat.isBlocked ? (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-rose-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                          ) : isOnline ? (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white dark:border-zinc-950 rounded-full" />
                          ) : null}
                        </div>
                        <div>
                          <h4 className="text-[15px] font-extrabold text-zinc-900 dark:text-white leading-tight">
                            {currentChat.studentName}
                          </h4>
                          {currentChat.isBlocked ? (
                            <span className="text-[11px] font-bold flex items-center gap-1.5 mt-0.5 text-rose-600 dark:text-rose-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              {isBlockedByMe ? "Blocked by you" : "You are blocked"}
                            </span>
                          ) : isTyping ? (
                            <span className="text-[11px] text-[#0F5B47] dark:text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                              <span className="inline-flex items-center gap-0.5">
                                <span className="w-1 h-1 rounded-full bg-[#0F5B47] animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1 h-1 rounded-full bg-[#0F5B47] animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1 h-1 rounded-full bg-[#0F5B47] animate-bounce" style={{ animationDelay: "300ms" }} />
                              </span>
                              <span>typing...</span>
                            </span>
                          ) : (
                            <span className={`text-[11px] font-bold flex items-center gap-1.5 mt-0.5 ${
                              isOnline ? "text-[#10B981]" : "text-zinc-400 dark:text-zinc-500"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#10B981] animate-pulse" : "bg-zinc-400"}`} />
                              {isOnline ? "Online now" : "Offline"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                          className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all cursor-pointer"
                          title="More Options"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {showHeaderMenu && (
                          <>
                            <div
                              className="fixed inset-0 z-30 cursor-default"
                              onClick={() => setShowHeaderMenu(false)}
                            />
                            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 divide-y divide-zinc-100 dark:divide-zinc-800">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setShowHeaderMenu(false);
                                    if (currentChat.recipientId) {
                                      router.push(`/students/${currentChat.recipientId}`);
                                    }
                                  }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 flex items-center gap-2.5 cursor-pointer"
                                >
                                  <User className="w-4 h-4 text-[#0F5B47]" />
                                  <span>View Student Profile</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setShowHeaderMenu(false);
                                    handleToggleBlock();
                                  }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/70 flex items-center gap-2.5 cursor-pointer"
                                >
                                  {currentChat.isBlocked ? (
                                    <>
                                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                      <span>Unblock Student</span>
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="w-4 h-4 text-rose-500" />
                                      <span className="text-rose-600 dark:text-rose-400">Block Student</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => {
                                    setShowHeaderMenu(false);
                                    setShowDeleteConvModal(true);
                                  }}
                                  className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-500" />
                                  <span>Clear Conversation</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Info Alert Banner */}
                    <div className="px-4 py-3 bg-[#E6F4EA] dark:bg-emerald-950/30 border-b border-[#0F5B47]/10 dark:border-emerald-900/40 flex items-center gap-2.5 text-xs font-bold text-[#0F5B47] dark:text-emerald-300 shrink-0">
                      <Shield className="w-4 h-4 text-[#0F5B47] dark:text-emerald-400 shrink-0" />
                      <span>Contact shared — you can now call or message directly</span>
                    </div>

                    {/* Messages Timeline */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                      {messagesLoading ? (
                        <div className="space-y-4 py-6 animate-pulse">
                          <div className="flex justify-start">
                            <div className="w-56 h-12 bg-zinc-200 dark:bg-zinc-850 rounded-2xl rounded-tl-xs" />
                          </div>
                          <div className="flex justify-end">
                            <div className="w-64 h-14 bg-emerald-200/50 dark:bg-emerald-950/40 rounded-2xl rounded-tr-xs" />
                          </div>
                          <div className="flex items-center justify-center gap-2 pt-2 text-zinc-400 text-xs font-semibold">
                            <Loader2 className="w-4 h-4 animate-spin text-[#0F5B47]" />
                            <span>Loading conversation...</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {currentChat.messages?.map((msg, mIdx) => {
                            const isMe = msg.sender === "tutor";
                            const isEditingThis = editingMessageId === msg.id;
                            const isEligible = isMessageEligibleForAction(msg.createdAt);
                            const hasReactions = Array.isArray(msg.reactions) && msg.reactions.length > 0;
                            
                            // Date separation check
                            const currentDateLabel = formatChatDateLabel(msg.createdAt);
                            const prevMessage = currentChat.messages ? currentChat.messages[mIdx - 1] : undefined;
                            const prevDateLabel = prevMessage ? formatChatDateLabel(prevMessage.createdAt) : null;
                            const showDateSeparator = mIdx === 0 || currentDateLabel !== prevDateLabel;

                            return (
                              <React.Fragment key={msg.id}>
                                {showDateSeparator && (
                                  <div className="flex justify-center my-4">
                                    <span className="px-3 py-1 bg-[#E5E7EB] dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 rounded-lg shadow-2xs">
                                      {currentDateLabel}
                                    </span>
                                  </div>
                                )}

                                <div
                                  className={`w-full flex items-start gap-2.5 my-2.5 ${
                                    isMe ? "justify-end" : "justify-start"
                                  } group animate-in fade-in duration-150`}
                                >
                                  {/* Left: Student Avatar for incoming */}
                                  {!isMe && (
                                    <ChatAvatar
                                      src={activeAvatarUrl}
                                      name={currentChat.studentName}
                                      className="w-8 h-8 mt-0.5"
                                      textClassName="text-[11px] font-black"
                                    />
                                  )}

                                  {/* Center: Bubble Container */}
                                  <div className="max-w-[70%] flex flex-col">
                                    {isEditingThis ? (
                                      <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border-2 border-[#0F5B47] shadow-md">
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
                                          className="flex-1 px-3 py-1 bg-transparent text-sm font-semibold outline-hidden text-zinc-900 dark:text-white"
                                        />
                                        <button
                                          onClick={() => handleEditMessage(msg.id)}
                                          disabled={isEditingSaving || !editingMessageText.trim()}
                                          className="p-1.5 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white rounded-lg cursor-pointer"
                                        >
                                          <Check className="w-4 h-4 stroke-[3px]" />
                                        </button>
                                        <button
                                          onClick={() => setEditingMessageId(null)}
                                          className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 rounded-lg cursor-pointer"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="relative">
                                        {/* Floating Messenger Emoji Reaction Bar */}
                                        {activeReactionPickerMsgId === msg.id && (
                                          <>
                                            <div
                                              className="fixed inset-0 z-20 cursor-default"
                                              onClick={() => setActiveReactionPickerMsgId(null)}
                                            />
                                            <div
                                              className={`absolute bottom-full mb-2 ${
                                                isMe ? "right-0" : "left-0"
                                              } flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-full px-2.5 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150`}
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
                                                      hasMyReaction ? "bg-emerald-100 dark:bg-emerald-950/80 scale-115" : ""
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

                                        {/* Message Bubble */}
                                        <div
                                          onContextMenu={(e) => {
                                            e.preventDefault();
                                            if (!currentChat.isBlocked) setActiveReactionPickerMsgId(msg.id);
                                          }}
                                          className={`px-4 py-3 rounded-2xl text-[14px] leading-5 font-normal select-none shadow-2xs ${
                                            isMe
                                              ? "bg-[#0F5B47] text-white rounded-tr-xs"
                                              : "bg-[#E5E7EB] dark:bg-zinc-800 text-[#111827] dark:text-zinc-100 rounded-tl-xs"
                                          }`}
                                        >
                                          {msg.content}
                                        </div>

                                        {/* Reaction Badges Pill */}
                                        {hasReactions && (
                                          <div
                                            className={`absolute -bottom-2.5 ${
                                              isMe ? "left-2" : "right-2"
                                            } flex items-center z-10`}
                                          >
                                            <button
                                              onClick={() => setActiveReactionPickerMsgId(msg.id)}
                                              className="inline-flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full px-2 py-0.5 shadow-xs cursor-pointer hover:scale-105 transition-all text-xs"
                                            >
                                              <span>{Array.from(new Set(msg.reactions!.map((r) => r.emoji))).join("")}</span>
                                              {msg.reactions!.length > 1 && (
                                                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                                                  {msg.reactions!.length}
                                                </span>
                                              )}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Status Row (time + checkmarks + options) */}
                                    <div
                                      className={`flex items-center gap-1.5 mt-1 px-1 ${
                                        hasReactions ? "pt-1.5" : ""
                                      } ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                      <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                                        {msg.time}
                                      </span>
                                      {isMe && (
                                        <span className={msg.isRead ? "text-[#0F5B47] font-bold text-[11px]" : "text-zinc-400 text-[11px]"}>
                                          {msg.isRead ? "✓✓" : "✓"}
                                        </span>
                                      )}
                                      {!currentChat.isBlocked && (
                                        <div className="relative">
                                          <button
                                            onClick={() => setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id)}
                                            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded transition-all cursor-pointer inline-flex items-center justify-center"
                                            title="Options"
                                          >
                                            <MoreHorizontal className="w-3.5 h-3.5" />
                                          </button>
                                          {activeMenuMsgId === msg.id && (
                                            <>
                                              <div
                                                className="fixed inset-0 z-20 cursor-default"
                                                onClick={() => setActiveMenuMsgId(null)}
                                              />
                                              <div
                                                className={`absolute bottom-full mb-1 ${
                                                  isMe ? "right-0" : "left-0"
                                                } w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1 z-30`}
                                              >
                                                <button
                                                  onClick={() => {
                                                    setActiveReactionPickerMsgId(msg.id);
                                                    setActiveMenuMsgId(null);
                                                  }}
                                                  className="w-full px-3 py-1.5 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                                                >
                                                  <Smile className="w-3.5 h-3.5 text-amber-500" />
                                                  <span>React</span>
                                                </button>
                                                {isMe && isEligible && (
                                                  <>
                                                    <button
                                                      onClick={() => {
                                                        setEditingMessageId(msg.id);
                                                        setEditingMessageText(msg.content);
                                                        setActiveMenuMsgId(null);
                                                      }}
                                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                                                    >
                                                      <Edit3 className="w-3.5 h-3.5 text-[#0F5B47]" />
                                                      <span>Edit</span>
                                                    </button>
                                                    <button
                                                      onClick={() => {
                                                        handleDeleteMessage(msg.id);
                                                        setActiveMenuMsgId(null);
                                                      }}
                                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 flex items-center gap-2 cursor-pointer"
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
                                    </div>
                                  </div>

                                  {/* Right: User Initials Circle (matching App orange circle) */}
                                  {isMe && (
                                    <ChatAvatar
                                      name={myUserName}
                                      className="w-8 h-8 mt-0.5"
                                      bgClassName="bg-[#F97316] text-white"
                                      textClassName="text-[11px] font-black text-white"
                                    />
                                  )}
                                </div>
                              </React.Fragment>
                            );
                          })}

                          {/* Real-time typing bubble */}
                          {isTyping && !currentChat.isBlocked && (
                            <div className="flex items-end gap-2.5 animate-in fade-in duration-150">
                              <ChatAvatar
                                src={activeAvatarUrl}
                                name={currentChat.studentName}
                                className="w-8 h-8"
                                textClassName="text-[11px] font-black"
                              />
                              <div className="bg-[#E5E7EB] dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
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
                        className="p-3.5 bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-900 flex gap-3 shrink-0 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Type a message..."
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
                          className="flex-1 px-5 py-2.5 bg-[#F9FAFB] dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-sm font-medium rounded-full outline-hidden focus:border-[#0F5B47] text-zinc-900 dark:text-white transition-all shadow-2xs"
                        />
                        <button
                          type="submit"
                          disabled={!newMessageText.trim()}
                          className="w-10 h-10 rounded-full bg-[#0F5B47] hover:bg-[#0c4a3a] disabled:opacity-40 text-white flex items-center justify-center shadow-xs cursor-pointer shrink-0 transition-all"
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
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
          
          {/* Left - Earnings & Invoices Summary */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  Payouts & Invoices History
                </h3>
                <p className="text-xs text-zinc-400 font-medium">
                  Track earnings disbursements and points recharge tax invoices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBuyPointsOpen(true)}
                className="px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a39] text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Buy Points</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900 text-[10px] font-black text-zinc-400 dark:text-zinc-555 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/30">
                    <th className="py-3 px-4 rounded-l-xl">Description</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Receipt</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-semibold text-zinc-650 dark:text-zinc-350">
                  {payouts.map((pay) => (
                    <tr key={pay.id} className="border-b border-zinc-100/50 dark:border-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white">
                        <div className="flex items-center gap-2">
                          {(pay as any).type === "Point Purchase" || (pay as any).points ? (
                            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-[#0F5B47] flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <span>{pay.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-500 whitespace-nowrap">{pay.date}</td>
                      <td className="py-4 px-4 font-bold">{pay.method}</td>
                      <td className="py-4 px-4 font-bold text-zinc-800 dark:text-white whitespace-nowrap">
                        ৳ {pay.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] uppercase">
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCorporateTrx((pay as any).trxId || (pay as any).reference || pay.id);
                            setIsCorporateInvoiceOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-[#0F5B47] hover:text-white dark:bg-zinc-800 dark:hover:bg-emerald-600 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                          title="View & Download Official Invoice"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {payouts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-400">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
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

      {/* --- PANEL 6: PROFILE SETTINGS --- */}
      {currentTab === "profile" && (
        <ProfileClient />
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

      {/* Corporate Tax Invoice Modal */}
      <CorporateInvoiceModal
        isOpen={isCorporateInvoiceOpen}
        onClose={() => {
          setIsCorporateInvoiceOpen(false);
          setSelectedCorporateTrx(null);
        }}
        trxId={selectedCorporateTrx}
      />

      {/* Buy Points Top-up Modal */}
      <BuyPointsModal
        isOpen={isBuyPointsOpen}
        onClose={() => setIsBuyPointsOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />

    </div>
  );
}
