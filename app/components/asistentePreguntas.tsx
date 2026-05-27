"use client";

// ============================================================
//  KAIZEN — Preguntas del Asistente (encuesta tipo nutricionista)
//  Las respuestas alimentan la generación de rutina + minuta.
// ============================================================

export type Pregunta = {
  id: string;
  texto: string;
  jp: string;
  tipo: "single" | "multi";   // elegir una o varias
  opciones: { id: string; label: string }[];
};

export const PREGUNTAS: Pregunta[] = [
  {
    id: "objetivo",
    texto: "¿Cuál es tu objetivo principal?",
    jp: "目標",
    tipo: "single",
    opciones: [
      { id: "bajar", label: "Bajar grasa" },
      { id: "mantener", label: "Mantenerme" },
      { id: "subir", label: "Ganar músculo" },
    ],
  },
  {
    id: "dias",
    texto: "¿Cuántos días por semana puedes entrenar?",
    jp: "日数",
    tipo: "single",
    opciones: [
      { id: "2", label: "2 días" },
      { id: "3", label: "3 días" },
      { id: "4", label: "4 días" },
      { id: "5", label: "5 o más" },
    ],
  },
  {
    id: "tiempo",
    texto: "¿Cuánto tiempo tienes por sesión?",
    jp: "時間",
    tipo: "single",
    opciones: [
      { id: "corto", label: "30 min" },
      { id: "medio", label: "45-60 min" },
      { id: "largo", label: "+1 hora" },
    ],
  },
  {
    id: "comidas",
    texto: "¿Cuántas comidas haces al día?",
    jp: "食事",
    tipo: "single",
    opciones: [
      { id: "3", label: "3 comidas" },
      { id: "4", label: "4 comidas" },
      { id: "5", label: "5 comidas" },
    ],
  },
  {
    id: "restricciones",
    texto: "¿Sigues alguna dieta o restricción?",
    jp: "制限",
    tipo: "multi",
    opciones: [
      { id: "ninguna", label: "Ninguna, como de todo" },
      { id: "vegetariano", label: "Vegetariano" },
      { id: "vegano", label: "Vegano" },
      { id: "singluten", label: "Sin gluten" },
      { id: "sinlactosa", label: "Sin lactosa" },
    ],
  },
  {
    id: "evitar",
    texto: "¿Hay alimentos que NO comes?",
    jp: "苦手",
    tipo: "multi",
    opciones: [
      { id: "nada", label: "Como de todo" },
      { id: "cerdo", label: "Cerdo" },
      { id: "mariscos", label: "Mariscos" },
      { id: "pescado", label: "Pescado" },
      { id: "huevo", label: "Huevo" },
      { id: "frutossecos", label: "Frutos secos" },
    ],
  },
  {
    id: "nivel",
    texto: "¿Cuál es tu nivel en el gym?",
    jp: "経験",
    tipo: "single",
    opciones: [
      { id: "prin", label: "Principiante" },
      { id: "inter", label: "Intermedio" },
      { id: "avz", label: "Avanzado" },
    ],
  },
  {
    id: "actividad",
    texto: "Fuera del gym, ¿qué tan activo eres?",
    jp: "活動",
    tipo: "single",
    opciones: [
      { id: "sedentario", label: "Sedentario (oficina)" },
      { id: "ligero", label: "Algo activo" },
      { id: "activo", label: "Muy activo" },
    ],
  },
  {
    id: "estricto",
    texto: "¿Qué tan estricto quieres el plan?",
    jp: "厳しさ",
    tipo: "single",
    opciones: [
      { id: "relajado", label: "Relajado" },
      { id: "equilibrado", label: "Equilibrado" },
      { id: "estricto", label: "Estricto" },
    ],
  },
];