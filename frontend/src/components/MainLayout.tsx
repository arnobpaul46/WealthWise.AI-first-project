"use client";

import React, { useState } from 'react';
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
  HelpCircle,
  Shield,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define route lists
  const loggedOutRoutes = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' }
  ];

  const loggedInRoutes = [
    { label: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
    { label: 'Add Transaction', href: '#add-transaction', icon: PlusCircle },
    { label: 'Analytics', href: '#analytics', icon: LineChart },
    { label: 'History', href: '#history', icon: History },
    { label: 'Profile', href: '#profile', icon: UserCircle }
  ];

  const currentRoutes = isLoggedIn ? loggedInRoutes : loggedOutRoutes;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* --- STICKY NAVBAR --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-dark">
              Wealthwise<span className="text-primary">.ai</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            {currentRoutes.map((route) => {
              const Icon = 'icon' in route ? route.icon : null;
              return (
                <a 
                  key={route.label} 
                  href={route.href} 
                  className="hover:text-primary transition-colors duration-200 flex items-center gap-1.5"
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span>{route.label}</span>
                </a>
              );
            })}
          </div>

          {/* User Auth Buttons / Simulation Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Simulate {isLoggedIn ? "Logout" : "Login"}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <User className="h-4.5 w-4.5 text-slate-600" />
                </div>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-primary hover:bg-indigo-700 text-white shadow-sm shadow-primary/10 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 px-6 py-6 flex flex-col gap-5 shadow-lg"
            >
              {currentRoutes.map((route) => {
                const Icon = 'icon' in route ? route.icon : null;
                return (
                  <a 
                    key={route.label} 
                    href={route.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-600 hover:text-primary font-semibold text-sm transition-colors flex items-center gap-2.5"
                  >
                    {Icon && <Icon className="h-4.5 w-4.5 text-slate-400" />}
                    <span>{route.label}</span>
                  </a>
                );
              })}
              <div className="h-px bg-slate-100 w-full my-1" />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsLoggedIn(!isLoggedIn);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-400 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Simulate {isLoggedIn ? "Logout" : "Login"}
                </button>
                {!isLoggedIn && (
                  <button 
                    onClick={() => {
                      setIsLoggedIn(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-xs text-center cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* State Information Toast */}
        <div className="mb-6 p-3 px-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-700 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Navbar View State: <strong>{isLoggedIn ? "Logged-In Menu Mode" : "Logged-Out Menu Mode"}</strong></span>
          </div>
          <button 
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="font-bold underline cursor-pointer hover:text-indigo-900"
          >
            Toggle State
          </button>
        </div>

        {children}
      </main>

      {/* --- FUNCTIONAL FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Wealthwise<span className="text-primary">.ai</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Next-generation AI wealth manager implementing autonomous data pipelines, predictive cash flows, and secure asset ledger systems.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold pt-2">
              <span className="flex items-center gap-1 text-slate-300">
                <Shield className="h-3.5 w-3.5 text-secondary" />
                FDIC Protection
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                SIPC Coverage
              </span>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Options</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security Audits</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#api" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Wealth Blog</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Newsletter</h4>
            <p className="text-xs">Subscribe to receive smart saving updates weekly.</p>
            <div className="flex items-center gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-primary placeholder-slate-600"
              />
              <button className="px-4 py-2 rounded-lg bg-primary hover:bg-indigo-700 text-white font-bold text-xs">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Footer Sub-bottom */}
        <div className="border-t border-slate-800/60 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span>&copy; {new Date().getFullYear()} Wealthwise AI Inc. All rights reserved.</span>
            </div>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:underline">Privacy Policy</a>
              <a href="#terms" className="hover:underline">Terms of Service</a>
              <a href="#cookies" className="hover:underline">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
