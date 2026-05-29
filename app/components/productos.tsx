"use client";

// ============================================================
//  KAIZEN — Catálogo de la tienda
//  Títulos comprables + temas extra que se desbloquean con monedas.
// ============================================================

export type Titulo = {
  id: string;
  nombre: string;       // texto del título
  emoji: string;
  descripcion: string;
  color: string;        // color del texto
  precio: number;
};

export const TITULOS: Titulo[] = [
  { id: "novato",     nombre: "Aprendiz",          emoji: "🥋", descripcion: "Acabas de empezar",            color: "#b09a7e", precio: 50 },
  { id: "guerrero",   nombre: "Guerrero del Sol",  emoji: "☀️", descripcion: "Constante y dedicado",          color: "#e8a13a", precio: 150 },
  { id: "samurai",    nombre: "Samurái Imparable", emoji: "⚔️", descripcion: "Disciplina pura",               color: "#d23b2e", precio: 300 },
  { id: "dragon",     nombre: "Dragón de Fuego",   emoji: "🐉", descripcion: "Tu fuego no se apaga",          color: "#e8201a", precio: 600 },
  { id: "leyenda",    nombre: "Leyenda KAIZEN",    emoji: "👑", descripcion: "El más alto rango",             color: "#ffd84a", precio: 1000 },
];

export type TemaExtra = {
  id: string;
  nombre: string;
  emoji: string;
  descripcion: string;
  precio: number;
  vars: Record<string, string>;
};

export const TEMAS_EXTRA: TemaExtra[] = [
  {
    id: "galaxy",
    nombre: "GALAXY",
    emoji: "🌌",
    descripcion: "Espacio profundo, púrpura cósmico",
    precio: 200,
    vars: {
      "--t-bg1": "#0a0612",
      "--t-bg2": "#150f24",
      "--t-panel": "#1f1638",
      "--t-panel2": "#2a1f4a",
      "--t-paper": "#f0e8ff",
      "--t-ink": "#000000",
      "--t-red": "#d44dc4",
      "--t-amber": "#a98aff",
      "--t-gold": "#8d6dff",
      "--t-teal": "#4ad6e8",
      "--t-txt": "#e8e0ff",
      "--t-mut": "#9888c5",
      "--t-glow": "#3a1a6a",
    },
  },
  {
    id: "fuego",
    nombre: "FUEGO",
    emoji: "🔥",
    descripcion: "Llamas vivas, rojo intenso",
    precio: 300,
    vars: {
      "--t-bg1": "#180603",
      "--t-bg2": "#260a04",
      "--t-panel": "#321008",
      "--t-panel2": "#42180c",
      "--t-paper": "#fff0e0",
      "--t-ink": "#000000",
      "--t-red": "#ff4520",
      "--t-amber": "#ffae3a",
      "--t-gold": "#ff8a20",
      "--t-teal": "#e85a20",
      "--t-txt": "#ffe8d4",
      "--t-mut": "#c89878",
      "--t-glow": "#7a1a05",
    },
  },
  {
    id: "hielo",
    nombre: "HIELO",
    emoji: "❄️",
    descripcion: "Ártico azul, frío como hielo",
    precio: 300,
    vars: {
      "--t-bg1": "#06141c",
      "--t-bg2": "#0a1f2c",
      "--t-panel": "#102a3a",
      "--t-panel2": "#163850",
      "--t-paper": "#e0f0ff",
      "--t-ink": "#000000",
      "--t-red": "#4ac4e8",
      "--t-amber": "#a8d8ff",
      "--t-gold": "#7ac0ee",
      "--t-teal": "#5af0d8",
      "--t-txt": "#d4ecff",
      "--t-mut": "#7a9cb5",
      "--t-glow": "#0a4a6a",
    },
  },
];