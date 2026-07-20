import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import Navbar from "./components/Navbar";
import QueryProvider from "@/src/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WealthWise AI - Agentic Wealth Manager",
  description: "AI-powered wealth management and transaction parsing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
          <footer className="bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-500 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">WW</span>
                </div>
                <span className="text-slate-300 font-bold">WealthWise AI</span>
              </div>
              <p>
                &copy; {new Date().getFullYear()} WealthWise AI Inc. All rights reserved.
              </p>
            </div>
          </footer>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #1e293b",
                fontSize: "13px",
              },
              success: { iconTheme: { primary: "#34d399", secondary: "#0f172a" } },
              error: { iconTheme: { primary: "#f87171", secondary: "#0f172a" } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}