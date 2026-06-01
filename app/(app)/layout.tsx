"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, NAVBAR_HEIGHT } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuth } from "@/hooks/useAuth";

const SIDEBAR_W = 220;
const BOTTOM_NAV_H = 60;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "100dvh" }}>
        <div className="flex flex-col items-center" style={{ gap: 16 }}>
          <div
            className="gradient-brand glow-green rounded-2xl flex items-center justify-center animate-pulse shadow-2xl"
            style={{ width: 48, height: 48 }}
          >
            <TrophyIcon style={{ width: 24, height: 24, color: "white" }} />
          </div>
          <p className="font-medium text-[#475569]" style={{ fontSize: 14 }}>Cargando…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100dvh" }}>
      <Navbar />
      <Sidebar />
      <main
        style={{
          paddingTop: NAVBAR_HEIGHT,
          paddingBottom: BOTTOM_NAV_H + 16,
          marginLeft: 0,
        }}
        className="md:ml-[220px]"
      >
        <div
          className="mx-auto"
          style={{ maxWidth: 900, padding: "24px 20px" }}
        >
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
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
