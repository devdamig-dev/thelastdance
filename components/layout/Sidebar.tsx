"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Users,
  User,
  History,
  Trophy,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pronosticos", label: "Pronósticos", icon: Target },
  { href: "/ligas", label: "Mis Ligas", icon: Users },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/perfil", label: "Mi Perfil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-56 flex-col border-r border-white/10 bg-[#0d0d0d] z-40">
      <div className="flex flex-col flex-1 p-3 gap-1 mt-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[#00875a]/20 text-[#10b981] border border-[#00875a]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        {user?.rol === "admin" && (
          <>
            <div className="h-px bg-white/10 my-2" />
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/5"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Link>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#10b981]" />
          <span className="text-xs text-gray-500">Prode Mundial 2026</span>
        </div>
      </div>
    </aside>
  );
}
