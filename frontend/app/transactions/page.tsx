"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  Grid,
  Table as TableIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

const initialTransactions: Transaction[] = [
  { id: '1', date: '2026-07-20', title: 'Monthly Salary Partner', category: 'Salary', amount: 4500, type: 'income' },
  { id: '2', date: '2026-07-19', title: 'Costco Wholesale Corp', category: 'Groceries', amount: 154.50, type: 'expense' },
  { id: '3', date: '2026-07-18', title: 'Landlord Housing Rent', category: 'Housing', amount: 1200, type: 'expense' },
  { id: '4', date: '2026-07-17', title: 'Starbucks Coffee Roasters', category: 'Food & Dining', amount: 6.80, type: 'expense' },
  { id: '5', date: '2026-07-15', title: 'Consulting Contract Payout', category: 'Client Work', amount: 1250, type: 'income' },
  { id: '6', date: '2026-07-14', title: 'Uber Transportation', category: 'Transport', amount: 24.20, type: 'expense' },
  { id: '7', date: '2026-07-12', title: 'Spotify Premium Music', category: 'Entertainment', amount: 14.99, type: 'expense' },
  { id: '8', date: '2026-07-10', title: 'Chevron Gasoline Station', category: 'Transport', amount: 45.00, type: 'expense' },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  const handleDelete = (id: string) => {
    const deletedTx = transactions.find(t => t.id === id);
    setTransactions(transactions.filter((t) => t.id !== id));
    if (deletedTx) {
      triggerNotification(`Removed transaction: "${deletedTx.title}" successfully.`);
    }
  };

  const categories = ['All', ...Array.from(new Set(transactions.map((t) => t.category)))];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-8 py-6 bg-slate-950 text-slate-100">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Transactions Management</h1>
          <p className="text-xs text-slate-400">View, search, filter, and delete transaction ledgers manually.</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'table' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'cards' ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Explore Cards</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-indigo-300 text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="finance-card grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 finance-input"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full finance-input !py-2.5 text-slate-300"
          >
            <option disabled>Filter by Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat} Records</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full finance-input !py-2.5 text-slate-300"
          >
            <option value="All">All Types</option>
            <option value="income">Incomes only</option>
            <option value="expense">Expenses only</option>
          </select>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 finance-card flex flex-col items-center gap-3 text-slate-400"
          >
            <AlertCircle className="h-10 w-10 text-slate-500 animate-bounce" />
            <h3 className="text-sm font-bold text-slate-300">No Transaction Records Found</h3>
            <p className="text-xs text-slate-500">Try modifying search filters or input new entries in the AI Dashboard.</p>
          </motion.div>
        ) : viewMode === 'table' ? (

          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="finance-card !p-0 overflow-hidden text-slate-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 font-bold text-slate-400">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium flex items-center gap-1.5 text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {tx.date}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-100">{tx.title}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950/40 border border-indigo-500/20 text-indigo-400">
                          <Tag className="h-2.5 w-2.5 text-indigo-400" />
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black font-mono">
                        <span className={`flex items-center ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-300'
                          }`}>
                          {tx.type === 'income' ? '+' : '-'}
                          <DollarSign className="h-3 w-3" />
                          {tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (

          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="finance-card flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {tx.date}
                    </span>
                    <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${tx.type === 'income'
                      ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400'
                      : 'bg-red-950/40 border border-red-500/20 text-red-400'
                      }`}>
                      {tx.type === 'income' ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      <span className="capitalize">{tx.type}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{tx.title}</h4>
                    <span className="inline-flex items-center gap-1 text-[9px] text-indigo-400 mt-1 font-semibold">
                      <Tag className="h-2.5 w-2.5" />
                      {tx.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4">
                  <span className="text-sm font-black font-mono text-white">${tx.amount.toFixed(2)}</span>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="finance-card">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-sm font-bold text-white">Featured Transactions</h3>
            <span className="text-[10px] text-slate-500 block font-medium">Recent high-value transactions</span>
          </div>
          <Plus className="h-4 w-4 text-indigo-400" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialTransactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="finance-card flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{tx.date}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tx.type === 'income'
                    ? 'bg-emerald-950/40 text-emerald-400'
                    : 'bg-red-950/40 text-red-400'
                    }`}>
                    {tx.type}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-2">{tx.title}</h4>
                <span className="inline-flex items-center gap-1 text-[9px] text-indigo-400 font-semibold">
                  <Tag className="h-2.5 w-2.5" />
                  {tx.category}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3">
                <span className="text-sm font-black font-mono text-white">${tx.amount.toFixed(2)}</span>
                <button className="p-1 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer">
                  <TrendingUp className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}