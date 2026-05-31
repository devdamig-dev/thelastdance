"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  codigo: z
    .string()
    .min(7, "El código tiene 7 caracteres")
    .max(7, "El código tiene 7 caracteres")
    .toUpperCase(),
});

type FormData = z.infer<typeof schema>;

interface JoinLigaFormProps {
  initialCode?: string;
}

export function JoinLigaForm({ initialCode }: JoinLigaFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { codigo: initialCode || "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();

      const { data: liga, error } = await supabase
        .from("ligas")
        .select("id, nombre")
        .eq("codigo", data.codigo.toUpperCase())
        .single();

      if (error || !liga) {
        toast.error("Código de liga inválido. Verificá que sea correcto.");
        return;
      }

      // Check if already member
      const { data: existing } = await supabase
        .from("miembros_liga")
        .select("id")
        .eq("liga_id", liga.id)
        .eq("usuario_id", user.id)
        .single();

      if (existing) {
        toast.info("Ya sos miembro de esta liga");
        router.push(`/ligas/${liga.id}`);
        return;
      }

      // Join
      const { error: joinError } = await supabase
        .from("miembros_liga")
        .insert({ liga_id: liga.id, usuario_id: user.id });

      if (joinError) {
        toast.error("Error al unirse a la liga");
        return;
      }

      toast.success(`Te uniste a "${liga.nombre}"!`);
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
        <Label htmlFor="codigo">Código de la liga</Label>
        <Input
          id="codigo"
          placeholder="XXXXXXX (7 caracteres)"
          className="font-mono tracking-widest uppercase text-center text-lg"
          maxLength={7}
          {...register("codigo")}
          onChange={(e) => {
            e.target.value = e.target.value.toUpperCase();
          }}
        />
        {errors.codigo && (
          <p className="text-xs text-red-400">{errors.codigo.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          "Uniéndose..."
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Unirse a la Liga
          </>
        )}
      </Button>
    </form>
  );
}
