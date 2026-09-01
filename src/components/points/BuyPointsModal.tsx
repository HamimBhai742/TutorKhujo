"use client";

import React, { useState } from "react";
import {
  X,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Loader2,
  ChevronRight,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface BuyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newBalance: number) => void;
  initialRequiredPoints?: number;
}

const POINT_PACKAGES = [
  {
    price: 99,
    points: 100,
    title: "Starter Pack",
    desc: "Great for unlocking contacts or applying to tuitions",
    tag: null,
    highlight: false,
  },
  {
    price: 199,
    points: 200,
    title: "Standard Pack",
    desc: "Most chosen by active students and tutors",
    tag: "Popular 🔥",
    highlight: false,
  },
  {
    price: 299,
    points: 300,
    title: "Pro Pack",
    desc: "Ideal for full-time tutors & multiple hires",
    tag: null,
    highlight: false,
  },
  {
    price: 399,
    points: 400,
    title: "Super Saver",
    desc: "Maximum reach with priority connect credits",
    tag: null,
    highlight: false,
  },
  {
    price: 499,
    points: 500,
    title: "Ultimate Champion",
    desc: "Best value with 500 points for unlimited connections",
    tag: "Best Value 👑",
    highlight: true,
  },
];

export default function BuyPointsModal({
  isOpen,
  onClose,
  onSuccess,
  initialRequiredPoints,
}: BuyPointsModalProps) {
  const { user, refetchUser } = useAuth();

  const [selectedPackage, setSelectedPackage] = useState<number>(199);
  const [paymentMethod, setPaymentMethod] = useState<"bKash" | "Nagad" | "Card">("bKash");
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.mobile || "");
  const [step, setStep] = useState<"SELECT" | "PAYMENT" | "SUCCESS">("SELECT");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [purchasedPoints, setPurchasedPoints] = useState<number>(0);
  const [newBalance, setNewBalance] = useState<number>(0);

  if (!isOpen) return null;

  const currentPkg = POINT_PACKAGES.find((p) => p.price === selectedPackage) || POINT_PACKAGES[1];

  const handlePurchase = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.post("/points/purchase", {
        packagePrice: currentPkg.price,
        method: paymentMethod,
        trxId: `TXN-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      });

      if (res.data?.success) {
        setPurchasedPoints(res.data.data.pointsAdded);
        setNewBalance(res.data.data.totalPoints);
        if (refetchUser) {
          await refetchUser();
        }
        if (onSuccess) {
          onSuccess(res.data.data.totalPoints);
        }
        setStep("SUCCESS");
      }
    } catch (err: any) {
      console.error("Points purchase error:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to process point purchase. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("SELECT");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#0F5B47] to-[#16785e] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Recharge Points Pack</h3>
              <p className="text-xs text-emerald-100 font-medium">
                Current Balance: <span className="font-black text-amber-300">{user?.rewardPoints ?? 0} Pts</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {initialRequiredPoints && initialRequiredPoints > (user?.rewardPoints ?? 0) && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300 font-semibold">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
              <span>
                You need <strong>{initialRequiredPoints} points</strong> for this action. Top up below to continue immediately!
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl text-xs text-red-600 dark:text-red-400 font-semibold">
              {errorMsg}
            </div>
          )}

          {step === "SELECT" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                  Choose a Points Package:
                </h4>
                <p className="text-xs text-zinc-500">
                  Use points to apply to tuitions, unlock teacher/student contacts, and direct message.
                </p>
              </div>

              {/* Package Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {POINT_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage === pkg.price;
                  return (
                    <button
                      key={pkg.price}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.price)}
                      className={`relative text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#0F5B47] bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-[#0F5B47]/20 shadow-md"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-emerald-500/40"
                      } ${pkg.highlight ? "sm:col-span-2 bg-gradient-to-r from-amber-500/5 via-white to-amber-500/5 dark:from-amber-950/20 dark:to-zinc-900" : ""}`}
                    >
                      {pkg.tag && (
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-xs">
                          {pkg.tag}
                        </span>
                      )}

                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-zinc-900 dark:text-white">
                          {pkg.title}
                        </span>
                        <span className="text-sm font-black text-[#0F5B47] dark:text-emerald-400">
                          ৳ {pkg.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 text-xs font-black mb-1.5">
                        <Zap className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{pkg.points} Points</span>
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                        {pkg.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                  Select Instant Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "bKash", name: "bKash", color: "text-pink-600 border-pink-200 dark:border-pink-900" },
                    { id: "Nagad", name: "Nagad", color: "text-orange-600 border-orange-200 dark:border-orange-900" },
                    { id: "Card", name: "Card / Bank", color: "text-blue-600 border-blue-200 dark:border-blue-900" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-3 px-2 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === m.id
                          ? "bg-[#0F5B47] text-white border-[#0F5B47] shadow-md"
                          : `bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 ${m.color}`
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep("PAYMENT")}
                  className="w-full py-3.5 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Pay ৳{currentPkg.price}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === "PAYMENT" && (
            <div className="space-y-5">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Selected Package:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{currentPkg.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Points to Add:</span>
                  <span className="font-black text-amber-500 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-500" /> {currentPkg.points} Pts
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Payment Channel:</span>
                  <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{paymentMethod} Gateway</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-sm font-extrabold text-zinc-900 dark:text-white">Total Payable:</span>
                  <span className="text-base font-black text-[#0F5B47] dark:text-emerald-400">
                    ৳ {currentPkg.price}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {paymentMethod} Account Number:
                </label>
                <input
                  type="text"
                  placeholder="e.g. 017XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
                />
                <p className="text-[10px] text-zinc-400">
                  Secured 256-bit encrypted simulated checkout for Instant Point Crediting.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("SELECT")}
                  disabled={loading}
                  className="w-1/3 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-extrabold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={loading}
                  className="w-2/3 py-3.5 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay ৳{currentPkg.price} & Top Up</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "SUCCESS" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-[#0F5B47] dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                  Payment Successful!
                </h3>
                <p className="text-xs text-zinc-500">
                  <strong>+{purchasedPoints} Points</strong> have been added to your wallet.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-300/40 text-amber-700 dark:text-amber-300 text-sm font-black">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span>New Balance: {newBalance} Points</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3.5 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-extrabold text-sm rounded-2xl transition-all shadow-md cursor-pointer"
                >
                  Continue & Unlock Contacts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-150 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe & Secure Payments
          </span>
          <span>10 Pts = 1 Contact / Application</span>
        </div>
      </div>
    </div>
  );
}
