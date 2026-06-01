"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* Avatar system: color + initial, no random emojis */
const AVATAR_COLORS = [
  { id: "green",  from: "#00D084", to: "#007A4D" },
  { id: "blue",   from: "#3B82F6", to: "#1D4ED8" },
  { id: "purple", from: "#A855F7", to: "#7C3AED" },
  { id: "gold",   from: "#F5C451", to: "#D4A017" },
  { id: "red",    from: "#F87171", to: "#DC2626" },
  { id: "cyan",   from: "#22D3EE", to: "#0891B2" },
  { id: "orange", from: "#FB923C", to: "#EA580C" },
  { id: "pink",   from: "#F472B6", to: "#DB2777" },
];

const schema = z
  .object({
    nombre: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(30, "Máximo 30 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ0-9_. ]+$/, "Solo letras, números y puntos"),
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
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0].id);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const nombreValue = watch("nombre") || "";
  const initial = nombreValue.trim().charAt(0).toUpperCase() || "?";
  const activeColor = AVATAR_COLORS.find((c) => c.id === selectedColor) ?? AVATAR_COLORS[0];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();

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
          avatar: selectedColor,
          rol: "user",
        })
        .select()
        .single();

      if (error || !newUserRaw) {
        toast.error("Error al crear la cuenta. Intenta de nuevo.");
        return;
      }

      const newUser = newUserRaw as {
        id: string; nombre: string; pin: string;
        avatar: string | null; rol: string; created_at: string;
      };

      login({
        id: newUser.id, nombre: newUser.nombre, pin: newUser.pin,
        avatar: newUser.avatar, rol: newUser.rol as "user" | "admin",
        created_at: newUser.created_at,
      });

      toast.success("¡Bienvenido al prode!");
      router.push("/dashboard");
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">

      {/* Logo */}
      <div className="text-center mb-7">
        <div className="relative inline-flex mb-5">
          <div className="w-18 h-18 gradient-brand rounded-2xl flex items-center justify-center glow-green shadow-2xl">
            <WorldCupIcon className="w-9 h-9 text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-[#00D084]/20 blur-xl -z-10" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#F8FAFC]">
          PRODE <span className="text-gradient">MUNDIAL</span>
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1.5">Creá tu cuenta</p>
      </div>

      <div className="glass-elevated rounded-3xl p-6 md:p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[18px]">

          {/* Avatar preview + color picker */}
          <div className="space-y-3">
            <Label className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              Tu avatar
            </Label>

            <div className="flex items-center gap-4">
              {/* Live preview */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0 shadow-lg transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${activeColor.from}, ${activeColor.to})` }}
              >
                {initial}
              </div>

              {/* Color grid */}
              <div className="grid grid-cols-4 gap-2.5 flex-1">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className="relative w-full aspect-square max-w-9 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 mx-auto"
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                    title={color.id}
                  >
                    {selectedColor === color.id && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              Nombre de usuario
            </Label>
            <Input
              id="nombre"
              placeholder="Cómo querés llamarte"
              {...register("nombre")}
              autoComplete="username"
              className={cn("h-14", errors.nombre && "border-[#F87171]/50")}
            />
            {errors.nombre && (
              <p className="text-xs text-[#F87171]">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin" className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              PIN (4–6 dígitos)
            </Label>
            <div className="relative">
              <Input
                id="pin"
                type={showPin ? "text" : "password"}
                placeholder="Elegí tu PIN secreto"
                inputMode="numeric"
                {...register("pin")}
                autoComplete="new-password"
                className={cn("h-14 pr-12 font-mono tracking-widest", errors.pin && "border-[#F87171]/50")}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.pin && <p className="text-xs text-[#F87171]">{errors.pin.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin" className="text-[#94A3B8] text-xs font-medium uppercase tracking-wider">
              Confirmar PIN
            </Label>
            <Input
              id="confirmPin"
              type="password"
              placeholder="Repetí tu PIN"
              inputMode="numeric"
              {...register("confirmPin")}
              autoComplete="new-password"
              className={cn("h-14 font-mono tracking-widest", errors.confirmPin && "border-[#F87171]/50")}
            />
            {errors.confirmPin && (
              <p className="text-xs text-[#F87171]">{errors.confirmPin.message}</p>
            )}
          </div>

          <div className="pt-1.5">
            <Button type="submit" size="lg" className="w-full h-14 gap-2" disabled={loading}>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  Crear cuenta <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[#475569] text-xs whitespace-nowrap">¿ya tenés cuenta?</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 h-12 w-full rounded-xl border border-white/10 bg-white/4 text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/8 hover:border-white/18 transition-all duration-200"
        >
          Ingresar a mi cuenta
        </Link>
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
      Creando cuenta...
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
