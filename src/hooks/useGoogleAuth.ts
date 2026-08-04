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

  const handleCredentialResponse = useCallback(async (response: any) => {
    setIsLoading(true);
    setError("");
    try {
      const idToken = response.credential;
      const res = await api.post("/auth/google-login", { idToken, role });
      const { accessToken, user } = res.data.data;
      
      login(accessToken, user);
      
      // Redirect to role selection if first time, otherwise to home page
      if (user?.isFirstLogin) {
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

  const renderGoogleButton = useCallback((elementId: string, options?: any) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured. Google Sign-In button will not render.");
      return;
    }

    if (!window.google?.accounts?.id) {
      return;
    }

    try {
      // Initialize Google accounts client
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
      });

      // Render the button
      const container = document.getElementById(elementId);
      if (container) {
        window.google.accounts.id.renderButton(
          container,
          options || {
            theme: "outline",
            size: "large",
            width: "360", // custom width to fit design nicely
            text: "continue_with",
            shape: "rectangular",
          }
        );
      }

      // Display One Tap prompt
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error("Error rendering Google button:", err);
    }
  }, [handleCredentialResponse]);

  return {
    error,
    setError,
    isLoading,
    scriptLoaded,
    renderGoogleButton,
  };
};
