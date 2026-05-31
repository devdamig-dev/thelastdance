import type { FasePartido } from "@/types";

export function getPointsByPhase(fase: FasePartido): number {
  const points: Record<FasePartido, number> = {
    grupos: 1,
    octavos: 2,
    cuartos: 3,
    semifinal: 4,
    final: 8,
  };
  return points[fase] ?? 1;
}

export const BONUS_POINTS = {
  campeon: 10,
  subcampeon: 5,
  goleador: 5,
} as const;
