"use client";

// ============================================================
//  KAIZEN — Calculadora de IMC (Índice de Masa Corporal)
//  El IMC es una GUÍA ORIENTATIVA, no un diagnóstico médico.
//  No distingue músculo de grasa, así que es solo referencia.
// ============================================================

export type ResultadoIMC = {
  imc: number;            // el valor del IMC
  categoria: string;      // "Bajo peso", "Saludable", etc.
  color: string;          // color para mostrarlo
  pesoIdealMin: number;   // peso saludable mínimo para su altura
  pesoIdealMax: number;   // peso saludable máximo para su altura
  mensaje: string;        // guía orientativa amable
};

// Calcula el IMC y el rango de peso saludable según la altura.
export function calcularIMC(peso: number, alturaCm: number): ResultadoIMC | null {
  if (!peso || !alturaCm) return null;

  const alturaM = alturaCm / 100;
  const imc = peso / (alturaM * alturaM);

  // Rango de peso saludable (IMC entre 18.5 y 24.9) para su altura
  const pesoIdealMin = Math.round(18.5 * alturaM * alturaM);
  const pesoIdealMax = Math.round(24.9 * alturaM * alturaM);

  let categoria: string, color: string, mensaje: string;
  if (imc < 18.5) {
    categoria = "Bajo peso";
    color = "#e8a13a";
    mensaje = "Como guía, estás bajo el rango habitual. Nutrirte bien es clave. 🦊";
  } else if (imc < 25) {
    categoria = "Saludable";
    color = "#3f7d6e";
    mensaje = "¡Estás en un rango saludable! Sigue cuidándote, guerrero. 🦊";
  } else if (imc < 30) {
    categoria = "Sobrepeso";
    color = "#e8843a";
    mensaje = "Como referencia, estás sobre el rango habitual. Vas paso a paso. 🦊";
  } else {
    categoria = "Obesidad";
    color = "#d23b2e";
    mensaje = "Esto es solo una guía. Lo importante es tu bienestar y constancia. 🦊";
  }

  return {
    imc: Math.round(imc * 10) / 10,
    categoria,
    color,
    pesoIdealMin,
    pesoIdealMax,
    mensaje,
  };
}