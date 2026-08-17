/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  RefreshCw,
  Eye,
  Star,
  ArrowUpRight,
  MessageSquare,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Ban,
  ArrowLeft,
  Smile,
  MoreHorizontal
} from "lucide-react";
import type { Socket } from "socket.io-client";
import { TakaIcon } from "@/components/shared/TakaIcon";
import api, { SOCKET_URL } from "@/lib/api";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import {
  TuitionPost,
  TutorApplication,
  Invoice,
  ChatContact,
  ChatMessage,
  MessageReactionItem
} from "@/data/dashboard";
import { Tutor, MOCK_TUTORS } from "@/data/tutors";
import { BANGLADESH_QUALIFICATIONS } from "@/data/qualifications";

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
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<TutorApplication | null>(null);
  const selectedTutorDetails: Tutor | undefined = selectedApplicant
    ? MOCK_TUTORS.find(
        (t) =>
          t.id === selectedApplicant.tutorId ||
          t.name.toLowerCase() === selectedApplicant.tutorName.toLowerCase()
      )
    : undefined;
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [chats, setChats] = useState<ChatContact[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  
  const [activeChatId, setActiveChatIdState] = useState<string>("");
  const [newMessageText, setNewMessageText] = useState<string>("");
  const [chatMobileView, setChatMobileView] = useState<"list" | "chat">("list");
  const [chatSearch, setChatSearch] = useState<string>("");
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
  const setActiveChatId = (id: string) => {
    activeChatIdRef.current = id;
    setActiveChatIdState(id);
    setChatMobileView("chat");
    setEditingMessageId(null);
    setEditingMessageText("");

    // Join conversation room
    socketRef.current?.emit("join_conversation", id);

    // Immediately clear unread badge in local state
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );

    // Mark as read in backend
    api.patch(`/messages/read/${id}`).catch(() => {});

    // Notify counterparty via socket
    const conv = chats.find((c) => c.id === id);
    if (conv?.recipientId) {
      socketRef.current?.emit("mark_read", {
        conversationId: id,
        recipientId: conv.recipientId,
      });
    }
  };

  const isMessageEligibleForAction = (createdAt?: string | Date) => {
    if (!createdAt) return true;
    const age = Date.now() - new Date(createdAt).getTime();
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
    } catch (_) {
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
  const [tutorQualification, setTutorQualification] = useState<string>("");
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

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    // Clear any existing timer before setting a new one — prevents memory leaks
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage({ type, text });
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

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
        genderPreference: p.genderPreference,
        tutorQualification: p.tutorQualification,
        extraNotes: p.extraNotes,
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

    const loadData = async () => {
      try {
        const [postsRes, appsRes, txRes, userRes, convRes] = await Promise.allSettled([
          api.get("/tuitions/my-posts"),
          api.get("/tuitions/my-applications"),
          api.get("/payments/my-transactions"),
          api.get("/user/me"),
          api.get("/messages/conversations"),
        ]);

        if (ignore) return;

        if (userRes.status === "fulfilled") {
          const uId = userRes.value.data?.data?.id || "";
          setMyUserId(uId);
        }

        if (postsRes.status === "fulfilled") {
          const rawPosts = postsRes.value.data?.data || [];
          const formatted: TuitionPost[] = rawPosts.map((p: any) => ({
            id: p.id,
            classLevel: p.classLevel,
            subjects: Array.isArray(p.subjects) ? p.subjects : [p.subjects],
            budget: p.budget,
            mode: p.mode,
            frequency: p.frequency,
            location: p.location,
            genderPreference: p.genderPreference,
            tutorQualification: p.tutorQualification,
            extraNotes: p.extraNotes,
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
        }

        if (appsRes.status === "fulfilled") {
          const rawApps = appsRes.value.data?.data || [];
          const bgColors = [
            "bg-emerald-600",
            "bg-rose-600",
            "bg-indigo-600",
            "bg-amber-600",
            "bg-blue-600",
            "bg-teal-600",
          ];

          const formattedApps: TutorApplication[] = rawApps.map(
            (a: any, idx: number) => ({
              id: a.id,
              postId: a.tuitionPostId,
              tutorId: a.tutorId,
              tutorName: a.tutor?.name || "Tutor",
              institution: a.tutor?.institution || "Verified Tutor",
              subject:
                (a.tuitionPost?.subjects && a.tuitionPost?.subjects.join(", ")) ||
                a.tuitionPost?.classLevel ||
                "Tuition",
              rating: 5.0,
              salaryBid: a.salaryBid,
              avatarBg: bgColors[idx % bgColors.length],
              location: a.tuitionPost?.location || "Dhaka",
              appliedDate: a.createdAt
                ? new Date(a.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Recently",
              status: a.status || "Pending",
            })
          );
          setApplications(formattedApps);
        }

        if (txRes.status === "fulfilled") {
          const rawTx = txRes.value.data?.data || [];
          const formattedInvoices = rawTx.map((t: any) => ({
            id: t.id,
            billingMonth: new Date(t.date).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            description: t.description,
            date: t.date,
            method: t.method,
            amount: t.amount,
            status: t.status,
          }));
          setInvoices(formattedInvoices);
        }

        if (convRes.status === "fulfilled") {
          const rawConv = convRes.value.data?.data || [];
          setChats(rawConv);
          if (rawConv.length > 0) {
            setActiveChatId(rawConv[0].id);
          }
        }
      } catch (err: any) {
        if (ignore) return;
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!ignore) {
          setLoadingPosts(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const fetchMessages = async (convId: string) => {
    try {
      setMessagesLoading(true);
      const res = await api.get(`/messages/${convId}`);
      const data = res.data?.data;
      const messageList = Array.isArray(data) ? data : (data?.messages || []);
      const isBlocked = data?.isBlocked;
      const blockedById = data?.blockedById;

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
    } catch (err) {
      console.error("Error loading chat messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (activeChatId) {
      Promise.resolve().then(() => {
        if (!ignore) {
          fetchMessages(activeChatId);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [activeChatId]);

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
    setTutorQualification("");
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
    setGenderPreference(post.genderPreference || "Any");
    setTutorQualification(post.tutorQualification || "");
    setExtraNotes(post.extraNotes || "");
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
        tutorQualification: tutorQualification.trim() || undefined,
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
        tutorQualification: tutorQualification.trim() || undefined,
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

  const handleHireTutor = async (app: TutorApplication) => {
    // 1. Mark applicant as Hired
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "Hired" as const } : a))
    );

    // 2. Find matching tuition post to auto-pause
    const targetPost = posts.find(
      (p) =>
        (app.postId && p.id === app.postId) ||
        p.subjects.some((s) => app.subject.toLowerCase().includes(s.toLowerCase())) ||
        app.subject.toLowerCase().includes(p.classLevel.toLowerCase())
    ) || posts.find((p) => p.status === "Active");

    if (targetPost) {
      // Optimistically update local posts state
      setPosts((prev) =>
        prev.map((p) => (p.id === targetPost.id ? { ...p, status: "Paused" } : p))
      );
    }

    try {
      await api.patch(`/tuitions/applications/${app.id}/status`, { status: "Hired" });
      showToast(
        "success",
        `🎉 Congratulations! You hired ${app.tutorName}. Your tuition post is now automatically Paused.`
      );
    } catch (err: any) {
      console.error("Error updating tuition post status on hire:", err);
      if (targetPost) {
        try {
          await api.patch(`/tuitions/${targetPost.id}/status`, { status: "Paused" });
        } catch {}
      }
      showToast(
        "success",
        `🎉 Congratulations! You hired ${app.tutorName}. Your tuition post is now automatically Paused.`
      );
    }
  };

  const handleRejectApplication = async (app: TutorApplication) => {
    try {
      await api.patch(`/tuitions/applications/${app.id}/status`, { status: "Rejected" });
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: "Rejected" } : a))
      );
      if (selectedApplicant?.id === app.id) {
        setSelectedApplicant((prev) => (prev ? { ...prev, status: "Rejected" } : null));
      }
      showToast("success", `Application from ${app.tutorName} has been declined.`);
    } catch (err: any) {
      console.error("Error rejecting application:", err);
      showToast("error", err?.response?.data?.message || "Failed to reject application.");
    }
  };

  const handleStartChatWithTutor = async (app: TutorApplication) => {
    if (!app.tutorId) {
      showToast("error", "Tutor profile information is unavailable.");
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.post("/messages/conversations", {
        otherUserId: app.tutorId,
        tutorId: app.tutorId,
        studentId: myUserId || undefined,
      });

      const conversation = res.data?.data;
      if (conversation?.id) {
        const convRes = await api.get("/messages/conversations");
        const rawList = Array.isArray(convRes.data?.data) ? convRes.data.data : (convRes.data?.data?.data || []);
        setChats(rawList);
        setActiveChatId(conversation.id);
      }

      setSelectedApplicant(null);
      router.push("/dashboard?tab=messages");
      showToast("success", `Opened chat conversation with ${app.tutorName}.`);
    } catch (err: any) {
      console.error("Error starting conversation:", err);
      showToast("error", err?.response?.data?.message || "Failed to start conversation.");
    } finally {
      setActionLoading(false);
    }
  };

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
        sender: "student",
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
                {applications.filter((a) => a.status === "Hired").length}
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
                ৳ {invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </span>
              <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>Real-time billing volume</span>
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
                <div
                  key={app.id}
                  onClick={() => setSelectedApplicant(app)}
                  className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 hover:border-[#0F5B47]/40 dark:hover:border-[#188c6e]/40 rounded-2xl flex items-center justify-between gap-4 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full ${app.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                      title="Click to view details"
                    >
                      {app.tutorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-zinc-850 dark:text-zinc-200 group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors truncate">
                          {app.tutorName}
                        </h4>
                        {app.rating && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-600 text-[10px] font-black shrink-0">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            {app.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-550 mt-0.5 truncate">
                        {app.institution} &bull; {app.subject}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                      ৳ {app.salaryBid.toLocaleString()}/mo
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedApplicant(app)}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-[#0F5B47]/10 dark:hover:bg-[#188c6e]/10 text-zinc-600 dark:text-zinc-300 hover:text-[#0F5B47] dark:hover:text-[#188c6e] rounded-xl transition-colors cursor-pointer"
                      title="View Application Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartChatWithTutor(app)}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-[#0F5B47]/10 dark:hover:bg-[#188c6e]/10 text-zinc-600 dark:text-zinc-300 hover:text-[#0F5B47] dark:hover:text-[#188c6e] rounded-xl transition-colors cursor-pointer"
                      title="Chat with Tutor"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectApplication(app)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl transition-colors cursor-pointer"
                      title="Decline / Reject Application"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHireTutor(app)}
                      className="px-2.5 py-1.5 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white text-[9px] font-extrabold uppercase rounded-xl transition-colors cursor-pointer"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-900 mb-6 gap-2">
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                All Tutor Applications ({applications.length})
              </h3>
              <p className="text-xs font-medium text-zinc-450 dark:text-zinc-500 mt-0.5">
                Click on any tutor or &quot;View Profile&quot; to review their credentials, reviews, and teaching subjects.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-xl">
                {applications.filter(a => a.status === "Pending").length} Pending
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApplicant(app)}
                className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 hover:border-[#0F5B47]/40 dark:hover:border-[#188c6e]/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex gap-4 items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl ${app.avatarBg} text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200`}
                    title="Click to view details"
                  >
                    {app.tutorName.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="text-base font-black text-zinc-900 dark:text-white group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors flex items-center gap-1">
                        <span>{app.tutorName}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all text-[#0F5B47] dark:text-[#188c6e]" />
                      </h4>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200/50 dark:border-amber-900/40">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {app.rating.toFixed(1)}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        app.status === "Pending" ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-200/40 dark:border-amber-900/30" :
                        app.status === "Hired" ? "bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] border border-emerald-200/40 dark:border-emerald-900/30" :
                        "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{app.institution}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <span className="text-[#0F5B47] dark:text-[#188c6e] font-bold">{app.subject}</span>
                      {app.location && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                          <span className="text-zinc-400">{app.location}</span>
                        </>
                      )}
                    </p>

                    {app.appliedDate && (
                      <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        Applied {app.appliedDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-900" onClick={(e) => e.stopPropagation()}>
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Salary Bid</span>
                    <span className="text-base md:text-lg font-black text-[#0F5B47] dark:text-[#188c6e]">
                      ৳ {app.salaryBid.toLocaleString()}
                      <span className="text-xs font-bold text-zinc-450 dark:text-zinc-500 ml-1">/mo</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedApplicant(app)}
                      className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-black rounded-xl transition-all inline-flex items-center gap-1.5 border border-zinc-200/60 dark:border-zinc-750/50 shadow-2xs hover:shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      <span>View Details</span>
                    </button>

                    {/* Chat with Tutor Button */}
                    <button
                      type="button"
                      onClick={() => handleStartChatWithTutor(app)}
                      className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-black rounded-xl transition-all inline-flex items-center gap-1.5 border border-zinc-200/60 dark:border-zinc-750/50 shadow-2xs hover:shadow-xs cursor-pointer"
                      title="Chat with Tutor"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#0F5B47] dark:text-[#188c6e]" />
                      <span>Chat</span>
                    </button>

                    {/* Hire & Reject Buttons */}
                    {app.status === "Pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRejectApplication(app)}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-black rounded-xl border border-rose-200/60 dark:border-rose-800/40 transition-colors cursor-pointer"
                          title="Decline this tutor application"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHireTutor(app)}
                          className="px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          Hire Tutor
                        </button>
                      </>
                    ) : app.status === "Rejected" ? (
                      <span className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-black rounded-xl border border-rose-200/50">
                        Declined
                      </span>
                    ) : (
                      <span className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-[#0F5B47] dark:text-[#188c6e] text-xs font-black rounded-xl border border-emerald-200/50">
                        Hired
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                <h4 className="text-base font-black text-zinc-800 dark:text-zinc-200">No applications yet</h4>
                <p className="text-xs text-zinc-450 dark:text-zinc-500 max-w-sm mx-auto mt-1">
                  Once tutors submit their bids on your active tuition posts, their profile applications will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PANEL 4: MESSAGES --- */}
      {currentTab === "messages" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-xs h-[72vh] min-h-130 max-h-180 flex flex-col">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
                <MessageSquare className="w-8 h-8 text-[#0F5B47] dark:text-[#188c6e]" />
              </div>
              <h4 className="text-base font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Your inbox is empty</h4>
              <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 max-w-sm mt-1.5 leading-relaxed">
                Connect with tutors regarding tuition postings or applications to start a real-time conversation thread.
              </p>
            </div>
          ) : (
            <div className="flex h-full w-full overflow-hidden">
              {/* Left: Chat Contacts List */}
              <div className={`w-full md:w-80 border-r border-zinc-150/80 dark:border-zinc-900 flex flex-col shrink-0 bg-white dark:bg-zinc-950 ${
                chatMobileView === "chat" ? "hidden md:flex" : "flex"
              }`}>
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
                      placeholder="Search conversations..."
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-800 dark:text-white transition-all"
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
                          onClick={() => setActiveChatId(chat.id)}
                          className={`w-full text-left p-4 flex gap-3 items-center transition-all duration-200 border-l-4 cursor-pointer ${
                            isActive
                              ? "bg-[#0F5B47]/5 dark:bg-[#188c6e]/5 border-[#0F5B47] dark:border-[#188c6e]"
                              : "border-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                          }`}
                        >
                          <div className="relative shrink-0">
                            <div className={`w-10 h-10 rounded-full ${chat.avatarBg || "bg-emerald-600"} text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}>
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

              {(() => {
                const activeChat = chats.find((c) => c.id === activeChatId);
                const isOnline = activeChat?.recipientId ? onlineUsers.has(activeChat.recipientId) : false;
                const isTyping = activeChat ? typingUsers[activeChat.id] : false;
                const isBlockedByMe = activeChat?.isBlocked && activeChat?.blockedById === myUserId;

                if (!activeChat) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50/30 dark:bg-zinc-900/10 text-zinc-400 p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                      <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Select a conversation</p>
                      <p className="text-xs text-zinc-400 mt-1">Choose a chat thread from the left to read and send messages.</p>
                    </div>
                  );
                }

                return (
                  <div className={`${
                    chatMobileView === "list" ? "hidden" : "flex"
                  } md:flex flex-1 flex-col h-full bg-zinc-50/30 dark:bg-zinc-900/10`}>
                    <div className="px-5 py-3.5 bg-white dark:bg-zinc-950 border-b border-zinc-150/60 dark:border-zinc-900 flex items-center justify-between shrink-0 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setChatMobileView("list")}
                          className="md:hidden p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500 dark:text-zinc-400 cursor-pointer shrink-0"
                          title="Back to conversations"
                        >
                          <ArrowLeft className="w-4 h-4 stroke-[3px]" />
                        </button>
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full ${activeChat.avatarBg || "bg-emerald-600"} text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}>
                            {activeChat.studentName.charAt(0).toUpperCase()}
                          </div>
                          {activeChat.isBlocked ? (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white dark:border-zinc-950 rounded-full ring-1 ring-rose-400" />
                          ) : isOnline ? (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full ring-1 ring-emerald-400" />
                          ) : null}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white leading-tight">
                            {activeChat.studentName}
                          </h4>
                          {activeChat.isBlocked ? (
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
                              {isOnline ? "Online • Verified Tutor" : "Offline • Tutor"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {activeChat.isBlocked ? (
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

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {messagesLoading ? (
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
                          {activeChat.messages?.map((m) => {
                            const isMe = m.sender === "student";
                            const isEditingThis = editingMessageId === m.id;
                            const isEligible = isMessageEligibleForAction(m.createdAt);

                            return (
                              <div
                                key={m.id}
                                className={`flex flex-col group ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-1 duration-200`}
                              >
                                {isEditingThis ? (
                                  <div className="flex items-center gap-2 max-w-md w-full bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border-2 border-[#0F5B47] shadow-md animate-in fade-in zoom-in-95 duration-150">
                                    <input
                                      type="text"
                                      value={editingMessageText}
                                      onChange={(e) => setEditingMessageText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isEditingSaving) handleEditMessage(m.id);
                                        if (e.key === "Escape" && !isEditingSaving) setEditingMessageId(null);
                                      }}
                                      disabled={isEditingSaving}
                                      autoFocus
                                      className="flex-1 px-3 py-1.5 bg-transparent text-xs font-semibold outline-hidden text-zinc-900 dark:text-white"
                                    />
                                    <button
                                      onClick={() => handleEditMessage(m.id)}
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
                                  <div className={`relative flex items-center gap-1.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                    {/* 3-Dot Options Button on hover */}
                                    {!activeChat.isBlocked && (
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 relative">
                                        <button
                                          onClick={() => {
                                            setActiveMenuMsgId(activeMenuMsgId === m.id ? null : m.id);
                                            setActiveReactionPickerMsgId(null);
                                          }}
                                          className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                                          title="More options"
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>

                                        {/* 3-Dot Dropdown Menu */}
                                        {activeMenuMsgId === m.id && (
                                          <>
                                            <div
                                              className="fixed inset-0 z-20 cursor-default"
                                              onClick={() => setActiveMenuMsgId(null)}
                                            />
                                            <div
                                              className={`absolute bottom-full mb-1 ${
                                                isMe ? "right-0" : "left-0"
                                              } w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150`}
                                            >
                                              <button
                                                onClick={() => {
                                                  setActiveReactionPickerMsgId(m.id);
                                                  setActiveMenuMsgId(null);
                                                }}
                                                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 flex items-center gap-2 cursor-pointer"
                                              >
                                                <Smile className="w-3.5 h-3.5 text-amber-500" />
                                                <span>React</span>
                                              </button>

                                              {isMe && isEligible && (
                                                <>
                                                  <button
                                                    onClick={() => {
                                                      setEditingMessageId(m.id);
                                                      setEditingMessageText(m.content);
                                                      setActiveMenuMsgId(null);
                                                    }}
                                                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 flex items-center gap-2 cursor-pointer"
                                                  >
                                                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Edit</span>
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteMessage(m.id);
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
                                      {activeReactionPickerMsgId === m.id && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-20 cursor-default"
                                            onClick={() => setActiveReactionPickerMsgId(null)}
                                          />
                                          <div
                                            className={`absolute bottom-full mb-2 ${
                                              isMe ? "right-0" : "left-0"
                                            } flex items-center gap-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-full px-2.5 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150`}
                                          >
                                            {REACTION_EMOJIS.map((emo) => {
                                              const hasMyReaction = m.reactions?.some(
                                                (r) => r.userId === myUserId && r.emoji === emo
                                              );
                                              return (
                                                <button
                                                  key={emo}
                                                  onClick={() => handleToggleReaction(m.id, emo)}
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
                                          if (!activeChat.isBlocked) {
                                            longPressTimerRef.current = setTimeout(() => {
                                              setActiveReactionPickerMsgId(m.id);
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
                                          if (!activeChat.isBlocked) {
                                            setActiveReactionPickerMsgId(m.id);
                                          }
                                        }}
                                        className={`max-w-md px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-2xs select-none transition-all ${
                                          isMe
                                            ? "bg-[#0F5B47] text-white rounded-br-xs"
                                            : "bg-white dark:bg-zinc-850 border border-zinc-200/60 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-xs"
                                        }`}
                                      >
                                        {m.content}
                                      </div>

                                      {/* Reaction Badges Pill */}
                                      {(() => {
                                        if (!m.reactions || m.reactions.length === 0) return null;
                                        const grouped: { [emoji: string]: { count: number; hasMine: boolean } } = {};
                                        m.reactions.forEach((r) => {
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
                                              isMe ? "right-2" : "left-2"
                                            } flex items-center gap-1 z-10`}
                                          >
                                            {Object.entries(grouped).map(([emo, data]) => (
                                              <button
                                                key={emo}
                                                onClick={() => handleToggleReaction(m.id, emo)}
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
                                  <span>{m.time}</span>
                                  {isMe && (
                                    <span className={m.isRead ? "text-emerald-500 font-bold" : "text-zinc-400"}>
                                      {m.isRead ? "✓✓" : "✓"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Real-time Messenger-style typing bubble */}
                          {isTyping && !activeChat.isBlocked && (
                            <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                              <div className={`w-7 h-7 rounded-full ${activeChat.avatarBg || "bg-emerald-600"} text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs mb-1 shrink-0`}>
                                {activeChat.studentName.charAt(0).toUpperCase()}
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
                    {activeChat.isBlocked ? (
                      <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border-t border-amber-200/50 dark:border-amber-900/40 flex flex-col sm:flex-row items-center justify-center gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold">
                          <Ban className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>
                            {activeChat.blockedById === myUserId
                              ? "You have blocked this contact. Unblock to send and receive messages."
                              : "You cannot send messages to this contact because you have been blocked."}
                          </span>
                        </div>
                        {activeChat.blockedById === myUserId && (
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
                          if (socketRef.current && activeChat?.id) {
                            socketRef.current.emit("typing_stop", {
                              conversationId: activeChat.id,
                              recipientId: activeChat.recipientId,
                            });
                          }
                          handleSendMessage(e);
                        }}
                        className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-150/60 dark:border-zinc-900 flex gap-2 shrink-0"
                      >
                        <input
                          type="text"
                          placeholder="Write a message..."
                          value={newMessageText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewMessageText(val);
                            if (socketRef.current && activeChat?.id) {
                              socketRef.current.emit("typing_start", {
                                conversationId: activeChat.id,
                                recipientId: activeChat.recipientId,
                              });
                              if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                              typingTimeoutRef.current = setTimeout(() => {
                                socketRef.current?.emit("typing_stop", {
                                  conversationId: activeChat.id,
                                  recipientId: activeChat.recipientId,
                                });
                              }, 1500);
                            }
                          }}
                          className="flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-2xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-900 dark:text-white"
                        />
                        <button
                          type="submit"
                          disabled={!newMessageText.trim()}
                          className="px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] disabled:opacity-50 text-white text-xs font-extrabold uppercase rounded-2xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
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

      {/* --- PANEL 5: ACTIVE TUTORS --- */}
      {currentTab === "active-tutors" && (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white pb-4 border-b border-zinc-100 dark:border-zinc-900">
            Hired & Active Educators
          </h3>
          <div className="space-y-4">
            {applications.filter((a) => a.status === "Hired").map((app) => (
              <div key={app.id} className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${app.avatarBg || "bg-purple-600"} text-white font-extrabold text-xs flex items-center justify-center`}>
                      {app.tutorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">{app.tutorName}</h4>
                      <p className="text-xs font-bold text-zinc-450">{app.subject} &bull; {app.institution}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e]">৳ {app.salaryBid.toLocaleString()}/mo</span>
                </div>
                <div className="bg-blue-50/20 dark:bg-blue-955/5 border border-blue-100/50 dark:border-blue-900/10 p-4 rounded-xl flex gap-3 items-start">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] text-blue-800 dark:text-blue-400 uppercase font-bold tracking-wider">
                      Tutor Progress Logs
                    </span>
                    <p className="text-xs text-zinc-650 dark:text-zinc-450 font-semibold leading-relaxed">
                      Syllabus on track. Ongoing regular model tests and revisions scheduled.
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {applications.filter((a) => a.status === "Hired").length === 0 && (
              <div className="text-center py-12 text-zinc-400 text-sm font-semibold bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-150/60 dark:border-zinc-900 rounded-2xl">
                No active hired educators under track.
              </div>
            )}
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
                <label className="text-zinc-600 dark:text-zinc-400 uppercase tracking-wide flex items-center justify-between">
                  <span>Tutor Qualification / Preferred University</span>
                  <span className="text-[10px] text-zinc-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={tutorQualification || "Any"}
                    onChange={(e) => setTutorQualification(e.target.value === "Any" ? "" : e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl outline-hidden focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-850 dark:text-white cursor-pointer transition-colors"
                  >
                    {BANGLADESH_QUALIFICATIONS.map((group) => (
                      <optgroup key={group.category} label={group.category}>
                        {group.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <p className="text-[10px] text-zinc-400 font-medium leading-tight">
                  💡 If left as &quot;Any&quot;, any qualified tutor can apply. If a university or category is selected, only tutors matching that qualification can apply.
                </p>
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

      {/* ========================================================================= */}
      {/* 4. APPLICANT PROFILE DETAILS MODAL WITH HIRE & CHAT */}
      {/* ========================================================================= */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Top Accent Gradient Line */}
            <div className="h-1.5 w-full bg-linear-to-r from-teal-500 to-[#0F5B47]" />

            {/* Modal Header */}
            <div className="p-5 md:p-6 border-b border-zinc-150/80 dark:border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] border border-teal-100 dark:border-teal-900/40 text-xs font-black rounded-full uppercase tracking-wider">
                  Applicant Profile
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                  selectedApplicant.status === "Pending" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200/50" :
                  selectedApplicant.status === "Hired" ? "bg-emerald-50 dark:bg-emerald-950/30 text-[#0F5B47] dark:text-[#188c6e] border border-emerald-200/50" :
                  "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
                }`}>
                  {selectedApplicant.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              {/* Tutor Hero Card */}
              <div className="bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-150/60 dark:border-zinc-850 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${selectedApplicant.avatarBg} flex items-center justify-center text-white text-3xl font-black shadow-md`}>
                    {selectedApplicant.tutorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-zinc-950 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-2 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
                      {selectedApplicant.tutorName}
                    </h3>
                    <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200/50 w-fit mx-auto md:mx-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {selectedApplicant.rating.toFixed(1)} (Verified Tutor)
                    </span>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    {selectedTutorDetails?.department || selectedApplicant.institution} &bull; {selectedTutorDetails?.university || selectedApplicant.institution}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold text-zinc-500">
                    {selectedApplicant.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        {selectedApplicant.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      {selectedApplicant.subject}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bid Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                    Monthly Salary Bid
                  </span>
                  <span className="text-lg md:text-xl font-black text-[#0F5B47] dark:text-[#188c6e]">
                    ৳ {selectedApplicant.salaryBid.toLocaleString()}
                    <span className="text-xs font-semibold text-zinc-450 ml-1">/mo</span>
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                    Tutoring Mode
                  </span>
                  <span className="text-sm md:text-base font-black text-zinc-800 dark:text-zinc-200">
                    {selectedTutorDetails?.mode === "Both" ? "Home & Online" : selectedTutorDetails?.mode || "Home Tutoring"}
                  </span>
                </div>

                <div className="col-span-2 md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                    Class Frequency
                  </span>
                  <span className="text-sm md:text-base font-black text-zinc-800 dark:text-zinc-200">
                    {selectedTutorDetails?.classFrequency || "3 Days / Week"}
                  </span>
                </div>
              </div>

              {/* About & Proposal */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
                  About Tutor & Teaching Proposal
                </h4>
                <div className="bg-zinc-50/60 dark:bg-zinc-900/30 border border-zinc-150/50 dark:border-zinc-850 p-4 rounded-2xl text-xs md:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                  {selectedTutorDetails?.about || `I am an experienced tutor specializing in ${selectedApplicant.subject}. I have strong pedagogical experience preparing students with problem solving, mock evaluations, and structured chapter summaries.`}
                </div>
              </div>

              {/* Education Background */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Education & Qualifications
                </h4>
                <div className="space-y-2">
                  {(selectedTutorDetails?.education || [
                    { degree: selectedApplicant.subject + " Specialist", institution: selectedApplicant.institution }
                  ]).map((edu, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50/60 dark:bg-zinc-900/30 border border-zinc-150/50 dark:border-zinc-850 rounded-xl">
                      <div className="p-2 bg-teal-50 dark:bg-teal-950/30 text-[#0F5B47] dark:text-[#188c6e] rounded-lg shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs md:text-sm font-black text-zinc-900 dark:text-white">{edu.degree}</h5>
                        <p className="text-[11px] font-semibold text-zinc-450 dark:text-zinc-500">{edu.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Reviews */}
              {selectedTutorDetails?.reviews && selectedTutorDetails.reviews.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Student Reviews & Feedback
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTutorDetails.reviews.map((rev, i) => (
                      <div key={i} className="p-3.5 bg-zinc-50/60 dark:bg-zinc-900/30 border border-zinc-150/50 dark:border-zinc-850 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{rev.reviewer}</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-500 text-[10px] font-black">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {rev.rating}
                          </span>
                        </div>
                        <p className="text-[11px] italic text-zinc-600 dark:text-zinc-400 leading-snug">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions Bar */}
            <div className="p-5 border-t border-zinc-150/80 dark:border-zinc-850 bg-zinc-50/80 dark:bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <Link
                  href={`/tutors/${selectedApplicant.tutorId || '1'}`}
                  target="_blank"
                  className="text-xs font-bold text-zinc-500 hover:text-[#0F5B47] dark:hover:text-[#188c6e] flex items-center gap-1 transition-colors"
                >
                  <span>Open Public Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Chat Button */}
                <button
                  type="button"
                  onClick={() => handleStartChatWithTutor(selectedApplicant)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-100 font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-zinc-200/60 dark:border-zinc-700 shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
                  <span>Chat with Tutor</span>
                </button>

                {/* Hire & Reject Buttons in Modal */}
                {selectedApplicant.status === "Pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRejectApplication(selectedApplicant)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold text-xs rounded-xl border border-rose-200/70 dark:border-rose-800/40 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4 stroke-[2.5px]" />
                      <span>Decline</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleHireTutor(selectedApplicant);
                        setSelectedApplicant((prev) => (prev ? { ...prev, status: "Hired" } : null));
                      }}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] dark:bg-[#188c6e] dark:hover:bg-[#15795f] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4 stroke-[3px]" />
                      <span>Hire Tutor</span>
                    </button>
                  </>
                ) : selectedApplicant.status === "Rejected" ? (
                  <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-black text-xs rounded-xl">
                    <X className="w-4 h-4" />
                    <span>Application Declined</span>
                  </div>
                ) : (
                  <div className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-emerald-50 dark:bg-emerald-950/40 text-[#0F5B47] dark:text-[#188c6e] border border-emerald-200 dark:border-emerald-900/50 font-black text-xs rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tutor Hired</span>
                  </div>
                )}
              </div>
            </div>
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
