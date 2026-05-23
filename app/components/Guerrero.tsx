"use client";
import React from "react";

// ============================================================
//  NEO NUTRI — GUERRERO EVOLUTIVO
//  Personaje con kimono (masculino/femenino) y cinturón que
//  sube de rango según un puntaje (nivel + racha + logros).
//  Dibujado 100% en SVG (original, sin copyright).
// ============================================================

// Los cinturones de artes marciales, de menor a mayor rango
export const CINTURONES = [
  { nombre: "Blanco", color: "#f4efe2", borde: "#c9bfa3" },
  { nombre: "Amarillo", color: "#e8c84a", borde: "#a8902a" },
  { nombre: "Naranja", color: "#e08a2e", borde: "#a85e1a" },
  { nombre: "Verde", color: "#4a9e5e", borde: "#2c6e3c" },
  { nombre: "Azul", color: "#3f73c4", borde: "#274d8a" },
  { nombre: "Marrón", color: "#7a4a2e", borde: "#52301c" },
  { nombre: "Negro", color: "#1a1410", borde: "#000" },
];

// Calcula el puntaje de evolución y el rango (índice de cinturón)
export function calcularRango(nivel: number, racha: number, logros: number) {
  // Cada fuente aporta al puntaje total
  const puntaje = nivel * 3 + racha * 2 + logros * 5;
  // Cada 25 puntos sube un cinturón (tope: negro)
  const indice = Math.min(Math.floor(puntaje / 25), CINTURONES.length - 1);
  // Progreso hacia el siguiente cinturón (0 a 1)
  const enRango = (puntaje % 25) / 25;
  return { puntaje, indice, enRango, cinturon: CINTURONES[indice] };
}

type Props = {
  genero?: "hombre" | "mujer";
  nivel?: number;
  racha?: number;
  logros?: number;
  size?: number;
};

export function GuerreroSVG({ genero = "hombre", nivel = 1, racha = 0, logros = 0, size = 150 }: Props) {
  const { indice, cinturon } = calcularRango(nivel, racha, logros);
  // El aura aparece desde cinturón verde (índice 3) en adelante
  const tieneAura = indice >= 3;
  // Detalles dorados desde marrón (índice 5)
  const tieneDorado = indice >= 5;
  const kimono = genero === "mujer" ? "#c9405a" : "#3f6e8c";
  const kimonoSombra = genero === "mujer" ? "#9c2c42" : "#2a4d63";

  return (
    <svg viewBox="0 0 120 150" style={{ width: size, height: size * 1.25 }} aria-label="Tu guerrero">
      {/* AURA de poder (en rangos altos) */}
      {tieneAura && (
        <ellipse cx="60" cy="80" rx="52" ry="68" fill={cinturon.color} opacity="0.16">
          <animate attributeName="opacity" values="0.10;0.22;0.10" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* Piernas */}
      <rect x="46" y="110" width="11" height="30" rx="3" fill={kimonoSombra} stroke="#0d0805" strokeWidth="2" />
      <rect x="63" y="110" width="11" height="30" rx="3" fill={kimonoSombra} stroke="#0d0805" strokeWidth="2" />
      {/* Pies */}
      <ellipse cx="51" cy="142" rx="8" ry="4" fill="#0d0805" />
      <ellipse cx="69" cy="142" rx="8" ry="4" fill="#0d0805" />

      {/* Cuerpo / torso del kimono */}
      <path d="M38 70 Q60 60 82 70 L80 116 Q60 122 40 116 Z" fill={kimono} stroke="#0d0805" strokeWidth="2.5" />
      {/* Solapas del kimono cruzadas */}
      <path d="M60 64 L60 116 L48 112 L52 72 Z" fill={kimonoSombra} opacity="0.55" />
      <path d="M60 64 L72 70 L70 112 L60 116 Z" fill="#ffffff18" />
      {/* Cuello en V */}
      <path d="M52 66 L60 80 L68 66" fill="none" stroke="#f6e9c8" strokeWidth="3" strokeLinejoin="round" />

      {/* Brazos */}
      <path d="M38 72 Q28 86 30 104 L40 102 Q40 86 46 76 Z" fill={kimono} stroke="#0d0805" strokeWidth="2.5" />
      <path d="M82 72 Q92 86 90 104 L80 102 Q80 86 74 76 Z" fill={kimono} stroke="#0d0805" strokeWidth="2.5" />
      {/* Manos */}
      <circle cx="33" cy="106" r="6" fill="#f0b78a" stroke="#0d0805" strokeWidth="2" />
      <circle cx="87" cy="106" r="6" fill="#f0b78a" stroke="#0d0805" strokeWidth="2" />

      {/* CINTURÓN (cambia de color según el rango) */}
      <rect x="39" y="100" width="42" height="9" fill={cinturon.color} stroke="#0d0805" strokeWidth="2" />
      {/* Nudo del cinturón */}
      <rect x="55" y="98" width="10" height="13" rx="2" fill={cinturon.color} stroke="#0d0805" strokeWidth="2" />
      {/* Puntas colgando */}
      <path d="M57 110 l-2 14 l4 0 Z" fill={cinturon.color} stroke="#0d0805" strokeWidth="1.5" />
      <path d="M63 110 l2 14 l-4 0 Z" fill={cinturon.color} stroke="#0d0805" strokeWidth="1.5" />
      {/* Detalle dorado en el cinturón (rangos altos) */}
      {tieneDorado && <rect x="39" y="103" width="42" height="2" fill="#e8c84a" />}

      {/* Cabeza */}
      <circle cx="60" cy="48" r="18" fill="#f0b78a" stroke="#0d0805" strokeWidth="2.5" />
      {/* Pelo (distinto por género) */}
      {genero === "mujer" ? (
        <path d="M42 48 Q40 26 60 26 Q80 26 78 48 Q74 38 60 38 Q46 38 42 48 M42 48 Q40 64 44 72 L48 60 M78 48 Q80 64 76 72 L72 60"
          fill="#3a2418" stroke="#0d0805" strokeWidth="2" strokeLinejoin="round" />
      ) : (
        <path d="M42 46 Q42 26 60 26 Q78 26 78 46 Q70 36 60 36 Q50 36 42 46 Z"
          fill="#3a2418" stroke="#0d0805" strokeWidth="2" strokeLinejoin="round" />
      )}
      {/* Ojos decididos */}
      <path d="M50 48 q3 -2 6 0" fill="none" stroke="#0d0805" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 48 q3 -2 6 0" fill="none" stroke="#0d0805" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="53" cy="51" r="2.2" fill="#0d0805" />
      <circle cx="67" cy="51" r="2.2" fill="#0d0805" />
      {/* Banda guerrera en la frente */}
      <rect x="42" y="40" width="36" height="6" rx="1" fill="#d23b2e" stroke="#0d0805" strokeWidth="1.5" />
      <circle cx="60" cy="43" r="2.5" fill="#e8a13a" stroke="#0d0805" strokeWidth="1" />
    </svg>
  );
}