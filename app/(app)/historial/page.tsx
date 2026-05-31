"use client";

import { useEffect, useState } from "react";
import { History, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { getPointsByPhase } from "@/lib/points";
import type { FasePartido, ResultadoPartido } from "@/types";
import { cn } from "@/lib/utils";

interface HistorialEntry {
  id: string;
  pronostico: ResultadoPartido;
  equipo_a: string;
  equipo_b: string;
  fecha: string;
  fase: FasePartido;
  resultado: ResultadoPartido;
  liga_nombre: string;
  acertado: boolean | null;
  puntos: number;
}

export default function HistorialPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HistorialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | "acertados" | "fallados">("todos");

  useEffect(() => {
    if (!user) return;
    const fetchHistorial = async () => {
      const supabase = createClient();

      const { data: pronosticos } = await supabase
        .from("pronosticos")
        .select(
          "id, pronostico, liga_id, partidos(equipo_a, equipo_b, fecha, fase, resultado), ligas(nombre)"
        )
        .eq("usuario_id", user.id)
        .order("created_at", { ascending: false });

      if (pronosticos) {
        type PronosticoRow = {
          id: string;
          pronostico: string;
          liga_id: string;
          partidos: { equipo_a: string; equipo_b: string; fecha: string; fase: string; resultado: string | null } | null;
          ligas: { nombre: string } | null;
        };
        const mapped: HistorialEntry[] = (pronosticos as unknown as PronosticoRow[]).map((p) => {
          const partido = p.partidos;
          const liga = p.ligas;
          const result = (partido?.resultado ?? null) as ResultadoPartido;
          const hasResult = result !== null;
          const acertado = hasResult ? p.pronostico === result : null;
          const fase = (partido?.fase || "grupos") as FasePartido;

          return {
            id: p.id,
            pronostico: p.pronostico as ResultadoPartido,
            equipo_a: partido?.equipo_a || "",
            equipo_b: partido?.equipo_b || "",
            fecha: partido?.fecha || "",
            fase,
            resultado: result,
            liga_nombre: liga?.nombre || "",
            acertado,
            puntos: acertado ? getPointsByPhase(fase) : 0,
          };
        });
        setEntries(mapped);
      }
      setLoading(false);
    };
    fetchHistorial();
  }, [user]);

  const filtered = entries.filter((e) => {
    if (filter === "acertados") return e.acertado === true;
    if (filter === "fallados") return e.acertado === false;
    return true;
  });

  const totalAciertos = entries.filter((e) => e.acertado === true).length;
  const totalPuntos = entries.reduce((sum, e) => sum + e.puntos, 0);
  const precision =
    entries.filter((e) => e.acertado !== null).length > 0
      ? Math.round(
          (totalAciertos /
            entries.filter((e) => e.acertado !== null).length) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <History className="w-6 h-6 text-purple-400" />
          Historial
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Todos tus pronósticos
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="gradient-card rounded-xl border border-white/10 p-3 text-center">
          <div className="text-2xl font-black text-yellow-400">{totalPuntos}</div>
          <div className="text-xs text-gray-400">Puntos</div>
        </div>
        <div className="gradient-card rounded-xl border border-white/10 p-3 text-center">
          <div className="text-2xl font-black text-emerald-400">{totalAciertos}</div>
          <div className="text-xs text-gray-400">Aciertos</div>
        </div>
        <div className="gradient-card rounded-xl border border-white/10 p-3 text-center">
          <div className="text-2xl font-black text-blue-400">{precision}%</div>
          <div className="text-xs text-gray-400">Precisión</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["todos", "acertados", "fallados"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filter === f
                ? "bg-[#00875a] text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <History className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No hay pronósticos en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className={cn(
                "gradient-card rounded-xl border p-3 flex items-center gap-3",
                entry.acertado === true
                  ? "border-emerald-500/20"
                  : entry.acertado === false
                  ? "border-red-500/10"
                  : "border-white/10"
              )}
            >
              {/* Status icon */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  entry.acertado === true
                    ? "bg-emerald-500/20 text-emerald-400"
                    : entry.acertado === false
                    ? "bg-red-500/20 text-red-400"
                    : "bg-gray-500/20 text-gray-400"
                )}
              >
                {entry.acertado === true ? (
                  <Check className="w-4 h-4" />
                ) : entry.acertado === false ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded">
                    {entry.fase}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {entry.liga_nombre}
                  </span>
                </div>
                <div className="text-sm font-medium text-white">
                  {entry.equipo_a} vs {entry.equipo_b}
                </div>
                <div className="text-xs text-gray-400">
                  Tu pronóstico:{" "}
                  <span className="font-medium text-gray-300">
                    {entry.pronostico === "1"
                      ? entry.equipo_a
                      : entry.pronostico === "2"
                      ? entry.equipo_b
                      : "Empate"}
                  </span>
                  {entry.resultado && (
                    <>
                      {" "}·{" "}
                      <span
                        className={
                          entry.acertado ? "text-emerald-400" : "text-gray-400"
                        }
                      >
                        Resultado:{" "}
                        {entry.resultado === "1"
                          ? entry.equipo_a
                          : entry.resultado === "2"
                          ? entry.equipo_b
                          : "Empate"}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Points */}
              {entry.acertado !== null && (
                <div className="text-right flex-shrink-0">
                  <div
                    className={cn(
                      "text-lg font-black",
                      entry.acertado ? "text-emerald-400" : "text-gray-600"
                    )}
                  >
                    {entry.acertado ? `+${entry.puntos}` : "0"}
                  </div>
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
