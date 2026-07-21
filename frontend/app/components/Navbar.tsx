"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, LayoutDashboard, UserCircle, LogOut, Home, TrendingUp, Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('wealthwise_auth_sim') === 'true');

    const handleScroll = () => {
      if (pathname !== '/') return;
      const sections = ['features', 'security'];
      let current = 'home';
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) current = id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const guestRoutes = [
    { label: 'Home', href: '/', id: 'home', icon: Home },
    { label: 'Features', href: '/#features', id: 'features', icon: TrendingUp },
    { label: 'Security', href: '/#security', id: 'security', icon: Shield },
  ];

  const loggedInRoutes = [
    ...guestRoutes,
    { label: 'Dashboard', href: '/dashboard', id: 'dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/profile', id: 'profile', icon: UserCircle },
  ];

  const routes = isLoggedIn ? loggedInRoutes : guestRoutes;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO - Always Visible */}
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-indigo-500" />
          <span className="font-bold text-white text-lg tracking-tight">WealthWise.AI</span>
        </Link>

        {/* DESKTOP ROUTES */}
        <div className="hidden md:flex items-center gap-1">
          {routes.map((route) => {
            const isActive = route.href.includes('#') 
              ? (pathname === '/' && activeSection === route.id)
              : (pathname === route.href && (pathname !== '/' || activeSection === 'home'));

            return (
              <Link 
                key={route.label} 
                href={route.href} 
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
                  isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <route.icon className="h-4 w-4" /> {route.label}
              </Link>
            );
          })}
        </div>

        {/* AUTH/TOGGLE */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-all flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold">Login</Link>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800"
          >
            <div className="p-4 space-y-1">
              {routes.map((route) => {
                const isActive = route.href.includes('#') 
                  ? (pathname === '/' && activeSection === route.id)
                  : (pathname === route.href && (pathname !== '/' || activeSection === 'home'));

                return (
                  <Link 
                    key={route.label} 
                    href={route.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <route.icon className="h-5 w-5" /> {route.label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-slate-800 mt-2">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl font-bold">
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-bold">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}