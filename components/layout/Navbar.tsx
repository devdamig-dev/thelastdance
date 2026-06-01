"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/ui/user-avatar";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-15 flex items-center"
      style={{ background: "rgba(7,18,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="w-full px-4 flex items-center justify-between max-w-screen-2xl mx-auto">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 gradient-brand rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-transform group-hover:scale-105">
            <TrophyMinimal className="w-4.5 h-4.5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-[#00D084]/30 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-[11px] font-medium text-[#94A3B8] tracking-widest uppercase">Prode</span>
            <span className="text-sm font-black text-[#F8FAFC] tracking-tight -mt-0.5">MUNDIAL</span>
          </div>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-1.5">
            {user.rol === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#F5C451] bg-[#F5C451]/10 border border-[#F5C451]/20 hover:bg-[#F5C451]/15 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            <Link
              href="/perfil"
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-white/6 transition-colors group"
            >
              <UserAvatar name={user.nombre} colorId={user.avatar} size="sm" />
              <span className="text-sm font-medium text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors hidden md:block max-w-[120px] truncate">
                {user.nombre}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#475569] hover:text-[#F87171] hover:bg-[#F87171]/8 transition-colors"
              title="Salir"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function TrophyMinimal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
