"use client";

// ============================================================
//  NEO NUTRI — Calculadora de meta de calorías.
//  Usa los datos del perfil (peso, altura, edad, objetivo)
//  para estimar cuántas kcal necesita el usuario al día.
//  Fórmula Mifflin-St Jeor (estándar en nutrición).
// ============================================================

export type DatosCalculo = {
  peso: number;     // kg
  altura: number;   // cm
  edad: number;     // años
  objetivo: string; // "bajar" | "mantener" | "subir"
};

// Calcula el metabolismo basal (calorías en reposo) y lo ajusta
// por actividad y objetivo. Devuelve la meta diaria de kcal.
export function calcularMetaKcal({ peso, altura, edad, objetivo }: DatosCalculo): number {
  // Si faltan datos, devolvemos una meta genérica por defecto
  if (!peso || !altura || !edad) return 2600;

  // Metabolismo basal (Mifflin-St Jeor). Usamos una versión promedio.
  // BMR = 10*peso + 6.25*altura - 5*edad + 5  (constante para promedio)
  const bmr = 10 * peso + 6.25 * altura - 5 * edad + 5;

  // Factor de actividad (asumimos actividad moderada por ser app fitness)
  const tdee = bmr * 1.55;

  // Ajuste según objetivo
  let meta = tdee;
  if (objetivo === "bajar") meta = tdee - 400;   // déficit para bajar de peso
  else if (objetivo === "subir") meta = tdee + 350; // superávit para ganar masa
  // "mantener" se queda en tdee

  // Redondeamos a la decena más cercana
  return Math.round(meta / 10) * 10;
}