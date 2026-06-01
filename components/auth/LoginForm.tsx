"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: userData, error } = await supabase
        .from("usuarios").select("*")
        .eq("nombre", data.nombre.trim()).eq("pin", data.pin).single();

      if (error || !userData) { toast.error("Nombre o PIN incorrecto"); return; }

      const user = userData as { id: string; nombre: string; pin: string; avatar: string | null; rol: string; created_at: string };
      login({ id: user.id, nombre: user.nombre, pin: user.pin, avatar: user.avatar, rol: user.rol as "user" | "admin", created_at: user.created_at });
      toast.success(`Bienvenido, ${userData.nombre}!`);
      router.push(user.rol === "admin" ? "/admin" : "/dashboard");
    } catch {
      toast.error("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 52, borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.07)",
    color: "#F8FAFC", fontSize: 14, padding: "0 16px",
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}>

      {/* Logo */}
      <div className="text-center" style={{ marginBottom: 32 }}>
        <div style={{ position: "relative", display: "inline-flex", marginBottom: 16 }}>
          <div
            className="gradient-brand glow-green rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ width: 64, height: 64 }}
          >
            <TrophyIcon style={{ width: 32, height: 32, color: "white" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "rgba(0,208,132,0.25)", filter: "blur(16px)", zIndex: -1 }} />
        </div>
        <h1 className="font-black text-[#F8FAFC]" style={{ fontSize: 24, letterSpacing: "-0.5px" }}>
          PRODE <span className="text-gradient">MUNDIAL</span>
        </h1>
        <p className="text-[#94A3B8]" style={{ fontSize: 14, marginTop: 4 }}>Ingresá a tu cuenta</p>
      </div>

      {/* Card */}
      <div
        className="glass-elevated shadow-2xl"
        style={{ borderRadius: 24, padding: "28px 24px" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Nombre */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Nombre de usuario
            </label>
            <input
              placeholder="Tu nombre en la liga"
              {...register("nombre")}
              autoComplete="username"
              style={{ ...inputStyle, borderColor: errors.nombre ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)" }}
            />
            {errors.nombre && <p style={{ color: "#F87171", fontSize: 12, marginTop: 4 }}>{errors.nombre.message}</p>}
          </div>

          {/* PIN */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              PIN
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPin ? "text" : "password"}
                placeholder="4–6 dígitos"
                inputMode="numeric"
                {...register("pin")}
                autoComplete="current-password"
                style={{ ...inputStyle, paddingRight: 48, fontFamily: "monospace", letterSpacing: "0.15em", borderColor: errors.pin ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)" }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                {showPin ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
            {errors.pin && <p style={{ color: "#F87171", fontSize: 12, marginTop: 4 }}>{errors.pin.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient text-white font-bold rounded-xl w-full flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            style={{ height: 52, fontSize: 15 }}
          >
            {loading ? <Spinner /> : <><span>Ingresar</span><ArrowRight style={{ width: 16, height: 16 }} /></>}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3" style={{ margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}>¿nuevo aquí?</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        <Link
          href="/register"
          className="flex items-center justify-center font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors rounded-xl border border-white/10 hover:bg-white/5"
          style={{ height: 48, fontSize: 14 }}
        >
          Crear una cuenta gratis
        </Link>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 text-[#475569]" style={{ marginTop: 20, fontSize: 12 }}>
        <ShieldCheck style={{ width: 13, height: 13 }} />
        <span>Tu PIN es privado y nunca se comparte</span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function TrophyIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
