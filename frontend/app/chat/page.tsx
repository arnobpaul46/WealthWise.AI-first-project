"use client";
import React, { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import { Send, Bot, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIChatPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('wealthwise_user_id') : null;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (customMsg?: string) => {
    const msgText = customMsg || input;
    if (!msgText.trim() || !userId) return;

    setMessages(prev => [...prev, { role: 'user', content: msgText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post('/users/chat', { message: msgText, userId });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
    } catch (e) {
      toast.error("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How much did I spend this month?",
    "What is my biggest expense category?",
    "Am I on track with my savings?",
    "Where can I cut my spending?",
    "What is my savings rate?"
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-[#0f172a]/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-[#161e2f]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg"><Bot className="text-white w-5 h-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Finance Chat</h2>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Agent: Gemini 1.5</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        {/* ১ম ইমেজের মতো ওয়েলকাম সেকশন */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700 shadow-2xl">
              <MessageSquare className="w-10 h-10 text-indigo-500 opacity-80" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">WealthWise AI</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2">
                I have access to your financial data this month. Ask me anything about your spending, savings, or budgets.
              </p>
            </div>
            
            {/* সাজেশান চিপস - ১ম ইমেজের মতো */}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSendMessage(s)}
                  className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full text-[11px] text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* চ্যাট মেসেজগুলো */}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-800/80 text-slate-200 border border-slate-700 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-3">
              <Loader2 className="animate-spin h-4 w-4 text-indigo-500" />
              <span className="text-xs text-slate-400 animate-pulse">Analyzing your financial records...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <div className="p-6 bg-[#161e2f]/30 border-t border-slate-800/50">
        <div className="relative max-w-4xl mx-auto flex items-center">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="What is my biggest expense category?" 
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pr-14 text-white placeholder-slate-600 outline-none focus:ring-2 ring-indigo-600/50 transition-all shadow-inner" 
          />
          <button 
            onClick={() => handleSendMessage()} 
            disabled={loading || !input.trim()}
            className="absolute right-3 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}