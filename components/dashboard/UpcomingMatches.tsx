"use client";

import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import type { Partido } from "@/types";
import { formatDate } from "@/lib/utils";

const FASE_LABELS: Record<string, string> = {
  grupos: "Grupos",
  octavos: "Octavos",
  cuartos: "Cuartos",
  semifinal: "Semifinal",
  final: "Final",
};

interface UpcomingMatchesProps {
  partidos: Partido[];
}

export function UpcomingMatches({ partidos }: UpcomingMatchesProps) {
  if (partidos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No hay partidos próximos</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {partidos.map((partido) => (
        <div
          key={partido.id}
          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full">
                {FASE_LABELS[partido.fase] || partido.fase}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span>{partido.equipo_a}</span>
              <span className="text-gray-500 text-xs font-normal">vs</span>
              <span>{partido.equipo_b}</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatDate(partido.fecha)}</span>
            </div>
          </div>
          <Link href="/pronosticos" className="ml-3">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      ))}
      <Link
        href="/pronosticos"
        className="block text-center text-sm text-[#10b981] hover:text-emerald-300 py-2 font-medium"
      >
        Ver todos los partidos
      </Link>
    </div>
  );
}
