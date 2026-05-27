"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Dumbbell, Flame } from "lucide-react";
import { useProgreso, XP_POR_ENTRENO } from "./useProgreso";
import { useSonido } from "./useSonido";
import { usePersistedState } from "./usePersistedState";

// ============================================================
//  NUT-KAIZEN — RUTINAS (shonen pintado)
//  Niveles (principiante/intermedio/avanzado) + tarjetas de
//  rutina + detalle con ejercicios. Dos vistas internas.
// ============================================================

const NIVELES = [
  { id: "prin", label: "PRINCIPIANTE" },
  { id: "inter", label: "INTERMEDIO" },
  { id: "avz", label: "AVANZADO" },
];

// Series por nivel (los ejercicios son los mismos; cambia el volumen)
const SERIES_POR_NIVEL: Record<string, string> = {
  prin: "3 × 10",
  inter: "4 × 10",
  avz: "5 × 12",
};

// Cuántos ejercicios ve cada nivel (principiante = simple, no abruma)
const EJERCICIOS_POR_NIVEL: Record<string, number> = {
  prin: 2,
  inter: 4,
  avz: 6,
};

// Cada rutina: nombre, músculos, color de acento, kanji, y sus ejercicios.
const RUTINAS = [
  {
    id: "push",
    name: "PUSH DAY",
    jp: "押す",
    muscles: "Pecho · Hombros · Tríceps",
    tone: "#d23b2e",
    ejercicios: ["Press de banca", "Press inclinado con mancuernas", "Press militar", "Elevaciones laterales", "Fondos en paralelas", "Extensión de tríceps en polea"],
  },
  {
    id: "pull",
    name: "PULL DAY",
    jp: "引く",
    muscles: "Espalda · Bíceps",
    tone: "#e8a13a",
    ejercicios: ["Dominadas", "Remo con barra", "Jalón al pecho", "Remo en polea baja", "Curl con barra", "Curl martillo"],
  },
  {
    id: "leg",
    name: "LEG DAY",
    jp: "脚",
    muscles: "Piernas · Glúteos",
    tone: "#3f7d6e",
    ejercicios: ["Sentadilla", "Prensa de piernas", "Peso muerto rumano", "Zancadas", "Curl femoral", "Elevación de gemelos"],
  },
  {
    id: "full",
    name: "FULL BODY",
    jp: "全身",
    muscles: "Cuerpo completo",
    tone: "#c77d3a",
    ejercicios: ["Sentadilla", "Press de banca", "Remo con barra", "Press militar", "Peso muerto", "Plancha abdominal"],
  },
];

export default function Rutinas({ onBack }: { onBack?: () => void }) {
  // El nivel se lee del perfil (lo eligió al registrarse), pero se puede cambiar aquí
  const [nivelGuardado, setNivelGuardado] = usePersistedState("perfil.nivelGym", "prin");
  const [nivel, setNivel] = useState(nivelGuardado);
  const [abierta, setAbierta] = useState<string | null>(null); // id de rutina abierta, o null = lista
  const { completarEntreno } = useProgreso();
  const sonido = useSonido();
  const [hecho, setHecho] = useState(false); // muestra confirmación de XP ganado

  // Cuántos ejercicios mostrar según el nivel (principiante ve menos)
  const tope = EJERCICIOS_POR_NIVEL[nivel] || 2;

  const rutina = RUTINAS.find((r) => r.id === abierta);
  const series = SERIES_POR_NIVEL[nivel];

  // Cambiar nivel también lo guarda en el perfil
  function cambiarNivel(n: string) {
    setNivel(n);
    setNivelGuardado(n);
  }

  // Al completar un entrenamiento: suma XP, suena, y muestra confirmación.
  async function entrenar() {
    const subioNivel = await completarEntreno();
    if (subioNivel) {
      sonido.levelUp();   // ¡tu levelup.mp3!
    } else {
      sonido.entrenar();  // beep de logro
    }
    setHecho(true);
    setTimeout(() => {
      setHecho(false);
      onBack && onBack();
    }, 1400);
  }

  // ---------- VISTA DETALLE ----------
  if (rutina) {
    return (
      <div className="app">
        <style suppressHydrationWarning>{CSS}</style>
        <header className="top">
          <button className="back" aria-label="Volver" onClick={() => setAbierta(null)}>
            <ChevronLeft size={22} />
          </button>
          <h1 className="top-title" style={{ color: rutina.tone }}>{rutina.name}</h1>
          <span className="top-jp">{rutina.jp}</span>
        </header>

        <div className="detail-head panel" style={{ borderColor: rutina.tone }}>
          <Dumbbell size={20} style={{ color: rutina.tone }} />
          <div>
            <p className="detail-muscles">{rutina.muscles}</p>
            <p className="detail-level">{NIVELES.find((n) => n.id === nivel)?.label} · {series} por ejercicio</p>
          </div>
        </div>

        <div className="ex-list">
          {rutina.ejercicios.slice(0, tope).map((e, i) => (
            <div key={e} className="ex">
              <span className="ex-num" style={{ background: rutina.tone }}>{i + 1}</span>
              <span className="ex-name">{e}</span>
              <span className="ex-sets">{series}</span>
            </div>
          ))}
        </div>

        <button className="start-btn" onClick={entrenar} disabled={hecho}>
          <Flame size={16} /> {hecho ? `+${XP_POR_ENTRENO.toLocaleString()} XP · ¡BIEN HECHO!` : "COMENZAR ENTRENAMIENTO"}
        </button>
      </div>
    );
  }

  // ---------- VISTA LISTA ----------
  return (
    <div className="app">
      <style suppressHydrationWarning>{CSS}</style>
      <header className="top">
        <button className="back" aria-label="Volver" onClick={() => onBack && onBack()}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="top-title">RUTINAS</h1>
        <span className="top-jp">ルーティン</span>
      </header>


      {/* PESTAÑAS DE NIVEL */}
      <div className="levels">
        {NIVELES.map((n) => (
          <button
            key={n.id}
            className={`level-tab ${nivel === n.id ? "on" : ""}`}
            onClick={() => cambiarNivel(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* TARJETAS DE RUTINA */}
      <div className="cards">
        {RUTINAS.map((r) => (
          <button key={r.id} className="rutina-card" style={{ borderColor: r.tone }} onClick={() => setAbierta(r.id)}>
            <div className="rutina-bar" style={{ background: r.tone }} />
            <div className="rutina-info">
              <div className="rutina-name" style={{ color: r.tone }}>
                {r.name} <span className="rutina-jp">{r.jp}</span>
              </div>
              <div className="rutina-muscles">{r.muscles}</div>
              <div className="rutina-meta">{Math.min(r.ejercicios.length, tope)} ejercicios · {series}</div>
            </div>
            <ChevronRight size={20} className="rutina-arrow" />
          </button>
        ))}
      </div>
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
    border:2px solid var(--ink); border-radius:8px; padding:14px; box-shadow:4px 4px 0 #00000055; }

  /* NIVELES */
  .levels { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; margin-bottom:16px; }
  .level-tab { font-family:'Bebas Neue'; font-size:13px; letter-spacing:1px; padding:10px 2px;
    border:2px solid var(--ink); border-radius:6px; cursor:pointer; color:var(--mut);
    background:#241410; transition:.12s; }
  .level-tab.on { color:var(--paper); background:linear-gradient(135deg,var(--red),#7a1d13); border-color:var(--amber); }

  /* TARJETAS */
  .cards { display:flex; flex-direction:column; gap:12px; }
  .rutina-card { display:flex; align-items:center; gap:0; width:100%; cursor:pointer; text-align:left;
    background:linear-gradient(160deg,var(--panel2),var(--panel)); border:2px solid; border-radius:8px;
    overflow:hidden; box-shadow:0 8px 24px #00000066; transition:.12s; padding:0; }
  .rutina-card:hover { transform:translateX(3px); }
  .rutina-bar { width:7px; align-self:stretch; flex-shrink:0; }
  .rutina-info { flex:1; padding:14px; }
  .rutina-name { font-family:'Bebas Neue'; font-size:24px; letter-spacing:1px; line-height:1; }
  .rutina-jp { font-size:13px; color:var(--mut); letter-spacing:1px; font-family:'Zen Kaku Gothic New'; }
  .rutina-muscles { font-size:13px; font-weight:700; color:var(--txt); margin-top:5px; }
  .rutina-meta { font-size:12px; color:var(--mut); margin-top:2px; }
  .rutina-arrow { color:var(--mut); margin-right:12px; flex-shrink:0; }

  /* DETALLE */
  .detail-head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
  .detail-muscles { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--paper); }
  .detail-level { font-size:12px; color:var(--mut); }
  .ex-list { display:flex; flex-direction:column; gap:9px; }
  .ex { display:flex; align-items:center; gap:12px; background:linear-gradient(160deg,#341f18,#26150f);
    border:2px solid var(--ink); border-radius:6px; padding:12px; }
  .ex-num { width:30px; height:30px; border-radius:6px; border:2px solid var(--ink); color:#0d0805;
    font-family:'Bebas Neue'; font-size:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ex-name { flex:1; font-size:14px; font-weight:700; color:var(--paper); }
  .ex-sets { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--amber); }
  .start-btn { width:100%; margin-top:18px; display:flex; align-items:center; justify-content:center; gap:8px;
    font-family:'Bebas Neue'; font-size:20px; letter-spacing:2px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),#a02619); border:2px solid var(--ink); padding:13px;
    border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .start-btn:active { transform:translate(3px,3px); box-shadow:none; }
`;