"use client";

import Link from "next/link";
import { Users, Copy, Crown, ChevronRight } from "lucide-react";
import type { Liga } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LigaCardProps {
  liga: Liga;
  currentUserId?: string;
}

export function LigaCard({ liga, currentUserId }: LigaCardProps) {
  const isOwner = liga.owner_id === currentUserId;

  const copyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(liga.codigo);
    toast.success("Código copiado");
  };

  return (
    <Link href={`/ligas/${liga.id}`}>
      <div className={cn(
        "rounded-2xl border p-4 transition-all duration-200 group hover:border-white/18 hover:shadow-lg",
        "bg-gradient-to-br from-white/7 to-white/3",
        isOwner ? "border-[#F5C451]/20" : "border-white/10",
      )}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Liga icon */}
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
              isOwner ? "bg-[#F5C451]/12 border border-[#F5C451]/25" : "bg-[#00D084]/10 border border-[#00D084]/20"
            )}>
              {isOwner
                ? <Crown className="w-4 h-4 text-[#F5C451]" />
                : <Users className="w-4 h-4 text-[#00D084]" />
              }
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[#F8FAFC] text-sm truncate">{liga.nombre}</h3>
              {isOwner && (
                <span className="text-[11px] text-[#F5C451] font-medium">Organizador</span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94A3B8] transition-colors flex-shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <Users className="w-3.5 h-3.5 text-[#475569]" />
            <span>
              {liga.miembros_count ?? "?"} miembro{(liga.miembros_count ?? 0) !== 1 ? "s" : ""}
            </span>
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#00D084] transition-colors rounded-lg px-2.5 py-1.5 border border-white/8 hover:border-[#00D084]/25 hover:bg-[#00D084]/5"
          >
            <span className="font-mono font-bold tracking-wider">{liga.codigo}</span>
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  );
}
