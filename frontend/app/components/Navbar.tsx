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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // লগইন স্টেট চেক
    setIsLoggedIn(localStorage.getItem('wealthwise_auth_sim') === 'true');
    const savedUser = localStorage.getItem('wealthwise_user_info');
    if (savedUser) setUser(JSON.parse(savedUser));

    // স্ক্রল এবং রিলোড ডিটেকশন লজিক
    const handleActiveState = () => {
      if (pathname !== '/') {
        setActiveSection(pathname.replace('/', ''));
        return;
      }

      // হোম পেজের সেকশন ডিটেকশন
      const scrollPos = window.scrollY;
      const featuresSection = document.getElementById('features');
      const securitySection = document.getElementById('security');

      if (securitySection && scrollPos >= securitySection.offsetTop - 200) {
        setActiveSection('security');
      } else if (featuresSection && scrollPos >= featuresSection.offsetTop - 200) {
        setActiveSection('features');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleActiveState);
    handleActiveState(); // রিলোড দেওয়ার সাথে সাথে রান হবে

    return () => window.removeEventListener('scroll', handleActiveState);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const routes = [
    { label: 'Home', href: '/', id: 'home', icon: Home },
    { label: 'Features', href: '/#features', id: 'features', icon: TrendingUp },
    { label: 'Security', href: '/#security', id: 'security', icon: Shield },
  ];

  const authRoutes = isLoggedIn ? [
    { label: 'Dashboard', href: '/dashboard', id: 'dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/profile', id: 'profile', icon: UserCircle },
  ] : [];

  const allRoutes = [...routes, ...authRoutes];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* লোগো */}
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-indigo-500" />
          <span className="font-bold text-white uppercase tracking-tighter">WealthWise.AI</span>
        </Link>

        {/* ডেক্সটপ মেনু */}
        <div className="hidden md:flex items-center gap-1">
          {allRoutes.map((r) => (
            <Link 
              key={r.label} 
              href={r.href} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                activeSection === r.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <r.icon className="h-4 w-4" /> {r.label}
            </Link>
          ))}
        </div>

        {/* ডানে অ্যাভাটার এবং লগআউট */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-3 border-l border-slate-800 pl-4">
              <Link href="/profile" className={`h-9 w-9 rounded-full border-2 transition-all overflow-hidden flex items-center justify-center ${activeSection === 'profile' ? 'border-indigo-500 shadow-md' : 'border-slate-700'}`}>
                {user?.picture ? <img src={user.picture} alt="p" className="w-full h-full object-cover" /> : <UserCircle className="h-6 w-6 text-slate-400" />}
              </Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg transition-all"><LogOut className="h-4 w-4" /> Logout</button>
            </div>
          )}
          
          {!isLoggedIn && (
            <Link href="/login" className="hidden md:block bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold">Login</Link>
          )}

          {/* মোবাইল টগল */}
          <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* মোবাইল মেনু */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-900 border-b border-slate-800">
            <div className="p-4 space-y-1">
              {allRoutes.map((r) => (
                <Link 
                  key={r.label} 
                  href={r.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                    activeSection === r.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <r.icon className="h-5 w-5" /> {r.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-800">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-bold hover:bg-red-950/30 rounded-xl"><LogOut className="h-5 w-5" /> Logout</button>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-bold">Login</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}