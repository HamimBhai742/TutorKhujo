"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile?: string;
  profilePic?: string;
  rewardPoints?: number;
  isFirstLogin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userData: User, refreshToken?: string) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      if (res.data?.data) {
        const u = res.data.data;
        setUser((prev) => {
          const updated = { ...prev, ...u };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (_) {}
  };

  useEffect(() => {
    // Load auth data from localStorage on mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data", e);
      }
      refetchUser();
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, userData: User, refreshToken?: string) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    refetchUser();
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      // Revoke refresh token on the server (fire and forget)
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken }).catch(() => {
          // Ignore errors — still clear local storage
        });
      }
      
      // Disable GSI auto-select to prevent silent login on next visit
      if (typeof window !== "undefined" && window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updateUser, refetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
