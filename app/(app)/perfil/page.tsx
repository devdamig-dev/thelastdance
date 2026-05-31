"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Trophy, Target, Zap, Star, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { calcularLogros } from "@/lib/achievements";
import type { Logro } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AVATARES = ["⚽", "🏆", "🦁", "🦅", "🔥", "⚡", "🌟", "🎯", "🦊", "🐯", "👑", "🦋"];

export default function PerfilPage() {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  const [logros, setLogros] = useState<Logro[]>([]);
  const [stats, setStats] = useState({ puntos: 0, aciertos: 0, total: 0, ligas: 0 });
  const [editAvatar, setEditAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "⚽");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSelectedAvatar(user.avatar || "⚽");

    const fetchStats = async () => {
      const supabase = createClient();

      const { data: pronosticos } = await supabase
        .from("pronosticos")
        .select("pronostico, partidos(resultado, fase)")
        .eq("usuario_id", user.id);

      const { count: ligasCount } = await supabase
        .from("miembros_liga")
        .select("id", { count: "exact", head: true })
        .eq("usuario_id", user.id);

      const { count: ligasOwned } = await supabase
        .from("ligas")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user.id);

      const FASE_POINTS: Record<string, number> = {
        grupos: 1,
        octavos: 2,
        cuartos: 3,
        semifinal: 4,
        final: 8,
      };

      let puntos = 0;
      let aciertos = 0;

      type PRow = { pronostico: string; partidos: { resultado: string | null; fase: string } | null };
      ((pronosticos || []) as unknown as PRow[]).forEach((p) => {
        const partido = p.partidos;
        if (partido?.resultado && partido.resultado === p.pronostico) {
          puntos += FASE_POINTS[partido.fase] || 1;
          aciertos++;
        }
      });

      setStats({
        puntos,
        aciertos,
        total: pronosticos?.length || 0,
        ligas: ligasCount || 0,
      });

      const logrosCalc = calcularLogros({
        aciertos,
        esCreador: (ligasOwned || 0) > 0,
        esCampeon: false,
      });
      setLogros(logrosCalc);
    };
    fetchStats();
  }, [user]);

  const saveAvatar = async () => {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("usuarios")
      .update({ avatar: selectedAvatar })
      .eq("id", user.id);

    if (!error) {
      login({ ...user, avatar: selectedAvatar });
      toast.success("Avatar actualizado!");
      setEditAvatar(false);
    } else {
      toast.error("Error al actualizar avatar");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const precision =
    stats.total > 0 ? Math.round((stats.aciertos / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <User className="w-6 h-6 text-blue-400" />
          Mi Perfil
        </h1>
      </div>

      {/* Profile card */}
      <div className="gradient-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-3xl">
            {user?.avatar || user?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{user?.nombre}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  user?.rol === "admin"
                    ? "bg-yellow-400/20 text-yellow-400"
                    : "bg-emerald-400/20 text-emerald-400"
                )}
              >
                {user?.rol === "admin" ? "Administrador" : "Jugador"}
              </span>
            </div>
          </div>
        </div>

        {/* Change avatar */}
        {!editAvatar ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditAvatar(true)}
          >
            Cambiar avatar
          </Button>
        ) : (
          <div className="space-y-3">
            <Label>Elegí tu nuevo avatar</Label>
            <div className="flex flex-wrap gap-2">
              {AVATARES.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                    selectedAvatar === av
                      ? "bg-[#00875a] ring-2 ring-[#10b981]"
                      : "bg-[#1a1a1a] hover:bg-[#222]"
                  )}
                >
                  {av}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveAvatar} disabled={loading}>
                <Save className="w-3 h-3 mr-1" />
                Guardar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditAvatar(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="gradient-card rounded-xl border border-white/10 p-4 text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
          <div className="text-2xl font-black text-yellow-400">{stats.puntos}</div>
          <div className="text-xs text-gray-400">Puntos Totales</div>
        </div>
        <div className="gradient-card rounded-xl border border-white/10 p-4 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <div className="text-2xl font-black text-emerald-400">{stats.aciertos}</div>
          <div className="text-xs text-gray-400">Aciertos</div>
        </div>
        <div className="gradient-card rounded-xl border border-white/10 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Precisión</span>
            <span className="text-sm font-bold text-blue-400">{precision}%</span>
          </div>
          <Progress value={precision} className="h-2" />
          <div className="text-xs text-gray-500 mt-1">
            {stats.aciertos} de {stats.total} pronósticos
          </div>
        </div>
        <div className="gradient-card rounded-xl border border-white/10 p-4 text-center">
          <Zap className="w-5 h-5 mx-auto mb-1 text-purple-400" />
          <div className="text-2xl font-black text-purple-400">{stats.ligas}</div>
          <div className="text-xs text-gray-400">Ligas activas</div>
        </div>
      </div>

      {/* Logros */}
      <div className="gradient-card rounded-xl border border-white/10 p-4">
        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-400" />
          Logros
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {logros.map((logro) => (
            <div
              key={logro.id}
              className={cn(
                "p-3 rounded-lg border text-center transition-all",
                logro.desbloqueado
                  ? "border-yellow-400/30 bg-yellow-400/5"
                  : "border-white/5 opacity-40"
              )}
            >
              <div className="text-2xl mb-1">{logro.icono}</div>
              <div
                className={cn(
                  "text-xs font-bold",
                  logro.desbloqueado ? "text-yellow-400" : "text-gray-500"
                )}
              >
                {logro.nombre}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                {logro.descripcion}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400 gap-2"
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </Button>
    </div>
  );
}
