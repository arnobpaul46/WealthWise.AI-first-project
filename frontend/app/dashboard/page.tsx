"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions, updateBudgetApi } from '@/services/api';
import { Save, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Wallet, Loader2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [budgetInput, setBudgetInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('wealthwise_user_id'));
  }, []);

  const { data: resp, isLoading, refetch } = useQuery({
    queryKey: ["monthly-data", userId],
    queryFn: async () => {
      const now = new Date();
      const res = await fetchTransactions(userId!, now.getMonth(), now.getFullYear());
      return res.data;
    },
    enabled: !!userId
  });

  const transactions = resp?.data || [];
  const monthlyBudget = resp?.monthlyBudget || 0;

  const stats = useMemo(() => {
    const inc = transactions.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount || 0), 0);
    const exp = transactions.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount || 0), 0);
    return { 
      inc, exp, bal: inc - exp, 
      budgetLeft: Number(monthlyBudget) - exp, 
      isAlert: exp > Number(monthlyBudget) && Number(monthlyBudget) > 0 
    };
  }, [transactions, monthlyBudget]);

  // চার্টের জন্য ডাটা তৈরি
  const chartData = [
    { name: 'Income', amount: stats.inc, color: '#10b981' },
    { name: 'Expense', amount: stats.exp, color: '#ef4444' },
    { name: 'Budget', amount: Number(monthlyBudget), color: '#6366f1' },
  ];

  const handleBudgetUpdate = async () => {
    if (!budgetInput) return;
    try {
      await updateBudgetApi(userId!, Number(budgetInput));
      toast.success("Budget Updated!");
      refetch();
      setBudgetInput("");
    } catch (e) { toast.error("Update failed"); }
  };

  if (isLoading) return <div className="p-10 text-indigo-500 font-bold flex items-center gap-2"><Loader2 className="animate-spin" /> Syncing Dashboard...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ১. বাজেট ইনপুট এবং ওয়ার্নিং */}
      <div className="bg-[#161e2f] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Wallet className="text-indigo-400" />
          <input type="number" placeholder={`Current Limit: $${monthlyBudget}`} className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-white w-full outline-none focus:border-indigo-500" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
          <button onClick={handleBudgetUpdate} className="bg-indigo-600 p-2 rounded-lg text-white hover:bg-indigo-500 transition-all"><Save size={18} /></button>
        </div>
        {stats.isAlert && (
          <div className="bg-red-500/20 text-red-500 px-4 py-2 rounded-xl flex items-center gap-2 font-bold animate-pulse">
            <AlertTriangle size={18} /> Budget Exceeded! (Limit: ${monthlyBudget})
          </div>
        )}
      </div>

      {/* ২. সামারি কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL INCOME', val: stats.inc, color: 'text-emerald-500', icon: TrendingUp },
          { label: 'TOTAL EXPENSES', val: stats.exp, color: 'text-red-500', icon: TrendingDown },
          { label: 'NET SAVINGS', val: stats.bal, color: 'text-white', icon: DollarSign },
          { label: 'BUDGET LEFT', val: Math.max(stats.budgetLeft, 0), color: 'text-indigo-400', icon: Wallet }
        ].map(c => (
          <div key={c.label} className="bg-[#161e2f] border border-slate-800 p-5 rounded-xl">
            <p className="text-[10px] font-bold text-slate-500 flex justify-between uppercase tracking-wider">{c.label} <c.icon size={12} /></p>
            <h3 className={`text-2xl font-black mt-2 ${c.color}`}>${c.val.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      {/* ৩. চার্ট সেকশন (Bar Chart) */}
      <div className="bg-[#161e2f] border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-8">
            <BarChart3 className="text-indigo-500" size={20} />
            <h3 className="text-white font-bold uppercase text-xs tracking-widest">Financial Comparison (This Month)</h3>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#1e293b'}}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }} 
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#161e2f] border border-slate-800 p-6 rounded-2xl text-center text-slate-500 text-sm italic">
        {transactions.length > 0 ? `Showing analysis for ${transactions.length} transactions.` : "Add transactions to see chart analysis."}
      </div>
    </div>
  );
}