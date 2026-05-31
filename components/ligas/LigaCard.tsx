import Link from "next/link";
import { Users, Copy, Crown, ChevronRight } from "lucide-react";
import type { Liga } from "@/types";
import { toast } from "sonner";

interface LigaCardProps {
  liga: Liga;
  currentUserId?: string;
}

export function LigaCard({ liga, currentUserId }: LigaCardProps) {
  const isOwner = liga.owner_id === currentUserId;

  const copyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(liga.codigo);
    toast.success("Código copiado!");
  };

  return (
    <Link href={`/ligas/${liga.id}`}>
      <div className="gradient-card rounded-xl border border-white/10 hover:border-white/20 p-4 transition-all hover:shadow-lg group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Crown className="w-3 h-3 text-yellow-400" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-white text-sm">{liga.nombre}</h3>
              {isOwner && (
                <span className="text-xs text-yellow-400">Organizador</span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors mt-0.5" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span>
                {liga.miembros_count ?? "?"} miembro
                {(liga.miembros_count ?? 0) !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#10b981] transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md"
          >
            <span className="font-mono font-bold">{liga.codigo}</span>
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  );
}
