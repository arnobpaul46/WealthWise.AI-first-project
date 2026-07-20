"use client";
import React, { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/register', formData);
      if (res.data.success) {
        localStorage.setItem("wealthwise_user_id", res.data.data._id);
        localStorage.setItem("wealthwise_auth_sim", "true");
        toast.success("Account Created!");
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-md space-y-4">
        <h2 className="text-white text-2xl font-bold text-center">Create Account</h2>
        <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500">Register</button>
        <p className="text-slate-400 text-sm text-center">Already have an account? <Link href="/login" className="text-indigo-400">Login</Link></p>
      </form>
    </div>
  );
}