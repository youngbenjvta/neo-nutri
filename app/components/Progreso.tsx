"use client";
import React, { useState } from "react";
import { ChevronLeft, TrendingDown, Plus, Droplet, Footprints, Dumbbell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { usePersistedState } from "./usePersistedState";

// ============================================================
//  NEO NUTRI — PROGRESO (shonen pintado)
//  Gráfico de peso (recharts) + barras de progreso.
//  El historial de peso se guarda (persistencia).
// ============================================================

type Punto = { dia: string; peso: number };

// Historial de peso inicial (datos de ejemplo). El usuario añade los suyos.
const PESO_INICIAL: Punto[] = [
  { dia: "1", peso: 73.8 },
  { dia: "5", peso: 73.5 },
  { dia: "9", peso: 73.1 },
  { dia: "13", peso: 73.4 },
  { dia: "17", peso: 72.9 },
  { dia: "21", peso: 72.6 },
  { dia: "25", peso: 72.5 },
  { dia: "29", peso: 72.4 },
];

const PERIODOS = ["SEMANA", "MES", "3 MESES", "AÑO"];

// Barras de progreso (metas diarias)
const BARRAS = [
  { id: "entrenos", label: "Entrenamientos", icon: Dumbbell, v: 12, max: 20, unidad: "", tone: "#d23b2e" },
  { id: "pasos", label: "Pasos diarios", icon: Footprints, v: 8532, max: 10000, unidad: "", tone: "#e8a13a" },
  { id: "agua", label: "Agua", icon: Droplet, v: 2.1, max: 3, unidad: " L", tone: "#3f7d6e" },
];

// Tooltip personalizado del gráfico (lo que aparece al pasar el dedo/mouse)
function MiTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1c1410", border: "2px solid #e8a13a", borderRadius: 6, padding: "6px 10px", color: "#f6e9c8", fontFamily: "'Bebas Neue'", fontSize: 16 }}>
        {payload[0].value} kg
      </div>
    );
  }
  return null;
}

export default function Progreso({ onBack }: { onBack?: () => void }) {
  const [historial, setHistorial] = usePersistedState<Punto[]>("progreso.peso", PESO_INICIAL);
  const [periodo, setPeriodo] = useState("MES");
  const [abrir, setAbrir] = useState(false);
  const [nuevoPeso, setNuevoPeso] = useState("");

  const pesoActual = historial.length ? historial[historial.length - 1].peso : 0;
  const pesoInicial = historial.length ? historial[0].peso : 0;
  const diff = (pesoActual - pesoInicial).toFixed(1);
  const bajando = pesoActual <= pesoInicial;

  function añadirPeso() {
    const p = Number(nuevoPeso);
    if (!p || p <= 0) return;
    const sigDia = String((historial.length ? Number(historial[historial.length - 1].dia) : 0) + 4);
    setHistorial([...historial, { dia: sigDia, peso: p }]);
    setNuevoPeso("");
    setAbrir(false);
  }

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="top">
        <button className="back" aria-label="Volver" onClick={() => onBack && onBack()}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="top-title">PROGRESO</h1>
        <span className="top-jp">進捗</span>
      </header>

      {/* GRÁFICO DE PESO */}
      <section className="panel">
        <div className="peso-head">
          <div>
            <p className="peso-lbl">PESO ACTUAL</p>
            <p className="peso-num">{pesoActual} <em>kg</em></p>
          </div>
          <div className={`peso-diff ${bajando ? "down" : "up"}`}>
            <TrendingDown size={15} /> {diff} kg
          </div>
        </div>

        {/* Pestañas de periodo */}
        <div className="periodos">
          {PERIODOS.map((p) => (
            <button key={p} className={`periodo-tab ${periodo === p ? "on" : ""}`} onClick={() => setPeriodo(p)}>
              {p}
            </button>
          ))}
        </div>

        {/* Gráfico con recharts */}
        <div className="chart">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={historial} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#3a2a20" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dia" stroke="#b09a7e" fontSize={11} tickLine={false} />
              <YAxis stroke="#b09a7e" fontSize={11} tickLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip content={<MiTooltip />} />
              <Line type="monotone" dataKey="peso" stroke="#e8a13a" strokeWidth={3} dot={{ fill: "#d23b2e", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Botón para registrar peso */}
        {!abrir ? (
          <button className="reg-btn" onClick={() => setAbrir(true)}>
            <Plus size={16} /> REGISTRAR PESO
          </button>
        ) : (
          <div className="reg-form">
            <input
              className="reg-input"
              type="number"
              step="0.1"
              placeholder="Tu peso (kg)"
              value={nuevoPeso}
              onChange={(e) => setNuevoPeso(e.target.value)}
            />
            <button className="reg-confirm" onClick={añadirPeso}>GUARDAR</button>
          </div>
        )}
      </section>

      {/* BARRAS DE PROGRESO */}
      <section className="panel">
        <h2 className="card-title">目 METAS DE HOY</h2>
        <div className="barras">
          {BARRAS.map((b) => {
            const pct = Math.min((b.v / b.max) * 100, 100);
            return (
              <div key={b.id} className="barra">
                <div className="barra-head">
                  <span className="barra-label"><b.icon size={15} style={{ color: b.tone }} /> {b.label}</span>
                  <span className="barra-val">{b.v.toLocaleString()}{b.unidad} <em>/ {b.max.toLocaleString()}{b.unidad}</em></span>
                </div>
                <div className="barra-track">
                  <div className="barra-fill" style={{ width: `${pct}%`, background: b.tone }} />
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
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Zen+Kaku+Gothic+New:wght@500;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; }
  .app {
    --bg1:#1a0f0a; --bg2:#241410; --panel:#2a1812; --panel2:#32201a;
    --paper:#f6e9c8; --ink:#0d0805;
    --red:#d23b2e; --amber:#e8a13a; --gold:#d4a84a; --teal:#3f7d6e;
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
    background:linear-gradient(160deg,#341f18,#26150f); color:var(--paper);
    display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
  .top-title { font-family:'Bebas Neue'; font-size:30px; letter-spacing:2px; color:var(--paper); flex:1; }
  .top-jp { font-size:12px; color:var(--mut); letter-spacing:2px; }

  .panel { position:relative; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:8px; padding:16px; margin-bottom:14px;
    box-shadow:4px 4px 0 #00000055; }

  /* PESO */
  .peso-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; }
  .peso-lbl { font-size:11px; letter-spacing:2px; color:var(--mut); font-weight:700; }
  .peso-num { font-family:'Bebas Neue'; font-size:36px; letter-spacing:1px; color:var(--paper); line-height:1; margin-top:3px; }
  .peso-num em { font-size:16px; color:var(--mut); font-style:normal; }
  .peso-diff { display:flex; align-items:center; gap:5px; font-family:'Bebas Neue'; font-size:18px;
    padding:6px 12px; border:2px solid var(--ink); border-radius:6px; background:#241410; }
  .peso-diff.down { color:var(--teal); }
  .peso-diff.up { color:var(--red); }
  .peso-diff.up svg { transform:rotate(180deg); }

  .periodos { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:14px; }
  .periodo-tab { font-family:'Bebas Neue'; font-size:12px; letter-spacing:.5px; padding:8px 2px;
    border:2px solid var(--ink); border-radius:5px; cursor:pointer; color:var(--mut);
    background:#241410; transition:.12s; }
  .periodo-tab.on { color:var(--paper); background:linear-gradient(135deg,var(--red),#7a1d13); border-color:var(--amber); }

  .chart { background:#1c1410; border:2px solid var(--ink); border-radius:8px; padding:10px 6px 4px; margin-bottom:14px; }

  .reg-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:7px;
    font-family:'Bebas Neue'; font-size:17px; letter-spacing:1px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),#a02619); border:2px solid var(--ink); padding:11px;
    border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .reg-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .reg-form { display:flex; gap:8px; }
  .reg-input { flex:1; background:#1c1410; border:2px solid var(--amber); border-radius:6px; padding:10px;
    color:var(--paper); font-family:'Zen Kaku Gothic New'; font-size:15px; font-weight:700; outline:none; }
  .reg-confirm { font-family:'Bebas Neue'; font-size:17px; letter-spacing:1px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),#a02619); border:2px solid var(--ink); padding:10px 18px;
    border-radius:6px; box-shadow:2px 2px 0 var(--ink); }
  .reg-confirm:active { transform:translate(2px,2px); box-shadow:none; }

  /* BARRAS */
  .card-title { font-family:'Bebas Neue'; font-size:21px; letter-spacing:2px; color:var(--paper);
    border-bottom:3px solid var(--red); padding-bottom:5px; margin-bottom:16px; display:inline-block; }
  .barras { display:flex; flex-direction:column; gap:16px; }
  .barra-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
  .barra-label { display:flex; align-items:center; gap:7px; font-size:13px; font-weight:700; color:var(--txt); }
  .barra-val { font-family:'Bebas Neue'; font-size:16px; letter-spacing:.5px; color:var(--paper); }
  .barra-val em { color:var(--mut); font-style:normal; font-size:13px; }
  .barra-track { height:12px; background:#1a0f0a; border:2px solid var(--ink); border-radius:3px; overflow:hidden; }
  .barra-fill { height:100%; transition:width .3s; }
`;