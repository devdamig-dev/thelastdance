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
        <h1 className="text-2xl font-black text-[#F8FAFC]">
          Hola, {user?.nombre} 👋
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1">
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
      <div className="flex flex-wrap gap-2">
        <Link href="/ligas/crear">
          <Button size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Nueva Liga
          </Button>
        </Link>
        <Link href="/pronosticos">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Target className="w-3.5 h-3.5" /> Pronosticar
          </Button>
        </Link>
        <Link href="/ligas">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Users className="w-3.5 h-3.5" /> Mis Ligas
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Upcoming matches */}
        <div className="rounded-2xl border border-white/8 p-4 bg-gradient-to-br from-white/6 to-white/2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F5C451]" />
              Próximos Partidos
            </h2>
            <Link href="/pronosticos" className="text-xs text-[#94A3B8] hover:text-[#00D084] flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-white/4 animate-pulse" />)}
            </div>
          ) : (
            <UpcomingMatches partidos={upcomingMatches} />
          )}
        </div>

        {/* My leagues */}
        <div className="rounded-2xl border border-white/8 p-4 bg-gradient-to-br from-white/6 to-white/2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#60A5FA]" />
              Mis Ligas
            </h2>
            <Link href="/ligas" className="text-xs text-[#94A3B8] hover:text-[#00D084] flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1,2].map(i => <div key={i} className="h-14 rounded-xl bg-white/4 animate-pulse" />)}
            </div>
          ) : myLeagues.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
              <p className="text-sm text-[#94A3B8] mb-3">No estás en ninguna liga todavía</p>
              <Link href="/ligas/crear">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Crear Liga
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myLeagues.map((liga) => (
                <Link key={liga.id} href={`/ligas/${liga.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/6 hover:border-white/12 transition-all">
                  <div>
                    <div className="font-semibold text-sm text-[#F8FAFC]">{liga.nombre}</div>
                    <div className="text-xs text-[#475569] font-mono tracking-wider">#{liga.codigo}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#00D084]" />
                    <ChevronRight className="w-4 h-4 text-[#475569]" />
                  </div>
                </Link>
              ))}
              <Link href="/ligas" className="block text-center text-sm text-[#00D084] hover:text-[#00FFB3] py-2 font-medium transition-colors">
                Ver todas las ligas →
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
