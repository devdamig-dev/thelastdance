"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Shield, Trophy, Calendar, LayoutDashboard, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/torneos", label: "Torneos", icon: Trophy },
  { href: "/admin/partidos", label: "Partidos", icon: Calendar },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.rol !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || !user || user.rol !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center px-4">
        <div className="flex items-center gap-3 flex-1">
          <Shield className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-yellow-400 text-sm">ADMIN PANEL</span>
          <span className="text-gray-500 text-sm hidden sm:block">
            · {user.nombre}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-3 h-3" />
              App
            </button>
          </Link>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Salir
          </button>
        </div>
      </header>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-14 bottom-0 w-48 border-r border-white/10 bg-[#0d0d0d] hidden md:flex flex-col">
          <nav className="p-3 space-y-1 mt-2">
            {ADMIN_NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 glass border-t border-white/10 flex items-center">
          {ADMIN_NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 h-full",
                  active ? "text-yellow-400" : "text-gray-500"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          })}
        </nav>

        <main className="md:ml-48 flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}
