"use client";
import { usePersistedState } from "./usePersistedState";

// ============================================================
//  useProgreso — estado compartido del guerrero.
//  Nivel, XP, entrenamientos. Guardado y compartido entre
//  pantallas (Dashboard lee, Rutinas suma).
// ============================================================

export type ProgresoGuerrero = {
  nivel: number;
  xp: number;       // xp dentro del nivel actual
  xpMax: number;    // xp necesario para subir de nivel
  entrenos: number; // total de entrenamientos completados
};

const INICIAL: ProgresoGuerrero = {
  nivel: 23,
  xp: 12450,
  xpMax: 20000,
  entrenos: 48,
};

export const XP_POR_ENTRENO = 1000;

export function useProgreso() {
  const [prog, setProg] = usePersistedState<ProgresoGuerrero>("guerrero.progreso", INICIAL);

  // Suma XP por completar un entrenamiento. Sube de nivel si llega al máximo.
  function completarEntreno() {
    setProg((prev) => {
      let { nivel, xp, xpMax, entrenos } = prev;
      xp += XP_POR_ENTRENO;
      entrenos += 1;
      // Mientras el XP supere el máximo, subimos de nivel
      while (xp >= xpMax) {
        xp -= xpMax;
        nivel += 1;
        xpMax = Math.round(xpMax * 1.1); // cada nivel pide un poco más
      }
      return { nivel, xp, xpMax, entrenos };
    });
  }

  return { prog, completarEntreno };
}