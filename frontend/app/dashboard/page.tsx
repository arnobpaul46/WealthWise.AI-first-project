"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Bot, Loader2, Brain, Send, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTransactions, processWithAI } from "@/services/api";
import { getUserId } from "@/src/lib/user";
import { calculateTotals, groupByMonth, groupByCategory, formatCurrency } from "@/src/lib/transactions";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState(""); // স্টেট এর নাম inputText
  const [aiLoading, setAiLoading] = useState(false);
  const queryClient = useQueryClient();
  const userId = getUserId();

  useEffect(() => { setMounted(true); }, []);

  // dashboard/page.tsx এর ভেতরে useQuery আপডেট করুন
  // dashboard/page.tsx এর ভেতরে useQuery সেকশনটি এভাবে আপডেট করুন
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      // ব্যাকএন্ড এখন { success: true, data: [...] } পাঠাচ্ছে
      // তাই আমাদের response.data.data নিতে হবে
      return (response.data?.data ?? []) as any[];
    },
    enabled: mounted,
  });

  const transactions = data ?? [];
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const monthlyData = useMemo(() => groupByMonth(transactions), [transactions]);
  const categoryData = useMemo(() => groupByCategory(transactions), [transactions]);

  const handleAISubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setAiLoading(true);
      await processWithAI(inputText); // এটি এখন সরাসরি কাজ করবে
      setInputText("");
      toast.success("AI categorized and saved your transaction!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // ডাটা রিফ্রেশ
    } catch (error) {
      console.error(error);
      toast.error("AI processing failed. Check backend.");
    } finally {
      setAiLoading(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse text-indigo-400">Loading Dashboard...</div>;

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto">
      {/* AI Input Section */}
      <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg"><Brain className="h-5 w-5 text-white" /></div>
          <h3 className="text-lg font-bold text-slate-100">Talk to WealthWise AI</h3>
        </div>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='e.g., "Spent 500 on dinner yesterday"'
            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAISubmit()}
          />
          <button
            onClick={() => handleAISubmit()}
            disabled={aiLoading || !inputText.trim()}
            className="absolute bottom-4 right-4 bg-indigo-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all"
          >
            {aiLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
            Submit
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase font-bold">Total Balance</p>
          <h2 className="text-3xl font-black mt-2 text-white">{formatCurrency(totals.balance)}</h2>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase font-bold text-red-400">Expenses</p>
          <h2 className="text-3xl font-black mt-2 text-white">{formatCurrency(totals.expenses)}</h2>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase font-bold text-emerald-400">Income</p>
          <h2 className="text-3xl font-black mt-2 text-white">{formatCurrency(totals.income)}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl h-[350px]">
          <h4 className="font-bold mb-4">Monthly Overview</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}><Area type="monotone" dataKey="Expenses" stroke="#6366f1" fill="#6366f133" /><XAxis dataKey="name" /><Tooltip /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl h-[350px]">
          <h4 className="font-bold mb-4">Spending Categories</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}><Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} /><XAxis dataKey="name" /><Tooltip /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}