"use client";
import React, { useState, useRef, useEffect } from "react";
import { YunsSVG } from "./Yuns";

// ============================================================
//  NEO NUTRI — YUNS FLOTANTE
//  Botón flotante arrastrable. Al tocarlo (sin arrastrar)
//  muestra un consejo en una burbuja. Recuerda su posición.
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
  "Bebe agua y no olvides tu proteína. 🥤",
  "Registra todo lo que comes, ¡hasta el café! 🦊",
  "¡Calienta antes de entrenar! Cuida tu técnica.",
];

export default function YunsFlotante() {
  // Posición del botón (esquina inferior derecha por defecto)
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [abierto, setAbierto] = useState(false);
  const [frase, setFrase] = useState(FRASES[0]);
  const [listo, setListo] = useState(false);

  // Datos internos del arrastre
  const arrastrando = useRef(false);
  const movido = useRef(false);
  const inicio = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // Posición inicial: abajo a la derecha. Recupera la guardada si existe.
  useEffect(() => {
    const guardada = typeof window !== "undefined" ? localStorage.getItem("yuns.pos") : null;
    if (guardada) {
      try { setPos(JSON.parse(guardada)); }
      catch { setPos({ x: window.innerWidth - 86, y: window.innerHeight - 170 }); }
    } else {
      setPos({ x: window.innerWidth - 86, y: window.innerHeight - 170 });
    }
    setListo(true);
  }, []);

  function clamp(x: number, y: number) {
    const maxX = window.innerWidth - 70;
    const maxY = window.innerHeight - 80;
    return { x: Math.max(6, Math.min(x, maxX)), y: Math.max(6, Math.min(y, maxY)) };
  }

  // Inicio del toque/arrastre
  function onDown(clientX: number, clientY: number) {
    arrastrando.current = true;
    movido.current = false;
    inicio.current = { x: clientX, y: clientY, px: pos.x, py: pos.y };
  }
  // Movimiento del dedo/ratón
  function onMove(clientX: number, clientY: number) {
    if (!arrastrando.current) return;
    const dx = clientX - inicio.current.x;
    const dy = clientY - inicio.current.y;
    // Si se movió más de 6px, es un arrastre (no un toque)
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movido.current = true;
    setPos(clamp(inicio.current.px + dx, inicio.current.py + dy));
  }
  // Fin: si NO se movió, fue un toque → mostrar consejo
  function onUp() {
    if (!arrastrando.current) return;
    arrastrando.current = false;
    if (!movido.current) {
      // Fue un toque: abrir/cerrar consejo con nueva frase
      if (!abierto) setFrase(FRASES[Math.floor(Math.random() * FRASES.length)]);
      setAbierto((a) => !a);
    } else {
      // Fue arrastre: guardar la posición
      localStorage.setItem("yuns.pos", JSON.stringify(pos));
    }
  }

  // Listeners globales para mouse (desktop)
  useEffect(() => {
    function mm(e: MouseEvent) { onMove(e.clientX, e.clientY); }
    function mu() { onUp(); }
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  });

  if (!listo) return null;

  // ¿La burbuja va a la izquierda o derecha del botón?
  const burbujaIzq = pos.x > (typeof window !== "undefined" ? window.innerWidth / 2 : 200);

  return (
    <div className="yunsflo-wrap" style={{ left: pos.x, top: pos.y }}>
      <style suppressHydrationWarning>{CSS}</style>

      {/* Burbuja de consejo */}
      {abierto && (
        <div className={`yunsflo-burbuja ${burbujaIzq ? "izq" : "der"}`}>
          <p className="yunsflo-hola">YUNS dice:</p>
          <p className="yunsflo-frase">{frase}</p>
        </div>
      )}

      {/* Botón de Yuns */}
      <button
        className="yunsflo-btn"
        onMouseDown={(e) => onDown(e.clientX, e.clientY)}
        onTouchStart={(e) => { const t = e.touches[0]; onDown(t.clientX, t.clientY); }}
        onTouchMove={(e) => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }}
        onTouchEnd={onUp}
        aria-label="Yuns, tu mascota"
      >
        <YunsSVG size={54} />
      </button>
    </div>
  );
}

const CSS = `
  .yunsflo-wrap { position:fixed; z-index:9999; touch-action:none; }
  .yunsflo-btn { width:64px; height:64px; border-radius:50%; cursor:grab;
    background:linear-gradient(160deg,#32201a,#2a1812); border:3px solid #e8a13a;
    box-shadow:0 4px 14px #00000088; display:flex; align-items:center; justify-content:center;
    padding:0; user-select:none; -webkit-user-select:none; transition:transform .1s; }
  .yunsflo-btn:active { cursor:grabbing; transform:scale(.92); }
  .yunsflo-burbuja { position:absolute; bottom:72px; width:200px;
    background:#1c1410; border:2px solid #e8a13a; border-radius:12px; padding:11px 13px;
    box-shadow:0 6px 20px #000000aa; animation:yunsPop .18s ease; }
  .yunsflo-burbuja.der { left:0; }
  .yunsflo-burbuja.izq { right:0; }
  .yunsflo-burbuja::after { content:""; position:absolute; bottom:-9px; width:0; height:0;
    border-left:8px solid transparent; border-right:8px solid transparent; border-top:9px solid #e8a13a; }
  .yunsflo-burbuja.der::after { left:24px; }
  .yunsflo-burbuja.izq::after { right:24px; }
  .yunsflo-hola { font-family:'Bebas Neue'; font-size:13px; letter-spacing:2px; color:#e8a13a; margin-bottom:3px; }
  .yunsflo-frase { font-size:12.5px; font-weight:700; color:#f3e6cd; line-height:1.35; }
  @keyframes yunsPop { from { opacity:0; transform:translateY(6px) scale(.9); } to { opacity:1; transform:none; } }
`;