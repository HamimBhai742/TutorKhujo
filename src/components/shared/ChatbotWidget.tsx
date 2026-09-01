"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, GripHorizontal, RotateCcw, Bot, User } from "lucide-react";
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

  // Markdown-like parser helper
  const renderFormattedMessage = (text: string) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      const isNumbered = /^\d+\.\s/.test(line.trim());
      
      // Extract main text ignoring bullet indicators
      const rawText = line.replace(/^([-*\d.]+\s+)/, "");
      
      // Parse bold tags **
      const parts = rawText.split(/\*\*([\s\S]*?)\*\*/g);
      const parsedText = parts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <strong key={i} className="font-bold text-[#0F5B47] dark:text-[#1d9777]">
              {part}
            </strong>
          );
        }
        return part;
      });

      if (isBullet || isNumbered) {
        return (
          <li key={idx} className="ml-4 list-disc my-1 leading-relaxed text-sm">
            {parsedText}
          </li>
        );
      }
      
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed text-sm">
          {parsedText}
        </p>
      );
    });
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
          className="pointer-events-auto mb-4 w-[calc(100vw-32px)] sm:w-96 h-[500px] max-h-[calc(100vh-120px)] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
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
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/30">
                    <Bot className="w-4 h-4 text-[#0F5B47] dark:text-[#188c6e]" />
                  </div>
                )}
                
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#0F5B47] text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none"
                  }`}
                >
                  {renderFormattedMessage(msg.content)}
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
