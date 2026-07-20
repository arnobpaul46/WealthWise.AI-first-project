"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Bot, 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  DollarSign,
  Tag,
  Calendar,
  Users,
  Zap,
  Lock,
  Brain,
  Database,
  LineChart
} from 'lucide-react';

const savingsData = [
  { name: 'Jan', Traditional: 1200, WealthWiseAI: 1850 },
  { name: 'Feb', Traditional: 2100, WealthWiseAI: 3200 },
  { name: 'Mar', Traditional: 2950, WealthWiseAI: 4800 },
  { name: 'Apr', Traditional: 3800, WealthWiseAI: 6500 },
  { name: 'May', Traditional: 4600, WealthWiseAI: 8400 },
  { name: 'Jun', Traditional: 5400, WealthWiseAI: 10500 },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-indigo-400 text-sm font-semibold backdrop-blur">
                <Sparkles className="h-4 w-4" />
                <span>Meet Your Agentic Wealth Architect</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                Self-Driving Money <br />
                <span className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-300 bg-clip-text text-transparent">
                  Engineered for Growth.
                </span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                WealthWise AI parses your conversational inputs naturally, manages budgeting tasks, and organizes your ledger accounts automatically with advanced machine learning.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Link 
                  href="/login"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 group"
                >
                  <span>Try AI Demo</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a 
                  href="#analytics"
                  className="px-8 py-4 bg-slate-900/50 border border-slate-800 text-slate-300 hover:bg-slate-800/50 font-bold rounded-xl transition-all backdrop-blur flex items-center gap-2"
                >
                  <LineChart className="h-5 w-5" />
                  <span>View Analytics</span>
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">wealthwise-ai-v2.0</div>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="flex gap-3">
                    <span className="text-emerald-400 font-semibold">$</span>
                    <p className="text-slate-300">I spent 500 on a new monitor yesterday</p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-indigo-400" />
                      <span className="text-indigo-400 font-semibold">Gemini AI:</span>
                    </div>
                    <div className="text-xs space-y-1 bg-slate-900/60 p-3 rounded border border-slate-800">
                      <p className="text-slate-400">{"{"}</p>
                      <p className="pl-4 text-emerald-400">"title": "Monitor Purchase",</p>
                      <p className="pl-4 text-yellow-400">"amount": 500,</p>
                      <p className="pl-4 text-blue-400">"type": "expense",</p>
                      <p className="pl-4 text-purple-400">"category": "Electronics"</p>
                      <p className="text-slate-400">{"}"}</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Transaction categorized and saved!</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* SECTION 2: FEATURES GRID */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Core Features</h2>
            <p className="text-4xl font-extrabold tracking-tight mb-6">
              Advanced Ledger Intelligence.
            </p>
            <p className="text-lg text-slate-400">
              Powered by cutting-edge AI technology to transform how you manage your finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Natural Language Processing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Describe transactions in plain English. Our AI extracts amounts, categories, and context automatically.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Categorization</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Machine learning automatically categorizes expenses and income with 95% accuracy across all transactions.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Predictive Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI forecasts spending patterns and suggests optimal savings strategies based on your financial behavior.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bank-Level Security</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                256-bit encryption and secure data processing ensure your financial information stays protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI DATA ANALYTICS */}
      <section id="analytics" className="py-20 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Performance Analytics</h2>
              <h3 className="text-4xl font-extrabold tracking-tight leading-tight">
                AI-Driven Savings Growth
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Our intelligent algorithms help users save <span className="text-emerald-400 font-bold">47% more</span> compared 
                to traditional budgeting apps through predictive optimization and automated allocation strategies.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
                  <span className="text-emerald-400 font-extrabold text-2xl block">47%</span>
                  <span className="text-xs text-slate-500 font-medium">Average Savings Increase</span>
                </div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-4">
                  <span className="text-indigo-400 font-extrabold text-2xl block">$8.2K</span>
                  <span className="text-xs text-slate-500 font-medium">Avg Annual Optimization</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-white">Savings Comparison (6 Months)</h4>
                    <span className="text-sm text-slate-500">Traditional budgeting vs WealthWise AI optimization</span>
                  </div>
                </div>

                {mounted ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderColor: '#1e293b',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#f8fafc'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="Traditional" fill="#475569" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="WealthWiseAI" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-sm text-slate-500 bg-slate-900/20 rounded-xl">
                    Loading analytics chart...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 4: AGENT WORKFLOW STEPS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Workflow</h2>
            <p className="text-4xl font-extrabold tracking-tight">
              Intelligent Processing Pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-6 right-6 text-3xl font-black text-slate-800/40">01</div>
              <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Natural Input</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Speak or type transactions naturally: "Bought coffee for $4.50" or "Got paid $3000 salary"
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-6 right-6 text-3xl font-black text-slate-800/40">02</div>
              <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">AI Processing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gemini AI extracts amount, merchant, category, and transaction type with 97% accuracy
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-6 right-6 text-3xl font-black text-slate-800/40">03</div>
              <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Smart Storage</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Data is categorized, encrypted, and stored in optimized MongoDB schemas for fast retrieval
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-6 right-6 text-3xl font-black text-slate-800/40">04</div>
              <div className="h-12 w-12 rounded-xl bg-orange-600 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Insights & Growth</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time analytics, spending predictions, and automated savings recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS */}
      <section className="py-20 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Success Stories</h2>
            <p className="text-4xl font-extrabold tracking-tight">
              Trusted by Financial Professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                "The natural language processing is incredible. I just say 'paid rent $2400' and it's automatically 
                categorized and tracked. Saves hours of manual entry every month."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sarah Martinez</h4>
                  <span className="text-xs text-slate-500">Financial Advisor, Goldman Sachs</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                "WealthWise AI helped me identify spending patterns I never noticed. The predictive analytics 
                suggested changes that increased my savings by 40% in just 3 months."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Michael Roberts</h4>
                  <span className="text-xs text-slate-500">Senior Analyst, JPMorgan Chase</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                "As a CFO, I need precise financial tracking. WealthWise AI's accuracy and automation 
                have streamlined our expense management processes significantly."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center text-white font-bold">
                  LK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lisa Kim</h4>
                  <span className="text-xs text-slate-500">CFO, TechFlow Innovations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 6: PRICING & SECURITY */}
      <section id="security" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Security & Plans</h2>
            <p className="text-4xl font-extrabold tracking-tight">
              Enterprise-Grade Protection
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Security Features */}
            <div className="space-y-8">
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Bank-Level Encryption</h3>
                    <p className="text-sm text-slate-400">256-bit AES encryption for all data</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">FDIC Protected</h3>
                    <p className="text-sm text-slate-400">Your funds are insured up to $250,000</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Real-Time Monitoring</h3>
                    <p className="text-sm text-slate-400">24/7 fraud detection and alerts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-extrabold text-white mb-2">Pro Plan</h3>
              <p className="text-indigo-100 mb-6">Everything you need for smart wealth management</p>
              
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-white">$29</span>
                <span className="text-indigo-200">/month</span>
              </div>

              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span>Unlimited AI transaction processing</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span>Advanced predictive analytics</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span>Real-time spending insights</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span>Multi-account synchronization</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span>Priority customer support</span>
                </li>
              </ul>

              <Link
                href="/register"
                className="w-full bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 px-6 rounded-xl transition-all inline-block"
              >
                Start Free Trial
              </Link>
              
              <p className="text-indigo-200 text-sm mt-4">14-day free trial • No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FOOTER */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  WealthWise<span className="text-emerald-400">.AI</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Next-generation AI wealth manager with autonomous data pipelines, predictive cash flows, 
                and secure asset ledger systems.
              </p>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <span className="flex items-center gap-1 text-slate-300">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  FDIC Protected
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Lock className="h-4 w-4 text-indigo-400" />
                  Bank Security
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#analytics" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">AI Demo</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">Stay Updated</h4>
              <p className="text-sm text-slate-400">Get the latest AI finance insights and product updates.</p>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <span>&copy; {new Date().getFullYear()} WealthWise AI Inc. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}