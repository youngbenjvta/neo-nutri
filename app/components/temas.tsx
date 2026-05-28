"use client";
import { useState, useEffect } from "react";

// ============================================================
//  KAIZEN — Sistema de temas (skins)
//  Aplica variables CSS al <html> según el tema elegido.
//  Se guarda en localStorage y se restaura al volver.
// ============================================================

export type Tema = {
  id: string;
  nombre: string;
  emoji: string;
  descripcion: string;
  vars: Record<string, string>;
};

export const TEMAS: Tema[] = [
  {
    id: "kaizen",
    nombre: "KAIZEN",
    emoji: "🦊",
    descripcion: "El clásico cálido shonen",
    vars: {
      "--t-bg1": "#1a0f0a",
      "--t-bg2": "#241410",
      "--t-panel": "#2a1812",
      "--t-panel2": "#32201a",
      "--t-paper": "#f6e9c8",
      "--t-ink": "#0d0805",
      "--t-red": "#d23b2e",
      "--t-amber": "#e8a13a",
      "--t-gold": "#d4a84a",
      "--t-teal": "#3f7d6e",
      "--t-txt": "#f3e6cd",
      "--t-mut": "#b09a7e",
      "--t-glow": "#5a2a1e",
    },
  },
  {
    id: "bushido",
    nombre: "BUSHIDO",
    emoji: "⚔️",
    descripcion: "Negro y rojo samurái",
    vars: {
      "--t-bg1": "#0a0a0c",         // negro absoluto
      "--t-bg2": "#1a1a1f",         // gris carbón
      "--t-panel": "#22222a",       // panel oscuro
      "--t-panel2": "#2c2c34",      // panel alternativo
      "--t-paper": "#f0f0f5",       // texto blanco claro (alto contraste)
      "--t-ink": "#000000",         // bordes negro absoluto
      "--t-red": "#e8201a",         // rojo intenso samurái
      "--t-amber": "#e8c060",       // ámbar dorado
      "--t-gold": "#d4a838",        // oro
      "--t-teal": "#5a9c8f",        // teal claro (legible)
      "--t-txt": "#e8e8ee",         // texto principal (blanco suave)
      "--t-mut": "#9595a0",         // texto secundario (gris claro)
      "--t-glow": "#4a1010",        // brillo rojo profundo
    },
  },
  {
    id: "sakura",
    nombre: "SAKURA",
    emoji: "🌸",
    descripcion: "Día primaveral, rosa suave",
    vars: {
      "--t-bg1": "#fdf2f0",         // fondo principal (claro rosado)
      "--t-bg2": "#fce8e4",         // fondo secundario
      "--t-panel": "#ffffff",       // panel claro
      "--t-panel2": "#fff6f3",      // panel claro alternativo
      "--t-paper": "#3a1f1a",       // texto principal (oscuro, para leer sobre claro)
      "--t-ink": "#7a2a26",         // bordes (rojo oscuro)
      "--t-red": "#c8362c",         // rojo más profundo y legible
      "--t-amber": "#a86420",       // ámbar oscuro (legible sobre claro)
      "--t-gold": "#8a6020",        // dorado oscuro
      "--t-teal": "#4a7c6e",        // teal oscuro
      "--t-txt": "#3a1f1a",         // texto general (oscuro)
      "--t-mut": "#8a6a64",         // texto secundario
      "--t-glow": "#f5cdc3",        // brillo rosa suave
    },
  },
];

// Aplica las variables del tema al elemento <html>
function aplicarTema(tema: Tema) {
  if (typeof document === "undefined") return;
  Object.entries(tema.vars).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
  document.documentElement.setAttribute("data-tema", tema.id);
}

// Hook para usar el tema actual
export function useTema() {
  const [temaId, setTemaIdState] = useState<string>("kaizen");

  // Al cargar: leer el tema guardado y aplicarlo
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("kaizen.tema") || "kaizen";
      const tema = TEMAS.find((t) => t.id === guardado) || TEMAS[0];
      setTemaIdState(tema.id);
      aplicarTema(tema);
    } catch { /* nada */ }
  }, []);

  function setTema(id: string) {
    const tema = TEMAS.find((t) => t.id === id);
    if (!tema) return;
    setTemaIdState(id);
    aplicarTema(tema);
    try { localStorage.setItem("kaizen.tema", id); } catch { /* nada */ }
  }

  const temaActual = TEMAS.find((t) => t.id === temaId) || TEMAS[0];
  return { temaActual, setTema };
}