"use client";
import { useState, useEffect, useCallback } from "react";
import type { Usuario } from "@/types";

const STORAGE_KEY = "prode_user";
const COOKIE_KEY = "prode_session";

function setCookie(value: string) {
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

function deleteCookie() {
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
}

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((usuario: Usuario) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    setCookie(JSON.stringify({ id: usuario.id, rol: usuario.rol }));
    setUser(usuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    deleteCookie();
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
