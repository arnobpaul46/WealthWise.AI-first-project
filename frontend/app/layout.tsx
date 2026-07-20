import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/src/providers/QueryProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WealthWise AI - Agentic Wealth Manager",
  description: "AI-powered wealth management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <QueryProvider>
          <Navbar />
          <GoogleOAuthProvider clientId={googleClientId}>
          <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" />
      </GoogleOAuthProvider>
    </QueryProvider>
      </body >
    </html >
  );
}