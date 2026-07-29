"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from '@/services/api';
import { FileText, Sparkles, TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react';

export default function ReportsPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('wealthwise_user_id') : null;

    const { data: resp, isLoading } = useQuery({
        queryKey: ["transactions", userId],
        queryFn: () => {
            const now = new Date();
            return fetchTransactions(userId!, now.getMonth(), now.getFullYear()).then(res => res.data);
        },
        enabled: !!userId
    });

    const transactions = resp?.data || [];
    const monthlyBudget = resp?.monthlyBudget || 0;

    // ১. রিপোর্ট ক্যালকুলেশন লজিক
    const stats = useMemo(() => {
        const inc = transactions
            .filter((t: any) => t.type === 'income')
            .reduce((s: number, t: any) => s + t.amount, 0); // এখানে (s: number, t: any) যোগ করুন

        const exp = transactions
            .filter((t: any) => t.type === 'expense')
            .reduce((s: number, t: any) => s + t.amount, 0);
        const saved = inc - exp;
        const rate = inc > 0 ? Math.round((saved / inc) * 100) : 0;
        const topCat = transactions.filter((t: any) => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0]?.category || "General";

        return { inc, exp, saved, rate, topCat, status: saved >= 0 ? 'Surplus' : 'Deficit' };
    }, [transactions]);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setReportReady(true);
        }, 2000);
    };

    if (isLoading) return <div className="p-10 text-indigo-400">Syncing with Ledger...</div>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Reports</h1>
                    <p className="text-slate-500 text-sm">Monthly financial insights</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                >
                    {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    Generate this month
                </button>
            </div>

            {reportReady ? (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-[#161e2f] border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        {/* status badge */}
                        <div className="absolute top-8 right-8">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold ${stats.status === 'Surplus' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                                {stats.status}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">July 2026</h2>
                        <p className="text-slate-500 text-sm mb-8">Monthly AI Analytics Report</p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Income</p>
                                <h3 className="text-2xl font-black text-emerald-500 mt-1">${stats.inc.toLocaleString()}</h3>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Expenses</p>
                                <h3 className="text-2xl font-black text-red-500 mt-1">${stats.exp.toLocaleString()}</h3>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Saved</p>
                                <h3 className="text-2xl font-black text-indigo-400 mt-1">${stats.saved.toLocaleString()}</h3>
                            </div>
                        </div>

                        {/* Savings Rate Bar */}
                        <div className="space-y-3 mb-10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold">Savings rate</span>
                                <span className="text-indigo-400 font-bold">{stats.rate}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${stats.rate}%` }}></div>
                            </div>
                        </div>

                        {/* AI Summary Section - হুবহু ইমেজের মতো */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                <Sparkles size={16} /> AI SUMMARY
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed bg-slate-900/30 p-6 rounded-2xl border border-slate-800/50 italic">
                                In July 2026, your total income was <span className="text-emerald-400 font-bold">${stats.inc.toLocaleString()}</span>,
                                with total expenses amounting to <span className="text-red-400 font-bold">${stats.exp.toLocaleString()}</span>,
                                resulting in a net savings of <span className="text-indigo-400 font-bold">${stats.saved.toLocaleString()}</span> and
                                a savings rate of {stats.rate}%. Notably, the largest spending category was <span className="text-white font-bold">"{stats.topCat}"</span>.
                                {stats.status === 'Surplus'
                                    ? " To enhance your savings further, consider moving these surplus funds into a high-yield investment account."
                                    : " Warning: Your expenses exceeded your income. I suggest reviewing your discretionary spending immediately."}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-[#161e2f] border border-slate-800 rounded-3xl p-20 text-center flex flex-col items-center gap-4">
                    <div className="bg-slate-900 p-5 rounded-full border border-slate-800 shadow-xl"><FileText className="text-slate-700 h-10 w-10" /></div>
                    <div>
                        <h3 className="text-white font-bold text-lg">No report generated yet</h3>
                        <p className="text-slate-500 text-sm mt-1">Click the button above to analyze your monthly finances.</p>
                    </div>
                </div>
            )}
        </div>
    );
}