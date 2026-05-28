"use client";

// ============================================================
//  KAIZEN — Ayudante de RACHA con colores y niveles
//  La racha evoluciona en color y "rango" según los días.
//  Motiva a no romper la racha para llegar al siguiente.
// ============================================================

export type NivelRacha = {
  color: string;       // color del número/llama
  brillo: string;      // glow/shadow del ícono
  nombre: string;      // nombre del rango ("En racha", "Imparable", etc.)
  emoji: string;       // emoji decorativo
  diasMinimos: number;
};

// Rangos de menor a mayor (al subir, se queda en el más alto cuyo mínimo cumpla)
export const NIVELES_RACHA: NivelRacha[] = [
  { diasMinimos: 0,   color: "#f3e6cd", brillo: "#b09a7e",  nombre: "Empezando",   emoji: "🤍" },
  { diasMinimos: 3,   color: "#f5d147", brillo: "#e8a13a",  nombre: "Calentando",  emoji: "🟡" },
  { diasMinimos: 7,   color: "#f08a2e", brillo: "#d2691e",  nombre: "En racha",    emoji: "🟠" },
  { diasMinimos: 14,  color: "#e8201a", brillo: "#a01010",  nombre: "Imparable",   emoji: "🔴" },
  { diasMinimos: 30,  color: "#c855e0", brillo: "#7e2998",  nombre: "Leyenda",     emoji: "💜" },
  { diasMinimos: 60,  color: "#4ad0e8", brillo: "#1a8aa8",  nombre: "Maestro",     emoji: "💙" },
  { diasMinimos: 100, color: "#ffd84a", brillo: "#e8a13a",  nombre: "Élite KAIZEN",emoji: "🔥" },
];

// Calcula el nivel actual según los días
export function nivelDeRacha(dias: number): NivelRacha {
  let actual = NIVELES_RACHA[0];
  for (const nivel of NIVELES_RACHA) {
    if (dias >= nivel.diasMinimos) actual = nivel;
  }
  return actual;
}

// Calcula cuántos días faltan para el siguiente nivel (0 si ya está en el último)
export function diasAlSiguienteNivel(dias: number): number {
  for (const nivel of NIVELES_RACHA) {
    if (dias < nivel.diasMinimos) return nivel.diasMinimos - dias;
  }
  return 0;
}