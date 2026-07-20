"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Bot, 
  LogOut, 
  User, 
  LayoutDashboard, 
  PlusCircle, 
  LineChart, 
  History, 
  UserCircle,
  Shield,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavRoute {
  label: string;
  href: string;
  icon?: any; // Fixed: using any for quick build success
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Sync auth state
  useEffect(() => {
    const auth = localStorage.getItem('wealthwise_auth_sim') === 'true';
    setIsLoggedIn(auth);
  }, []);

  const loggedOutRoutes: NavRoute[] = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Security', href: '/#security' }
  ];

  const loggedInRoutes: NavRoute[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', href: '/transactions', icon: History },
    { label: 'Analytics', href: '/dashboard', icon: LineChart },
    { label: 'Profile', href: '/dashboard', icon: UserCircle }
  ];

  const currentRoutes = isLoggedIn ? loggedInRoutes : loggedOutRoutes;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              WealthWise<span className="text-emerald-400">.AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {currentRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link 
                  key={route.label} 
                  href={route.href} 
                  className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{route.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <Link href="/login" className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all">
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <button 
                  onClick={() => {
                    localStorage.setItem('wealthwise_auth_sim', 'false');
                    window.location.href = '/';
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-indigo-500" />
              <span className="text-white font-bold text-lg">WealthWise.AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Agentic AI wealth manager for autonomous finance tracking and predictive growth analytics.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-400 font-medium">
            <h4 className="text-white font-bold mb-2">Product</h4>
            <Link href="/dashboard" className="hover:text-indigo-400">Dashboard</Link>
            <Link href="/transactions" className="hover:text-indigo-400">Analytics</Link>
          </div>
          <div className="text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} WealthWise AI. Bank-level encryption protected.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}