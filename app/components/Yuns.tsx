"use client";
import React, { useState, useEffect } from "react";

// ============================================================
//  NEO NUTRI — YUNS, el zorro kitsune naturalista (mascota)
//  Estilo ilustración de zorro real, con lentes redondos.
//  Dibujado 100% en SVG (original, sin copyright).
// ============================================================

const FRASES = [
  "La constancia vence al talento, guerrero.",
  "¡Hoy es un gran día para superarte! 🔥",
  "Cada repetición te acerca a tu mejor versión.",
  "El cuerpo logra lo que la mente cree.",
  "¡Vamos! Tu yo del futuro te lo agradecerá.",
  "Descansa cuando lo necesites, pero nunca te rindas.",
  "Un pequeño paso hoy es un gran salto mañana.",
  "La disciplina es el puente entre metas y logros.",
  "¡Eres más fuerte de lo que crees! 💪",
  "Come bien, entrena duro, descansa mejor.",
];

// Dibujo del zorro Yuns NATURALISTA en SVG
export function YunsSVG({ size = 90 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" style={{ width: size, height: size }} aria-label="Yuns el zorro">
      <defs>
        {/* Degradados para dar volumen al pelaje */}
        <linearGradient id="pelaje" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8843a" />
          <stop offset="100%" stopColor="#c75a26" />
        </linearGradient>
        <linearGradient id="oreja" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4682e" />
          <stop offset="100%" stopColor="#a8431d" />
        </linearGradient>
      </defs>

      {/* Orejas grandes y definidas (proporción real de zorro) */}
      <path d="M30 50 L18 14 Q34 24 46 42 Z" fill="url(#oreja)" stroke="#0d0805" strokeWidth="2" strokeLinejoin="round" />
      <path d="M90 50 L102 14 Q86 24 74 42 Z" fill="url(#oreja)" stroke="#0d0805" strokeWidth="2" strokeLinejoin="round" />
      {/* Interior oscuro de orejas */}
      <path d="M31 46 L23 22 Q33 30 41 42 Z" fill="#3a1c10" />
      <path d="M89 46 L97 22 Q87 30 79 42 Z" fill="#3a1c10" />
      <path d="M32 43 L27 28 Q34 34 39 42 Z" fill="#f6e9c8" opacity="0.6" />
      <path d="M88 43 L93 28 Q86 34 81 42 Z" fill="#f6e9c8" opacity="0.6" />

      {/* Cabeza con forma de zorro (más angular, pómulos marcados) */}
      <path d="M60 40
        C42 40 33 50 33 64
        C33 74 37 82 44 90
        L54 102 Q60 106 66 102
        L76 90 C83 82 87 74 87 64
        C87 50 78 40 60 40 Z"
        fill="url(#pelaje)" stroke="#0d0805" strokeWidth="2.2" />

      {/* Pelaje del pecho/mejillas (el blanco característico del zorro) */}
      <path d="M60 60
        C50 60 45 72 48 84
        L56 100 Q60 104 64 100
        L72 84 C75 72 70 60 60 60 Z"
        fill="#f6e9c8" />
      {/* Mechones laterales de pelaje (textura) */}
      <path d="M34 66 l-5 8 l7 -3 Z" fill="#c75a26" stroke="#0d0805" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M86 66 l5 8 l-7 -3 Z" fill="#c75a26" stroke="#0d0805" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M40 88 l-3 7 l6 -4 Z" fill="#c75a26" stroke="#0d0805" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M80 88 l3 7 l-6 -4 Z" fill="#c75a26" stroke="#0d0805" strokeWidth="1.2" strokeLinejoin="round" />

      {/* Sombras suaves para volumen */}
      <ellipse cx="60" cy="56" rx="20" ry="8" fill="#c75a26" opacity="0.4" />

      {/* Ojos almendrados (forma realista de zorro) */}
      <path d="M40 62 Q47 55 55 61 Q48 67 40 62 Z" fill="#fff" />
      <path d="M80 62 Q73 55 65 61 Q72 67 80 62 Z" fill="#fff" />
      <ellipse cx="48" cy="62" rx="4" ry="4.5" fill="#7a4a1e" />
      <ellipse cx="72" cy="62" rx="4" ry="4.5" fill="#7a4a1e" />
      <circle cx="48" cy="62" r="2.2" fill="#0d0805" />
      <circle cx="72" cy="62" r="2.2" fill="#0d0805" />
      <circle cx="49.5" cy="60.5" r="1" fill="#fff" />
      <circle cx="73.5" cy="60.5" r="1" fill="#fff" />

      {/* Lentes redondos (como los del creador 😎) */}
      <circle cx="48" cy="62" r="10" fill="none" stroke="#0d0805" strokeWidth="2.3" />
      <circle cx="72" cy="62" r="10" fill="none" stroke="#0d0805" strokeWidth="2.3" />
      <path d="M58 62 q2 -1.5 4 0" fill="none" stroke="#0d0805" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M38 61 l-5 -1.5" stroke="#0d0805" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M82 61 l5 -1.5" stroke="#0d0805" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="48" cy="62" r="10" fill="#cfe8ff" opacity="0.1" />
      <circle cx="72" cy="62" r="10" fill="#cfe8ff" opacity="0.1" />

      {/* Hocico alargado (clave del realismo) */}
      <path d="M60 72 Q54 74 56 80 L60 86 L64 80 Q66 74 60 72 Z" fill="#f6e9c8" />
      <ellipse cx="60" cy="80" rx="4" ry="3" fill="#0d0805" />
      <path d="M60 83 v4 M60 87 q-5 3 -9 1 M60 87 q5 3 9 1" fill="none" stroke="#0d0805" strokeWidth="1.8" strokeLinecap="round" />

      {/* Bigotes (toque naturalista) */}
      <path d="M52 81 l-14 -3 M52 84 l-13 2" stroke="#0d0805" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M68 81 l14 -3 M68 84 l13 2" stroke="#0d0805" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

      {/* Banda guerrera (su sello, discreta) */}
      <rect x="34" y="46" width="52" height="7" rx="2" fill="#d23b2e" stroke="#0d0805" strokeWidth="1.8" />
      <circle cx="60" cy="49.5" r="3" fill="#e8a13a" stroke="#0d0805" strokeWidth="1.3" />
    </svg>
  );
}

// Tarjeta de Yuns con saludo + frase rotativa
export default function Yuns({ nombre = "GUERRERO" }: { nombre?: string }) {
  const [frase, setFrase] = useState(FRASES[0]);

  useEffect(() => {
    setFrase(FRASES[Math.floor(Math.random() * FRASES.length)]);
  }, []);

  function nuevaFrase() {
    let nueva = frase;
    while (nueva === frase && FRASES.length > 1) {
      nueva = FRASES[Math.floor(Math.random() * FRASES.length)];
    }
    setFrase(nueva);
  }

  return (
    <div className="yuns-card" onClick={nuevaFrase} role="button" title="Toca para otra frase">
      <style suppressHydrationWarning>{CSS}</style>
      <div className="yuns-fig">
        <YunsSVG size={90} />
      </div>
      <div className="yuns-bocadillo">
        <p className="yuns-hola">YUNS dice:</p>
        <p className="yuns-frase">{frase}</p>
      </div>
    </div>
  );
}

const CSS = `
  .yuns-card { display:flex; align-items:center; gap:12px; cursor:pointer;
    background:linear-gradient(160deg,#32201a,#2a1812); border:2px solid #0d0805; border-radius:8px;
    padding:14px; margin-bottom:14px; box-shadow:4px 4px 0 #00000055; transition:transform .12s; }
  .yuns-card:active { transform:scale(.98); }
  .yuns-fig { flex-shrink:0; filter:drop-shadow(2px 3px 0 #00000044); }
  .yuns-bocadillo { flex:1; position:relative; background:#1c1410; border:2px solid #e8a13a;
    border-radius:10px; padding:10px 12px; }
  .yuns-bocadillo::before { content:""; position:absolute; left:-9px; top:50%; transform:translateY(-50%);
    width:0; height:0; border-top:7px solid transparent; border-bottom:7px solid transparent;
    border-right:9px solid #e8a13a; }
  .yuns-hola { font-family:'Bebas Neue'; font-size:14px; letter-spacing:2px; color:#e8a13a; margin-bottom:3px; }
  .yuns-frase { font-size:13px; font-weight:700; color:#f3e6cd; line-height:1.35; }
`;