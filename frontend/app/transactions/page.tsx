"use client";
import React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTransactions, deleteTransaction } from '@/services/api';
import { Trash2, Calendar, Tag, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
// Import your auth hook – adjust the path to your actual auth provider
import { useAuth } from '@/contexts/AuthContext'; 

export default function TransactionsPage() {
  const { user } = useAuth(); // get the current user object
  const userId = user?.id || ''; // extract userId (fallback to empty string)
  const queryClient = useQueryClient();

  const { data: resp, isLoading } = useQuery({
    queryKey: ["transactions", userId], // include userId in key to refetch when user changes
    queryFn: () => fetchTransactions(userId).then(res => res.data),
    enabled: !!userId, // only run the query if we have a userId
  });

  const transactions = resp?.data || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction Removed");
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
    } catch (e) { toast.error("Delete failed"); }
  };

  if (isLoading) return <div className="p-10 text-center text-indigo-400">Loading History...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <h1 className="text-2xl font-bold text-white">Transaction History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {transactions.map((tx: any) => (
          <div key={tx._id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500 transition-all">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tx.type === 'income' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                  {tx.type.toUpperCase()}
                </span>
                <button onClick={() => handleDelete(tx._id)} className="text-slate-500 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-white font-bold truncate">{tx.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Tag className="h-3 w-3" /> {tx.category}
              </div>
            </div>
            <div className="mt-6 border-t border-slate-800 pt-4 flex justify-between items-center">
              <span className="text-xl font-black text-white">${tx.amount.toFixed(2)}</span>
              <span className="text-[10px] text-slate-600 font-mono">{new Date(tx.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      {transactions.length === 0 && <div className="text-center py-20 text-slate-500">No transactions found.</div>}
    </div>
  );
}