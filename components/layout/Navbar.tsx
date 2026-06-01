"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/ui/user-avatar";

export const NAVBAR_HEIGHT = 64; // px — used by layouts for offset

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center"
      style={{
        height: NAVBAR_HEIGHT,
        background: "rgba(7,18,15,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="w-full flex items-center justify-between"
        style={{ padding: "0 20px", maxWidth: "100%" }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className="gradient-brand rounded-xl flex items-center justify-center shadow-lg glow-green transition-transform group-hover:scale-105"
            style={{ width: 32, height: 32, flexShrink: 0 }}
          >
            <TrophyIcon style={{ width: 17, height: 17, color: "white" }} />
          </div>
          <div className="hidden sm:flex flex-col" style={{ lineHeight: 1 }}>
            <span className="font-medium text-[#94A3B8] tracking-widest uppercase" style={{ fontSize: 10 }}>Prode</span>
            <span className="font-black text-[#F8FAFC] tracking-tight" style={{ fontSize: 13, marginTop: -1 }}>MUNDIAL</span>
          </div>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center" style={{ gap: 4 }}>
            {user.rol === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 font-medium text-[#F5C451] rounded-lg transition-colors hover:bg-[#F5C451]/10"
                style={{ padding: "6px 10px", fontSize: 12, border: "1px solid rgba(245,196,81,0.2)" }}
              >
                <ShieldCheck style={{ width: 14, height: 14 }} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-xl transition-colors hover:bg-white/6"
              style={{ padding: "6px 10px" }}
            >
              <UserAvatar name={user.nombre} colorId={user.avatar} size="sm" />
              <span className="hidden md:block font-medium text-[#94A3B8] hover:text-[#F8FAFC] truncate" style={{ maxWidth: 120, fontSize: 13 }}>
                {user.nombre}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-xl text-[#475569] hover:text-[#F87171] hover:bg-[#F87171]/8 transition-colors"
              style={{ width: 36, height: 36 }}
              title="Salir"
            >
              <LogOut style={{ width: 16, height: 16 }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function TrophyIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
