"use client";

// ============================================================
//  KAIZEN — Catálogo de ejercicios para el editor de rutinas
//  Organizados por grupo muscular para facilitar la búsqueda.
// ============================================================

export type Ejercicio = {
  nombre: string;
  grupo: string;
};

export const EJERCICIOS: Ejercicio[] = [
  // Pecho
  { nombre: "Press de banca", grupo: "Pecho" },
  { nombre: "Press inclinado", grupo: "Pecho" },
  { nombre: "Press declinado", grupo: "Pecho" },
  { nombre: "Aperturas con mancuernas", grupo: "Pecho" },
  { nombre: "Fondos en paralelas", grupo: "Pecho" },
  { nombre: "Press con mancuernas", grupo: "Pecho" },
  { nombre: "Flexiones", grupo: "Pecho" },
  { nombre: "Cruces en polea", grupo: "Pecho" },

  // Espalda
  { nombre: "Dominadas", grupo: "Espalda" },
  { nombre: "Remo con barra", grupo: "Espalda" },
  { nombre: "Remo con mancuernas", grupo: "Espalda" },
  { nombre: "Jalón al pecho", grupo: "Espalda" },
  { nombre: "Peso muerto", grupo: "Espalda" },
  { nombre: "Remo en máquina", grupo: "Espalda" },
  { nombre: "Hiperextensiones", grupo: "Espalda" },
  { nombre: "Pullover", grupo: "Espalda" },

  // Pierna
  { nombre: "Sentadilla", grupo: "Pierna" },
  { nombre: "Sentadilla frontal", grupo: "Pierna" },
  { nombre: "Prensa de piernas", grupo: "Pierna" },
  { nombre: "Zancadas", grupo: "Pierna" },
  { nombre: "Peso muerto rumano", grupo: "Pierna" },
  { nombre: "Extensión de cuádriceps", grupo: "Pierna" },
  { nombre: "Curl femoral", grupo: "Pierna" },
  { nombre: "Elevación de gemelos", grupo: "Pierna" },
  { nombre: "Sentadilla búlgara", grupo: "Pierna" },
  { nombre: "Hip thrust", grupo: "Pierna" },

  // Hombro
  { nombre: "Press militar", grupo: "Hombro" },
  { nombre: "Press Arnold", grupo: "Hombro" },
  { nombre: "Elevaciones laterales", grupo: "Hombro" },
  { nombre: "Elevaciones frontales", grupo: "Hombro" },
  { nombre: "Pájaros (deltoide posterior)", grupo: "Hombro" },
  { nombre: "Encogimientos (trapecio)", grupo: "Hombro" },
  { nombre: "Remo al mentón", grupo: "Hombro" },

  // Bíceps
  { nombre: "Curl con barra", grupo: "Bíceps" },
  { nombre: "Curl con mancuernas", grupo: "Bíceps" },
  { nombre: "Curl martillo", grupo: "Bíceps" },
  { nombre: "Curl en banco scott", grupo: "Bíceps" },
  { nombre: "Curl concentrado", grupo: "Bíceps" },
  { nombre: "Curl en polea", grupo: "Bíceps" },

  // Tríceps
  { nombre: "Press francés", grupo: "Tríceps" },
  { nombre: "Extensión en polea", grupo: "Tríceps" },
  { nombre: "Fondos en banco", grupo: "Tríceps" },
  { nombre: "Patada de tríceps", grupo: "Tríceps" },
  { nombre: "Press cerrado", grupo: "Tríceps" },
  { nombre: "Extensión sobre cabeza", grupo: "Tríceps" },

  // Core
  { nombre: "Plancha abdominal", grupo: "Core" },
  { nombre: "Crunch", grupo: "Core" },
  { nombre: "Elevación de piernas", grupo: "Core" },
  { nombre: "Russian twist", grupo: "Core" },
  { nombre: "Mountain climbers", grupo: "Core" },
  { nombre: "Plancha lateral", grupo: "Core" },
  { nombre: "Rueda abdominal", grupo: "Core" },

  // Cardio
  { nombre: "Correr", grupo: "Cardio" },
  { nombre: "Bicicleta", grupo: "Cardio" },
  { nombre: "Saltar la cuerda", grupo: "Cardio" },
  { nombre: "Elíptica", grupo: "Cardio" },
  { nombre: "Remo (máquina)", grupo: "Cardio" },
  { nombre: "Burpees", grupo: "Cardio" },
];

// Grupos en orden, para los filtros del editor
export const GRUPOS = ["Pecho", "Espalda", "Pierna", "Hombro", "Bíceps", "Tríceps", "Core", "Cardio"];