"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { processWithAI } from "@/services/api";
import { getUserId } from "@/src/lib/user";

interface TransactionData {
  _id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

interface AIAgentInputProps {
  userId?: string;
  onTransactionAdded?: (transaction: TransactionData) => void;
}

export default function AIAgentInput({
  userId,
  onTransactionAdded,
}: AIAgentInputProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<TransactionData | null>(null);

  const resolvedUserId = userId ?? getUserId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const response = await processWithAI(inputText.trim(), resolvedUserId);
      const result = response.data; // AxiosResponse থেকে আসল ডাটা বের করলাম

      if (result?.success) {
        const transaction = result.data;
        setSuccessData(transaction);
        setInputText("");
        toast.success(`Logged: ${transaction.title} ($${transaction.amount.toFixed(2)})`);
        onTransactionAdded?.(transaction);
      } else {
        const message = result?.message || "AI was unable to process the transaction.";
        setError(message);
        toast.error(message);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to connect to the AI service. Ensure the backend is running.";
      console.error("Error processing transaction with AI:", err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="finance-card w-full max-w-xl mx-auto shadow-xl shadow-slate-950/20">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8.5 w-8.5 rounded-xl bg-indigo-950 border border-indigo-500/20 flex items-center justify-center">
          <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-100">Agentic AI Transaction Logger</h3>
          <p className="text-[10px] text-slate-400">Describe what you earned or spent in plain English</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder='e.g., "Received my salary payment of $4500 yesterday" or "Spent 35.50 on grocery shopping at Costco"'
            className="w-full h-24 finance-input !p-4 resize-none transition-colors duration-200 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="absolute bottom-3 right-3 px-3 py-2 rounded-xl finance-btn-primary !p-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[10px] hidden sm:inline">Submit</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span className="text-[10px] hidden sm:inline">Submit</span>
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
              <span className="text-[10px] text-indigo-300 font-medium font-mono">AI is thinking...</span>
            </div>
            <span className="text-[9px] text-slate-500 animate-pulse font-mono">Gemini 1.5 Flash</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl border border-red-900/60 bg-red-950/15 flex items-start gap-3 text-red-400"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold">Extraction Failed</h4>
              <p className="text-[11px] text-red-300/80 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-100">Transaction Parsed & Logged</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">
                ID: {successData._id.slice(-6)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-medium block">Title</span>
                <span className="text-sm font-semibold text-slate-200">{successData.title}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-medium block">Amount</span>
                <span className="text-sm font-bold text-slate-200 flex items-center">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  {successData.amount.toFixed(2)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-medium block">Type</span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${successData.type === "income"
                      ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400"
                      : "bg-red-950/40 border border-red-500/20 text-red-400"
                    }`}
                >
                  {successData.type === "income" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="capitalize">{successData.type}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-medium block">Category</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md font-medium">
                  <Tag className="h-3 w-3" />
                  {successData.category}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
