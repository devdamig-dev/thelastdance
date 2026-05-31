"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, RefreshCw } from "lucide-react";
import { Podium } from "@/components/ranking/Podium";
import { RankingTable } from "@/components/ranking/RankingTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { RankingEntry } from "@/types";

const FASE_POINTS: Record<string, number> = {
  grupos: 1,
  octavos: 2,
  cuartos: 3,
  semifinal: 4,
  final: 8,
};

export default function LigaRankingPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [ligaNombre, setLigaNombre] = useState("");
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = async () => {
    if (!id) return;
    setLoading(true);
    const supabase = createClient();

    // Liga info
    const { data: liga } = await supabase
      .from("ligas")
      .select("nombre")
      .eq("id", id)
      .single();
    if (liga) setLigaNombre((liga as { nombre: string }).nombre);

    type MiembroRow = {
      usuario_id: string;
      usuarios: { id: string; nombre: string; avatar: string | null; rol: string; created_at: string; pin: string } | null;
    };
    type PronosticoRow = {
      usuario_id: string;
      pronostico: string;
      partidos: { resultado: string | null; fase: string } | null;
    };

    // Members
    const { data: miembrosRaw } = await supabase
      .from("miembros_liga")
      .select("usuario_id, usuarios(id, nombre, avatar, rol, created_at, pin)")
      .eq("liga_id", id);

    const miembros = miembrosRaw as unknown as MiembroRow[] | null;

    if (!miembros) {
      setLoading(false);
      return;
    }

    // Pronosticos for this liga
    const { data: pronosticosRaw } = await supabase
      .from("pronosticos")
      .select("usuario_id, pronostico, partidos(resultado, fase)")
      .eq("liga_id", id);

    const pronosticos = pronosticosRaw as unknown as PronosticoRow[] | null;

    // Calculate points per user
    const rankingEntries: RankingEntry[] = miembros.map((m) => {
      const usuario = m.usuarios!;
      const userPronosticos = (pronosticos || []).filter(
        (p) => p.usuario_id === m.usuario_id
      );

      let puntos = 0;
      let aciertos = 0;
      let racha = 0;
      let currentRacha = 0;

      userPronosticos.forEach((p) => {
        const partido = p.partidos;
        if (partido?.resultado && partido.resultado === p.pronostico) {
          const pts = FASE_POINTS[partido.fase] || 1;
          puntos += pts;
          aciertos++;
          currentRacha++;
          if (currentRacha > racha) racha = currentRacha;
        } else if (partido?.resultado) {
          currentRacha = 0;
        }
      });

      return {
        posicion: 0,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          avatar: usuario.avatar,
          rol: usuario.rol as "user" | "admin",
          pin: usuario.pin,
          created_at: usuario.created_at,
        },
        puntos,
        aciertos,
        racha,
      };
    });

    // Sort and assign positions
    rankingEntries.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      return b.aciertos - a.aciertos;
    });
    rankingEntries.forEach((e, i) => (e.posicion = i + 1));

    setRanking(rankingEntries);
    setLoading(false);
  };

  useEffect(() => {
    fetchRanking();
  }, [id]);

  const top3 = ranking.filter((e) => e.posicion <= 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/ligas/${id}`}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Ranking</h1>
            <p className="text-gray-400 text-sm">{ligaNombre}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchRanking}
          disabled={loading}
          title="Actualizar"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div className="gradient-card rounded-xl border border-white/10 p-4">
              <h2 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Podio
              </h2>
              <Podium top3={top3} />
            </div>
          )}

          {/* Full ranking */}
          <div className="gradient-card rounded-xl border border-white/10 p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-4">
              Clasificación completa · {ranking.length} participantes
            </h2>
            <RankingTable entries={ranking} currentUserId={user?.id} />
          </div>
        </>
      )}
    </div>
  );
}
