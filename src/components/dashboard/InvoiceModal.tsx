"use client";

import React from "react";
import { X, Printer, CheckCircle, ShieldCheck } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    studentName: string;
    classLevel: string;
    subject: string;
    month: string;
    amount: number;
    status: "Paid" | "Pending";
    paymentMethod?: string;
    paidAt?: string;
    tutorName?: string;
  };
}

export default function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#0F5B47] text-white flex items-center justify-center font-black text-xs">
              TK
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                TutorKhujo Verified Invoice
              </h3>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Receipt ID: #{invoice.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable Area */}
        <div id="printable-receipt" className="space-y-6 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40">
          
          {/* Status Stamp */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {invoice.month} Tuition Fee
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-xs flex items-center gap-1 ${
                invoice.status === "Paid"
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-500 text-white"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {invoice.status}
            </span>
          </div>

          {/* Amount Box */}
          <div className="text-center py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">
              Total Amount Received
            </span>
            <div className="text-3xl font-black text-[#0F5B47] dark:text-[#188c6e]">
              ৳ {invoice.amount.toLocaleString()} BDT
            </div>
            {invoice.paymentMethod && (
              <span className="text-[10px] font-bold text-zinc-500 block">
                Paid via {invoice.paymentMethod}
              </span>
            )}
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850">
              <span className="text-zinc-400 font-semibold">Student / Guardian</span>
              <span className="font-bold text-zinc-900 dark:text-white">{invoice.studentName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850">
              <span className="text-zinc-400 font-semibold">Class Level</span>
              <span className="font-bold text-zinc-900 dark:text-white">{invoice.classLevel}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-850">
              <span className="text-zinc-400 font-semibold">Subject(s)</span>
              <span className="font-bold text-zinc-900 dark:text-white">{invoice.subject}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400 font-semibold">Date of Payment</span>
              <span className="font-bold text-zinc-900 dark:text-white">
                {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : "Pending"}
              </span>
            </div>
          </div>

          {/* Verified Watermark Footer */}
          <div className="pt-2 text-center flex items-center justify-center space-x-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Digital Receipt generated via TutorKhujo Bangladesh</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-extrabold text-xs rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-teal-500/20 flex items-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Digital Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
}
