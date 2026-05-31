export interface Usuario {
  id: string;
  nombre: string;
  pin: string;
  avatar: string | null;
  rol: 'user' | 'admin';
  created_at: string;
}

export interface Liga {
  id: string;
  nombre: string;
  codigo: string;
  owner_id: string;
  torneo_id: string | null;
  created_at: string;
  miembros_count?: number;
  owner?: Usuario;
}

export interface MiembroLiga {
  id: string;
  liga_id: string;
  usuario_id: string;
  created_at: string;
  usuario?: Usuario;
}

export interface Torneo {
  id: string;
  nombre: string;
  anio: number;
  activo: boolean;
}

export type FasePartido = 'grupos' | 'octavos' | 'cuartos' | 'semifinal' | 'final';
export type ResultadoPartido = '1' | 'X' | '2' | null;

export interface Partido {
  id: string;
  torneo_id: string;
  equipo_a: string;
  equipo_b: string;
  escudo_a?: string | null;
  escudo_b?: string | null;
  fecha: string;
  fase: FasePartido;
  resultado: ResultadoPartido;
  torneo?: Torneo;
}

export interface Pronostico {
  id: string;
  usuario_id: string;
  liga_id: string;
  partido_id: string;
  pronostico: ResultadoPartido;
  partido?: Partido;
}

export interface Bonus {
  id: string;
  usuario_id: string;
  liga_id: string;
  torneo_id: string;
  campeon: string | null;
  subcampeon: string | null;
  goleador: string | null;
}

export interface RankingEntry {
  posicion: number;
  usuario: Usuario;
  puntos: number;
  aciertos: number;
  racha: number;
}

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  desbloqueado: boolean;
}
