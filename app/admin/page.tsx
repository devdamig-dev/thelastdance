"use client";

import { useEffect, useState } from "react";
import { Users, Trophy, Calendar, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminStats {
  usuarios: number;
  ligas: number;
  partidos: number;
  pronosticos: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    usuarios: 0,
    ligas: 0,
    partidos: 0,
    pronosticos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [usuarios, ligas, partidos, pronosticos] = await Promise.all([
        supabase.from("usuarios").select("id", { count: "exact", head: true }),
        supabase.from("ligas").select("id", { count: "exact", head: true }),
        supabase.from("partidos").select("id", { count: "exact", head: true }),
        supabase
          .from("pronosticos")
          .select("id", { count: "exact", head: true }),
      ]);

      setStats({
        usuarios: usuarios.count || 0,
        ligas: ligas.count || 0,
        partidos: partidos.count || 0,
        pronosticos: pronosticos.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Usuarios",
      value: stats.usuarios,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Ligas",
      value: stats.ligas,
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      title: "Partidos",
      value: stats.partidos,
      icon: Calendar,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      title: "Pronósticos",
      value: stats.pronosticos,
      icon: Target,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Panel de Administración</h1>
        <p className="text-gray-400 text-sm mt-1">Gestión de Prode Mundial</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="gradient-card rounded-xl border border-white/10 p-4"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-white/10 rounded animate-pulse mb-1" />
            ) : (
              <div className={`text-3xl font-black ${card.color}`}>
                {card.value}
              </div>
            )}
            <div className="text-sm text-gray-400">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="gradient-card rounded-xl border border-white/10 p-4">
        <h2 className="font-bold text-white mb-3">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <a
            href="/admin/torneos"
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm font-medium text-white">Gestionar Torneos</div>
              <div className="text-xs text-gray-400">Crear y editar torneos</div>
            </div>
          </a>
          <a
            href="/admin/partidos"
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Calendar className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm font-medium text-white">Gestionar Partidos</div>
              <div className="text-xs text-gray-400">Cargar resultados</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
