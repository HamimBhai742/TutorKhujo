import React, { useState } from "react";
import { X, Send, Sparkles, CheckCircle, Loader2, Zap } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import BuyPointsModal from "@/components/points/BuyPointsModal";

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title?: string;
    classLevel: string;
    subjects: string[];
    budget: number;
    location: string;
    studentName?: string;
  };
  onSuccess?: () => void;
}

export default function QuickApplyModal({ isOpen, onClose, job, onSuccess }: QuickApplyModalProps) {
  const { user, refetchUser } = useAuth();
  const [salaryBid, setSalaryBid] = useState<number>(job.budget || 5000);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [customProposal, setCustomProposal] = useState<string>(
    `Experienced tutor in ${job.subjects.join(", ")}. Focused on conceptual clarity, student query resolution, and weekly progress tests.`
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isBuyPointsOpen, setIsBuyPointsOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const proposalTemplates = [
    {
      id: 1,
      title: "Conceptual Clarity Focus",
      text: `I have 3+ years experience teaching ${job.subjects.join(" & ")}. I focus on building strong core concepts, solving test papers, and conducting weekly evaluation tests.`,
    },
    {
      id: 2,
      title: "Exam & Syllabus Specialist",
      text: `University graduate specialized in ${job.classLevel} syllabus. Available for immediate demo class to evaluate student level and design custom study routine.`,
    },
    {
      id: 3,
      title: "Custom Pitch",
      text: customProposal,
    },
  ];

  const handleTemplateSelect = (idx: number) => {
    setSelectedTemplate(idx + 1);
    setCustomProposal(proposalTemplates[idx].text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if ((user?.rewardPoints || 0) < 10) {
      setIsBuyPointsOpen(true);
      return;
    }

    setLoading(true);

    try {
      await api.post(`/tuitions/${job.id}/apply`, {
        salaryBid: Number(salaryBid),
        proposal: customProposal,
      });

      if (refetchUser) {
        await refetchUser();
      }

      setSuccessMsg("Application submitted successfully! (10 Points Deducted)");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to submit application. Please try again.";
      setErrorMsg(msg);
      if (msg.includes("Insufficient points")) {
        setIsBuyPointsOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#F26A1B] bg-orange-50 dark:bg-orange-955/30 px-2.5 py-0.5 rounded-full border border-orange-200/40">
                  2-Click Quick Apply
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-955/30 px-2.5 py-0.5 rounded-full border border-amber-300/40 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-amber-500" /> Cost: 10 Pts
                </span>
              </div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mt-1">
                Apply for {job.classLevel} - {job.subjects.join(", ")}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {successMsg ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-base font-black text-zinc-900 dark:text-white">
                {successMsg}
              </h4>
              <p className="text-xs font-bold text-zinc-400">
                The student has been notified. You can track this application in your dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-955/30 border border-red-200 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl flex items-center justify-between">
                  <span>{errorMsg}</span>
                  {errorMsg.includes("Insufficient points") && (
                    <button
                      type="button"
                      onClick={() => setIsBuyPointsOpen(true)}
                      className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[10px] font-black"
                    >
                      Top Up Now
                    </button>
                  )}
                </div>
              )}

            {/* Salary Bid Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block pl-1">
                Your Monthly Salary Bid (BDT)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={salaryBid}
                  onChange={(e) => setSalaryBid(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  / month (Budget: ৳{job.budget?.toLocaleString()})
                </span>
              </div>
            </div>

            {/* Quick Proposal Pitch Selector */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 pl-1">
                <Sparkles className="w-4 h-4 text-[#F26A1B]" />
                <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Smart Proposal Pitch Templates
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {proposalTemplates.slice(0, 2).map((tmpl, idx) => (
                  <button
                    type="button"
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTemplate === tmpl.id
                        ? "border-[#0F5B47] bg-teal-50/20 dark:bg-teal-955/20 text-zinc-900 dark:text-white font-extrabold"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 font-semibold hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-xs block">{tmpl.title}</span>
                    <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{tmpl.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Pitch Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block pl-1">
                Proposal Letter Pitch
              </label>
              <textarea
                rows={3}
                value={customProposal}
                onChange={(e) => {
                  setSelectedTemplate(3);
                  setCustomProposal(e.target.value);
                }}
                placeholder="Why are you the best fit for this tuition..."
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F5B47] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-extrabold text-xs rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#F26A1B] hover:bg-[#db5b14] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-500/20 flex items-center space-x-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Quick Submit Pitch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        </div>
      </div>

      <BuyPointsModal
        isOpen={isBuyPointsOpen}
        onClose={() => setIsBuyPointsOpen(false)}
        initialRequiredPoints={10}
      />
    </>
  );
}
