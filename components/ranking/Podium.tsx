import type { RankingEntry } from "@/types";
import { UserAvatar } from "@/components/ui/user-avatar";
import { cn } from "@/lib/utils";

interface PodiumProps {
  top3: RankingEntry[];
}

const CONFIG = [
  {
    pos: 2, order: "order-1", height: "h-20",
    bg: "bg-[#94A3B8]/10", border: "border-[#94A3B8]/25",
    label: "text-[#94A3B8]", labelShadow: "",
    medal: "🥈", posNum: "text-[#94A3B8]",
    avatarRing: "ring-2 ring-[#94A3B8]/40",
    pedestalGlow: "",
  },
  {
    pos: 1, order: "order-2", height: "h-28",
    bg: "bg-[#F5C451]/12", border: "border-[#F5C451]/35",
    label: "text-[#F5C451]", labelShadow: "drop-shadow-[0_0_8px_rgba(245,196,81,0.6)]",
    medal: "👑", posNum: "text-gradient-gold",
    avatarRing: "ring-2 ring-[#F5C451]/50 shadow-[0_0_16px_rgba(245,196,81,0.25)]",
    pedestalGlow: "shadow-[0_0_30px_rgba(245,196,81,0.15)]",
  },
  {
    pos: 3, order: "order-3", height: "h-14",
    bg: "bg-[#CD7F32]/10", border: "border-[#CD7F32]/25",
    label: "text-[#CD7F32]", labelShadow: "",
    medal: "🥉", posNum: "text-[#CD7F32]",
    avatarRing: "ring-2 ring-[#CD7F32]/35",
    pedestalGlow: "",
  },
];

export function Podium({ top3 }: PodiumProps) {
  if (top3.length === 0) {
    return (
      <div className="text-center py-10 text-[#475569] text-sm">
        Aún no hay datos para el podio
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center gap-3 py-6 px-4">
      {CONFIG.map((cfg) => {
        const entry = top3.find((e) => e.posicion === cfg.pos);
        if (!entry) return <div key={cfg.pos} className={cn("flex-1 max-w-[110px]", cfg.order)} />;

        return (
          <div key={cfg.pos} className={cn("flex-1 max-w-[110px] flex flex-col items-center gap-2", cfg.order)}>

            {/* Medal + Avatar */}
            <div className="flex flex-col items-center gap-1.5">
              {cfg.pos === 1 ? (
                <span className={cn("text-xl", cfg.labelShadow)}>{cfg.medal}</span>
              ) : (
                <span className="text-lg opacity-80">{cfg.medal}</span>
              )}

              <UserAvatar
                name={entry.usuario.nombre}
                colorId={entry.usuario.avatar}
                size="lg"
                className={cn("rounded-2xl", cfg.avatarRing)}
              />

              <span className="text-[11px] font-bold text-[#F8FAFC] text-center leading-tight max-w-[90px] truncate">
                {entry.usuario.nombre}
              </span>

              <span className={cn("text-sm font-black tabular-nums", cfg.label)}>
                {entry.puntos} pts
              </span>
              <span className="text-[10px] text-[#475569]">
                {entry.aciertos} aciertos
              </span>
            </div>

            {/* Pedestal */}
            <div className={cn(
              "w-full rounded-t-xl border-t-2 flex flex-col items-center justify-start pt-2",
              cfg.height, cfg.bg, cfg.border, cfg.pedestalGlow
            )}>
              <span className={cn("text-2xl font-black", cfg.posNum)}>
                {cfg.pos}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
