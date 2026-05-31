"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Users, ArrowRight } from "lucide-react";
import { JoinLigaForm } from "@/components/ligas/JoinLigaForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

interface LigaInfo {
  nombre: string;
  codigo: string;
  miembros: number;
}

export default function JoinPage() {
  const { codigo } = useParams<{ codigo: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [ligaInfo, setLigaInfo] = useState<LigaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigo) return;
    const fetchLiga = async () => {
      const supabase = createClient();
      const { data: liga } = await supabase
        .from("ligas")
        .select("nombre, codigo, id")
        .eq("codigo", codigo.toUpperCase())
        .single();

      if (liga) {
        const { count } = await supabase
          .from("miembros_liga")
          .select("id", { count: "exact", head: true })
          .eq("liga_id", liga.id);

        setLigaInfo({
          nombre: liga.nombre,
          codigo: liga.codigo,
          miembros: count || 0,
        });
      }
      setLoading(false);
    };
    fetchLiga();
  }, [codigo]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Unirse a Liga</h1>
          {loading ? (
            <div className="h-5 w-40 bg-white/10 rounded animate-pulse mx-auto mt-2" />
          ) : ligaInfo ? (
            <p className="text-gray-400 mt-2">
              Te invitaron a{" "}
              <span className="text-[#10b981] font-bold">
                {ligaInfo.nombre}
              </span>
            </p>
          ) : (
            <p className="text-red-400 mt-2">Liga no encontrada</p>
          )}
        </div>

        {!loading && ligaInfo && (
          <div className="gradient-card rounded-2xl border border-white/10 p-6 space-y-4 mb-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-bold text-white">{ligaInfo.nombre}</div>
                <div className="text-xs text-gray-400 font-mono">
                  Código: {ligaInfo.codigo}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{ligaInfo.miembros}</span>
              </div>
            </div>

            {user ? (
              <JoinLigaForm initialCode={codigo} />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 text-center">
                  Para unirte necesitás crear una cuenta o ingresar
                </p>
                <Link href={`/register?join=${codigo}`}>
                  <Button size="lg" className="w-full gap-2">
                    Crear cuenta y unirse
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/login?join=${codigo}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Ya tengo cuenta - Ingresar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
