"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, DollarSign, MessageSquare, FileText } from "lucide-react";
// মেইন ফিক্স: সঠিক পাথ ইমপোর্ট করা হলো
import AuthGuard from "../../src/components/AuthGuard"; 

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // যে পেজগুলো প্রটেক্ট করতে হবে
  const protectedRoutes = ["/dashboard", "/transactions", "/chat", "/reports", "/profile"];
  const isProtected = protectedRoutes.includes(pathname);

  // যদি প্রটেক্টেড রুট হয়, তবে AuthGuard দিয়ে মুড়িয়ে দিন
  if (isProtected) {
    return (
      <AuthGuard>
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          <aside className="w-64 bg-[#0f172a] border-r border-slate-800 p-4 space-y-2 hidden lg:block">
            <nav className="space-y-1">
              {[
                { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                { label: "Transactions", href: "/transactions", icon: DollarSign },
                { label: "AI Chat", href: "/chat", icon: MessageSquare },
                { label: "Reports", href: "/reports", icon: FileText },
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    pathname === item.href ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0b1120]">
            {children}
          </main>
        </div>
      </AuthGuard>
    );
  }

  // যদি সাধারণ পেজ (যেমন Home) হয়, তবে কোনো সাইডবার থাকবে না
  return <main className="flex-1">{children}</main>;
}