"use client";

import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "@/redux/store";
import { AuthProvider } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const ChatbotWidget = dynamic(() => import("@/components/shared/ChatbotWidget"), {
  ssr: false,
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
          <ChatbotWidget />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
