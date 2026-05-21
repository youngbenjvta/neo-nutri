"use client";
import React from "react";
import { ChevronLeft, Hand } from "lucide-react";

// ============================================================
//  NEO NUTRI — PORCIONES VISUALES (shonen pintado)
//  Mide tu comida usando la mano. Sin báscula.
// ============================================================

const PORTIONS = [
  {
    key: "palma",
    name: "PALMA",
    jp: "手のひら",
    eq: "≈ 100-120g",
    macro: "Proteína",
    examples: "carne, pollo, pescado",
    tone: "#d23b2e",
    // dibujo simple de la mano abierta (palma)
    draw: (
      <g>
        <path d="M30 60 Q30 30 40 30 Q50 30 50 60 M52 58 Q52 22 62 22 Q72 22 72 58 M74 60 Q74 26 84 26 Q94 26 94 60 M28 60 Q26 40 18 44 Q12 48 18 64 L26 84"
          fill="none" stroke="#f6e9c8" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 64 Q22 96 44 104 L80 104 Q98 100 96 64"
          fill="#1c1410" stroke="#f6e9c8" strokeWidth="3" strokeLinejoin="round" />
      </g>
    ),
  },
  {
    key: "puno",
    name: "PUÑO",
    jp: "握りこぶし",
    eq: "≈ 1 taza",
    macro: "Carbohidratos",
    examples: "arroz, pasta, avena",
    tone: "#e8a13a",
    draw: (
      <g>
        <rect x="34" y="44" width="54" height="42" rx="16" fill="#1c1410" stroke="#f6e9c8" strokeWidth="3" />
        <path d="M40 44 V36 M52 44 V34 M64 44 V34 M76 44 V36"
          stroke="#f6e9c8" strokeWidth="3" strokeLinecap="round" />
        <path d="M34 60 Q24 58 26 70 Q28 80 38 78" fill="none" stroke="#f6e9c8" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },
  {
    key: "copa",
    name: "MANO EN COPA",
    jp: "すくう手",
    eq: "≈ ½ taza",
    macro: "Frutas y verduras",
    examples: "bayas, cereales",
    tone: "#3f7d6e",
    draw: (
      <g>
        <path d="M22 50 Q20 92 60 96 Q100 92 98 50 Q92 70 60 72 Q28 70 22 50 Z"
          fill="#1c1410" stroke="#f6e9c8" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="48" cy="60" r="5" fill="#3f7d6e" />
        <circle cx="62" cy="64" r="5" fill="#d23b2e" />
        <circle cx="74" cy="58" r="5" fill="#e8a13a" />
      </g>
    ),
  },
  {
    key: "pulgar",
    name: "PULGAR",
    jp: "親指",
    eq: "≈ 1 cucharada",
    macro: "Grasas saludables",
    examples: "aceites, mantequillas",
    tone: "#d4a84a",
    draw: (
      <g>
        <path d="M44 36 Q60 36 60 56 Q60 86 44 90 Q34 90 34 70 Q34 40 44 36 Z"
          fill="#1c1410" stroke="#f6e9c8" strokeWidth="3" strokeLinejoin="round" />
        <path d="M34 64 Q22 62 24 74 Q26 84 36 82" fill="none" stroke="#f6e9c8" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },
  {
    key: "dedos",
    name: "DEDOS JUNTOS",
    jp: "指",
    eq: "≈ 30g",
    macro: "Frutos secos",
    examples: "almendras, nueces",
    tone: "#9b6bd2",
    draw: (
      <g>
        <path d="M40 30 V84 M52 26 V84 M64 26 V84 M76 30 V84"
          stroke="#f6e9c8" strokeWidth="6" strokeLinecap="round" />
      </g>
    ),
  },
];

const EQUIVS = [
  { label: "1 TAZA", val: "≈ 240 ml" },
  { label: "1 ONZA", val: "≈ 28.35 g" },
  { label: "1 CDA", val: "≈ 15 ml" },
  { label: "1 CDTA", val: "≈ 5 ml" },
];

export default function Porciones({ onBack }: { onBack?: () => void }) {
  return (
    <div className="app">
      <style suppressHydrationWarning>{CSS}</style>

      {/* HEADER */}
      <header className="top">
        <button className="back" aria-label="Volver" onClick={() => onBack && onBack()}><ChevronLeft size={22} /></button>
        <h1 className="top-title">PORCIONES</h1>
        <span className="top-jp">分量</span>
      </header>

      <p className="intro">
        <Hand size={15} /> Aprende a medir sin báscula. Tu mano es tu herramienta.
      </p>

      {/* LISTA DE PORCIONES */}
      <div className="list">
        {PORTIONS.map((p) => (
          <div key={p.key} className="card" style={{ borderColor: p.tone }}>
            <div className="card-draw" style={{ borderColor: p.tone }}>
              <svg viewBox="0 0 120 120">{p.draw}</svg>
            </div>
            <div className="card-info">
              <div className="card-name" style={{ color: p.tone }}>
                {p.name} <span className="card-jp">{p.jp}</span>
              </div>
              <div className="card-eq">{p.eq}</div>
              <div className="card-macro">{p.macro}</div>
              <div className="card-ex">{p.examples}</div>
            </div>
          </div>
        ))}
      </div>

      {/* EQUIVALENCIAS */}
      <section className="equiv-panel">
        <h2 className="equiv-title">換 EQUIVALENCIAS</h2>
        <div className="equiv-grid">
          {EQUIVS.map((e) => (
            <div key={e.label} className="equiv">
              <span className="equiv-label">{e.label}</span>
              <span className="equiv-val">{e.val}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const CSS = `
  * { box-sizing: border-box; margin: 0; }
  .app {
    --bg1:#1a0f0a; --bg2:#241410; --panel:#2a1812; --panel2:#32201a;
    --paper:#f6e9c8; --ink:#0d0805;
    --red:#d23b2e; --amber:#e8a13a; --gold:#d4a84a;
    --txt:#f3e6cd; --mut:#b09a7e;
    max-width:460px; margin:0 auto; padding:16px 14px 32px;
    color:var(--txt); min-height:100vh; position:relative; overflow-x:hidden;
    font-family:'Zen Kaku Gothic New', sans-serif; font-weight:500;
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 8%, #5a2a1e 0%, transparent 45%),
      linear-gradient(165deg, var(--bg2), var(--bg1));
  }
  .top { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
  .back { width:38px; height:38px; border-radius:6px; border:2px solid var(--ink);
    background:linear-gradient(160deg,#341f18,#26150f); color:var(--paper);
    display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .top-title { font-family:'Bebas Neue'; font-size:30px; letter-spacing:2px; color:var(--paper);
    flex:1; }
  .top-jp { font-size:13px; color:var(--mut); letter-spacing:3px; }
  .intro { display:flex; align-items:center; gap:7px; font-size:13px; color:var(--mut);
    margin-bottom:16px; }
  .intro svg { color:var(--amber); }

  .list { display:flex; flex-direction:column; gap:12px; }
  .card { display:flex; align-items:center; gap:14px; padding:12px;
    background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid; border-radius:8px; box-shadow:4px 4px 0 #00000055; }
  .card-draw { width:84px; height:84px; flex-shrink:0; border:2px solid; border-radius:8px;
    background:#1c1410; display:flex; align-items:center; justify-content:center; padding:8px; }
  .card-draw svg { width:100%; height:100%; }
  .card-info { flex:1; }
  .card-name { font-family:'Bebas Neue'; font-size:22px; letter-spacing:1px; line-height:1; }
  .card-jp { font-size:11px; color:var(--mut); letter-spacing:1px; font-family:'Zen Kaku Gothic New'; }
  .card-eq { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--paper); margin-top:2px; }
  .card-macro { font-size:13px; font-weight:700; color:var(--txt); margin-top:4px; }
  .card-ex { font-size:12px; color:var(--mut); }

  .equiv-panel { margin-top:18px; padding:16px;
    background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:8px; box-shadow:4px 4px 0 #00000055; }
  .equiv-title { font-family:'Bebas Neue'; font-size:21px; letter-spacing:2px; color:var(--paper);
    border-bottom:3px solid var(--gold); padding-bottom:5px; margin-bottom:14px; display:inline-block; }
  .equiv-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
  .equiv { text-align:center; padding:10px 4px; border:2px solid var(--ink); border-radius:6px;
    background:#241410; }
  .equiv-label { display:block; font-family:'Bebas Neue'; font-size:15px; letter-spacing:1px; color:var(--gold); }
  .equiv-val { font-size:11px; color:var(--mut); }
`;