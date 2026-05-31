"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { generateCode } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  nombre: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function CreateLigaForm() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const supabase = createClient();

      // Get active tournament
      const { data: torneo } = await supabase
        .from("torneos")
        .select("id")
        .eq("activo", true)
        .single();

      const codigo = generateCode(7);

      const { data: liga, error } = await supabase
        .from("ligas")
        .insert({
          nombre: data.nombre.trim(),
          codigo,
          owner_id: user.id,
          torneo_id: torneo?.id ?? null,
        })
        .select()
        .single();

      if (error || !liga) {
        toast.error("Error al crear la liga");
        return;
      }

      // Add owner as member
      await supabase.from("miembros_liga").insert({
        liga_id: liga.id,
        usuario_id: user.id,
      });

      toast.success(`Liga "${liga.nombre}" creada! Código: ${codigo}`);
      router.push(`/ligas/${liga.id}`);
    } catch {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la liga</Label>
        <Input
          id="nombre"
          placeholder="Ej: Los Cracks del Trabajo"
          {...register("nombre")}
        />
        {errors.nombre && (
          <p className="text-xs text-red-400">{errors.nombre.message}</p>
        )}
        <p className="text-xs text-gray-400">
          Elegí un nombre divertido para tu liga
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          "Creando..."
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Crear Liga
          </>
        )}
      </Button>
    </form>
  );
}
