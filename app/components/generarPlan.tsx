"use client";
import { calcularMetaKcal } from "./calcularMeta";

// ============================================================
//  KAIZEN — Generador de plan (rutina + minuta)
//  Usa reglas con base nutricional real:
//   - Calorías: Mifflin-St Jeor (ya calculado en calcularMeta)
//   - Macros: proporciones recomendadas según objetivo
//   - Comidas: reparto por porcentajes típicos del día
//  NO reemplaza a un nutricionista; es una guía orientativa.
// ============================================================

export type Respuestas = Record<string, string | string[]>;

export type PlanGenerado = {
  kcal: number;
  macros: { proteina: number; carbos: number; grasa: number };
  rutina: { dia: string; foco: string }[];
  minuta: { comida: string; kcal: number; sugerencia: string }[];
  selectividad: { come: string[]; noCome: string[] };
  nota: string;
};

// Reparto de macros según objetivo (proteína/carbos/grasa en % de calorías)
const MACROS_OBJETIVO: Record<string, { p: number; c: number; g: number }> = {
  bajar:    { p: 0.35, c: 0.35, g: 0.30 }, // más proteína para preservar músculo
  mantener: { p: 0.30, c: 0.45, g: 0.25 },
  subir:    { p: 0.30, c: 0.50, g: 0.20 }, // más carbos para energía/volumen
};

// Plantillas de rutina semanal según días disponibles
const RUTINA_DIAS: Record<string, { dia: string; foco: string }[]> = {
  "2": [
    { dia: "Día 1", foco: "Tren superior (Push + Pull)" },
    { dia: "Día 2", foco: "Tren inferior + Core" },
  ],
  "3": [
    { dia: "Día 1", foco: "Push (Pecho · Hombro · Tríceps)" },
    { dia: "Día 2", foco: "Pull (Espalda · Bíceps)" },
    { dia: "Día 3", foco: "Pierna + Core" },
  ],
  "4": [
    { dia: "Día 1", foco: "Push" },
    { dia: "Día 2", foco: "Pull" },
    { dia: "Día 3", foco: "Pierna" },
    { dia: "Día 4", foco: "Full Body / Débiles" },
  ],
  "5": [
    { dia: "Día 1", foco: "Pecho" },
    { dia: "Día 2", foco: "Espalda" },
    { dia: "Día 3", foco: "Pierna" },
    { dia: "Día 4", foco: "Hombro + Brazos" },
    { dia: "Día 5", foco: "Full Body / Core" },
  ],
};

// Reparto de comidas según cuántas hace al día (% de las calorías)
const REPARTO_COMIDAS: Record<string, { nombre: string; pct: number }[]> = {
  "3": [
    { nombre: "Desayuno", pct: 0.30 },
    { nombre: "Almuerzo", pct: 0.40 },
    { nombre: "Cena", pct: 0.30 },
  ],
  "4": [
    { nombre: "Desayuno", pct: 0.25 },
    { nombre: "Almuerzo", pct: 0.35 },
    { nombre: "Merienda", pct: 0.15 },
    { nombre: "Cena", pct: 0.25 },
  ],
  "5": [
    { nombre: "Desayuno", pct: 0.22 },
    { nombre: "Media mañana", pct: 0.13 },
    { nombre: "Almuerzo", pct: 0.30 },
    { nombre: "Merienda", pct: 0.13 },
    { nombre: "Cena", pct: 0.22 },
  ],
};

// Sugerencias de comida según restricciones (simples y orientativas)
function sugerirComida(nombre: string, restric: string[], evitar: string[]): string {
  const veg = restric.includes("vegetariano") || restric.includes("vegano");
  const vegano = restric.includes("vegano");
  const proteina = vegano ? "tofu o legumbres"
    : veg ? "huevo o legumbres"
    : evitar.includes("pescado") && evitar.includes("cerdo") ? "pollo"
    : "pollo, pescado o carne magra";

  switch (nombre) {
    case "Desayuno":
      return vegano ? "Avena con fruta y bebida vegetal" : "Avena, fruta y " + (veg ? "yogur" : "huevos");
    case "Media mañana":
      return evitar.includes("frutossecos") ? "Una fruta" : "Puñado de frutos secos o fruta";
    case "Almuerzo":
      return `${proteina} + arroz/quinoa + ensalada`;
    case "Merienda":
      return veg ? "Yogur o fruta con avena" : "Batido de proteína o yogur";
    case "Cena":
      return `${proteina} + verduras al vapor`;
    default:
      return "Comida balanceada";
  }
}

export function generarPlan(respuestas: Respuestas, perfil: { peso: number; altura: number; edad: number }): PlanGenerado {
  const objetivo = (respuestas.objetivo as string) || "mantener";
  const dias = (respuestas.dias as string) || "3";
  const comidas = (respuestas.comidas as string) || "3";
  const restric = (respuestas.restricciones as string[]) || [];
  const evitar = (respuestas.evitar as string[]) || [];
  const estricto = (respuestas.estricto as string) || "equilibrado";

  // Calorías base según perfil y objetivo (Mifflin-St Jeor)
  let kcal = calcularMetaKcal({ peso: perfil.peso, altura: perfil.altura, edad: perfil.edad, objetivo });
  // Ajuste fino por qué tan estricto quiere el plan
  if (estricto === "estricto" && objetivo === "bajar") kcal -= 150;
  if (estricto === "relajado" && objetivo === "bajar") kcal += 150;

  // Macros en gramos (proteína y carbos 4 kcal/g, grasa 9 kcal/g)
  const m = MACROS_OBJETIVO[objetivo] || MACROS_OBJETIVO.mantener;
  const macros = {
    proteina: Math.round((kcal * m.p) / 4),
    carbos: Math.round((kcal * m.c) / 4),
    grasa: Math.round((kcal * m.g) / 9),
  };

  // Rutina según días
  const rutina = RUTINA_DIAS[dias] || RUTINA_DIAS["3"];

  // Minuta: repartir calorías en las comidas del día
  const reparto = REPARTO_COMIDAS[comidas] || REPARTO_COMIDAS["3"];
  const minuta = reparto.map((c) => ({
    comida: c.nombre,
    kcal: Math.round(kcal * c.pct),
    sugerencia: sugerirComida(c.nombre, restric, evitar),
  }));

  // Tabla de selectividad (qué come / qué no come)
  const noCome: string[] = [];
  const etiquetas: Record<string, string> = {
    vegetariano: "Sin carne", vegano: "Sin productos animales",
    singluten: "Sin gluten", sinlactosa: "Sin lactosa",
    cerdo: "Cerdo", mariscos: "Mariscos", pescado: "Pescado",
    huevo: "Huevo", frutossecos: "Frutos secos",
  };
  [...restric, ...evitar].forEach((r) => {
    if (etiquetas[r] && !noCome.includes(etiquetas[r])) noCome.push(etiquetas[r]);
  });

  return {
    kcal,
    macros,
    rutina,
    minuta,
    selectividad: {
      come: ["Verduras", "Frutas", "Proteínas permitidas", "Carbohidratos integrales", "Agua"],
      noCome: noCome.length ? noCome : ["Sin restricciones"],
    },
    nota: "Este plan es una guía orientativa basada en tus datos, no reemplaza a un profesional de la salud.",
  };
}