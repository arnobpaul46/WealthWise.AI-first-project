"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  History as HistoryIcon,
  LineChart,
  UserCircle,
  Sparkles,
  LogOut,
  Home,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('wealthwise_auth_sim');
      setIsLoggedIn(storedAuth === 'true');
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 300);
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleToggleAuth = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    localStorage.setItem('wealthwise_auth_sim', String(newState));
    if (newState) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const guestRoutes = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Features', href: '/#features', icon: TrendingUp },
    { label: 'Security', href: '/#security', icon: Shield }
  ];

  const loggedInRoutes = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Add', href: '/dashboard', icon: PlusCircle },
    { label: 'Transactions', href: '/transactions', icon: HistoryIcon },
    { label: 'Analytics', href: '/dashboard', icon: LineChart },
    { label: 'Profile', href: '/dashboard', icon: UserCircle }
  ];

  const currentRoutes = isLoggedIn ? loggedInRoutes : guestRoutes;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Bot className="h-4.5 w-4.5 text-slate-950" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                WealthWise<span className="text-emerald-400">.AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-1">
            {currentRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
              return (
                <Link
                  key={route.label}
                  href={route.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{route.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - Right Side */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleToggleAuth}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Simulate Logout</span>
                </button>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    localStorage.setItem('wealthwise_auth_sim', 'false');
                    router.push('/');
                  }}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden md:flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/25"
                >
                  <span>Get Started</span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-t border-slate-800 mt-3 rounded-lg overflow-hidden"
            >
              <div className="py-2">
                {currentRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Link
                      key={route.label}
                      href={route.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      {Icon && <Icon className="h-5 w-5 text-slate-400" />}
                      <span className="font-medium">{route.label}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-slate-800 my-2"></div>
                
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        handleToggleAuth();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                      <span className="font-medium">Simulate Logout</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        localStorage.setItem('wealthwise_auth_sim', 'false');
                        setMobileMenuOpen(false);
                        router.push('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                      <span className="font-medium">Login</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                    >
                      <span className="font-medium">Get Started</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}