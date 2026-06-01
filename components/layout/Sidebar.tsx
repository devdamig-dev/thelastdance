"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Users, User, History, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NAVBAR_HEIGHT } from "./Navbar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/pronosticos", label: "Pronósticos", icon: Target },
  { href: "/ligas",       label: "Mis Ligas",   icon: Users },
  { href: "/historial",   label: "Historial",   icon: History },
  { href: "/perfil",      label: "Mi Perfil",   icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className="hidden md:flex fixed left-0 bottom-0 flex-col z-40"
      style={{
        top: NAVBAR_HEIGHT,
        width: 220,
        background: "rgba(7,18,15,0.75)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <nav className="flex flex-col flex-1" style={{ padding: "12px 10px", gap: 2 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl font-medium transition-all duration-200",
                active ? "text-[#00D084]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              )}
              style={{ padding: "10px 12px", fontSize: 13 }}
            >
              {active && (
                <span
                  className="absolute rounded-r-full"
                  style={{ left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: "#00D084", boxShadow: "0 0 8px #00D084" }}
                />
              )}
              <Icon
                style={{ width: 16, height: 16, flexShrink: 0, filter: active ? "drop-shadow(0 0 6px #00D084)" : "none" }}
              />
              {label}
              {active && (
                <span style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(0,208,132,0.08)", pointerEvents: "none" }} />
              )}
            </Link>
          );
        })}

        {user?.rol === "admin" && (
          <>
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 4px" }} />
            <Link
              href="/admin"
              className={cn(
                "relative flex items-center gap-3 rounded-xl font-medium transition-all duration-200",
                pathname.startsWith("/admin") ? "text-[#F5C451]" : "text-[#94A3B8] hover:text-[#F5C451] hover:bg-[#F5C451]/5"
              )}
              style={{ padding: "10px 12px", fontSize: 13 }}
            >
              <ShieldCheck style={{ width: 16, height: 16, flexShrink: 0 }} />
              Admin Panel
            </Link>
          </>
        )}
      </nav>

      <div style={{ padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="font-medium text-[#475569] text-center tracking-widest uppercase" style={{ fontSize: 10 }}>
          Mundial 2026
        </p>
      </div>
    </aside>
  );
}
