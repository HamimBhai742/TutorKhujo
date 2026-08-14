"use client";

import React, { useState } from "react";
import {
  Settings,
  Percent,
  Mail,
  Smartphone,
  Shield,
  Save,
  Info
} from "lucide-react";
import { MOCK_ADMIN_SETTINGS, AdminSettings } from "@/data/adminDashboard";

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<AdminSettings>(MOCK_ADMIN_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 800);
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
                <h4 className="text-sm font-bold text-zinc-855 dark:text-white">Auto-Verify Tutor Profiles</h4>
                <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                  Instantly verify tutor onboarding profiles without admin document screening.
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

        {/* Card 3: Communications & Alerts */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-3">
            <Smartphone size={20} className="text-[#0F5B47]" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Gateways & Contact</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Support Operations Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      supportEmail: e.target.value
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-4 text-sm outline-none transition-all focus:border-[#0F5B47] focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-[#188c6e]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 self-end">
              <div>
                <h4 className="text-sm font-bold text-zinc-855 dark:text-white">Active SMS Notification Gateway</h4>
                <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                  Sends SMS alerts on student verification and matching.
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
    </div>
  );
}
