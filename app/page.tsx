import Link from "next/link";
import { Trophy, Users, Target, Zap, Star, ArrowRight, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">PRODE MUNDIAL</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm bg-[#00875a] hover:bg-[#00a86e] text-white rounded-lg transition-colors font-medium"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-emerald-400">
            <Globe className="w-4 h-4" />
            <span>Mundial 2026 - Pronósticos ya disponibles</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            El mejor <span className="text-gradient">prode</span> para el
            <br />
            <span className="text-gradient">Mundial 2026</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Competí con tus amigos, familia y compañeros de trabajo. Creá tu liga privada,
            pronosticá los partidos y subí al podio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-brand rounded-xl font-bold text-white hover:opacity-90 transition-opacity text-lg"
            >
              Empezar gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/5 transition-colors text-lg"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { label: "Equipos", value: "48" },
            { label: "Partidos", value: "104" },
            { label: "Días de acción", value: "39" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-black text-gradient">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Todo lo que necesitás</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
            Una plataforma completa para vivir el Mundial como nunca antes
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Ligas Privadas",
                desc: "Creá tu propia liga y unite a la de tus amigos con un código único de 7 caracteres. Sin límites de ligas.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                icon: Target,
                title: "Sistema 1 X 2",
                desc: "Pronosticá el resultado de cada partido: 1 (local), X (empate) o 2 (visitante). Simple y efectivo.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: Zap,
                title: "Puntos por Fase",
                desc: "Más puntos en fases eliminatorias. Grupos vale 1 punto, Final vale 8. ¡Remontadas épicas garantizadas!",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
              {
                icon: Star,
                title: "Logros y Bonus",
                desc: "Desbloquéa logros, predecí el campeón y goleador para puntos extra. La competencia no termina nunca.",
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
            ].map((feat) => (
              <div key={feat.title} className="gradient-card rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feat.icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Registrate", desc: "Solo necesitás un nombre y un PIN de 4-6 dígitos. Sin email." },
              { step: "2", title: "Creá una liga", desc: "Invitá a tus amigos con el código único de tu liga." },
              { step: "3", title: "Pronosticá", desc: "Antes de cada partido, elegí quién ganará o si habrá empate." },
              { step: "4", title: "Subí al podio", desc: "Acumulá puntos y competí por el primer lugar del ranking." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 gradient-brand rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gradient-brand rounded-3xl p-10">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl font-black mb-4">¿Listo para competir?</h2>
            <p className="text-green-100 mb-8">
              Unite ahora y empezá a pronosticar los partidos del Mundial 2026
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#00875a] rounded-xl font-black text-lg hover:bg-gray-100 transition-colors"
            >
              Crear mi cuenta gratis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-white/10 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-white">PRODE MUNDIAL</span>
        </div>
        <p>Hecho con mate y pasión. ¡Que gane el mejor!</p>
      </footer>
    </div>
  );
}
