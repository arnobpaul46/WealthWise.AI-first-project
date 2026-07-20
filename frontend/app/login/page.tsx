"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Sparkles, ShieldCheck, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";
import { setUserId } from "@/src/lib/user";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/users/google-auth", {
        name: "Demo User",
        email: formData.email || "demo@wealthwise.ai",
        googleId: "demo-google-id-wealthwise",
        picture: "",
      });

      if (response.data?.success && response.data.data?._id) {
        setUserId(response.data.data._id);
        localStorage.setItem("wealthwise_auth_sim", "true");
        localStorage.setItem("wealthwise_user_token", "demo-jwt-token");
        toast.success("Welcome to WealthWise AI!");
        router.push("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch {
      localStorage.setItem("wealthwise_auth_sim", "true");
      localStorage.setItem("wealthwise_user_token", "demo-jwt-token");
      setUserId("6a5dfdd8cd2228d081b6b080");
      toast.success("Demo login successful!");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
  toast.loading("Connecting to Google...", { id: "google-auth" });
  
  setTimeout(() => {
    // সফল লগইন সিমুলেশন
    localStorage.setItem("wealthwise_auth_sim", "true");
    localStorage.setItem("wealthwise_user_id", "6a5dfdd8cd2228d081b6b080");
    
    toast.dismiss("google-auth");
    toast.success("Logged in with Google!");
    router.push("/dashboard");
  }, 1500);
};

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@wealthwise.ai",
      password: "demo123",
    });
    setTimeout(() => handleSubmit(new Event('submit') as any), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-emerald-400/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Bot className="h-7 w-7 text-slate-950" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
            <p className="text-sm text-slate-400 text-center max-w-xs">
              Sign in to access your AI-powered wealth dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full pl-10 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4.5 w-4.5" />
              )}
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-slate-900/50 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 text-slate-100 font-semibold rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>{googleLoading ? "Connecting..." : "Google Social Login"}</span>
            </button>

            <button
              onClick={handleDemoLogin}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="h-4.5 w-4.5 text-indigo-400" />
              <span>Demo Login</span>
            </button>
          </div>

          <div className="text-sm text-slate-400 text-center mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create one
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium border-t border-slate-800 pt-6 mt-6">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Bank-level security & encryption</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}