export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nombre: string;
          pin: string;
          avatar: string | null;
          rol: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          pin: string;
          avatar?: string | null;
          rol?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          pin?: string;
          avatar?: string | null;
          rol?: string;
          created_at?: string;
        };
      };
      torneos: {
        Row: {
          id: string;
          nombre: string;
          anio: number;
          activo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          anio: number;
          activo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          anio?: number;
          activo?: boolean;
          created_at?: string;
        };
      };
      partidos: {
        Row: {
          id: string;
          torneo_id: string;
          equipo_a: string;
          equipo_b: string;
          escudo_a: string | null;
          escudo_b: string | null;
          fecha: string;
          fase: string;
          resultado: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          torneo_id: string;
          equipo_a: string;
          equipo_b: string;
          escudo_a?: string | null;
          escudo_b?: string | null;
          fecha: string;
          fase: string;
          resultado?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          torneo_id?: string;
          equipo_a?: string;
          equipo_b?: string;
          escudo_a?: string | null;
          escudo_b?: string | null;
          fecha?: string;
          fase?: string;
          resultado?: string | null;
          created_at?: string;
        };
      };
      ligas: {
        Row: {
          id: string;
          nombre: string;
          codigo: string;
          owner_id: string;
          torneo_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          codigo: string;
          owner_id: string;
          torneo_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          codigo?: string;
          owner_id?: string;
          torneo_id?: string | null;
          created_at?: string;
        };
      };
      miembros_liga: {
        Row: {
          id: string;
          liga_id: string;
          usuario_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          liga_id: string;
          usuario_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          liga_id?: string;
          usuario_id?: string;
          created_at?: string;
        };
      };
      pronosticos: {
        Row: {
          id: string;
          usuario_id: string;
          liga_id: string;
          partido_id: string;
          pronostico: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          liga_id: string;
          partido_id: string;
          pronostico: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          liga_id?: string;
          partido_id?: string;
          pronostico?: string;
          created_at?: string;
        };
      };
      bonus: {
        Row: {
          id: string;
          usuario_id: string;
          liga_id: string;
          torneo_id: string;
          campeon: string | null;
          subcampeon: string | null;
          goleador: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          liga_id: string;
          torneo_id: string;
          campeon?: string | null;
          subcampeon?: string | null;
          goleador?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          liga_id?: string;
          torneo_id?: string;
          campeon?: string | null;
          subcampeon?: string | null;
          goleador?: string | null;
          created_at?: string;
        };
      };
      logros_usuario: {
        Row: {
          id: string;
          usuario_id: string;
          logro_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          logro_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          logro_id?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
