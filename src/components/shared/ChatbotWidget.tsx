"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, GripHorizontal, RotateCcw, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tutorkhujo_chat_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error reading chat history", e);
        }
      }
    }
    // Fallback welcome message
    return [
      {
        role: "assistant",
        content: "Hello! Welcome to **TutorKhujo (টউটর খুঁজুন)** support. How can I guide you today? Ask me about finding tutors, tutor onboarding, platform settings, or bookings!"
      }
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Draggable position coordinates (offset from initial position)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Suggestion chips
  const suggestions = [
    "How to find a tutor?",
    "How to join as a tutor?",
    "What are the platform fees?",
    "Is there a referral program?"
  ];

  // Save chat history to localStorage when changed
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("tutorkhujo_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // API call to custom AgentRouter chatbot controller
      const response = await api.post("/chatbot/chat", {
        message: textToSend,
        // Map history to server schema
        history: messages.slice(-10).map((msg) => ({
          role: msg.role,
          content: msg.content
        }))
      });

      const reply = response.data?.data?.reply || "I'm sorry, I couldn't process your request.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the support server. Please check your connection and try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const initialMsg: Message = {
        role: "assistant",
        content: "History cleared. How can I help you today?"
      };
      setMessages([initialMsg]);
      localStorage.setItem("tutorkhujo_chat_history", JSON.stringify([initialMsg]));
    }
  };

  // Draggable logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable drag on mobile
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: position.x,
      y: position.y,
      clientX: e.clientX,
      clientY: e.clientY
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStart.current = {
      x: position.x,
      y: position.y,
      clientX: touch.clientX,
      clientY: touch.clientY
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const dx = e.clientX - dragStart.current.clientX;
      const dy = e.clientY - dragStart.current.clientY;

      let newX = dragStart.current.x + dx;
      let newY = dragStart.current.y + dy;

      // Boundaries Clamping
      const padding = 24;
      const widgetWidth = 384; 
      const widgetHeight = 520; 

      const minX = -(window.innerWidth - widgetWidth - padding);
      const maxX = padding;
      
      const minY = -64; // Limit drag bottom
      const maxY = window.innerHeight - widgetHeight - padding;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      
      const dx = touch.clientX - dragStart.current.clientX;
      const dy = touch.clientY - dragStart.current.clientY;

      let newX = dragStart.current.x + dx;
      let newY = dragStart.current.y + dy;

      const padding = 24;
      const widgetWidth = 384; 
      const widgetHeight = 520; 

      const minX = -(window.innerWidth - widgetWidth - padding);
      const maxX = padding;
      
      const minY = -64;
      const maxY = window.innerHeight - widgetHeight - padding;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  // Rich Markdown renderer with remark-gfm support
  const renderFormattedMessage = (text: string, isUser = false) => {
    if (!text) return null;
    if (isUser) {
      return <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
    }

    // Clean up raw HTML line breaks generated by some LLMs
    const cleanContent = text.replace(/<br\s*\/?>/gi, "\n\n");

    return (
      <div className="text-xs sm:text-[13px] leading-relaxed space-y-2 max-w-full overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h4 className="font-bold text-sm sm:text-base my-2 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-1">
                {children}
              </h4>
            ),
            h2: ({ children }) => (
              <h5 className="font-bold text-xs sm:text-sm my-1.5 text-[#0F5B47] dark:text-emerald-400">
                {children}
              </h5>
            ),
            h3: ({ children }) => (
              <h6 className="font-bold text-xs my-1 text-[#0F5B47] dark:text-emerald-400 uppercase tracking-wide">
                {children}
              </h6>
            ),
            p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
            strong: ({ children }) => (
              <strong className="font-bold text-[#0F5B47] dark:text-emerald-400">
                {children}
              </strong>
            ),
            ul: ({ children }) => (
              <ul className="my-1.5 ml-4 list-disc space-y-1 text-zinc-700 dark:text-zinc-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-1.5 ml-4 list-decimal space-y-1 text-zinc-700 dark:text-zinc-300">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0F5B47] dark:text-emerald-400 underline font-semibold hover:opacity-80"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-[#0F5B47] pl-3 py-1 my-2 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs italic rounded-r text-zinc-700 dark:text-zinc-300">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="my-2.5 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <table className="min-w-full text-xs divide-y divide-zinc-200 dark:divide-zinc-800">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-zinc-100 dark:bg-zinc-800/80 font-bold text-zinc-800 dark:text-zinc-200">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 bg-white/40 dark:bg-zinc-900/40">
                {children}
              </tbody>
            ),
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => (
              <th className="px-2.5 py-1.5 text-left text-[11px] font-bold tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-2.5 py-1.5 text-[11px] whitespace-normal">
                {children}
              </td>
            ),
            code: ({ children }) => (
              <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-600 dark:text-emerald-400">
                {children}
              </code>
            ),
            hr: () => <hr className="my-2 border-zinc-200 dark:border-zinc-800" />,
          }}
        >
          {cleanContent}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="fixed z-50 bottom-6 right-6 select-none font-sans flex flex-col items-end pointer-events-none">
      {/* 2. Chat Window Panel */}
      {isOpen && (
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="pointer-events-auto mb-4 w-[calc(100vw-32px)] sm:w-[420px] h-[540px] max-h-[calc(100vh-120px)] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="px-4 py-3 bg-gradient-to-r from-[#0F5B47] to-[#1d9777] text-white flex items-center justify-between select-none cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">TutorKhujo AI</h3>
                <span className="text-[10px] text-emerald-200 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  Support Agent • Online
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              {/* Reset History */}
              <button
                onClick={handleClearHistory}
                className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-100 cursor-pointer"
                title="Clear Chat History"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {/* Drag Indicator (Desktop Only) */}
              <div className="hidden md:flex items-center text-zinc-300 cursor-grab active:cursor-grabbing">
                <GripHorizontal className="w-4.5 h-4.5" />
              </div>
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors text-zinc-100 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end space-x-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/30 mb-1">
                    <Bot className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#0F5B47] text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none"
                  }`}
                >
                  {renderFormattedMessage(msg.content, msg.role === "user")}
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-end space-x-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex space-x-1 items-center h-9">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions chips */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                Suggested Topics
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="text-xs px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 transition-colors cursor-pointer text-left font-medium"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask TutorKhujo AI..."
              disabled={loading}
              className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-zinc-800 dark:text-zinc-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-[#0F5B47] hover:bg-[#157A60] dark:bg-[#188c6e] dark:hover:bg-[#1f9f7f] text-white rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Launcher Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-[#0F5B47] hover:bg-[#157A60] dark:bg-[#188c6e] dark:hover:bg-[#1f9f7f] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 animate-float cursor-pointer relative group"
        aria-label="Chat support"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200 rotate-0 hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {/* Label tooltip */}
            <div className="absolute right-16 bg-zinc-900 dark:bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md">
              Need help? Ask AI
            </div>
          </>
        )}
      </button>
    </div>
  );
}
