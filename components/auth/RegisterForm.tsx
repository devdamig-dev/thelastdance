"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const AVATARES = ["⚽", "🏆", "🦁", "🦅", "🔥", "⚡", "🌟", "🎯", "🦊", "🐯"];

const schema = z
  .object({
    nombre: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(30, "Máximo 30 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ0-9_ ]+$/, "Solo letras, números, guión y espacios"),
    pin: z
      .string()
      .min(4, "El PIN debe tener entre 4 y 6 dígitos")
      .max(6, "El PIN debe tener entre 4 y 6 dígitos")
      .regex(/^\d+$/, "Solo números"),
    confirmPin: z.string(),
  })
  .refine((d) => d.pin === d.confirmPin, {
    message: "Los PINs no coinciden",
    path: ["confirmPin"],
  });

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARES[0]);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Check if name taken
      const { data: existing } = await supabase
        .from("usuarios")
        .select("id")
        .eq("nombre", data.nombre.trim())
        .single();

      if (existing) {
        toast.error("Ese nombre ya está en uso. Elegí otro.");
        return;
      }

      const { data: newUserRaw, error } = await supabase
        .from("usuarios")
        .insert({
          nombre: data.nombre.trim(),
          pin: data.pin,
          avatar: selectedAvatar,
          rol: "user",
        })
        .select()
        .single();

      if (error || !newUserRaw) {
        toast.error("Error al crear la cuenta. Intenta de nuevo.");
        return;
      }

      const newUser = newUserRaw as {
        id: string;
        nombre: string;
        pin: string;
        avatar: string | null;
        rol: string;
        created_at: string;
      };

      login({
        id: newUser.id,
        nombre: newUser.nombre,
        pin: newUser.pin,
        avatar: newUser.avatar,
        rol: newUser.rol as "user" | "admin",
        created_at: newUser.created_at,
      });

      toast.success("¡Cuenta creada! Bienvenido al prode.");
      router.push("/dashboard");
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white">PRODE MUNDIAL</h1>
        <p className="text-gray-400 mt-1">Creá tu cuenta</p>
      </div>

      <div className="gradient-card rounded-2xl border border-white/10 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar selector */}
          <div className="space-y-2">
            <Label>Elegí tu avatar</Label>
            <div className="flex flex-wrap gap-2">
              {AVATARES.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? "bg-[#00875a] ring-2 ring-[#10b981]"
                      : "bg-[#1a1a1a] hover:bg-[#222]"
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de usuario</Label>
            <Input
              id="nombre"
              placeholder="Cómo querés llamarte en la liga"
              {...register("nombre")}
              autoComplete="username"
            />
            {errors.nombre && (
              <p className="text-xs text-red-400">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">PIN (4-6 dígitos)</Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                placeholder="Elegí tu PIN secreto"
                inputMode="numeric"
                {...register("pin")}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPin ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.pin && (
              <p className="text-xs text-red-400">{errors.pin.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirmar PIN</Label>
            <Input
              id="confirmPin"
              type="password"
              placeholder="Repetí tu PIN"
              inputMode="numeric"
              {...register("confirmPin")}
              autoComplete="new-password"
            />
            {errors.confirmPin && (
              <p className="text-xs text-red-400">
                {errors.confirmPin.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creando cuenta...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Crear cuenta
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="text-[#10b981] hover:text-emerald-300 font-medium"
          >
            Ingresar
          </Link>
        </div>
      </div>
    </div>
  );
}
