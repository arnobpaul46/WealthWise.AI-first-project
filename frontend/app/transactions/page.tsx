"use client";
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTransactions, createTransactionApi, deleteTransaction } from '@/services/api';
import { Plus, Trash2, Loader2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'expense', category: 'Food' });
  const [userId, setUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUserId(localStorage.getItem('wealthwise_user_id'));
  }, []);

  const { data: resp, refetch } = useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => {
      const now = new Date();
      return fetchTransactions(userId!, now.getMonth(), now.getFullYear()).then(res => res.data);
    },
    enabled: !!userId
  });

  const transactions = resp?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransactionApi({ ...formData, userId });
      toast.success("Saved!");
      // ডাটা সাথে সাথে আপডেট করার জন্য নিচের ২ লাইন মাস্ট:
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-data"] });
      setIsModalOpen(false);
    } catch (e) { toast.error("Fail"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus size={18} /> Add Entry
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {transactions.map((tx: any) => (
          <div key={tx._id} className="bg-[#161e2f] border border-slate-800 p-5 rounded-xl text-white">
            <div className="flex justify-between mb-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${tx.type === 'income' ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>{tx.type}</span>
              <button onClick={async () => { await deleteTransaction(tx._id); refetch(); queryClient.invalidateQueries({ queryKey: ["monthly-data"] }); }} className="text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
            <h4 className="font-bold truncate">{tx.title}</h4>
            <p className="text-xl font-black mt-2">${tx.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-white font-bold text-xl mb-4 text-center">New Transaction</h2>
            <input type="text" placeholder="Title (e.g. Salary)" className="w-full bg-[#161e2f] p-3 rounded-xl text-white border border-slate-700 outline-none" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            <input type="number" step="0.01" placeholder="Amount" className="w-full bg-[#161e2f] p-3 rounded-xl text-white border border-slate-700 outline-none" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <select className="w-full bg-[#161e2f] p-3 rounded-xl text-white border border-slate-700" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select className="w-full bg-[#161e2f] p-3 rounded-xl text-white border border-slate-700" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <option value="Food">Food</option>
              <option value="Salary">Salary</option>
              <option value="Rent">Rent</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-3 rounded-xl text-white font-bold hover:bg-indigo-500">
              {loading ? "Saving..." : "Save Transaction"}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-slate-500 text-sm">Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}