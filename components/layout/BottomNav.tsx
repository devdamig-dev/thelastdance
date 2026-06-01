"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Users, User, History } from "lucide-react";

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
      className="md:hidden fixed left-0 right-0 bottom-0 z-50 flex items-center"
      style={{
        height: 60,
        background: "rgba(7,18,15,0.94)",
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
            className="flex-1 flex flex-col items-center justify-center h-full relative"
            style={{ gap: 3 }}
          >
            {/* Active top dot */}
            {active && (
              <span
                className="absolute rounded-full"
                style={{ top: 6, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, background: "#00D084", boxShadow: "0 0 6px #00D084" }}
              />
            )}
            {/* Icon pill */}
            <div
              className="flex items-center justify-center rounded-xl transition-all"
              style={{
                width: 36, height: 28,
                background: active ? "rgba(0,208,132,0.15)" : "transparent",
              }}
            >
              <Icon
                style={{
                  width: 20, height: 20,
                  color: active ? "#00D084" : "#475569",
                  filter: active ? "drop-shadow(0 0 8px #00D084)" : "none",
                  transition: "color 0.2s",
                }}
              />
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.03em", color: active ? "#00D084" : "#475569" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
