"use client";
import React, { useState, useEffect, useRef } from "react";
import { Timer, X, Play, Pause, RotateCcw } from "lucide-react";

// ============================================================
//  KAIZEN — Cronómetro de descanso flotante
//  Útil para descanso entre series. Tiempos típicos preset.
//  Beep al terminar. Esquina inferior izquierda (no choca con Yuns).
// ============================================================

// Tiempos típicos en segundos
const TIEMPOS = [
  { id: 30,  label: "30s" },
  { id: 60,  label: "1m" },
  { id: 90,  label: "1m 30s" },
  { id: 120, label: "2m" },
  { id: 180, label: "3m" },
];

export default function Cronometro() {
  const [abierto, setAbierto] = useState(false);
  const [segundos, setSegundos] = useState(60);  // tiempo restante
  const [duracion, setDuracion] = useState(60);  // tiempo total elegido (para reset)
  const [activo, setActivo] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cuenta atrás
  useEffect(() => {
    if (activo && segundos > 0) {
      intervalRef.current = setInterval(() => {
        setSegundos((s) => {
          if (s <= 1) {
            // Llegó a 0: beep y parar
            beep();
            setActivo(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activo, segundos]);

  // Beep simple con Web Audio (sin necesidad de archivo)
  function beep() {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      // 3 beeps cortos seguidos
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.2);
        osc.start(ctx.currentTime + i * 0.3);
        osc.stop(ctx.currentTime + i * 0.3 + 0.2);
      }
    } catch { /* nada si falla el audio */ }
  }

  function elegirTiempo(seg: number) {
    setDuracion(seg);
    setSegundos(seg);
    setActivo(true);
  }
  function alternarPausa() {
    if (segundos === 0) {
      // Si terminó, reinicia con el mismo tiempo
      setSegundos(duracion);
      setActivo(true);
    } else {
      setActivo(!activo);
    }
  }
  function reiniciar() {
    setSegundos(duracion);
    setActivo(false);
  }

  // Formato MM:SS
  function formato(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  // Porcentaje para el círculo de progreso
  const pct = duracion > 0 ? ((duracion - segundos) / duracion) * 100 : 0;
  const circunferencia = 2 * Math.PI * 26;
  const offset = circunferencia - (pct / 100) * circunferencia;

  // Si no está abierto, solo el botón flotante
  if (!abierto) {
    return (
      <>
        <style suppressHydrationWarning>{CSS}</style>
        <button className="crono-fab" onClick={() => setAbierto(true)} aria-label="Cronómetro">
          <Timer size={24} />
          {activo && segundos > 0 && (
            <span className="crono-fab-num">{formato(segundos)}</span>
          )}
        </button>
      </>
    );
  }

  return (
    <>
      <style suppressHydrationWarning>{CSS}</style>
      <div className="crono-panel">
        <div className="crono-head">
          <span className="crono-titulo">⏱ DESCANSO</span>
          <button className="crono-cerrar" onClick={() => setAbierto(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Reloj circular con tiempo restante */}
        <div className="crono-reloj">
          <svg viewBox="0 0 60 60" width="100" height="100">
            <circle cx="30" cy="30" r="26" stroke="var(--bg2)" strokeWidth="4" fill="none" />
            <circle
              cx="30" cy="30" r="26"
              stroke="var(--amber)" strokeWidth="4" fill="none"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              transform="rotate(-90 30 30)"
              style={{ transition: "stroke-dashoffset .3s" }}
              strokeLinecap="round"
            />
          </svg>
          <span className="crono-num">{formato(segundos)}</span>
        </div>

        {/* Tiempos típicos */}
        <div className="crono-tiempos">
          {TIEMPOS.map((t) => (
            <button
              key={t.id}
              className={`crono-tiempo ${duracion === t.id ? "on" : ""}`}
              onClick={() => elegirTiempo(t.id)}
            >{t.label}</button>
          ))}
        </div>

        {/* Controles */}
        <div className="crono-ctrls">
          <button className="crono-ctrl" onClick={alternarPausa} aria-label="Play/Pause">
            {activo ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="crono-ctrl secundario" onClick={reiniciar} aria-label="Reiniciar">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

const CSS = `
  /* Botón flotante compacto (izquierda abajo, no choca con Yuns que está a la derecha) */
  .crono-fab {
    position:fixed; bottom:84px; left:14px; z-index:9998;
    width:54px; height:54px; border-radius:50%; cursor:pointer;
    background:linear-gradient(160deg,var(--panel2),var(--panel)); border:3px solid var(--amber);
    color:var(--paper); display:flex; flex-direction:column; align-items:center; justify-content:center;
    box-shadow:0 4px 14px #00000088; transition:transform .1s;
  }
  .crono-fab:active { transform:scale(.92); }
  .crono-fab-num { font-family:'Bebas Neue'; font-size:11px; color:var(--amber); letter-spacing:1px; line-height:1; }

  /* Panel expandido */
  .crono-panel {
    position:fixed; bottom:84px; left:14px; z-index:9998;
    width:230px; padding:14px;
    background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:3px solid var(--amber); border-radius:14px; box-shadow:0 6px 20px #000000aa;
  }
  .crono-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .crono-titulo { font-family:'Bebas Neue'; font-size:15px; letter-spacing:2px; color:var(--amber); }
  .crono-cerrar { background:none; border:none; cursor:pointer; color:var(--mut); padding:2px;
    display:flex; align-items:center; }
  .crono-cerrar:hover { color:var(--red); }

  /* Reloj */
  .crono-reloj { position:relative; display:flex; justify-content:center; margin:6px 0 10px; }
  .crono-num { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    font-family:'Bebas Neue'; font-size:22px; color:var(--paper); letter-spacing:1px; }

  /* Tiempos típicos */
  .crono-tiempos { display:grid; grid-template-columns:repeat(5,1fr); gap:4px; margin-bottom:10px; }
  .crono-tiempo { font-size:10px; font-weight:700; padding:6px 2px; cursor:pointer;
    background:var(--bg2); border:1px solid var(--ink); border-radius:5px; color:var(--mut); transition:.12s; }
  .crono-tiempo:hover { color:var(--amber); border-color:var(--amber); }
  .crono-tiempo.on { background:linear-gradient(95deg,var(--red),#7a1d13); color:var(--paper); border-color:var(--ink); }

  /* Controles */
  .crono-ctrls { display:flex; gap:6px; }
  .crono-ctrl { flex:1; display:flex; align-items:center; justify-content:center; padding:9px;
    background:linear-gradient(95deg,var(--red),#a02619); border:2px solid var(--ink); border-radius:6px;
    cursor:pointer; color:var(--paper); transition:.1s; }
  .crono-ctrl:active { transform:translate(1px,1px); }
  .crono-ctrl.secundario { flex:0 0 42px; background:var(--bg2); color:var(--mut); }
  .crono-ctrl.secundario:hover { color:var(--amber); }
`;