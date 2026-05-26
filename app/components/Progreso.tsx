"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, TrendingDown, Plus, Minus, Droplet, Footprints, Dumbbell } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { usePesosNube } from "./usePesosNube";
import { useDiarioNube } from "./useDiarioNube";
import { useProgreso } from "./useProgreso";
import { usePersistedState } from "./usePersistedState";
import { calcularIMC } from "./calcularIMC";

// ============================================================
//  NUT-KAIZEN — PROGRESO (shonen pintado)
//  Gráfico de peso (recharts) + barras de progreso.
//  El historial de peso se guarda (persistencia).
// ============================================================

type Punto = { dia: string; peso: number };


// Metas diarias
const META_AGUA = 8;      // vasos
const META_PASOS = 10000; // pasos
const META_ENTRENOS = 20; // entrenamientos

// Barras de progreso (metas diarias)
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
  const { pesos, cargando, agregar } = usePesosNube();
  const { diario, actualizar } = useDiarioNube();
  const { prog } = useProgreso();
  const [abrir, setAbrir] = useState(false);
  const [nuevoPeso, setNuevoPeso] = useState("");

  // Datos del perfil para el peso ideal (IMC)
  const [perfilPeso] = usePersistedState("perfil.pesoMeta", "70");
  const [perfilAltura] = usePersistedState("perfil.altura", "175");
  const imc = calcularIMC(Number(perfilPeso), Number(perfilAltura));

  // Año seleccionado (por defecto, el actual)
  const añoActual = new Date().getFullYear();
  const [año, setAño] = useState(añoActual);

  const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  // Agrupamos los pesos por mes del año seleccionado (último peso de cada mes)
  const porMes: (number | null)[] = Array(12).fill(null);
  pesos.forEach((p) => {
    const fecha = new Date(p.creado);
    if (fecha.getFullYear() === año) {
      porMes[fecha.getMonth()] = p.peso; // se queda el último de ese mes
    }
  });

  // Datos para el gráfico (12 meses; meses sin dato quedan en null)
  const historial: Punto[] = MESES.map((m, i) => ({ dia: m, peso: porMes[i] as number }));

  // Años disponibles (donde hay registros) + el actual
  const añosConDatos = Array.from(new Set(pesos.map((p) => new Date(p.creado).getFullYear())));
  if (!añosConDatos.includes(añoActual)) añosConDatos.push(añoActual);
  añosConDatos.sort((a, b) => a - b);

  // Sincronizamos el peso más reciente con localStorage (para el Dashboard)
  useEffect(() => {
    if (!cargando && pesos.length) {
      try {
        const ultimo = [{ dia: "1", peso: pesos[pesos.length - 1].peso }];
        localStorage.setItem("progreso.peso", JSON.stringify(ultimo));
      } catch { /* nada */ }
    }
  }, [cargando, pesos]);

  // Peso actual = el último registro de todos
  const pesoActual = pesos.length ? pesos[pesos.length - 1].peso : 0;
  // Pesos registrados del año, para ver la tendencia
  const pesosDelAño = porMes.filter((p) => p !== null) as number[];
  const pesoInicialAño = pesosDelAño.length ? pesosDelAño[0] : 0;
  const diff = pesosDelAño.length ? (pesoActual - pesoInicialAño).toFixed(1) : "0";
  const bajando = pesoActual <= pesoInicialAño;

  // ¿El peso actual está dentro del rango saludable?
  const enRango = imc ? (pesoActual >= imc.pesoIdealMin && pesoActual <= imc.pesoIdealMax) : false;

  // Mensaje de Yuns según cómo va (siempre amable y motivador)
  function mensajeYuns(): string {
    if (!pesosDelAño.length) return "Registra tu peso para empezar a ver tu progreso. ¡Vamos! 🦊";
    if (enRango) return "¡Estás en tu rango saludable! Sigue así, guerrero. 🦊";
    if (pesosDelAño.length < 2) return "Buen comienzo. La constancia es lo que cuenta. 🦊";
    // Si lleva varios registros pero no se mueve mucho
    if (Math.abs(Number(diff)) < 0.5) return "Los cambios toman tiempo. No te rindas, cada día suma. 🦊";
    return "¡Vas avanzando! Pequeños pasos llevan a grandes metas. 🦊";
  }

  async function añadirPeso() {
    const p = Number(nuevoPeso);
    if (!p || p <= 0) return;
    await agregar(p);
    setNuevoPeso("");
    setAbrir(false);
  }

  return (
    <div className="app">
      <style suppressHydrationWarning>{CSS}</style>

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

        {/* Selector de año */}
        <div className="año-sel">
          <button
            className="año-btn"
            onClick={() => setAño(año - 1)}
            disabled={!añosConDatos.includes(año - 1)}
          >‹</button>
          <span className="año-txt">{año}</span>
          <button
            className="año-btn"
            onClick={() => setAño(año + 1)}
            disabled={!añosConDatos.includes(año + 1)}
          >›</button>
        </div>

        {/* Peso ideal (del IMC) */}
        {imc && (
          <p className="peso-ideal">
            🎯 Peso saludable para ti: <b>{imc.pesoIdealMin}–{imc.pesoIdealMax} kg</b>
          </p>
        )}

        {/* Gráfico con recharts */}
        <div className="chart">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={historial} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#3a2a20" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dia" stroke="#b09a7e" fontSize={10} tickLine={false} interval={0} />
              <YAxis stroke="#b09a7e" fontSize={11} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip content={<MiTooltip />} />
              {imc && (
                <ReferenceLine y={imc.pesoIdealMax} stroke="#3f7d6e" strokeDasharray="4 4" />
              )}
              {imc && (
                <ReferenceLine y={imc.pesoIdealMin} stroke="#3f7d6e" strokeDasharray="4 4" />
              )}
              <Line type="monotone" dataKey="peso" stroke="#e8a13a" strokeWidth={3}
                dot={{ fill: "#d23b2e", r: 4 }} activeDot={{ r: 6 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mensaje motivador de Yuns */}
        <div className="yuns-msg">{mensajeYuns()}</div>

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

          {/* AGUA — con botones +/- */}
          <div className="barra">
            <div className="barra-head">
              <span className="barra-label"><Droplet size={15} style={{ color: "#3f7d6e" }} /> Agua</span>
              <span className="barra-val">{diario.agua} <em>/ {META_AGUA} vasos</em></span>
            </div>
            <div className="barra-track">
              <div className="barra-fill" style={{ width: `${Math.min((diario.agua / META_AGUA) * 100, 100)}%`, background: "#3f7d6e" }} />
            </div>
            <div className="agua-ctrl">
              <button onClick={() => actualizar({ ...diario, agua: Math.max(0, diario.agua - 1) })} aria-label="Quitar vaso">
                <Minus size={16} />
              </button>
              <span>{diario.agua} vasos</span>
              <button onClick={() => actualizar({ ...diario, agua: diario.agua + 1 })} aria-label="Añadir vaso">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* PASOS — campo editable */}
          <div className="barra">
            <div className="barra-head">
              <span className="barra-label"><Footprints size={15} style={{ color: "#e8a13a" }} /> Pasos diarios</span>
              <span className="barra-val">{diario.pasos.toLocaleString()} <em>/ {META_PASOS.toLocaleString()}</em></span>
            </div>
            <div className="barra-track">
              <div className="barra-fill" style={{ width: `${Math.min((diario.pasos / META_PASOS) * 100, 100)}%`, background: "#e8a13a" }} />
            </div>
            <div className="pasos-ctrl">
              <input
                type="number"
                placeholder="Anota tus pasos de hoy"
                value={diario.pasos || ""}
                onChange={(e) => actualizar({ ...diario, pasos: Number(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* ENTRENAMIENTOS — del progreso real (solo lectura) */}
          <div className="barra">
            <div className="barra-head">
              <span className="barra-label"><Dumbbell size={15} style={{ color: "#d23b2e" }} /> Entrenamientos</span>
              <span className="barra-val">{prog.entrenos} <em>/ {META_ENTRENOS}</em></span>
            </div>
            <div className="barra-track">
              <div className="barra-fill" style={{ width: `${Math.min((prog.entrenos / META_ENTRENOS) * 100, 100)}%`, background: "#d23b2e" }} />
            </div>
          </div>

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
    box-shadow:0 8px 24px #00000066; }

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

  .año-sel { display:flex; align-items:center; justify-content:center; gap:18px; margin-bottom:10px; }
  .año-btn { width:34px; height:34px; border-radius:6px; border:2px solid var(--ink); cursor:pointer;
    background:linear-gradient(160deg,#341f18,#26150f); color:var(--paper); font-size:20px; font-weight:900;
    display:flex; align-items:center; justify-content:center; }
  .año-btn:disabled { opacity:.3; cursor:default; }
  .año-txt { font-family:'Bebas Neue'; font-size:26px; letter-spacing:2px; color:var(--amber); min-width:80px; text-align:center; }
  .peso-ideal { font-size:13px; color:var(--txt); text-align:center; margin-bottom:12px; }
  .peso-ideal b { color:var(--teal); }
  .yuns-msg { background:#1c1410; border:2px solid var(--amber); border-radius:8px; padding:11px 13px;
    font-size:13px; font-weight:700; color:var(--paper); text-align:center; margin-top:12px; line-height:1.4; }

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
  .agua-ctrl { display:flex; align-items:center; justify-content:center; gap:16px; margin-top:9px; }
  .agua-ctrl button { width:36px; height:36px; border-radius:6px; cursor:pointer; color:var(--paper);
    background:linear-gradient(160deg,#341f18,#26150f); border:2px solid var(--ink);
    display:flex; align-items:center; justify-content:center; transition:.12s; }
  .agua-ctrl button:hover { border-color:var(--teal); color:var(--teal); }
  .agua-ctrl span { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--paper); min-width:80px; text-align:center; }
  .pasos-ctrl { margin-top:9px; }
  .pasos-ctrl input { width:100%; background:#1c1410; border:2px solid var(--ink); border-radius:6px;
    padding:9px 11px; color:var(--paper); font-family:'Zen Kaku Gothic New'; font-size:14px; font-weight:700; outline:none; }
  .pasos-ctrl input:focus { border-color:var(--amber); }
`;