"use client";
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleAuthSuccess = (response: any) => {
    const user = response.data.data;
    localStorage.setItem("wealthwise_user_id", user._id);
    localStorage.setItem("wealthwise_auth_sim", "true");
    toast.success("Login Successful!");
    router.push('/dashboard');
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', formData);
      handleAuthSuccess(res);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-md space-y-6 shadow-2xl">
        <h2 className="text-white text-2xl font-bold text-center">Login</h2>
        
        <div className="flex justify-center">
          <GoogleLogin 
            onSuccess={async (cred) => {
              const res = await api.post('/users/google-auth', { token: cred.credential });
              handleAuthSuccess(res);
            }} 
          />
        </div>

        <div className="text-slate-500 text-center text-xs">OR LOGIN MANUALLY</div>

        <form onSubmit={handleManualLogin} className="space-y-4">
          <input type="email" placeholder="Email Address" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-600" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-indigo-600" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500">Sign In</button>
        </form>

        <button onClick={async () => handleAuthSuccess(await api.post('/users/demo-login'))} className="w-full bg-slate-800 text-white py-2 rounded-xl border border-slate-700 text-sm font-bold">One-Click Demo Access</button>
        
        <p className="text-slate-400 text-sm text-center">No account? <Link href="/register" className="text-indigo-400 font-bold underline">Create Account</Link></p>
      </div>
    </div>
  );
}