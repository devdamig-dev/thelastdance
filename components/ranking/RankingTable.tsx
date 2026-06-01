import type { RankingEntry } from "@/types";
import { UserAvatar } from "@/components/ui/user-avatar";
import { cn } from "@/lib/utils";

interface RankingTableProps {
  entries: RankingEntry[];
  currentUserId?: string;
}

const POSITION_STYLE = {
  1: { badge: "text-[#F5C451] text-lg", glow: "shadow-[0_0_12px_rgba(245,196,81,0.12)]", pts: "text-[#F5C451]" },
  2: { badge: "text-[#94A3B8] text-lg", glow: "", pts: "text-[#94A3B8]" },
  3: { badge: "text-[#CD7F32] text-base", glow: "", pts: "text-[#CD7F32]" },
};
const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function RankingTable({ entries, currentUserId }: RankingTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-10 text-[#475569] text-sm">
        El ranking estará disponible cuando haya pronósticos
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_3.5rem_3.5rem] gap-3 px-3 pb-1">
        <span className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider text-center">#</span>
        <span className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">Jugador</span>
        <span className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider text-center">Aciertos</span>
        <span className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider text-center">Puntos</span>
      </div>

      {entries.map((entry) => {
        const isMe = entry.usuario.id === currentUserId;
        const pos = entry.posicion as 1 | 2 | 3;
        const style = POSITION_STYLE[pos];
        const medal = MEDALS[pos];

        return (
          <div
            key={entry.usuario.id}
            className={cn(
              "grid grid-cols-[2rem_1fr_3.5rem_3.5rem] gap-3 items-center px-3 py-2.5 rounded-xl transition-colors",
              isMe
                ? "bg-[#00D084]/10 border border-[#00D084]/25"
                : pos <= 3
                ? `bg-white/6 border border-white/8 ${style?.glow ?? ""}`
                : "bg-white/4 border border-white/6 hover:bg-white/6"
            )}
          >
            {/* Position */}
            <div className="text-center">
              {medal ? (
                <span className={style?.badge ?? "text-base"}>{medal}</span>
              ) : (
                <span className="text-sm font-bold text-[#475569] tabular-nums">{entry.posicion}</span>
              )}
            </div>

            {/* Avatar + Name */}
            <div className="flex items-center gap-2 min-w-0">
              <UserAvatar
                name={entry.usuario.nombre}
                colorId={entry.usuario.avatar}
                size="sm"
                className="rounded-xl flex-shrink-0"
              />
              <div className="min-w-0">
                <p className={cn(
                  "text-sm font-semibold truncate",
                  isMe ? "text-[#00D084]" : "text-[#F8FAFC]"
                )}>
                  {entry.usuario.nombre}
                  {isMe && <span className="text-xs font-normal text-[#00D084]/70 ml-1">(Tú)</span>}
                </p>
                {entry.racha > 1 && (
                  <p className="text-[11px] text-[#FB923C]">🔥 {entry.racha} seguidos</p>
                )}
              </div>
            </div>

            {/* Aciertos */}
            <div className="text-center">
              <span className="text-sm font-medium text-[#94A3B8] tabular-nums">{entry.aciertos}</span>
            </div>

            {/* Points */}
            <div className="text-center">
              <span className={cn(
                "text-sm font-black tabular-nums",
                isMe ? "text-[#00D084]" : (style?.pts ?? "text-[#F8FAFC]")
              )}>
                {entry.puntos}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
