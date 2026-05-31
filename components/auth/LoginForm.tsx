"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(30, "Máximo 30 caracteres"),
  pin: z
    .string()
    .min(4, "El PIN debe tener entre 4 y 6 dígitos")
    .max(6, "El PIN debe tener entre 4 y 6 dígitos")
    .regex(/^\d+$/, "El PIN solo debe contener números"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const { data: userData, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("nombre", data.nombre.trim())
        .eq("pin", data.pin)
        .single();

      if (error || !userData) {
        toast.error("Nombre o PIN incorrecto");
        return;
      }

      const user = userData as {
        id: string;
        nombre: string;
        pin: string;
        avatar: string | null;
        rol: string;
        created_at: string;
      };

      login({
        id: user.id,
        nombre: user.nombre,
        pin: user.pin,
        avatar: user.avatar,
        rol: user.rol as "user" | "admin",
        created_at: user.created_at,
      });

      toast.success(`Bienvenido, ${userData.nombre}!`);

      if (user.rol === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
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
        <p className="text-gray-400 mt-1">Ingresá a tu cuenta</p>
      </div>

      <div className="gradient-card rounded-2xl border border-white/10 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de usuario</Label>
            <Input
              id="nombre"
              placeholder="Tu nombre en la liga"
              {...register("nombre")}
              autoComplete="username"
            />
            {errors.nombre && (
              <p className="text-xs text-red-400">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                placeholder="4-6 dígitos"
                inputMode="numeric"
                {...register("pin")}
                autoComplete="current-password"
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
                Ingresando...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Ingresar
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="text-[#10b981] hover:text-emerald-300 font-medium"
          >
            Registrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
