"use client";

import React, { useState } from "react";
import {
  Download,
  Loader2,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { downloadElementAsPdf } from "@/lib/pdfDownloader";

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  status: string;
  type?: string;
  customer: {
    name: string;
    email: string;
    mobile?: string;
    role?: string;
    rewardPoints?: number;
  };
  paymentDetails: {
    method: string;
    trxId: string;
    paidAt?: string;
    amount: number;
    currency?: string;
  };
  items: Array<{
    description: string;
    points?: number | null;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  company?: {
    name: string;
    slogan?: string;
    address: string;
    email: string;
    website: string;
    helpline?: string;
    tradeLicense?: string;
  };
}

interface InvoiceDocumentProps {
  data: InvoiceData;
  showDownloadAction?: boolean;
  elementId?: string;
}

export default function InvoiceDocument({
  data,
  showDownloadAction = true,
  elementId = "official-invoice",
}: InvoiceDocumentProps) {
  const [downloading, setDownloading] = useState<boolean>(false);

  const formattedDate = data.issueDate
    ? new Date(data.issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  const handleDirectDownload = async () => {
    try {
      setDownloading(true);
      const filename = `TutorKhojo_Invoice_${data.invoiceNumber || "Receipt"}.pdf`;
      await downloadElementAsPdf(elementId, filename);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 font-sans">
      {/* Direct Download Action Bar */}
      {showDownloadAction && (
        <div className="flex items-center justify-between bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-sm border border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-zinc-300">
              Tax Invoice: <strong className="font-mono text-white">{data.invoiceNumber}</strong>
            </span>
          </div>

          <button
            onClick={handleDirectDownload}
            disabled={downloading}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5B47] hover:bg-[#0c4a39] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Downloading PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Invoice (PDF)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Ultra-Clean Modern Invoice Sheet */}
      <div
        id={elementId}
        className="bg-white text-zinc-900 p-8 sm:p-12 rounded-3xl border border-zinc-200/90 shadow-sm relative overflow-hidden"
        style={{ colorScheme: "light" }}
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-zinc-150">
          {/* Brand */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0F5B47] text-white font-black text-sm flex items-center justify-center tracking-tight">
                TK
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900">
                Tutor<span className="text-[#F26A1B]">Khojo</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              Official Electronic Receipt & Invoice
            </p>
          </div>

          {/* Invoice Meta */}
          <div className="sm:text-right space-y-1">
            <div className="flex sm:justify-end items-center gap-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                Invoice
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {data.status || "PAID"}
              </span>
            </div>

            <p className="text-base font-black font-mono text-zinc-900">
              {data.invoiceNumber}
            </p>

            <div className="text-xs text-zinc-500 font-medium space-x-2">
              <span>Date: <strong className="text-zinc-700 font-semibold">{formattedDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Addresses & Transaction Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-zinc-150 text-xs">
          {/* Billed To */}
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Billed To
            </p>
            <p className="text-sm font-black text-zinc-900">
              {data.customer.name || "Customer"}
            </p>
            <p className="text-zinc-500 font-medium">{data.customer.email}</p>
            {data.customer.mobile && (
              <p className="text-zinc-500 font-mono">{data.customer.mobile}</p>
            )}
            <p className="text-[10px] font-semibold text-zinc-400 uppercase pt-0.5">
              Account: {data.customer.role || "User"}
            </p>
          </div>

          {/* Payment & Issuer Details */}
          <div className="sm:text-right space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              Payment Details
            </p>
            <p className="text-zinc-700 font-semibold">
              Method: <strong className="text-zinc-900 font-bold">{data.paymentDetails.method}</strong>
            </p>
            <p className="text-zinc-500 font-mono">
              TrxID: {data.paymentDetails.trxId}
            </p>
            <p className="text-zinc-400 text-[11px] pt-1">
              Issued by: <strong>TutorKhojo Bangladesh Ltd.</strong>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-center">Reward Credits</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {data.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-2">
                    <p className="font-bold text-zinc-900">{item.description}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Standard Instant Recharge & Digital Activation
                    </p>
                  </td>
                  <td className="py-4 px-2 text-center font-bold text-amber-600">
                    {item.points ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[11px] font-bold">
                        <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                        +{item.points} Pts
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-4 px-2 text-center text-zinc-600 font-medium">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-2 text-right font-black text-zinc-900 text-sm tabular-nums">
                    ৳ {item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="pt-4 border-t border-zinc-150 flex justify-end">
          <div className="w-full sm:w-60 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal:</span>
              <span className="font-bold text-zinc-800 tabular-nums">
                ৳ {data.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>VAT / Platform Fee (0%):</span>
              <span className="font-bold text-zinc-800 tabular-nums">৳ 0.00</span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-900 border-t border-zinc-200 pt-2.5">
              <span>Total Paid:</span>
              <span className="text-[#0F5B47] tabular-nums">
                ৳ {data.total.toLocaleString()} BDT
              </span>
            </div>
          </div>
        </div>

        {/* Understated Minimalist Footer */}
        <div className="mt-12 pt-6 border-t border-zinc-150 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
          <p>
            Questions? Contact billing at{" "}
            <a href="mailto:support@tutorkhojo.com" className="text-zinc-600 font-semibold underline">
              support@tutorkhojo.com
            </a>
          </p>
          <p className="text-[10px] text-zinc-400">
            Electronic Tax Invoice • No physical signature required.
          </p>
        </div>
      </div>
    </div>
  );
}
