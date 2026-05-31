"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10 flex items-center">
      <div className="w-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm tracking-tight text-white hidden sm:block">
            PRODE MUNDIAL
          </span>
        </Link>

        {/* User info */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link
                href="/perfil"
                className="flex items-center gap-2 hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-base">
                  {user.avatar || user.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 hidden md:block font-medium">
                  {user.nombre}
                </span>
              </Link>
              {user.rol === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="icon" className="text-yellow-400">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400"
                title="Salir"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
