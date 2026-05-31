"use client";

import { useEffect, useState } from "react";
import { Plus, Calendar, Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Partido, Torneo, ResultadoPartido, FasePartido } from "@/types";
import { formatDate } from "@/lib/utils";

const FASES: FasePartido[] = [
  "grupos",
  "octavos",
  "cuartos",
  "semifinal",
  "final",
];

interface FormData {
  torneo_id: string;
  equipo_a: string;
  equipo_b: string;
  fecha: string;
  fase: FasePartido;
}

export default function AdminPartidosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingResultado, setEditingResultado] = useState<string | null>(null);
  const [filterTorneo, setFilterTorneo] = useState<string>("all");
  const [form, setForm] = useState<FormData>({
    torneo_id: "",
    equipo_a: "",
    equipo_b: "",
    fecha: new Date().toISOString().slice(0, 16),
    fase: "grupos",
  });

  const fetchData = async () => {
    const supabase = createClient();
    const [torneosRes, partidosRes] = await Promise.all([
      supabase.from("torneos").select("*").order("anio", { ascending: false }),
      supabase
        .from("partidos")
        .select("*, torneos(id, nombre, anio, activo)")
        .order("fecha", { ascending: true }),
    ]);

    if (torneosRes.data) {
      setTorneos(torneosRes.data as Torneo[]);
      if (torneosRes.data.length > 0) {
        const active =
          torneosRes.data.find((t) => t.activo) || torneosRes.data[0];
        setForm((f) => ({ ...f, torneo_id: active.id }));
      }
    }
    if (partidosRes.data) {
      setPartidos(
        partidosRes.data.map((p) => ({
          ...p,
          resultado: p.resultado as ResultadoPartido,
          fase: p.fase as FasePartido,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!form.equipo_a.trim() || !form.equipo_b.trim() || !form.torneo_id) {
      toast.error("Completá todos los campos");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("partidos").insert({
      torneo_id: form.torneo_id,
      equipo_a: form.equipo_a.trim(),
      equipo_b: form.equipo_b.trim(),
      fecha: new Date(form.fecha).toISOString(),
      fase: form.fase,
    });
    if (error) {
      toast.error("Error al crear partido");
    } else {
      toast.success("Partido creado");
      setCreating(false);
      setForm((f) => ({ ...f, equipo_a: "", equipo_b: "" }));
      fetchData();
    }
  };

  const setResultado = async (
    partidoId: string,
    resultado: ResultadoPartido
  ) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("partidos")
      .update({ resultado })
      .eq("id", partidoId);
    if (error) {
      toast.error("Error al cargar resultado");
    } else {
      toast.success("Resultado cargado");
      setEditingResultado(null);
      fetchData();
    }
  };

  const deletePartido = async (id: string) => {
    if (!confirm("¿Eliminar este partido?")) return;
    const supabase = createClient();
    await supabase.from("partidos").delete().eq("id", id);
    toast.success("Partido eliminado");
    fetchData();
  };

  const filtered =
    filterTorneo === "all"
      ? partidos
      : partidos.filter((p) => p.torneo_id === filterTorneo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Partidos</h1>
          <p className="text-gray-400 text-sm">{filtered.length} partidos</p>
        </div>
        <Button
          size="sm"
          onClick={() => setCreating(!creating)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </Button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="gradient-card rounded-xl border border-white/10 p-4 space-y-4">
          <h3 className="font-bold text-white">Nuevo Partido</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label>Torneo</Label>
              <Select
                value={form.torneo_id}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, torneo_id: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar torneo" />
                </SelectTrigger>
                <SelectContent>
                  {torneos.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label>Fase</Label>
              <Select
                value={form.fase}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, fase: v as FasePartido }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FASES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Equipo Local</Label>
              <Input
                placeholder="Ej: Argentina"
                value={form.equipo_a}
                onChange={(e) =>
                  setForm((f) => ({ ...f, equipo_a: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Equipo Visitante</Label>
              <Input
                placeholder="Ej: Brasil"
                value={form.equipo_b}
                onChange={(e) =>
                  setForm((f) => ({ ...f, equipo_b: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>Fecha y Hora</Label>
              <Input
                type="datetime-local"
                value={form.fecha}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fecha: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate}>Crear Partido</Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Filter */}
      {torneos.length > 1 && (
        <Select value={filterTorneo} onValueChange={setFilterTorneo}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Todos los torneos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los torneos</SelectItem>
            {torneos.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No hay partidos cargados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((partido) => (
            <div
              key={partido.id}
              className="gradient-card rounded-xl border border-white/10 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {partido.fase}
                    </Badge>
                    {partido.resultado && (
                      <Badge variant="success" className="text-[10px]">
                        <Check className="w-2.5 h-2.5 mr-1" />
                        {partido.resultado === "1"
                          ? partido.equipo_a
                          : partido.resultado === "2"
                          ? partido.equipo_b
                          : "Empate"}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {partido.equipo_a} vs {partido.equipo_b}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(partido.fecha)}
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setEditingResultado(
                        editingResultado === partido.id ? null : partido.id
                      )
                    }
                    className="text-yellow-400 hover:text-yellow-300"
                    title="Cargar resultado"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePartido(partido.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Resultado editor */}
              {editingResultado === partido.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-400 mb-2">
                    Cargar resultado:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["1", "X", "2"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setResultado(partido.id, r)}
                        className={`py-2 rounded-lg text-sm font-bold transition-all ${
                          partido.resultado === r
                            ? "bg-[#00875a] text-white"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {r === "1"
                          ? partido.equipo_a
                          : r === "2"
                          ? partido.equipo_b
                          : "Empate"}
                      </button>
                    ))}
                  </div>
                  {partido.resultado && (
                    <button
                      onClick={() => setResultado(partido.id, null)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Borrar resultado
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
