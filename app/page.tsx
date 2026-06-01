import Link from "next/link";
import { ArrowRight, Users, Target, Zap, Star, Globe2, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";

const NAV_H = 64; // px — keep in sync with Navbar

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden text-[#F8FAFC]">

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center"
        style={{
          height: NAV_H,
          background: "rgba(7,18,15,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="gradient-brand rounded-xl flex items-center justify-center shadow-lg glow-green"
              style={{ width: 32, height: 32, flexShrink: 0 }}
            >
              <TrophyIcon className="text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div className="flex flex-col" style={{ lineHeight: 1 }}>
              <span className="font-medium text-[#94A3B8] tracking-widest uppercase" style={{ fontSize: 10 }}>Prode</span>
              <span className="font-black text-[#F8FAFC] tracking-tight" style={{ fontSize: 14, marginTop: -1 }}>MUNDIAL</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-2 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors font-medium">
              Ingresar
            </Link>
            <Link
              href="/register"
              className="text-sm text-white font-semibold rounded-xl btn-gradient shadow-lg"
              style={{ padding: "8px 16px" }}
            >
              Registrarse
            </Link>
          </div>
        </Container>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section
        className="relative"
        style={{ paddingTop: NAV_H + 80, paddingBottom: 80 }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{ top: NAV_H, width: "min(600px, 90vw)", height: 400, background: "rgba(0,208,132,0.08)", filter: "blur(100px)" }}
        />
        <Container>
          <div className="text-center" style={{ maxWidth: 760, margin: "0 auto" }}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full font-medium text-[#00D084]"
              style={{ background: "rgba(0,208,132,0.1)", border: "1px solid rgba(0,208,132,0.2)", padding: "8px 16px", marginBottom: 28, fontSize: 13 }}
            >
              <Globe2 style={{ width: 15, height: 15, flexShrink: 0 }} />
              <span>Mundial 2026 · Pronósticos ya disponibles</span>
            </div>

            <h1
              className="font-black tracking-tight text-[#F8FAFC]"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", lineHeight: 1.02, marginBottom: 24 }}
            >
              El prode del
              <br />
              <span className="text-gradient">Mundial 2026</span>
            </h1>

            <p
              className="text-[#94A3B8] leading-relaxed mx-auto"
              style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: 520, marginBottom: 36 }}
            >
              Creá tu liga privada, invitá amigos y competí pronosticando cada partido.
              Sin apuestas. Solo diversión.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-3" style={{ maxWidth: 480, margin: "0 auto" }}>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 btn-gradient text-white font-bold rounded-2xl shadow-xl"
                style={{ padding: "16px 32px", fontSize: 16 }}
              >
                Empezar gratis <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] font-semibold rounded-2xl transition-all border border-white/10 hover:border-white/20 hover:bg-white/5"
                style={{ padding: "16px 32px", fontSize: 16 }}
              >
                Ya tengo cuenta <ChevronRight style={{ width: 18, height: 18 }} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 40, paddingBottom: 40,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <Container size="narrow">
          <div className="grid grid-cols-3 text-center" style={{ gap: 24 }}>
            {[
              { value: "48",  label: "Selecciones", sub: "de todo el mundo" },
              { value: "104", label: "Partidos",     sub: "para pronosticar" },
              { value: "39",  label: "Días",         sub: "de competencia" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-black text-gradient tabular-nums" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>{s.value}</div>
                <div className="font-semibold text-[#F8FAFC]" style={{ fontSize: 14, marginTop: 4 }}>{s.label}</div>
                <div className="text-[#475569]" style={{ fontSize: 12, marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <Container size="narrow">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 className="font-black text-[#F8FAFC]" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", marginBottom: 12 }}>
              Todo lo que necesitás
            </h2>
            <p className="text-[#94A3B8] mx-auto" style={{ fontSize: 15, maxWidth: 400 }}>
              Una plataforma completa para vivir el Mundial como nunca antes
            </p>
          </div>

          <div className="grid sm:grid-cols-2" style={{ gap: 16 }}>
            {[
              { icon: Users,  title: "Ligas Privadas",  desc: "Creá tu propia liga e invitá amigos con un código único de 7 caracteres. Competí en múltiples ligas a la vez.", color: "#00D084" },
              { icon: Target, title: "Sistema 1 X 2",   desc: "Pronosticá el resultado de cada partido. Local, empate o visitante. Simple, justo y adictivo.", color: "#3B82F6" },
              { icon: Zap,    title: "Puntos por Fase", desc: "Más puntos en fases eliminatorias. En Grupos vale 1 punto, en la Final vale 8. ¡Las remontadas son épicas!", color: "#F5C451" },
              { icon: Star,   title: "Logros y Bonus",  desc: "Predecí campeón, subcampeón y goleador para puntos extra. Desbloquéa logros mientras competís.", color: "#A855F7" },
            ].map((feat) => (
              <div
                key={feat.title}
                className="rounded-3xl border border-white/8 hover:border-white/14 transition-all"
                style={{ padding: 24, background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))" }}
              >
                <div
                  className="rounded-2xl flex items-center justify-center shadow-md"
                  style={{ width: 44, height: 44, marginBottom: 16, background: `${feat.color}1f`, border: `1px solid ${feat.color}33` }}
                >
                  <feat.icon style={{ width: 20, height: 20, color: feat.color }} />
                </div>
                <h3 className="font-bold text-[#F8FAFC]" style={{ fontSize: 15, marginBottom: 8 }}>{feat.title}</h3>
                <p className="text-[#94A3B8]" style={{ fontSize: 14, lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── How it works ───────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80, background: "rgba(255,255,255,0.018)" }}>
        <Container size="narrow">
          <h2 className="font-black text-[#F8FAFC] text-center" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", marginBottom: 48 }}>
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "32px 16px" }}>
            {[
              { n: "1", title: "Registrate",    desc: "Solo nombre y PIN. Sin email, sin complicaciones." },
              { n: "2", title: "Creá tu liga",  desc: "Generá un código y compartilo con tus amigos." },
              { n: "3", title: "Pronosticá",    desc: "Elegí 1, X o 2 antes de que empiece el partido." },
              { n: "4", title: "Subí al podio", desc: "Acumulá puntos y escalá en el ranking." },
            ].map((item) => (
              <div key={item.n} className="text-center">
                <div
                  className="gradient-brand rounded-2xl font-black text-white flex items-center justify-center mx-auto shadow-lg glow-green"
                  style={{ width: 44, height: 44, fontSize: 16, marginBottom: 12 }}
                >
                  {item.n}
                </div>
                <h3 className="font-bold text-[#F8FAFC]" style={{ fontSize: 14, marginBottom: 6 }}>{item.title}</h3>
                <p className="text-[#94A3B8]" style={{ fontSize: 13, lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <Container size="narrow">
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div
              className="relative rounded-3xl text-center overflow-hidden"
              style={{ padding: "48px 32px", background: "linear-gradient(135deg, #007A4D, #004D30 50%, #003820)", border: "1px solid rgba(0,208,132,0.25)" }}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: 0, width: 240, height: 120, background: "rgba(0,208,132,0.2)", filter: "blur(40px)", pointerEvents: "none" }}
              />
              <div style={{ position: "relative" }}>
                <div
                  className="mx-auto flex items-center justify-center rounded-2xl border border-white/20 shadow-xl"
                  style={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", marginBottom: 20 }}
                >
                  <TrophyIcon className="text-[#F5C451]" style={{ width: 28, height: 28 }} />
                </div>
                <h2 className="font-black text-[#F8FAFC]" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: 12 }}>
                  ¿Listo para competir?
                </h2>
                <p className="text-white/70" style={{ fontSize: 15, marginBottom: 28 }}>
                  Sumate ahora y empezá a pronosticar el Mundial 2026
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-[#007A4D] font-black rounded-2xl hover:bg-[#F0FFF8] transition-colors shadow-xl"
                  style={{ padding: "16px 32px", fontSize: 16 }}
                >
                  Crear mi cuenta gratis <ArrowRight style={{ width: 18, height: 18 }} />
                </Link>
              </div>
            </div>

            {/* Donaciones */}
            <div
              className="rounded-2xl text-center border border-white/8"
              style={{ padding: 24, marginTop: 16, background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-[#94A3B8]" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                Esta app es gratuita y fue creada para disfrutar el fútbol entre amigos.<br />
                Si te gustó, podés invitarme una yerba, una picada o un café.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_MERCADOPAGO_URL ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#00D084] hover:text-[#00FFB3] transition-colors"
                style={{ fontSize: 14 }}
              >
                ☕ Invitarme un mate →
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer
        className="text-center"
        style={{ padding: "32px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-center gap-2" style={{ marginBottom: 8 }}>
          <div
            className="gradient-brand rounded-md flex items-center justify-center"
            style={{ width: 20, height: 20 }}
          >
            <TrophyIcon className="text-white" style={{ width: 10, height: 10 }} />
          </div>
          <span className="font-bold text-[#94A3B8] tracking-wider uppercase" style={{ fontSize: 11 }}>Prode Mundial 2026</span>
        </div>
        <p className="text-[#475569]" style={{ fontSize: 12 }}>Hecho con mate y pasión. ¡Que gane el mejor!</p>
      </footer>
    </div>
  );
}

function TrophyIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
