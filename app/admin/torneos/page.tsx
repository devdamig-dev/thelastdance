"use client";

import { useEffect, useState } from "react";
import { Plus, Trophy, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Torneo } from "@/types";

export default function AdminTorneosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", anio: new Date().getFullYear() });

  const fetchTorneos = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("torneos")
      .select("*")
      .order("anio", { ascending: false });
    if (data) setTorneos(data as Torneo[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  const handleCreate = async () => {
    if (!formData.nombre.trim()) return;
    const supabase = createClient();
    const { error } = await supabase.from("torneos").insert({
      nombre: formData.nombre.trim(),
      anio: formData.anio,
      activo: false,
    });
    if (error) {
      toast.error("Error al crear torneo");
    } else {
      toast.success("Torneo creado");
      setFormData({ nombre: "", anio: new Date().getFullYear() });
      setCreating(false);
      fetchTorneos();
    }
  };

  const toggleActivo = async (torneo: Torneo) => {
    const supabase = createClient();

    if (!torneo.activo) {
      // Deactivate all, activate this one
      await supabase.from("torneos").update({ activo: false }).neq("id", "");
    }

    await supabase
      .from("torneos")
      .update({ activo: !torneo.activo })
      .eq("id", torneo.id);

    toast.success(torneo.activo ? "Torneo desactivado" : "Torneo activado");
    fetchTorneos();
  };

  const deleteTorneo = async (id: string) => {
    if (!confirm("¿Eliminar este torneo? Se eliminarán todos sus partidos.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("torneos").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Torneo eliminado");
      fetchTorneos();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Torneos</h1>
          <p className="text-gray-400 text-sm">Gestión de torneos del sistema</p>
        </div>
        <Button size="sm" onClick={() => setCreating(!creating)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo
        </Button>
      </div>

      {creating && (
        <div className="gradient-card rounded-xl border border-white/10 p-4 space-y-4">
          <h3 className="font-bold text-white">Crear Torneo</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input
                placeholder="Ej: Mundial 2026"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, nombre: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Año</Label>
              <Input
                type="number"
                value={formData.anio}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, anio: parseInt(e.target.value) }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate}>Crear Torneo</Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : torneos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No hay torneos creados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {torneos.map((torneo) => (
            <div
              key={torneo.id}
              className="gradient-card rounded-xl border border-white/10 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="font-bold text-white">{torneo.nombre}</div>
                  <div className="text-xs text-gray-400">{torneo.anio}</div>
                </div>
                {torneo.activo && (
                  <span className="text-xs bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    Activo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActivo(torneo)}
                  title={torneo.activo ? "Desactivar" : "Activar"}
                >
                  {torneo.activo ? (
                    <ToggleRight className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTorneo(torneo.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
