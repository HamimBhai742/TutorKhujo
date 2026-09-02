/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import InvoiceDocument, { InvoiceData } from "./InvoiceDocument";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  trxId?: string | null;
  initialData?: InvoiceData | null;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  trxId,
  initialData,
}: InvoiceModalProps) {
  const [fetchedData, setFetchedData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const activeInvoice = initialData || fetchedData;

  useEffect(() => {
    if (!isOpen || initialData || !trxId) return;

    let isMounted = true;
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/payments/invoice/${trxId}`);
        if (isMounted) {
          if (res.data?.success) {
            setFetchedData(res.data.data);
          } else {
            setError("Could not find invoice details.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to fetch invoice:", err);
          setError(
            err.response?.data?.message || "Failed to load invoice details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInvoice();

    return () => {
      isMounted = false;
    };
  }, [isOpen, trxId, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-zinc-100 dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden my-auto border border-zinc-200 dark:border-zinc-800">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-extrabold tracking-wide">
              Official Tax Receipt & Invoice
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#0F5B47]" />
              <p className="text-xs font-bold">Generating invoice document...</p>
            </div>
          )}

          {error && (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm font-semibold max-w-md mx-auto my-12">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && activeInvoice && (
            <InvoiceDocument
              data={activeInvoice}
              showDownloadAction={true}
              elementId="modal-invoice-document"
            />
          )}
        </div>
      </div>
    </div>
  );
}
