"use client";

import { useState } from "react";
import { Clock, Lock, CheckCircle2, XCircle } from "lucide-react";
import type { Partido, ResultadoPartido } from "@/types";
import { formatDate, isMatchStarted } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getPointsByPhase } from "@/lib/points";

const FASE_LABELS: Record<string, string> = {
  grupos: "Fase de Grupos",
  octavos: "Octavos de Final",
  cuartos: "Cuartos de Final",
  semifinal: "Semifinal",
  final: "Gran Final",
};

const FASE_BADGE: Record<string, string> = {
  grupos:   "badge-green",
  octavos:  "badge-blue",
  cuartos:  "badge-blue",
  semifinal:"badge-gold",
  final:    "badge-gold",
};

interface MatchCardProps {
  partido: Partido;
  pronostico?: ResultadoPartido;
  ligaId: string;
  onPronosticoChange?: (partidoId: string, ligaId: string, value: ResultadoPartido) => Promise<void>;
}

export function MatchCard({ partido, pronostico: initialPronostico, ligaId, onPronosticoChange }: MatchCardProps) {
  const [selected, setSelected] = useState<ResultadoPartido>(initialPronostico ?? null);
  const [saving, setSaving] = useState(false);
  const started = isMatchStarted(partido.fecha);
  const points = getPointsByPhase(partido.fase);

  const handleSelect = async (value: ResultadoPartido) => {
    if (started || !onPronosticoChange || selected === value) return;
    setSaving(true);
    setSelected(value);
    await onPronosticoChange(partido.id, ligaId, value);
    setSaving(false);
  };

  const hasResult = partido.resultado !== null;
  const isCorrect = hasResult && selected === partido.resultado;
  const isWrong = hasResult && selected !== null && !isCorrect;

  return (
    <div className={cn(
      "relative rounded-2xl border overflow-hidden transition-all duration-300",
      "bg-gradient-to-br from-white/7 to-white/3",
      started && !hasResult ? "border-white/6 opacity-70" : "border-white/10",
      isCorrect ? "border-[#00D084]/35 shadow-[0_0_24px_rgba(0,208,132,0.08)]" : "",
      isWrong ? "border-[#F87171]/25" : "",
      !started ? "hover:border-white/18" : "",
    )}>

      {/* Top bar: phase + status */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-0">
        <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full", FASE_BADGE[partido.fase] ?? "badge-green")}>
          {FASE_LABELS[partido.fase] ?? partido.fase}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#94A3B8] tabular-nums">
            {points} {points === 1 ? "pt" : "pts"}
          </span>
          {started && !hasResult && (
            <span className="flex items-center gap-1 text-[11px] text-[#475569]">
              <Lock className="w-3 h-3" /> En curso
            </span>
          )}
          {isCorrect && (
            <span className="flex items-center gap-1 text-[11px] text-[#00D084] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Acertaste
            </span>
          )}
          {isWrong && (
            <span className="flex items-center gap-1 text-[11px] text-[#F87171]">
              <XCircle className="w-3.5 h-3.5" /> Fallaste
            </span>
          )}
        </div>
      </div>

      {/* Teams row */}
      <div className="flex items-center px-4 py-4 gap-3">
        {/* Team A */}
        <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <div className="text-3xl leading-none">{getTeamFlag(partido.equipo_a)}</div>
          <span className="text-xs font-bold text-[#F8FAFC] text-center leading-tight truncate w-full text-center">
            {partido.equipo_a}
          </span>
        </div>

        {/* Center: VS or Result */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 px-1">
          {hasResult ? (
            <div className="text-center">
              <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Resultado</div>
              <div className="text-xs font-black text-[#F8FAFC] text-center leading-tight px-2">
                {partido.resultado === "1" ? partido.equipo_a : partido.resultado === "2" ? partido.equipo_b : "Empate"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[#475569] font-black text-lg">VS</span>
              <div className="flex items-center gap-1 text-[10px] text-[#475569]">
                <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatDate(partido.fecha)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <div className="text-3xl leading-none">{getTeamFlag(partido.equipo_b)}</div>
          <span className="text-xs font-bold text-[#F8FAFC] text-center leading-tight truncate w-full text-center">
            {partido.equipo_b}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 divider" />

      {/* 1 X 2 buttons */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {(["1", "X", "2"] as const).map((val) => {
          const isSelected = selected === val;
          const isResult = hasResult && partido.resultado === val;
          const isWrongChoice = hasResult && isSelected && !isResult;
          const label = val === "1"
            ? partido.equipo_a.split(" ")[0]
            : val === "2"
            ? partido.equipo_b.split(" ")[0]
            : "Empate";

          return (
            <button
              key={val}
              onClick={() => handleSelect(val)}
              disabled={started || saving}
              className={cn(
                "h-11 rounded-xl text-xs font-bold transition-all duration-200 border relative overflow-hidden",
                /* Unselected, not started */
                !started && !isSelected
                  ? "bg-white/5 border-white/8 text-[#94A3B8] hover:bg-white/10 hover:border-white/15 hover:text-[#F8FAFC] active:scale-95"
                  : "",
                /* Selected, not started */
                isSelected && !hasResult
                  ? "bg-[#00D084]/15 border-[#00D084]/45 text-[#00D084] shadow-[0_0_12px_rgba(0,208,132,0.2)]"
                  : "",
                /* Correct result */
                isResult
                  ? "bg-[#00D084]/20 border-[#00D084]/50 text-[#00D084] font-black"
                  : "",
                /* Wrong choice */
                isWrongChoice
                  ? "bg-[#F87171]/10 border-[#F87171]/30 text-[#F87171]"
                  : "",
                /* Started, not selected, not result */
                started && !isResult && !isSelected
                  ? "bg-white/4 border-white/6 text-[#475569] cursor-not-allowed"
                  : "",
                /* Val header */
                "flex flex-col items-center justify-center gap-0.5"
              )}
            >
              {saving && isSelected ? (
                <Spinner />
              ) : (
                <>
                  <span className="text-base font-black leading-none">{val}</span>
                  <span className="text-[9px] leading-none opacity-70 truncate max-w-full px-1">{label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Pronóstico label */}
      {selected && !started && (
        <div className="px-4 pb-3 text-center">
          <span className="text-[11px] text-[#475569]">
            Tu pronóstico:{" "}
            <span className="text-[#00D084] font-semibold">
              {selected === "1" ? partido.equipo_a : selected === "2" ? partido.equipo_b : "Empate"}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function getTeamFlag(team: string): string {
  const flags: Record<string, string> = {
    Argentina: "🇦🇷", Brasil: "🇧🇷", Francia: "🇫🇷", España: "🇪🇸",
    Alemania: "🇩🇪", México: "🇲🇽", Uruguay: "🇺🇾", Portugal: "🇵🇹",
    Colombia: "🇨🇴", Chile: "🇨🇱", Italia: "🇮🇹", Inglaterra: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "Estados Unidos": "🇺🇸", Marruecos: "🇲🇦", Japón: "🇯🇵", Croacia: "🇭🇷",
    Holanda: "🇳🇱", Ecuador: "🇪🇨", Suiza: "🇨🇭", Bélgica: "🇧🇪",
    Ghana: "🇬🇭", Camerún: "🇨🇲", Senegal: "🇸🇳", Perú: "🇵🇪",
    Paraguay: "🇵🇾", Bolivia: "🇧🇴", Venezuela: "🇻🇪", Costa: "🇨🇷",
  };
  return flags[team] ?? "🏳️";
}
