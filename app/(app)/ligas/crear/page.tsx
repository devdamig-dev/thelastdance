import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { CreateLigaForm } from "@/components/ligas/CreateLigaForm";

export const metadata = { title: "Crear Liga - Prode Mundial" };

export default function CrearLigaPage() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/ligas"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white">Crear Liga</h1>
          <p className="text-gray-400 text-sm">
            Invitá a tus amigos con un código único
          </p>
        </div>
      </div>

      <div className="gradient-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6 p-3 bg-[#00875a]/10 rounded-lg border border-[#00875a]/20">
          <div className="w-10 h-10 gradient-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Liga para Mundial 2026
            </p>
            <p className="text-xs text-gray-400">
              Se genera un código de 7 dígitos automáticamente
            </p>
          </div>
        </div>
        <CreateLigaForm />
      </div>

      <div className="gradient-card rounded-xl border border-white/10 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-white">¿Cómo funciona?</h3>
        <ul className="space-y-1">
          {[
            "Creás la liga y obtenés un código único de 7 caracteres",
            "Compartís el código con tus amigos",
            "Cada uno se une con ese código",
            "Todos pronostican los mismos partidos",
            "El ranking se actualiza en tiempo real",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
              <span className="text-[#10b981] mt-0.5 flex-shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
