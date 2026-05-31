"use client";

import { useEffect, useState } from "react";
import { Target, Users, AlertCircle } from "lucide-react";
import { MatchCard } from "@/components/pronosticos/MatchCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { Partido, Liga, ResultadoPartido } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PartidoWithPronostico extends Partido {
  mi_pronostico?: ResultadoPartido;
}

export default function PronosticosPage() {
  const { user } = useAuth();
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [selectedLiga, setSelectedLiga] = useState<string>("");
  const [partidos, setPartidos] = useState<PartidoWithPronostico[]>([]);
  const [loading, setLoading] = useState(true);
  const [fase, setFase] = useState<string>("todos");

  useEffect(() => {
    if (!user) return;
    const fetchLigas = async () => {
      const supabase = createClient();
      const { data: miembros } = await supabase
        .from("miembros_liga")
        .select(
          "liga_id, ligas(id, nombre, codigo, owner_id, torneo_id, created_at)"
        )
        .eq("usuario_id", user.id);

      if (miembros && miembros.length > 0) {
        const ligasData = (miembros as unknown as Array<{ ligas: Liga | Liga[] | null }>)
          .map((m) => {
            const l = m.ligas;
            return Array.isArray(l) ? l[0] : l;
          })
          .filter(Boolean) as Liga[];
        setLigas(ligasData);
        setSelectedLiga(ligasData[0].id);
      }
      setLoading(false);
    };
    fetchLigas();
  }, [user]);

  useEffect(() => {
    if (!selectedLiga || !user) return;
    const fetchPartidos = async () => {
      setLoading(true);
      const supabase = createClient();

      // Get liga torneo
      const { data: liga } = await supabase
        .from("ligas")
        .select("torneo_id")
        .eq("id", selectedLiga)
        .single();

      if (!(liga as { torneo_id: string | null } | null)?.torneo_id) {
        // Load all active tournaments' matches
        const { data: pts } = await supabase
          .from("partidos")
          .select("*, torneos(id, nombre, anio, activo)")
          .order("fecha", { ascending: true });

        if (pts) {
          await attachPronosticos(
            pts as unknown as Partido[],
            selectedLiga,
            user.id,
            supabase
          );
        } else {
          setPartidos([]);
          setLoading(false);
        }
        return;
      }

      const { data: pts } = await supabase
        .from("partidos")
        .select("*, torneos(id, nombre, anio, activo)")
        .eq("torneo_id", (liga as { torneo_id: string }).torneo_id)
        .order("fecha", { ascending: true });

      if (pts) {
        await attachPronosticos(
          pts as unknown as Partido[],
          selectedLiga,
          user.id,
          supabase
        );
      } else {
        setPartidos([]);
        setLoading(false);
      }
    };
    fetchPartidos();
  }, [selectedLiga, user]);

  const attachPronosticos = async (
    pts: Partido[],
    ligaId: string,
    userId: string,
    supabase: ReturnType<typeof createClient>
  ) => {
    const { data: pronosticos } = await supabase
      .from("pronosticos")
      .select("partido_id, pronostico")
      .eq("liga_id", ligaId)
      .eq("usuario_id", userId);

    const pronosticosMap = new Map<string, ResultadoPartido>();
    (pronosticos as unknown as Array<{ partido_id: string; pronostico: string }> | null)?.forEach((p) => {
      pronosticosMap.set(p.partido_id, p.pronostico as ResultadoPartido);
    });

    setPartidos(
      pts.map((p) => ({
        ...p,
        mi_pronostico: pronosticosMap.get(p.id) ?? null,
      }))
    );
    setLoading(false);
  };

  const handlePronosticoChange = async (
    partidoId: string,
    ligaId: string,
    value: ResultadoPartido
  ) => {
    if (!user || !value) return;
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("pronosticos") as any).upsert(
      {
        usuario_id: user.id,
        liga_id: ligaId,
        partido_id: partidoId,
        pronostico: value,
      },
      { onConflict: "usuario_id,liga_id,partido_id" }
    );

    if (error) {
      toast.error("Error al guardar el pronóstico");
    } else {
      toast.success("Pronóstico guardado");
      setPartidos((prev) =>
        prev.map((p) =>
          p.id === partidoId ? { ...p, mi_pronostico: value } : p
        )
      );
    }
  };

  const fases = ["todos", ...Array.from(new Set(partidos.map((p) => p.fase)))];
  const filteredPartidos =
    fase === "todos" ? partidos : partidos.filter((p) => p.fase === fase);

  const pronosticados = partidos.filter((p) => p.mi_pronostico).length;
  const pendientes = partidos.filter(
    (p) => !p.mi_pronostico && new Date(p.fecha) > new Date()
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-[#10b981]" />
          Pronósticos
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Pronosticá los partidos antes de que empiecen
        </p>
      </div>

      {/* Liga selector */}
      {ligas.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedLiga} onValueChange={setSelectedLiga}>
                <SelectTrigger>
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <SelectValue placeholder="Seleccionar liga" />
                </SelectTrigger>
                <SelectContent>
                  {ligas.map((liga) => (
                    <SelectItem key={liga.id} value={liga.id}>
                      {liga.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="success">
                {pronosticados} pronósticos
              </Badge>
              {pendientes > 0 && (
                <Badge variant="warning">
                  {pendientes} pendientes
                </Badge>
              )}
            </div>
          </div>

          {/* Fase filter */}
          {fases.length > 2 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {fases.map((f) => (
                <button
                  key={f}
                  onClick={() => setFase(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    fase === f
                      ? "bg-[#00875a] text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {f === "todos"
                    ? "Todos"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : filteredPartidos.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400">No hay partidos disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPartidos.map((partido) => (
                <MatchCard
                  key={partido.id}
                  partido={partido}
                  pronostico={partido.mi_pronostico}
                  ligaId={selectedLiga}
                  onPronosticoChange={handlePronosticoChange}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Necesitás unirte a una liga primero
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Los pronósticos se hacen dentro de una liga
          </p>
          <Link href="/ligas">
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              Ver Ligas
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
