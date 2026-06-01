"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Users, User, History } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",   label: "Inicio",      icon: LayoutDashboard },
  { href: "/pronosticos", label: "Pronósticos", icon: Target },
  { href: "/ligas",       label: "Ligas",       icon: Users },
  { href: "/historial",   label: "Historial",   icon: History },
  { href: "/perfil",      label: "Perfil",      icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center safe-area-inset-bottom"
      style={{
        background: "rgba(7,18,15,0.92)",
        backdropFilter: "blur(20px) saturate(1.5)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-full relative group"
          >
            {/* Icon container */}
            <div className={cn(
              "flex items-center justify-center w-9 h-7 rounded-xl transition-all duration-200",
              active
                ? "bg-[#00D084]/15"
                : "group-active:bg-white/5"
            )}>
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  active
                    ? "text-[#00D084] drop-shadow-[0_0_8px_#00D084]"
                    : "text-[#475569] group-hover:text-[#94A3B8]"
                )}
              />
            </div>
            <span className={cn(
              "text-[9px] font-semibold leading-none tracking-wide transition-colors duration-200",
              active ? "text-[#00D084]" : "text-[#475569]"
            )}>
              {label}
            </span>
            {/* Active dot */}
            {active && (
              <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00D084] shadow-[0_0_4px_#00D084]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
