"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, Send, Loader2, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchTransactions, processWithAI } from '@/services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const queryClient = useQueryClient();

  // ১. লোকাল স্টোরেজ থেকে আইডি নেওয়া
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => { setUserId(localStorage.getItem('wealthwise_user_id')); }, []);

  // ২. ডাটা ফেচ করা
  const { data: resp } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => fetchTransactions(userId!).then(res => res.data),
    enabled: !!userId
  });

  const transactions = resp?.data || [];
  
  // ৩. রিয়েল-টাইম ক্যালকুলেশন
  const stats = useMemo(() => {
    const inc = transactions.filter((t:any) => t.type === 'income').reduce((s:number, t:any) => s + t.amount, 0);
    const exp = transactions.filter((t:any) => t.type === 'expense').reduce((s:number, t:any) => s + t.amount, 0);
    return { income: inc, expenses: exp, balance: inc - exp };
  }, [transactions]);

  // ৪. সাবমিট হ্যান্ডলার (নিশ্চিত করে আইডি পাঠানো হচ্ছে)
  const handleAISubmit = async () => {
    if (!inputText.trim() || !userId) return;
    setLoading(true);
    try {
      const res = await processWithAI(inputText, userId);
      if (res.data.success) {
        setSuggestion(res.data.suggestion);
        toast.success(res.data.data.type === 'income' ? "Income Added!" : "Expense Added!");
        setInputText("");
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }
    } catch (e) {
      toast.error("Process interrupted, try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4">
      {/* ডিজাইন আগের মতোই থাকবে */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2"><Brain className="text-indigo-500" /> AI Wealth Agent</h2>
        <div className="relative">
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-24 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none" placeholder="Type: 'Salary 5000' or 'Rent 1200'..." />
          <button onClick={handleAISubmit} disabled={loading} className="absolute bottom-4 right-4 bg-indigo-600 px-6 py-2 rounded-xl font-bold text-white flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />} Analyze
          </button>
        </div>
        {suggestion && (
          <div className="mt-4 p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-xl text-indigo-100 flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400 shrink-0" /> <p className="text-sm font-medium italic">{suggestion}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase">Balance</p>
          <h3 className="text-3xl font-black mt-2">${stats.balance.toFixed(2)}</h3>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl border-l-4 border-l-red-500">
          <p className="text-red-400 text-xs font-bold uppercase flex items-center gap-1"><TrendingDown className="h-4 w-4" /> Expenses</p>
          <h3 className="text-3xl font-black mt-2">${stats.expenses.toFixed(2)}</h3>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl border-l-4 border-l-emerald-500">
          <p className="text-emerald-400 text-xs font-bold uppercase flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Income</p>
          <h3 className="text-3xl font-black mt-2">${stats.income.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}