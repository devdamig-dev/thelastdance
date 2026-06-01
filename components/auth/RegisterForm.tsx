"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

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

const schema = z.object({
  nombre: z
    .string().min(2, "Mínimo 2 caracteres").max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ0-9_. ]+$/, "Solo letras, números y puntos"),
  pin: z.string().min(4, "El PIN debe tener entre 4 y 6 dígitos").max(6, "El PIN debe tener entre 4 y 6 dígitos").regex(/^\d+$/, "Solo números"),
  confirmPin: z.string(),
}).refine((d) => d.pin === d.confirmPin, { message: "Los PINs no coinciden", path: ["confirmPin"] });

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0].id);
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const nombreValue = watch("nombre") || "";
  const initial = nombreValue.trim().charAt(0).toUpperCase() || "?";
  const activeColor = AVATAR_COLORS.find((c) => c.id === selectedColor) ?? AVATAR_COLORS[0];

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: existing } = await supabase.from("usuarios").select("id").eq("nombre", data.nombre.trim()).single();
      if (existing) { toast.error("Ese nombre ya está en uso. Elegí otro."); return; }

      const { data: newUserRaw, error } = await supabase
        .from("usuarios").insert({ nombre: data.nombre.trim(), pin: data.pin, avatar: selectedColor, rol: "user" })
        .select().single();

      if (error || !newUserRaw) { toast.error("Error al crear la cuenta. Intenta de nuevo."); return; }

      const newUser = newUserRaw as { id: string; nombre: string; pin: string; avatar: string | null; rol: string; created_at: string };
      login({ id: newUser.id, nombre: newUser.nombre, pin: newUser.pin, avatar: newUser.avatar, rol: newUser.rol as "user" | "admin", created_at: newUser.created_at });
      toast.success("¡Bienvenido al prode!");
      router.push("/dashboard");
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.");
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
      <div className="text-center" style={{ marginBottom: 28 }}>
        <div style={{ position: "relative", display: "inline-flex", marginBottom: 16 }}>
          <div className="gradient-brand glow-green rounded-2xl flex items-center justify-center shadow-2xl" style={{ width: 64, height: 64 }}>
            <TrophyIcon style={{ width: 32, height: 32, color: "white" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "rgba(0,208,132,0.25)", filter: "blur(16px)", zIndex: -1 }} />
        </div>
        <h1 className="font-black text-[#F8FAFC]" style={{ fontSize: 24, letterSpacing: "-0.5px" }}>
          PRODE <span className="text-gradient">MUNDIAL</span>
        </h1>
        <p className="text-[#94A3B8]" style={{ fontSize: 14, marginTop: 4 }}>Creá tu cuenta</p>
      </div>

      {/* Card */}
      <div className="glass-elevated shadow-2xl" style={{ borderRadius: 24, padding: "28px 24px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Avatar picker */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Tu avatar
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Preview */}
              <div
                className="rounded-2xl flex items-center justify-center font-black text-white shadow-lg"
                style={{ width: 52, height: 52, fontSize: 22, flexShrink: 0, background: `linear-gradient(135deg, ${activeColor.from}, ${activeColor.to})`, transition: "background 0.3s" }}
              >
                {initial}
              </div>
              {/* Color swatches — 4 per row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 36px)", gap: 8, flex: 1 }}>
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className="flex items-center justify-center rounded-xl transition-transform hover:scale-110 active:scale-95"
                    style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${c.from}, ${c.to})`, border: "none", cursor: "pointer", position: "relative" }}
                    title={c.id}
                  >
                    {selectedColor === c.id && (
                      <Check style={{ width: 14, height: 14, color: "white", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

          {/* Nombre */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Nombre de usuario
            </label>
            <input placeholder="Cómo querés llamarte" {...register("nombre")} autoComplete="username"
              style={{ ...inputStyle, borderColor: errors.nombre ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)" }} />
            {errors.nombre && <p style={{ color: "#F87171", fontSize: 12, marginTop: 4 }}>{errors.nombre.message}</p>}
          </div>

          {/* PIN */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              PIN (4–6 dígitos)
            </label>
            <div style={{ position: "relative" }}>
              <input type={showPin ? "text" : "password"} placeholder="Elegí tu PIN secreto"
                inputMode="numeric" {...register("pin")} autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: 48, fontFamily: "monospace", letterSpacing: "0.15em", borderColor: errors.pin ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)" }} />
              <button type="button" onClick={() => setShowPin(!showPin)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                {showPin ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
            {errors.pin && <p style={{ color: "#F87171", fontSize: 12, marginTop: 4 }}>{errors.pin.message}</p>}
          </div>

          {/* Confirm PIN */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Confirmar PIN
            </label>
            <input type="password" placeholder="Repetí tu PIN" inputMode="numeric"
              {...register("confirmPin")} autoComplete="new-password"
              style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.15em", borderColor: errors.confirmPin ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)" }} />
            {errors.confirmPin && <p style={{ color: "#F87171", fontSize: 12, marginTop: 4 }}>{errors.confirmPin.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="btn-gradient text-white font-bold rounded-xl w-full flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            style={{ height: 52, fontSize: 15 }}
          >
            {loading ? <Spinner /> : <><span>Crear cuenta</span><ArrowRight style={{ width: 16, height: 16 }} /></>}
          </button>
        </form>

        <div className="flex items-center gap-3" style={{ margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "#475569", fontSize: 12, whiteSpace: "nowrap" }}>¿ya tenés cuenta?</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        <Link href="/login"
          className="flex items-center justify-center font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors rounded-xl border border-white/10 hover:bg-white/5"
          style={{ height: 48, fontSize: 14 }}>
          Ingresar a mi cuenta
        </Link>
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
