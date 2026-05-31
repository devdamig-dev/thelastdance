import type { Logro } from "@/types";

export const LOGROS_DEFINICION = [
  { id: 'primer_pronostico', nombre: 'Primer Pronóstico', descripcion: 'Realizaste tu primer pronóstico', icono: '🎯' },
  { id: 'diez_aciertos', nombre: '10 Aciertos', descripcion: 'Acertaste 10 pronósticos', icono: '🔥' },
  { id: 'veinte_aciertos', nombre: '20 Aciertos', descripcion: 'Acertaste 20 pronósticos', icono: '⚡' },
  { id: 'campeon_liga', nombre: 'Campeón de Liga', descripcion: 'Ganaste una liga', icono: '🏆' },
  { id: 'rey_empates', nombre: 'Rey de los Empates', descripcion: 'Acertaste 5 empates consecutivos', icono: '🤝' },
  { id: 'primera_liga', nombre: 'Fundador', descripcion: 'Creaste tu primera liga', icono: '👑' },
];

export function calcularLogros(stats: { aciertos: number; esCreador: boolean; esCampeon: boolean }): Logro[] {
  return LOGROS_DEFINICION.map(logro => ({
    ...logro,
    desbloqueado:
      (logro.id === 'primer_pronostico' && stats.aciertos >= 1) ||
      (logro.id === 'diez_aciertos' && stats.aciertos >= 10) ||
      (logro.id === 'veinte_aciertos' && stats.aciertos >= 20) ||
      (logro.id === 'campeon_liga' && stats.esCampeon) ||
      (logro.id === 'primera_liga' && stats.esCreador) ||
      false,
  }));
}
