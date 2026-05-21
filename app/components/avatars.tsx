"use client";
import React from "react";

// ============================================================
//  Avatares guerreros compartidos (Perfil y Dashboard).
//  Definidos en un solo lugar para que coincidan en toda la app.
// ============================================================

export const AVATARS = [
  { id: "a1", aura: "#e8a13a", hair: "#0d0805" },
  { id: "a2", aura: "#d23b2e", hair: "#2a1810" },
  { id: "a3", aura: "#3f7d6e", hair: "#0d0805" },
  { id: "a4", aura: "#9b6bd2", hair: "#1a1018" },
  { id: "a5", aura: "#3b82c4", hair: "#0d0805" },
  { id: "a6", aura: "#d4a84a", hair: "#2a1810" },
];

export function getAvatar(id: string) {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}

// Dibujo SVG del guerrero (cabello en pico estilo shonen).
export function WarriorSVG({ aura, hair }: { aura: string; hair: string }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
      <path d="M30 40 L36 14 L42 34 L50 10 L58 34 L64 14 L70 40 Z" fill={hair} />
      <circle cx="50" cy="46" r="15" fill="#e9c9a0" />
      <path d="M42 44 l6 2 M58 44 l-6 2" stroke="#0d0805" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="44" fill="none" stroke={aura} strokeWidth="3" opacity="0.85" />
    </svg>
  );
}