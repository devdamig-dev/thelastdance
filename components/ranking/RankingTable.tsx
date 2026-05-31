import type { RankingEntry } from "@/types";
import { cn } from "@/lib/utils";

interface RankingTableProps {
  entries: RankingEntry[];
  currentUserId?: string;
}

export function RankingTable({ entries, currentUserId }: RankingTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        El ranking estará disponible cuando haya pronósticos
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 px-3 py-1 text-xs text-gray-500 font-medium">
        <span className="w-6 text-center">#</span>
        <span>Jugador</span>
        <span className="text-center">Aciertos</span>
        <span className="text-center min-w-[50px]">Puntos</span>
      </div>

      {entries.map((entry) => {
        const isCurrentUser = entry.usuario.id === currentUserId;
        const isTop3 = entry.posicion <= 3;

        return (
          <div
            key={entry.usuario.id}
            className={cn(
              "grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center px-3 py-2.5 rounded-lg transition-colors",
              isCurrentUser
                ? "bg-[#00875a]/15 border border-[#00875a]/30"
                : "bg-white/5 hover:bg-white/8",
              isTop3 && !isCurrentUser && "bg-white/5"
            )}
          >
            {/* Position */}
            <div className="w-6 text-center">
              {entry.posicion === 1 ? (
                <span className="text-lg">🥇</span>
              ) : entry.posicion === 2 ? (
                <span className="text-lg">🥈</span>
              ) : entry.posicion === 3 ? (
                <span className="text-lg">🥉</span>
              ) : (
                <span className="text-sm font-bold text-gray-400">
                  {entry.posicion}
                </span>
              )}
            </div>

            {/* Name & Avatar */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-sm flex-shrink-0">
                {entry.usuario.avatar ||
                  entry.usuario.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span
                  className={cn(
                    "text-sm font-medium truncate block",
                    isCurrentUser ? "text-[#10b981]" : "text-white"
                  )}
                >
                  {entry.usuario.nombre}
                  {isCurrentUser && (
                    <span className="ml-1 text-xs opacity-75">(Tú)</span>
                  )}
                </span>
                {entry.racha > 1 && (
                  <span className="text-xs text-orange-400">
                    🔥 {entry.racha} seguidos
                  </span>
                )}
              </div>
            </div>

            {/* Aciertos */}
            <div className="text-center">
              <span className="text-sm text-gray-300">{entry.aciertos}</span>
            </div>

            {/* Points */}
            <div className="text-center min-w-[50px]">
              <span
                className={cn(
                  "text-sm font-bold",
                  isCurrentUser
                    ? "text-[#10b981]"
                    : entry.posicion <= 3
                    ? "text-yellow-400"
                    : "text-white"
                )}
              >
                {entry.puntos}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
