"use client";
import React, { useEffect } from "react";
import { ChevronLeft, Lock, Dumbbell, Flame, Salad, Zap, Scale, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useProgreso } from "./useProgreso";
import { usePersistedState } from "./usePersistedState";

// ============================================================
//  NEO NUTRI — LOGROS (shonen pintado)
//  Medallas que se desbloquean según el progreso real del usuario.
// ============================================================

type ComidaItem = { id: number; tipo: string; nombre: string; kcal: number };
type PesoItem = { dia: string; peso: number };

// Cada logro: id, icono, título, descripción, valor actual y meta.
// 'valor' y 'meta' definen la barra de progreso y si está desbloqueado.
type Logro = {
  id: string;
  icon: LucideIcon;
  titulo: string;
  desc: string;
  valor: number;
  meta: number;
  tone: string;
};

export default function Logros({ onBack }: { onBack?: () => void }) {
  const { prog } = useProgreso();
  const [comidas] = usePersistedState<ComidaItem[]>("comida.lista", []);
  const [pesos] = usePersistedState<PesoItem[]>("progreso.peso", []);

  // Definimos los logros con su condición basada en datos reales
  const logros: Logro[] = [
    { id: "primer", icon: Dumbbell, titulo: "PRIMER PASO", desc: "Completa tu primer entrenamiento", valor: prog.entrenos, meta: 1, tone: "#e8a13a" },
    { id: "constante", icon: Flame, titulo: "GUERRERO CONSTANTE", desc: "Completa 50 entrenamientos", valor: prog.entrenos, meta: 50, tone: "#d23b2e" },
    { id: "bestia", icon: Trophy, titulo: "MODO BESTIA", desc: "Completa 100 entrenamientos", valor: prog.entrenos, meta: 100, tone: "#d4a84a" },
    { id: "nivel", icon: Zap, titulo: "ASCENSIÓN", desc: "Alcanza el nivel 25", valor: prog.nivel, meta: 25, tone: "#9b6bd2" },
    { id: "nutricion", icon: Salad, titulo: "NUTRICIÓN EN ORDEN", desc: "Registra 10 comidas", valor: comidas.length, meta: 10, tone: "#3f7d6e" },
    { id: "seguimiento", icon: Scale, titulo: "BAJO CONTROL", desc: "Registra tu peso 5 veces", valor: pesos.length, meta: 5, tone: "#3b82c4" },
  ];

  const desbloqueados = logros.filter((l) => l.valor >= l.meta).length;

  // Guardamos el conteo para que el guerrero evolutivo del Perfil lo use
  const [, setLogrosCount] = usePersistedState("logros.desbloqueados", 0);
  useEffect(() => {
    setLogrosCount(desbloqueados);
  }, [desbloqueados, setLogrosCount]);

  return (
    <div className="app">
      <style suppressHydrationWarning>{CSS}</style>

      {/* HEADER */}
      <header className="top">
        <button className="back" aria-label="Volver" onClick={() => onBack && onBack()}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="top-title">LOGROS</h1>
        <span className="top-jp">実績</span>
      </header>

      {/* RESUMEN */}
      <section className="panel resumen">
        <Trophy size={28} />
        <div>
          <p className="resumen-num">{desbloqueados} / {logros.length}</p>
          <p className="resumen-lbl">MEDALLAS DESBLOQUEADAS</p>
        </div>
      </section>

      {/* LISTA DE LOGROS */}
      <section className="panel">
        <h2 className="card-title">章 MEDALLAS</h2>
        <div className="medallas">
          {logros.map((l) => {
            const logrado = l.valor >= l.meta;
            const pct = Math.min((l.valor / l.meta) * 100, 100);
            const Icono = l.icon;
            return (
              <div key={l.id} className={`medalla ${logrado ? "on" : ""}`}>
                <div className="medalla-ic" style={{ borderColor: logrado ? l.tone : "#0d0805", color: logrado ? l.tone : "#5a4a3a" }}>
                  {logrado ? <Icono size={22} /> : <Lock size={18} />}
                </div>
                <div className="medalla-info">
                  <b>{l.titulo}</b>
                  <em>{l.desc}</em>
                  {!logrado && (
                    <div className="medalla-bar">
                      <div className="medalla-fill" style={{ width: `${pct}%`, background: l.tone }} />
                    </div>
                  )}
                  {!logrado && <span className="medalla-prog">{Math.min(l.valor, l.meta)} / {l.meta}</span>}
                  {logrado && <span className="medalla-ok" style={{ color: l.tone }}>✓ DESBLOQUEADO</span>}
                </div>
              </div>
            );
          })}
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
  .top { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
  .back { width:38px; height:38px; border-radius:6px; border:2px solid var(--ink);
    background:#241410; color:var(--paper);
    display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
  .top-title { font-family:'Bebas Neue'; font-size:30px; letter-spacing:2px; color:var(--paper); flex:1; }
  .top-jp { font-size:12px; color:var(--mut); letter-spacing:2px; }

  .panel { position:relative; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:8px; padding:16px; margin-bottom:14px;
    box-shadow:0 8px 24px #00000066; }

  .resumen { display:flex; align-items:center; gap:14px; }
  .resumen svg { color:var(--gold); flex-shrink:0; }
  .resumen-num { font-family:'Bebas Neue'; font-size:32px; letter-spacing:1px; color:var(--paper); line-height:1; }
  .resumen-lbl { font-size:11px; letter-spacing:2px; color:var(--mut); font-weight:700; margin-top:3px; }

  .card-title { font-family:'Bebas Neue'; font-size:21px; letter-spacing:2px; color:var(--paper);
    border-bottom:3px solid var(--red); padding-bottom:5px; margin-bottom:16px; display:inline-block; }

  .medallas { display:flex; flex-direction:column; gap:11px; }
  .medalla { display:flex; align-items:center; gap:13px; background:linear-gradient(160deg,#341f18,#26150f);
    border:2px solid var(--ink); border-radius:8px; padding:13px; opacity:.7; transition:.15s; }
  .medalla.on { opacity:1; background:linear-gradient(160deg,#3a241c,#2a1812); box-shadow:3px 3px 0 #00000044; }
  .medalla-ic { width:48px; height:48px; border-radius:8px; border:2px solid; background:#241410;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .medalla-info { flex:1; display:flex; flex-direction:column; gap:3px; min-width:0; }
  .medalla-info b { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--paper); }
  .medalla-info em { font-size:12px; color:var(--mut); font-style:normal; }
  .medalla-bar { height:8px; background:#1a0f0a; border:2px solid var(--ink); border-radius:3px; overflow:hidden; margin-top:4px; }
  .medalla-fill { height:100%; transition:width .4s; }
  .medalla-prog { font-family:'Bebas Neue'; font-size:13px; color:var(--mut); letter-spacing:1px; margin-top:2px; }
  .medalla-ok { font-family:'Bebas Neue'; font-size:13px; letter-spacing:1px; margin-top:2px; }
`;