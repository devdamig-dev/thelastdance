"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Crown,
  Users,
  Trophy,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { Liga, MiembroLiga } from "@/types";
import { toast } from "sonner";

export default function LigaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [liga, setLiga] = useState<Liga | null>(null);
  const [miembros, setMiembros] = useState<MiembroLiga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchLiga = async () => {
      const supabase = createClient();

      const { data: ligaData } = await supabase
        .from("ligas")
        .select("*")
        .eq("id", id)
        .single();

      if (!ligaData) {
        router.push("/ligas");
        return;
      }
      setLiga(ligaData as Liga);

      const { data: miembrosData } = await supabase
        .from("miembros_liga")
        .select("*, usuarios(id, nombre, avatar, rol, created_at, pin)")
        .eq("liga_id", id)
        .order("created_at", { ascending: true });

      if (miembrosData) {
        type MiembroRow = {
          id: string;
          liga_id: string;
          usuario_id: string;
          created_at: string;
          usuarios: MiembroLiga["usuario"] | null;
        };
        setMiembros(
          (miembrosData as unknown as MiembroRow[]).map((m) => ({
            id: m.id,
            liga_id: m.liga_id,
            usuario_id: m.usuario_id,
            created_at: m.created_at,
            usuario: m.usuarios ?? undefined,
          }))
        );
      }
      setLoading(false);
    };
    fetchLiga();
  }, [id, router]);

  const copyCode = () => {
    if (!liga) return;
    navigator.clipboard.writeText(liga.codigo);
    toast.success("Código copiado!");
  };

  const shareLink = () => {
    if (!liga) return;
    const url = `${window.location.origin}/join/${liga.codigo}`;
    navigator.clipboard.writeText(url);
    toast.success("Link de invitación copiado!");
  };

  const leaveOrDelete = async () => {
    if (!user || !liga) return;
    const supabase = createClient();
    const isOwner = liga.owner_id === user.id;

    if (isOwner) {
      if (
        !confirm(
          `¿Seguro que querés eliminar la liga "${liga.nombre}"? Esta acción no se puede deshacer.`
        )
      )
        return;

      await supabase.from("ligas").delete().eq("id", liga.id);
      toast.success("Liga eliminada");
    } else {
      if (!confirm("¿Querés salir de esta liga?")) return;
      await supabase
        .from("miembros_liga")
        .delete()
        .eq("liga_id", liga.id)
        .eq("usuario_id", user.id);
      toast.success("Saliste de la liga");
    }
    router.push("/ligas");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-white/5 animate-pulse rounded-lg" />
        <div className="h-32 bg-white/5 animate-pulse rounded-xl" />
        <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!liga) return null;

  const isOwner = liga.owner_id === user?.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/ligas"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white truncate">
              {liga.nombre}
            </h1>
            {isOwner && (
              <Badge variant="warning" className="flex-shrink-0">
                <Crown className="w-3 h-3 mr-1" />
                Tuya
              </Badge>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {miembros.length} miembro{miembros.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Code card */}
      <div className="gradient-card rounded-xl border border-white/10 p-4">
        <p className="text-xs text-gray-400 mb-2">Código de invitación</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black font-mono text-[#10b981] tracking-widest flex-1">
            {liga.codigo}
          </span>
          <Button variant="ghost" size="icon" onClick={copyCode} title="Copiar código">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={shareLink} title="Compartir link">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Compartí este código para que tus amigos se unan
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href={`/ligas/${id}/ranking`} className="flex-1">
          <Button variant="default" className="w-full gap-2">
            <Trophy className="w-4 h-4" />
            Ver Ranking
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={leaveOrDelete}
          className="gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
          {isOwner ? "Eliminar" : "Salir"}
        </Button>
      </div>

      {/* Members */}
      <div className="gradient-card rounded-xl border border-white/10 p-4">
        <h2 className="font-bold text-white flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-blue-400" />
          Miembros ({miembros.length})
        </h2>
        <div className="space-y-2">
          {miembros.map((m, index) => (
            <div
              key={m.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-base flex-shrink-0">
                {m.usuario?.avatar ||
                  m.usuario?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {m.usuario?.nombre}
                  </span>
                  {m.usuario_id === liga.owner_id && (
                    <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                  )}
                  {m.usuario_id === user?.id && (
                    <Badge variant="secondary" className="text-[10px] py-0">
                      Tú
                    </Badge>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                #{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
