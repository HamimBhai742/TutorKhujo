/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  FileText,
  ArrowRight,
  Zap,
  ShieldCheck,
  Copy,
  Check,
  CreditCard,
  LayoutDashboard,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import InvoiceDocument, { InvoiceData } from "@/components/invoice/InvoiceDocument";
import InvoiceModal from "@/components/invoice/InvoiceModal";
import { downloadElementAsPdf } from "@/lib/pdfDownloader";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { user, refetchUser } = useAuth();

  const trxId = searchParams.get("trxId") || "";
  const queryPoints = searchParams.get("points");
  const queryAmount = searchParams.get("amount");
  const queryMethod = searchParams.get("method");

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [copiedTrx, setCopiedTrx] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (refetchUser) {
      refetchUser();
    }
  }, [refetchUser]);

  useEffect(() => {
    let isMounted = true;

    const fetchInvoiceData = async () => {
      if (!trxId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/payments/invoice/${trxId}`);
        if (res.data?.success && isMounted) {
          setInvoice(res.data.data);
        }
      } catch (err: any) {
        console.error("Failed to load invoice details:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInvoiceData();

    return () => {
      isMounted = false;
    };
  }, [trxId]);

  const handleCopyTrx = () => {
    const textToCopy = invoice?.paymentDetails.trxId || trxId;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedTrx(true);
      setTimeout(() => setCopiedTrx(false), 2000);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const filename = `TutorKhojo_Invoice_${displayInvoiceNo}.pdf`;
      await downloadElementAsPdf("official-invoice", filename);
    } finally {
      setDownloading(false);
    }
  };

  if (loading && !invoice && !queryPoints) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-[#0F5B47] animate-spin" />
          <p className="text-xs font-bold text-zinc-500">Loading payment receipt...</p>
        </div>
      </div>
    );
  }

  const displayPoints =
    invoice?.items?.[0]?.points ||
    (queryPoints ? Number(queryPoints) : null) ||
    100;
  const displayAmount =
    invoice?.total || (queryAmount ? Number(queryAmount) : 99);
  const displayMethod =
    invoice?.paymentDetails?.method || queryMethod || "Instant Gateway";
  const displayTrxId = invoice?.paymentDetails?.trxId || trxId || "TXN-VERIFIED";
  const displayInvoiceNo = invoice?.invoiceNumber || `INV-TK-${displayTrxId.slice(-8)}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ============================================================== */}
        {/* 1. HERO CELEBRATION CARD */}
        {/* ============================================================== */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-12 text-center">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Success Badge */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-4 border-emerald-500/20 text-[#0F5B47] dark:text-emerald-400 flex items-center justify-center shadow-xl animate-in zoom-in duration-300">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md animate-bounce">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified & Fulfilled Instant Payment
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Thank you! Your transaction has been approved and your points pack is now active in your wallet.
            </p>
          </div>

          {/* Key Metrics Breakdown Card */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Points Added
              </span>
              <div className="flex items-center gap-1 mt-1 text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>+{displayPoints} Pts</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Amount Paid
              </span>
              <p className="mt-1 text-base sm:text-lg font-black text-[#0F5B47] dark:text-emerald-400">
                ৳ {displayAmount.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Method
              </span>
              <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                <CreditCard className="w-3.5 h-3.5 text-[#0F5B47]" />
                <span className="truncate">{displayMethod}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                Wallet Balance
              </span>
              <p className="mt-1 text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                {user?.rewardPoints ?? (displayPoints || 0)} Pts
              </p>
            </div>
          </div>

          {/* Transaction Reference & Copy */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 text-xs font-mono text-zinc-700 dark:text-zinc-300">
            <span className="text-zinc-400">TrxID:</span>
            <span className="font-bold text-zinc-900 dark:text-white">{displayTrxId}</span>
            <button
              onClick={handleCopyTrx}
              type="button"
              className="ml-1 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md transition-colors cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              title="Copy Transaction ID"
            >
              {copiedTrx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-6 py-3.5 bg-[#0F5B47] hover:bg-[#0c4a39] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Official Invoice (PDF)</span>
                </>
              )}
            </button>

            <Link
              href={user?.role === "student" ? "/dashboard?tab=invoices" : "/dashboard?tab=earnings"}
              className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs sm:text-sm font-black rounded-2xl transition-all flex items-center gap-2 cursor-pointer border border-zinc-200 dark:border-zinc-700"
            >
              <FileText className="w-4 h-4 text-[#0F5B47]" />
              <span>View Invoices in Dashboard</span>
            </Link>

            <Link
              href={user?.role === "tutor" ? "/tuitions" : "/tutors"}
              className="px-6 py-3.5 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs sm:text-sm font-black rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>{user?.role === "tutor" ? "Browse Tuition Posts" : "Browse Tutors"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. EMBEDDED OFFICIAL INVOICE VIEW */}
        {/* ============================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0F5B47]" />
                Tax Invoice Preview
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Official electronic invoice for your company or personal records.
              </p>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>

          {invoice ? (
            <InvoiceDocument
              data={invoice}
              showDownloadAction={false}
              elementId="official-invoice"
            />
          ) : (
            <InvoiceDocument
              data={{
                invoiceNumber: displayInvoiceNo,
                issueDate: new Date().toISOString(),
                status: "PAID",
                type: "Point Purchase",
                customer: {
                  name: user?.name || "Valued User",
                  email: user?.email || "user@tutorkhojo.com",
                  mobile: user?.mobile || undefined,
                  role: user?.role || "User",
                  rewardPoints: user?.rewardPoints || displayPoints,
                },
                paymentDetails: {
                  method: displayMethod,
                  trxId: displayTrxId,
                  amount: displayAmount,
                  currency: "BDT",
                },
                items: [
                  {
                    description: `TutorKhojo Points Pack (${displayPoints} Reward Credits)`,
                    points: displayPoints,
                    quantity: 1,
                    unitPrice: displayAmount,
                    total: displayAmount,
                  },
                ],
                subtotal: displayAmount,
                discount: 0,
                tax: 0,
                total: displayAmount,
              }}
              showDownloadAction={false}
              elementId="official-invoice"
            />
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. SAFETY & HELP FOOTER */}
        {/* ============================================================== */}
        <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#0F5B47] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">Need help with this purchase?</p>
              <p className="text-[11px] text-zinc-500">Contact billing support at support@tutorkhojo.com or call 09613-828282</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-black text-[#0F5B47] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to My Dashboard</span>
          </Link>
        </div>

      </div>

      {/* Invoice Modal for pop-up preview if needed */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        trxId={trxId}
        initialData={invoice}
      />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-[#0F5B47] animate-spin" />
            <p className="text-xs font-bold text-zinc-500">Loading payment receipt...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
