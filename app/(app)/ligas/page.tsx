"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, UserPlus, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LigaCard } from "@/components/ligas/LigaCard";
import { JoinLigaForm } from "@/components/ligas/JoinLigaForm";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { Liga } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LigasPage() {
  const { user } = useAuth();
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchLigas = async () => {
      const supabase = createClient();
      const { data: miembros } = await supabase
        .from("miembros_liga")
        .select(
          "liga_id, ligas(id, nombre, codigo, owner_id, torneo_id, created_at)"
        )
        .eq("usuario_id", user.id);

      if (miembros) {
        const ligasData = (miembros as unknown as Array<{ ligas: Liga | Liga[] | null }>)
          .map((m) => {
            const l = m.ligas;
            return Array.isArray(l) ? l[0] : l;
          })
          .filter(Boolean) as Liga[];

        // Fetch member counts
        const ligasWithCounts = await Promise.all(
          ligasData.map(async (liga) => {
            const { count } = await supabase
              .from("miembros_liga")
              .select("id", { count: "exact", head: true })
              .eq("liga_id", liga.id);
            return { ...liga, miembros_count: count ?? 0 };
          })
        );

        setLigas(ligasWithCounts);
      }
      setLoading(false);
    };
    fetchLigas();
  }, [user]);

  const filtered = ligas.filter((l) =>
    l.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Mis Ligas</h1>
          <p className="text-gray-400 text-sm mt-1">
            {ligas.length} liga{ligas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Unirse</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unirse a una Liga</DialogTitle>
              </DialogHeader>
              <JoinLigaForm />
            </DialogContent>
          </Dialog>
          <Link href="/ligas/crear">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Liga</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      {ligas.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar liga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {search ? "No se encontraron ligas" : "Todavía no estás en ninguna liga"}
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            {search
              ? "Intenta con otro nombre"
              : "Creá una liga propia o unite a la de un amigo con su código"}
          </p>
          {!search && (
            <div className="flex gap-3 justify-center">
              <Link href="/ligas/crear">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Crear Liga
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setJoinOpen(true)}
                className="gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Unirse
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((liga) => (
            <LigaCard key={liga.id} liga={liga} currentUserId={user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
