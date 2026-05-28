"use client";
import React, { useState, useRef, useEffect } from "react";
import { YunsSVG } from "./Yuns";

// ============================================================
//  NUT-KAIZEN — YUNS FLOTANTE
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
  // Posición del botón. null = aún sin posicionar (usa esquina por defecto vía CSS)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [frase, setFrase] = useState(FRASES[0]);

  // Datos internos del arrastre
  const arrastrando = useRef(false);
  const movido = useRef(false);
  const inicio = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const esTactil = useRef(false); // evita el doble disparo touch+mouse en móvil

  // Recupera la posición guardada si existe
  useEffect(() => {
    try {
      const guardada = localStorage.getItem("yuns.pos");
      if (guardada) setPos(JSON.parse(guardada));
    } catch { /* usa la esquina por defecto */ }
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
    const base = pos || { x: window.innerWidth - 86, y: window.innerHeight - 170 };
    inicio.current = { x: clientX, y: clientY, px: base.x, py: base.y };
  }
  // Movimiento del dedo/ratón
  function onMove(clientX: number, clientY: number) {
    if (!arrastrando.current) return;
    const dx = clientX - inicio.current.x;
    const dy = clientY - inicio.current.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movido.current = true;
    setPos(clamp(inicio.current.px + dx, inicio.current.py + dy));
  }
  // Fin: si NO se movió, fue un toque → mostrar consejo
  function onUp() {
    if (!arrastrando.current) return;
    arrastrando.current = false;
    if (!movido.current) {
      if (!abierto) setFrase(FRASES[Math.floor(Math.random() * FRASES.length)]);
      setAbierto((a) => !a);
    } else if (pos) {
      localStorage.setItem("yuns.pos", JSON.stringify(pos));
    }
  }

  // Listeners globales para mouse (solo desktop; en móvil se ignoran)
  useEffect(() => {
    function mm(e: MouseEvent) { if (!esTactil.current) onMove(e.clientX, e.clientY); }
    function mu() { if (!esTactil.current) onUp(); }
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  });

  // Si no hay posición guardada, usa la esquina inferior derecha (CSS)
  const estilo: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : { right: 18, bottom: 90 };

  // ¿La burbuja va a la izquierda del botón? (si está en la mitad derecha)
  const burbujaIzq = pos ? pos.x > 200 : true;

  return (
    <div className="yunsflo-wrap" style={estilo}>
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
        onMouseDown={(e) => { if (!esTactil.current) onDown(e.clientX, e.clientY); }}
        onTouchStart={(e) => { esTactil.current = true; const t = e.touches[0]; onDown(t.clientX, t.clientY); }}
        onTouchMove={(e) => { e.preventDefault(); const t = e.touches[0]; onMove(t.clientX, t.clientY); }}
        onTouchEnd={(e) => { e.preventDefault(); onUp(); }}
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
    background:linear-gradient(160deg,var(--panel2),var(--panel)); border:3px solid var(--amber);
    box-shadow:0 4px 14px #00000088; display:flex; align-items:center; justify-content:center;
    padding:0; user-select:none; -webkit-user-select:none; transition:transform .1s; }
  .yunsflo-btn:active { cursor:grabbing; transform:scale(.92); }
  .yunsflo-burbuja { position:absolute; bottom:72px; width:200px;
    background:var(--bg2); border:2px solid var(--amber); border-radius:12px; padding:11px 13px;
    box-shadow:0 6px 20px #000000aa; animation:yunsPop .18s ease; }
  .yunsflo-burbuja.der { left:0; }
  .yunsflo-burbuja.izq { right:0; }
  .yunsflo-burbuja::after { content:""; position:absolute; bottom:-9px; width:0; height:0;
    border-left:8px solid transparent; border-right:8px solid transparent; border-top:9px solid var(--amber); }
  .yunsflo-burbuja.der::after { left:24px; }
  .yunsflo-burbuja.izq::after { right:24px; }
  .yunsflo-hola { font-family:'Bebas Neue'; font-size:13px; letter-spacing:2px; color:var(--amber); margin-bottom:3px; }
  .yunsflo-frase { font-size:12.5px; font-weight:700; color:var(--txt); line-height:1.35; }
  @keyframes yunsPop { from { opacity:0; transform:translateY(6px) scale(.9); } to { opacity:1; transform:none; } }
`;