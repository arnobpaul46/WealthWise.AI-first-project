"use client";
import React, { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ClientLayout from "./components/ClientLayout";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/src/providers/QueryProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // এটি হাইড্রেশন এরর ফিক্স করার জন্য মাস্ট
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0b1120] text-slate-300 antialiased`}>
        {mounted ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <QueryProvider>
              <Navbar />
              <ClientLayout>{children}</ClientLayout>
              <Toaster position="top-right" />
            </QueryProvider>
          </GoogleOAuthProvider>
        ) : (
          <div className="bg-[#0b1120] min-h-screen" /> // লোডিং অবস্থায় খালি স্ক্রিন
        )}
      </body>
    </html>
  );
}