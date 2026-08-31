/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";
import api from "@/lib/api";

declare global {
  interface Window {
    google?: any;
  }
}

export const useGoogleAuth = (role?: "student" | "tutor") => {
  const { login } = useAuth();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(() => {
    return typeof window !== "undefined" && !!window.google?.accounts?.id;
  });

  useEffect(() => {
    // 1. Check if script is already loaded
    if (window.google?.accounts?.id) {
      return;
    }

    // 2. Append script tag to head/body
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError("Failed to load Google Sign-in SDK.");
    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = useCallback(async (response: any, overrideRole?: "student" | "tutor") => {
    setIsLoading(true);
    setError("");
    try {
      const idToken = response.credential;
      const finalRole = overrideRole || role;
      const res = await api.post("/auth/google-login", { idToken, role: finalRole });
      const { accessToken, refreshToken, user } = res.data.data;
      
      login(accessToken, user, refreshToken);
      
      // Redirect to dashboard if admin, to role selection if first time, otherwise to home page
      if (user?.role === "admin") {
        window.location.href = ROUTES.DASHBOARD.HOME;
      } else if (user?.isFirstLogin) {
        window.location.href = "/who-are-you";
      } else {
        window.location.href = ROUTES.HOME;
      }
    } catch (err: any) {
      console.error("Google authentication error:", err);
      const errMsg = err.response?.data?.message || "Google sign-in failed. Please try again.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [role, login]);

  // Parse id_token from hash fragment on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const hash = window.location.hash;
    if (hash && hash.includes("id_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get("id_token");
      if (idToken) {
        // Clear hash from URL cleanly
        window.history.replaceState(null, "", window.location.pathname);
        
        // Retrieve role
        const savedRole = localStorage.getItem("google_auth_role") as "student" | "tutor" | null;
        localStorage.removeItem("google_auth_role");
        
        // Submit the credential
        const finalRole = savedRole || role;
        setTimeout(() => {
          handleCredentialResponse({ credential: idToken }, finalRole);
        }, 0);
      }
    }
  }, [handleCredentialResponse, role]);

  const signInWithGoogleRedirect = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
      return;
    }
    
    const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname);
    const nonce = Math.random().toString(36).substring(2);
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=openid%20email%20profile&nonce=${nonce}&prompt=select_account`;
    
    if (role) {
      localStorage.setItem("google_auth_role", role);
    }
    
    window.location.href = googleAuthUrl;
  }, [role]);

  return {
    error,
    setError,
    isLoading,
    scriptLoaded,
    signInWithGoogleRedirect,
  };
};
