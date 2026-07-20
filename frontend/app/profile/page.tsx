"use client";
import React, { useEffect, useState } from 'react';
import { UserCircle, Mail, ShieldCheck, Loader2, Fingerprint } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('wealthwise_user_id');
    // যদি আইডি না থাকে বা ভুল থাকে, তবে লগইনে পাঠাবে
    if (!id || id === "undefined") {
      router.push('/login');
    } else {
      setUserId(id);
    }
  }, [router]);

  const { data: resp, isLoading, isError } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId!).then(res => res.data),
    enabled: !!userId,
    retry: false // বারবার ট্রাই করবে না
  });

  const user = resp?.data;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-indigo-500">Loading...</div>;

  // যদি ডাটা না পায়, তবে একটি বাটন দেখাবে যাতে ইউজার আবার লগইন করতে পারে
  if (isError || !user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
      <p className="text-red-500 font-bold">Profile data not found.</p>
      <button onClick={() => {localStorage.clear(); router.push('/login');}} className="bg-indigo-600 px-6 py-2 rounded-xl font-bold">Re-Login</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center space-y-6 shadow-2xl backdrop-blur-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center border-4 border-slate-800 overflow-hidden">
            {user.picture ? <img src={user.picture} alt="p" className="h-full w-full object-cover" /> : <UserCircle className="h-16 w-16 text-white" />}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <div className="space-y-3 text-left bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 text-slate-300"><Mail className="h-5 w-5" /> <span>{user.email}</span></div>
          <div className="flex items-center gap-3 text-slate-300"><ShieldCheck className="h-5 w-5" /> <span>Verified & Secured</span></div>
        </div>
        <p className="text-[10px] text-slate-600">User ID: {user._id}</p>
      </div>
    </div>
  );
}