"use client";

import { useState } from "react";
import { Clock, Lock, Check } from "lucide-react";
import type { Partido, ResultadoPartido } from "@/types";
import { formatDate, isMatchStarted } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getPointsByPhase } from "@/lib/points";

const FASE_LABELS: Record<string, string> = {
  grupos: "Grupos",
  octavos: "Octavos",
  cuartos: "Cuartos",
  semifinal: "Semifinal",
  final: "Final",
};

const RESULTADO_LABELS: Record<string, string> = {
  "1": "1",
  X: "X",
  "2": "2",
};

interface MatchCardProps {
  partido: Partido;
  pronostico?: ResultadoPartido;
  ligaId: string;
  onPronosticoChange?: (
    partidoId: string,
    ligaId: string,
    value: ResultadoPartido
  ) => Promise<void>;
}

export function MatchCard({
  partido,
  pronostico: initialPronostico,
  ligaId,
  onPronosticoChange,
}: MatchCardProps) {
  const [selected, setSelected] = useState<ResultadoPartido>(
    initialPronostico ?? null
  );
  const [saving, setSaving] = useState(false);
  const started = isMatchStarted(partido.fecha);
  const points = getPointsByPhase(partido.fase);

  const handleSelect = async (value: ResultadoPartido) => {
    if (started || !onPronosticoChange) return;
    if (selected === value) return;

    setSaving(true);
    setSelected(value);
    await onPronosticoChange(partido.id, ligaId, value);
    setSaving(false);
  };

  const hasResult = partido.resultado !== null;
  const isCorrect = hasResult && selected === partido.resultado;

  return (
    <div
      className={cn(
        "gradient-card rounded-xl border p-4 transition-all",
        started
          ? "border-white/5 opacity-75"
          : "border-white/10 hover:border-white/20",
        isCorrect && "border-emerald-500/30 bg-emerald-900/5"
      )}
    >
      {/* Phase badge + Points */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full">
          {FASE_LABELS[partido.fase] || partido.fase}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{points} pt{points !== 1 ? "s" : ""}</span>
          {started && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Lock className="w-3 h-3" />
              Cerrado
            </span>
          )}
          {isCorrect && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Check className="w-3 h-3" />
              Acertaste
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{getTeamFlag(partido.equipo_a)}</div>
          <div className="text-sm font-bold text-white leading-tight">
            {partido.equipo_a}
          </div>
        </div>

        <div className="flex flex-col items-center px-4">
          {hasResult ? (
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Resultado</div>
              <div className="text-lg font-black text-white">
                {partido.resultado === "1"
                  ? partido.equipo_a
                  : partido.resultado === "2"
                  ? partido.equipo_b
                  : "Empate"}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-gray-500 font-bold text-xl">vs</div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatDate(partido.fecha)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{getTeamFlag(partido.equipo_b)}</div>
          <div className="text-sm font-bold text-white leading-tight">
            {partido.equipo_b}
          </div>
        </div>
      </div>

      {/* 1 X 2 buttons */}
      <div className="grid grid-cols-3 gap-2">
        {(["1", "X", "2"] as const).map((val) => {
          const isSelected = selected === val;
          const isResult = hasResult && partido.resultado === val;
          const isWrong = hasResult && isSelected && !isResult;

          return (
            <button
              key={val}
              onClick={() => handleSelect(val)}
              disabled={started || saving}
              className={cn(
                "h-10 rounded-lg text-sm font-bold transition-all relative",
                isSelected && !hasResult
                  ? "bg-[#00875a] text-white ring-2 ring-[#10b981]/50"
                  : isResult
                  ? "bg-emerald-600 text-white"
                  : isWrong
                  ? "bg-red-900/50 text-red-400 ring-1 ring-red-500/30"
                  : started
                  ? "bg-white/5 text-gray-500 cursor-not-allowed"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {saving && isSelected ? (
                <span className="flex items-center justify-center gap-1">
                  <svg
                    className="animate-spin h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </span>
              ) : (
                <span>
                  {val === "1"
                    ? partido.equipo_a.split(" ")[0]
                    : val === "2"
                    ? partido.equipo_b.split(" ")[0]
                    : "Empate"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && !started && (
        <p className="text-xs text-center text-gray-400 mt-2">
          Pronóstico:{" "}
          <span className="text-[#10b981] font-medium">
            {selected === "1"
              ? partido.equipo_a
              : selected === "2"
              ? partido.equipo_b
              : "Empate"}
          </span>
        </p>
      )}
    </div>
  );
}

function getTeamFlag(team: string): string {
  const flags: Record<string, string> = {
    Argentina: "🇦🇷",
    Brasil: "🇧🇷",
    Francia: "🇫🇷",
    España: "🇪🇸",
    Alemania: "🇩🇪",
    México: "🇲🇽",
    Uruguay: "🇺🇾",
    Portugal: "🇵🇹",
    Colombia: "🇨🇴",
    Chile: "🇨🇱",
    Italia: "🇮🇹",
    Inglaterra: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Estados Unidos": "🇺🇸",
    Marruecos: "🇲🇦",
    Japón: "🇯🇵",
    Croacia: "🇭🇷",
    Países: "🇳🇱",
    Senegal: "🇸🇳",
    Holanda: "🇳🇱",
    Ecuador: "🇪🇨",
    Suiza: "🇨🇭",
    Bélgica: "🇧🇪",
    Ghana: "🇬🇭",
    Camerún: "🇨🇲",
  };
  return flags[team] || "⚽";
}
