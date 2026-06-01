"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(30, "Máximo 30 caracteres"),
  pin: z
    .string()
    .min(4, "El PIN debe tener entre 4 y 6 dígitos")
    .max(6, "El PIN debe tener entre 4 y 6 dígitos")
    .regex(/^\d+$/, "Solo números"),
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
        id: string; nombre: string; pin: string;
        avatar: string | null; rol: string; created_at: string;
      };

      login({
        id: user.id, nombre: user.nombre, pin: user.pin,
        avatar: user.avatar, rol: user.rol as "user" | "admin",
        created_at: user.created_at,
      });

      toast.success(`Bienvenido, ${userData.nombre}!`);
      router.push(user.rol === "admin" ? "/admin" : "/dashboard");
    } catch {
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">

      {/* Logo & header */}
      <div className="text-center mb-8">
        <div className="relative inline-flex mb-5">
          <div className="w-18 h-18 gradient-brand rounded-2xl flex items-center justify-center glow-green shadow-2xl">
            <WorldCupIcon className="w-9 h-9 text-white" />
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-2xl bg-[#00D084]/20 blur-xl -z-10" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
          PRODE <span className="text-gradient">MUNDIAL</span>
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1.5">Ingresá a tu cuenta</p>
      </div>

      {/* Form card */}
      <div className="glass-elevated rounded-2xl p-6 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1.5">
            <Label htmlFor="nombre" className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              Nombre de usuario
            </Label>
            <Input
              id="nombre"
              placeholder="Tu nombre en la liga"
              {...register("nombre")}
              autoComplete="username"
              className={cn(errors.nombre && "border-[#F87171]/50 focus-visible:border-[#F87171] focus-visible:ring-[#F87171]/20")}
            />
            {errors.nombre && (
              <p className="text-xs text-[#F87171] flex items-center gap-1">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#F87171]/15 text-center text-[9px] leading-3.5">!</span>
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pin" className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              PIN
            </Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                placeholder="4–6 dígitos"
                inputMode="numeric"
                {...register("pin")}
                autoComplete="current-password"
                className={cn(
                  "pr-12 font-mono tracking-widest",
                  errors.pin && "border-[#F87171]/50 focus-visible:border-[#F87171] focus-visible:ring-[#F87171]/20"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.pin && (
              <p className="text-xs text-[#F87171]">{errors.pin.message}</p>
            )}
          </div>

          <div className="pt-1">
            <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  Ingresar <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[#475569] text-xs">¿nuevo aquí?</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <Link
          href="/register"
          className="flex items-center justify-center gap-2 h-11 w-full rounded-xl border border-white/10 bg-white/4 text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/8 hover:border-white/18 transition-all duration-200"
        >
          Crear una cuenta gratis
        </Link>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-[#475569]">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Tu PIN es privado y nunca se comparte</span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Ingresando...
    </span>
  );
}

function WorldCupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
