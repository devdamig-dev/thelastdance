"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Target,
  Users,
  Zap,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { Partido, Liga } from "@/types";

interface Stats {
  puntos: number;
  aciertos: number;
  ligas: number;
  pronosticados: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    puntos: 0,
    aciertos: 0,
    ligas: 0,
    pronosticados: 0,
  });
  const [upcomingMatches, setUpcomingMatches] = useState<Partido[]>([]);
  const [myLeagues, setMyLeagues] = useState<Liga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const supabase = createClient();

      // Fetch leagues
      const { data: miembros } = await supabase
        .from("miembros_liga")
        .select("liga_id, ligas(id, nombre, codigo, owner_id, torneo_id, created_at)")
        .eq("usuario_id", user.id)
        .limit(3);

      if (miembros) {
        const ligasData = (miembros as unknown as Array<{ ligas: Liga | Liga[] | null }>)
          .map((m) => {
            const l = m.ligas;
            return Array.isArray(l) ? l[0] : l;
          })
          .filter(Boolean) as Liga[];
        setMyLeagues(ligasData);
        setStats((prev) => ({ ...prev, ligas: miembros.length }));
      }

      // Fetch upcoming matches
      const { data: partidos } = await supabase
        .from("partidos")
        .select("*, torneos(id, nombre, anio, activo)")
        .gt("fecha", new Date().toISOString())
        .order("fecha", { ascending: true })
        .limit(5);

      if (partidos) {
        setUpcomingMatches(
          (partidos as Partido[]).map((p) => ({
            ...p,
            resultado: p.resultado as "1" | "X" | "2" | null,
            fase: p.fase as
              | "grupos"
              | "octavos"
              | "cuartos"
              | "semifinal"
              | "final",
          }))
        );
      }

      // Fetch pronosticos stats
      const { data: pronosticos } = await supabase
        .from("pronosticos")
        .select("id, partido_id, pronostico, partidos(resultado, fase)")
        .eq("usuario_id", user.id);

      if (pronosticos) {
        let puntos = 0;
        let aciertos = 0;

        const FASE_POINTS: Record<string, number> = {
          grupos: 1,
          octavos: 2,
          cuartos: 3,
          semifinal: 4,
          final: 8,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pronosticos as unknown as any[]).forEach((p) => {
          const partidos = p.partidos;
          const partido = Array.isArray(partidos) ? partidos[0] : partidos as { resultado: string | null; fase: string } | null;
          if (partido?.resultado && partido.resultado === p.pronostico) {
            const pts = FASE_POINTS[partido.fase] || 1;
            puntos += pts;
            aciertos++;
          }
        });

        setStats((prev) => ({
          ...prev,
          puntos,
          aciertos,
          pronosticados: pronosticos.length,
        }));
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const precisionPct =
    stats.pronosticados > 0
      ? Math.round((stats.aciertos / stats.pronosticados) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-white">
          Hola, {user?.avatar} {user?.nombre}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Mundial 2026 · Tu rendimiento
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard
          title="Puntos"
          value={stats.puntos}
          icon={Trophy}
          color="yellow"
          subtitle="Total acumulado"
        />
        <StatsCard
          title="Aciertos"
          value={stats.aciertos}
          icon={Target}
          color="green"
          subtitle={`${precisionPct}% precisión`}
        />
        <StatsCard
          title="Mis Ligas"
          value={stats.ligas}
          icon={Users}
          color="blue"
          subtitle="Compitiendo en"
        />
        <StatsCard
          title="Pronosticados"
          value={stats.pronosticados}
          icon={Zap}
          color="purple"
          subtitle="Partidos jugados"
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/ligas/crear">
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Liga
          </Button>
        </Link>
        <Link href="/pronosticos">
          <Button variant="outline" size="sm" className="gap-2">
            <Target className="w-4 h-4" />
            Pronosticar
          </Button>
        </Link>
        <Link href="/ligas">
          <Button variant="ghost" size="sm" className="gap-2">
            <Users className="w-4 h-4" />
            Mis Ligas
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming matches */}
        <div className="gradient-card rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Próximos Partidos
            </h2>
            <Link
              href="/pronosticos"
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <UpcomingMatches partidos={upcomingMatches} />
          )}
        </div>

        {/* My leagues */}
        <div className="gradient-card rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Mis Ligas
            </h2>
            <Link
              href="/ligas"
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : myLeagues.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-400 mb-3">
                No estás en ninguna liga todavía
              </p>
              <Link href="/ligas/crear">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Liga
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myLeagues.map((liga) => (
                <Link
                  key={liga.id}
                  href={`/ligas/${liga.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm text-white">
                      {liga.nombre}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      #{liga.codigo}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#10b981]" />
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </Link>
              ))}
              <Link
                href="/ligas"
                className="block text-center text-sm text-[#10b981] hover:text-emerald-300 py-2 font-medium"
              >
                Ver todas las ligas
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Need this import
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
