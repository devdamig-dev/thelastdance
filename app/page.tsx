import Link from "next/link";
import { ArrowRight, Users, Target, Zap, Star, Globe2, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden text-[#F8FAFC]">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-15 flex items-center"
        style={{ background: "rgba(7,18,15,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-5xl mx-auto px-5 w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-brand rounded-xl flex items-center justify-center shadow-lg glow-green">
              <TrophyIcon className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-medium text-[#94A3B8] tracking-widest uppercase">Prode</span>
              <span className="text-sm font-black text-[#F8FAFC] tracking-tight -mt-0.5">MUNDIAL</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors font-medium">
              Ingresar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm btn-gradient text-white rounded-xl font-semibold shadow-lg"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-5 relative">
        {/* Radial glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#00D084]/8 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-[#00D084]"
            style={{ background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.2)" }}>
            <Globe2 className="w-4 h-4" />
            <span>Mundial 2026 · Pronósticos ya disponibles</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-6">
            El prode del
            <br />
            <span className="text-gradient">Mundial 2026</span>
          </h1>

          <p className="text-[#94A3B8] text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Creá tu liga privada, invitá amigos y competí pronosticando cada partido.
            Sin apuestas. Solo diversión.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 btn-gradient rounded-2xl font-bold text-white text-base shadow-xl w-full sm:w-auto justify-center"
            >
              Empezar gratis <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-[#94A3B8] hover:text-[#F8FAFC] text-base transition-all border border-white/10 hover:border-white/18 hover:bg-white/5 w-full sm:w-auto justify-center"
            >
              Ya tengo cuenta <ChevronRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="py-10 px-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "48", label: "Selecciones", sub: "de todo el mundo" },
            { value: "104", label: "Partidos", sub: "para pronosticar" },
            { value: "39", label: "Días", sub: "de competencia" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black text-gradient tabular-nums">{s.value}</div>
              <div className="text-sm font-semibold text-[#F8FAFC] mt-1">{s.label}</div>
              <div className="text-xs text-[#475569] mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-3">Todo lo que necesitás</h2>
            <p className="text-[#94A3B8] text-base max-w-md mx-auto">
              Una plataforma completa para vivir el Mundial como nunca antes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                title: "Ligas Privadas",
                desc: "Creá tu propia liga e invitá amigos con un código único de 7 caracteres. Competí en múltiples ligas a la vez.",
                from: "#00D084", to: "#007A4D",
              },
              {
                icon: Target,
                title: "Sistema 1 X 2",
                desc: "Pronosticá el resultado de cada partido. Local, empate o visitante. Simple, justo y adictivo.",
                from: "#3B82F6", to: "#1D4ED8",
              },
              {
                icon: Zap,
                title: "Puntos por Fase",
                desc: "Más puntos en fases eliminatorias. En Grupos vale 1 punto, en la Final vale 8. ¡Las remontadas son épicas!",
                from: "#F5C451", to: "#D4A017",
              },
              {
                icon: Star,
                title: "Logros y Bonus",
                desc: "Predecí campeón, subcampeón y goleador para puntos extra. Desbloquéa logros mientras competís.",
                from: "#A855F7", to: "#7C3AED",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="rounded-2xl p-5 border border-white/8 hover:border-white/14 transition-all duration-200 group"
                style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))" }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${feat.from}20, ${feat.to}20)`, border: `1px solid ${feat.from}30` }}
                >
                  <feat.icon className="w-5 h-5" style={{ color: feat.from }} />
                </div>
                <h3 className="font-bold text-base mb-1.5 text-[#F8FAFC]">{feat.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section className="py-24 px-5" style={{ background: "rgba(255,255,255,0.018)" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-14">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              { n: "1", title: "Registrate", desc: "Solo nombre y PIN. Sin email, sin complicaciones." },
              { n: "2", title: "Creá tu liga", desc: "Generá un código y compartilo con tus amigos." },
              { n: "3", title: "Pronosticá", desc: "Elegí 1, X o 2 antes de que empiece el partido." },
              { n: "4", title: "Subí al podio", desc: "Acumulá puntos y escalá en el ranking." },
            ].map((item, i) => (
              <div key={item.n} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#00D084]/30 to-transparent" />
                )}
                <div className="w-11 h-11 gradient-brand rounded-2xl flex items-center justify-center text-sm font-black mx-auto mb-3 shadow-lg glow-green">
                  {item.n}
                </div>
                <h3 className="font-bold mb-1.5 text-[#F8FAFC]">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-5">
        <div className="max-w-xl mx-auto">
          <div
            className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, #007A4D 0%, #004D30 50%, #003820 100%)", border: "1px solid rgba(0,208,132,0.25)" }}
          >
            {/* Subtle radial glow inside */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#00D084]/20 blur-3xl" />

            <div className="relative">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/15 flex items-center justify-center shadow-xl border border-white/20">
                <TrophyIcon className="w-7 h-7 text-[#F5C451]" />
              </div>
              <h2 className="text-3xl font-black mb-3">¿Listo para competir?</h2>
              <p className="text-[#00D084]/70 mb-7 text-base">
                Sumate ahora y empezá a pronosticar el Mundial 2026
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#007A4D] rounded-2xl font-black text-base hover:bg-[#F0FFF8] transition-colors shadow-xl"
              >
                Crear mi cuenta gratis <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>

          {/* Donaciones */}
          <div
            className="mt-5 rounded-2xl p-5 text-center border border-white/8"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-sm text-[#94A3B8] mb-3">
              Esta app es gratuita y fue creada para disfrutar el fútbol entre amigos.<br />
              Si te gustó, podés invitarme una yerba, una picada o un café.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_MERCADOPAGO_URL ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D084] hover:text-[#00FFB3] transition-colors"
            >
              ☕ Invitarme un mate →
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-8 px-5 text-center text-[#475569] text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 gradient-brand rounded-md flex items-center justify-center">
            <TrophyIcon className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="font-bold text-[#94A3B8] text-xs tracking-wider uppercase">Prode Mundial 2026</span>
        </div>
        <p className="text-[#475569]">Hecho con mate y pasión. ¡Que gane el mejor!</p>
      </footer>
    </div>
  );
}

function TrophyIcon({ className }: { className?: string }) {
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
