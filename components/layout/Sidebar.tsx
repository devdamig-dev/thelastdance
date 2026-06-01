"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Target, Users, User, History, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { href: "/pronosticos",  label: "Pronósticos", icon: Target },
  { href: "/ligas",        label: "Mis Ligas",   icon: Users },
  { href: "/historial",    label: "Historial",   icon: History },
  { href: "/perfil",       label: "Mi Perfil",   icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-16 bottom-0 w-56 flex-col z-40"
      style={{ background: "rgba(7,18,15,0.7)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
    >
      <nav className="flex flex-col flex-1 p-3 gap-0.5 mt-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "text-[#00D084] bg-[#00D084]/10"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              )}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00D084] rounded-r-full glow-green" />
              )}
              <Icon className={cn("w-4 h-4 flex-shrink-0", active && "drop-shadow-[0_0_6px_#00D084]")} />
              {label}
            </Link>
          );
        })}

        {user?.rol === "admin" && (
          <>
            <div className="my-2 mx-3 divider" />
            <Link
              href="/admin"
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                pathname.startsWith("/admin")
                  ? "text-[#F5C451] bg-[#F5C451]/10"
                  : "text-[#94A3B8] hover:text-[#F5C451] hover:bg-[#F5C451]/5"
              )}
            >
              {pathname.startsWith("/admin") && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#F5C451] rounded-r-full" />
              )}
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              Admin Panel
            </Link>
          </>
        )}
      </nav>

      {/* Bottom brand */}
      <div className="p-4 mt-auto">
        <div className="divider mb-3" />
        <p className="text-[10px] text-[#475569] font-medium tracking-widest uppercase text-center">
          Mundial 2026
        </p>
      </div>
    </aside>
  );
}
