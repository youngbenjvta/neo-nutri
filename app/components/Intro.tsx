"use client";
import React, { useState } from "react";
import { YunsSVG } from "./Yuns";
import { ChevronRight, Check } from "lucide-react";

// ============================================================
//  KAIZEN — INTRODUCCIÓN (onboarding)
//  Diapositivas que explican la app. Se ve solo la 1ª vez.
// ============================================================

const SLIDES = [
  {
    jp: "改善",
    titulo: "BIENVENIDO A KAIZEN",
    texto: "Soy Yuns, tu compañero. KAIZEN significa \"mejora continua\": volverte mejor cada día, un pequeño paso a la vez. 🦊",
  },
  {
    jp: "食事",
    titulo: "REGISTRA TU COMIDA",
    texto: "Anota lo que comes y calcula tus calorías y macros al instante. Arma tus platos eligiendo de cientos de alimentos. 🍱",
  },
  {
    jp: "鍛錬",
    titulo: "ENTRENA Y SUBE DE NIVEL",
    texto: "Completa rutinas, gana experiencia (XP) y haz evolucionar a tu guerrero. ¡De cinturón blanco a negro! 🥋",
  },
  {
    jp: "炎",
    titulo: "MANTÉN TU RACHA",
    texto: "Entra cada día para no romper tu racha, desbloquea logros y alcanza tus metas. ¡La constancia es tu poder! 🔥",
  },
];

export default function Intro({ onListo }: { onListo?: () => void }) {
  const [i, setI] = useState(0);
  const esUltima = i === SLIDES.length - 1;
  const slide = SLIDES[i];

  function siguiente() {
    if (esUltima) {
      terminar();
    } else {
      setI(i + 1);
    }
  }

  function terminar() {
    try { localStorage.setItem("kaizen.introVista", "1"); } catch { /* nada */ }
    onListo && onListo();
  }

  return (
    <div className="intro">
      <style suppressHydrationWarning>{CSS}</style>

      {/* Botón saltar (no en la última) */}
      {!esUltima && (
        <button className="intro-skip" onClick={terminar}>Saltar</button>
      )}

      <div className="intro-box">
        {/* Yuns con su kanji */}
        <div className="intro-yuns">
          <YunsSVG size={130} />
          <span className="intro-jp">{slide.jp}</span>
        </div>

        <h1 className="intro-titulo">{slide.titulo}</h1>
        <p className="intro-texto">{slide.texto}</p>

        {/* Puntitos de progreso */}
        <div className="intro-dots">
          {SLIDES.map((_, idx) => (
            <span key={idx} className={`dot ${idx === i ? "on" : ""}`} />
          ))}
        </div>

        {/* Botón siguiente / empezar */}
        <button className="intro-btn" onClick={siguiente}>
          {esUltima ? (<>¡EMPEZAR! <Check size={18} /></>) : (<>SIGUIENTE <ChevronRight size={18} /></>)}
        </button>
      </div>
    </div>
  );
}

const CSS = `
  * { box-sizing:border-box; margin:0; }
  .intro {
    position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center;
    padding:24px; font-family:'Zen Kaku Gothic New', sans-serif; color:var(--txt);
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 22%, var(--glow) 0%, transparent 55%),
      linear-gradient(165deg, var(--bg2), var(--bg1));
  }
  .intro-skip { position:absolute; top:20px; right:20px; background:none; border:none;
    color:var(--mut); font-size:14px; font-weight:700; cursor:pointer; padding:8px; }
  .intro-skip:hover { color:var(--amber); }
  .intro-box { width:100%; max-width:420px; text-align:center; display:flex; flex-direction:column; align-items:center; }
  .intro-yuns { position:relative; margin-bottom:8px; filter:drop-shadow(2px 4px 0 #00000055); }
  .intro-jp { position:absolute; bottom:-4px; right:-6px; font-family:'Bebas Neue';
    font-size:30px; color:var(--amber); text-shadow:2px 2px 0 var(--ink); }
  .intro-titulo { font-family:'Bebas Neue'; font-size:34px; letter-spacing:2px; color:var(--paper);
    text-shadow:3px 3px 0 var(--red); margin:14px 0 10px; line-height:1; }
  .intro-texto { font-size:15px; font-weight:500; color:var(--txt); line-height:1.5; max-width:340px;
    min-height:90px; }
  .intro-dots { display:flex; gap:8px; margin:20px 0; }
  .dot { width:9px; height:9px; border-radius:50%; background:#5a3a2a; transition:.2s; }
  .dot.on { background:var(--amber); width:24px; border-radius:5px; }
  .intro-btn { display:inline-flex; align-items:center; gap:8px; font-family:'Bebas Neue'; font-size:21px;
    letter-spacing:2px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),var(--red)); border:2px solid var(--ink);
    padding:13px 38px; border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .intro-btn:active { transform:translate(3px,3px); box-shadow:none; }
`;