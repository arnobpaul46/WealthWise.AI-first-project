"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, LayoutDashboard, History, UserCircle, LogOut, Home, TrendingUp, Shield } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('wealthwise_auth_sim') === 'true');
  }, [pathname]);

  const guestRoutes = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Features', href: '/#features', icon: TrendingUp },
    { label: 'Security', href: '/#security', icon: Shield },
  ];

  const loggedInRoutes = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Features', href: '/#features', icon: TrendingUp },
    { label: 'Security', href: '/#security', icon: Shield },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', href: '/profile', icon: UserCircle },
  ];

  const routes = isLoggedIn ? loggedInRoutes : guestRoutes;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-indigo-500" />
          <span className="font-bold text-white">WealthWise.AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {routes.map((route) => (
            <Link key={route.label} href={route.href} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${pathname === route.href ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
              <route.icon className="h-4 w-4" /> {route.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-indigo-500/30">
                <UserCircle className="h-6 w-6 text-slate-400" />
              </div>
              <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}