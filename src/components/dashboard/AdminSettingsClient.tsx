/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Percent,
  Smartphone,
  Shield,
  Save,
  Info
} from "lucide-react";
import { AdminSettings } from "@/data/adminDashboard";
import api from "@/lib/api";

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<AdminSettings>({
    platformFeePercent: 10,
    maintenanceMode: false,
    supportEmail: "support@tutorkhujo.com",
    smsGatewayActive: true,
    autoApproveTutors: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/settings");
      setSettings(response.data.data);
    } catch (err: any) {
      console.error("Error fetching settings:", err);
      setError(
        err.response?.data?.message || 
        "Failed to retrieve settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await api.get("/settings");
        if (active) {
          setSettings(response.data.data);
        }
      } catch (err: any) {
        if (active) {
          console.error("Error fetching settings:", err);
          setError(
            err.response?.data?.message || 
            "Failed to retrieve settings."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...settings } as any;
      delete payload.id;
      await api.patch("/settings", payload);
      alert("Settings saved successfully!");
    } catch (err: any) {
      console.error("Error saving settings:", err);
      alert(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
          System Settings
        </h2>
        <p className="text-sm font-semibold text-zinc-550 dark:text-zinc-400 mt-1">
          Adjust platform configurations, fees, automated rules, and third-party gateway connections.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-850 dark:bg-zinc-900 shadow-sm">
          <svg
            className="h-10 w-10 animate-spin text-[#0F5B47] dark:text-[#188c6e]"
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
            Loading system configurations...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-150 bg-red-50/20 p-8 text-center dark:border-red-950/20 dark:bg-red-950/10">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={fetchSettings}
            className="mt-4 rounded-xl bg-[#0F5B47] hover:bg-[#0c4a39] px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
          >
            Reload Settings
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Platform Pricing */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-3">
              <Percent size={20} className="text-[#0F5B47]" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Fees & Commissions</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Platform Commission Fee (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="105"
                    value={settings.platformFeePercent}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        platformFeePercent: parseInt(e.target.value) || 0
                      }))
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-sm outline-none transition-all focus:border-[#0F5B47] focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-[#188c6e]"
                    required
                  />
                </div>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold mt-1.5 flex items-center gap-1">
                  <Info size={12} />
                  Percentage taken from student payments before paying out tutors.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Operations & Maintenance */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-3">
              <Shield size={20} className="text-[#0F5B47]" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Platform Operations</h3>
            </div>

            <div className="space-y-4">
              {/* Maintenance Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800">
                <div>
                  <h4 className="text-sm font-bold text-zinc-855 dark:text-white">System Maintenance Mode</h4>
                  <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                    Blocks student & tutor registrations and displays a maintenance message.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      maintenanceMode: !prev.maintenanceMode
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.maintenanceMode ? "bg-[#F26A1B]" : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.maintenanceMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Auto Approve Tutors */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800">
                <div>
                  <h4 className="text-sm font-bold text-zinc-855 dark:text-white">Auto-Approve Tutor Profiles</h4>
                  <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                    Skip admin moderation queue. Verification documents will still be required.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      autoApproveTutors: !prev.autoApproveTutors
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.autoApproveTutors ? "bg-[#0F5B47] dark:bg-[#188c6e]" : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.autoApproveTutors ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Gateways */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-3">
              <Smartphone size={20} className="text-[#0F5B47]" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Communications & Gateways</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800">
                <div>
                  <h4 className="text-sm font-bold text-zinc-855 dark:text-white">Active SMS Gateway API</h4>
                  <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                    Send real-time verification codes and invoice updates via SMS network.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      smsGatewayActive: !prev.smsGatewayActive
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.smsGatewayActive ? "bg-[#0F5B47] dark:bg-[#188c6e]" : "bg-zinc-200 dark:bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.smsGatewayActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#0F5B47] hover:bg-[#0F5B47]/90 text-white dark:bg-[#188c6e] dark:hover:bg-[#188c6e]/90 px-6 py-3 text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSaving ? "Saving system settings..." : "Save Configuration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
