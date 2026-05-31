import type { RankingEntry } from "@/types";

interface PodiumProps {
  top3: RankingEntry[];
}

const MEDAL_CONFIG = [
  {
    pos: 1,
    height: "h-24",
    bg: "bg-yellow-400/20",
    border: "border-yellow-400/40",
    text: "text-yellow-400",
    medal: "🥇",
    order: "order-2",
  },
  {
    pos: 2,
    height: "h-16",
    bg: "bg-gray-400/10",
    border: "border-gray-400/30",
    text: "text-gray-300",
    medal: "🥈",
    order: "order-1",
  },
  {
    pos: 3,
    height: "h-12",
    bg: "bg-amber-700/10",
    border: "border-amber-700/30",
    text: "text-amber-600",
    medal: "🥉",
    order: "order-3",
  },
];

export function Podium({ top3 }: PodiumProps) {
  if (top3.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Aún no hay datos para el podio
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center gap-3 py-4">
      {MEDAL_CONFIG.map((config) => {
        const entry = top3.find((e) => e.posicion === config.pos);
        if (!entry) return null;

        return (
          <div
            key={config.pos}
            className={`flex flex-col items-center gap-2 flex-1 max-w-[120px] ${config.order}`}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl">{config.medal}</div>
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-white/20 flex items-center justify-center text-xl">
                {entry.usuario.avatar || entry.usuario.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="text-xs font-bold text-white text-center leading-tight max-w-[80px] truncate">
                {entry.usuario.nombre}
              </div>
              <div className={`text-sm font-black ${config.text}`}>
                {entry.puntos} pts
              </div>
            </div>

            {/* Podium block */}
            <div
              className={`w-full ${config.height} ${config.bg} border-t-2 ${config.border} rounded-t-lg flex items-center justify-center`}
            >
              <span className={`text-xl font-black ${config.text}`}>
                {config.pos}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
