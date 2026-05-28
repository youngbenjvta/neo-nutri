"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Sparkles, Dumbbell, Utensils, ClipboardList, RotateCcw } from "lucide-react";
import { PREGUNTAS } from "./asistentePreguntas";
import { generarPlan, type Respuestas, type PlanGenerado } from "./generarPlan";
import { usePersistedState } from "./usePersistedState";

// ============================================================
//  KAIZEN — ASISTENTE (encuesta + plan personalizado)
//  Reglas propias con base nutricional. Función "premium" demo.
// ============================================================

export default function Asistente({ onBack }: { onBack?: () => void }) {
  // Datos del perfil para el cálculo de calorías
  const [perfilPeso] = usePersistedState("perfil.pesoMeta", "70");
  const [perfilAltura] = usePersistedState("perfil.altura", "175");
  const [perfilEdad] = usePersistedState("perfil.edad", "25");

  const [paso, setPaso] = useState(0);           // -1 = intro, 0..n = preguntas, n+1 = resultado
  const [intro, setIntro] = useState(true);       // pantalla de bienvenida del asistente
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [plan, setPlan] = useState<PlanGenerado | null>(null);

  const pregunta = PREGUNTAS[paso];
  const esUltima = paso === PREGUNTAS.length - 1;

  // Responder una pregunta de selección única
  function responderSingle(opId: string) {
    setRespuestas({ ...respuestas, [pregunta.id]: opId });
  }
  // Responder una de selección múltiple (marca/desmarca)
  function toggleMulti(opId: string) {
    const actual = (respuestas[pregunta.id] as string[]) || [];
    const nuevo = actual.includes(opId) ? actual.filter((x) => x !== opId) : [...actual, opId];
    setRespuestas({ ...respuestas, [pregunta.id]: nuevo });
  }

  // ¿La pregunta actual tiene respuesta?
  function tieneRespuesta(): boolean {
    const r = respuestas[pregunta.id];
    if (pregunta.tipo === "multi") return Array.isArray(r) && r.length > 0;
    return !!r;
  }

  function siguiente() {
    if (esUltima) {
      // Generar el plan con las respuestas + perfil
      const p = generarPlan(respuestas, {
        peso: Number(perfilPeso),
        altura: Number(perfilAltura),
        edad: Number(perfilEdad),
      });
      setPlan(p);
    } else {
      setPaso(paso + 1);
    }
  }

  function reiniciar() {
    setRespuestas({});
    setPlan(null);
    setPaso(0);
    setIntro(true);
  }

  // ===== PANTALLA DE RESULTADO (el plan) =====
  if (plan) {
    return (
      <div className="asis">
        <style suppressHydrationWarning>{CSS}</style>
        <header className="top">
          <button className="back" onClick={() => onBack && onBack()}><ChevronLeft size={22} /></button>
          <h1 className="top-title">TU PLAN</h1>
          <span className="top-jp">計画</span>
        </header>

        {/* Resumen calórico */}
        <section className="panel">
          <h2 className="card-title"><Sparkles size={18} /> RESUMEN</h2>
          <p className="plan-kcal"><b>{plan.kcal}</b> kcal / día</p>
          <div className="macros-fila">
            <div className="macro-chip"><b>{plan.macros.proteina}g</b><span>Proteína</span></div>
            <div className="macro-chip"><b>{plan.macros.carbos}g</b><span>Carbos</span></div>
            <div className="macro-chip"><b>{plan.macros.grasa}g</b><span>Grasa</span></div>
          </div>
        </section>

        {/* Rutina semanal */}
        <section className="panel">
          <h2 className="card-title"><Dumbbell size={18} /> TU RUTINA</h2>
          {plan.rutina.map((r) => (
            <div key={r.dia} className="plan-row">
              <span className="plan-dia">{r.dia}</span>
              <span className="plan-foco">{r.foco}</span>
            </div>
          ))}
        </section>

        {/* Minuta */}
        <section className="panel">
          <h2 className="card-title"><Utensils size={18} /> TU MINUTA</h2>
          {plan.minuta.map((c) => (
            <div key={c.comida} className="minuta-row">
              <div className="minuta-top">
                <span className="minuta-comida">{c.comida}</span>
                <span className="minuta-kcal">{c.kcal} kcal</span>
              </div>
              <span className="minuta-sug">{c.sugerencia}</span>
            </div>
          ))}
        </section>

        {/* Tabla de selectividad */}
        <section className="panel">
          <h2 className="card-title"><ClipboardList size={18} /> SELECTIVIDAD</h2>
          <div className="select-grid">
            <div className="select-col come">
              <p className="select-tit">✓ COME</p>
              {plan.selectividad.come.map((x) => <span key={x} className="select-item">{x}</span>)}
            </div>
            <div className="select-col nocome">
              <p className="select-tit">✕ EVITA</p>
              {plan.selectividad.noCome.map((x) => <span key={x} className="select-item">{x}</span>)}
            </div>
          </div>
        </section>

        <p className="plan-nota">{plan.nota}</p>

        <button className="asis-btn rehacer" onClick={reiniciar}>
          <RotateCcw size={16} /> REHACER ENCUESTA
        </button>
      </div>
    );
  }

  // ===== PANTALLA DE INTRO DEL ASISTENTE =====
  if (intro) {
    return (
      <div className="asis">
        <style suppressHydrationWarning>{CSS}</style>
        <header className="top">
          <button className="back" onClick={() => onBack && onBack()}><ChevronLeft size={22} /></button>
          <h1 className="top-title">ASISTENTE</h1>
          <span className="top-jp">先生</span>
        </header>

        <section className="panel intro-panel">
          <div className="intro-ic"><Sparkles size={40} /></div>
          <h2 className="intro-h">TU PLAN PERSONALIZADO</h2>
          <p className="intro-p">
            Responde unas preguntas y te crearé una <b>rutina</b> y una <b>minuta alimentaria</b> a tu medida,
            según tus datos y objetivos. 🦊
          </p>
          <p className="intro-mini">Toma menos de 1 minuto.</p>
          <button className="asis-btn" onClick={() => setIntro(false)}>
            EMPEZAR <ChevronRight size={18} />
          </button>
          <p className="plan-nota">Es una guía orientativa, no reemplaza a un profesional de la salud.</p>
        </section>
      </div>
    );
  }

  // ===== PANTALLA DE PREGUNTA =====
  const rActual = respuestas[pregunta.id];
  return (
    <div className="asis">
      <style suppressHydrationWarning>{CSS}</style>
      <header className="top">
        <button className="back" onClick={() => paso === 0 ? setIntro(true) : setPaso(paso - 1)}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="top-title">PREGUNTA {paso + 1}</h1>
        <span className="top-jp">{pregunta.jp}</span>
      </header>

      {/* Barra de progreso */}
      <div className="prog-bar">
        <div className="prog-fill" style={{ width: `${((paso + 1) / PREGUNTAS.length) * 100}%` }} />
      </div>

      <section className="panel">
        <h2 className="preg-texto">{pregunta.texto}</h2>
        {pregunta.tipo === "multi" && <p className="preg-hint">Puedes elegir varias</p>}

        <div className="opciones">
          {pregunta.opciones.map((op) => {
            const sel = pregunta.tipo === "multi"
              ? Array.isArray(rActual) && rActual.includes(op.id)
              : rActual === op.id;
            return (
              <button
                key={op.id}
                className={`opcion ${sel ? "on" : ""}`}
                onClick={() => pregunta.tipo === "multi" ? toggleMulti(op.id) : responderSingle(op.id)}
              >
                <span>{op.label}</span>
                {sel && <Check size={18} />}
              </button>
            );
          })}
        </div>
      </section>

      <button className="asis-btn" onClick={siguiente} disabled={!tieneRespuesta()}>
        {esUltima ? (<>GENERAR PLAN <Sparkles size={18} /></>) : (<>SIGUIENTE <ChevronRight size={18} /></>)}
      </button>
    </div>
  );
}

const CSS = `
  * { box-sizing:border-box; margin:0; }
  .asis {
    max-width:460px; margin:0 auto; padding:16px 14px 90px;
    color:var(--txt); min-height:100vh; font-family:'Zen Kaku Gothic New', sans-serif; font-weight:500;
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 8%, var(--glow) 0%, transparent 45%),
      linear-gradient(165deg, var(--bg2), var(--bg1));
  }
  .top { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
  .back { width:38px; height:38px; border-radius:6px; border:2px solid var(--ink);
    background:linear-gradient(160deg,var(--panel2),var(--panel)); color:var(--paper); cursor:pointer;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .top-title { font-family:'Bebas Neue'; font-size:26px; letter-spacing:2px; color:var(--paper); flex:1; }
  .top-jp { font-size:12px; color:var(--mut); letter-spacing:2px; }
  .panel { background:linear-gradient(160deg,var(--panel2),var(--panel)); border:2px solid var(--ink);
    border-radius:8px; padding:18px; margin-bottom:14px; box-shadow:4px 4px 0 #00000055; }
  .card-title { display:flex; align-items:center; gap:7px; font-family:'Bebas Neue'; font-size:22px;
    letter-spacing:1px; color:var(--paper); border-bottom:3px solid var(--red); padding-bottom:5px;
    margin-bottom:14px; }

  .prog-bar { height:8px; background:var(--bg1); border:2px solid var(--ink); border-radius:5px;
    overflow:hidden; margin-bottom:16px; }
  .prog-fill { height:100%; background:repeating-linear-gradient(45deg, var(--amber) 0 7px, var(--red) 7px 14px); transition:width .3s; }

  .preg-texto { font-size:19px; font-weight:900; color:var(--paper); line-height:1.3; margin-bottom:6px; }
  .preg-hint { font-size:12px; color:var(--amber); margin-bottom:14px; }
  .opciones { display:flex; flex-direction:column; gap:9px; margin-top:10px; }
  .opcion { display:flex; align-items:center; justify-content:space-between; cursor:pointer; text-align:left;
    background:var(--bg2); border:2px solid var(--ink); border-radius:6px; padding:14px; color:var(--txt);
    font-size:15px; font-weight:700; transition:.12s; }
  .opcion:hover { border-color:var(--amber); }
  .opcion.on { border-color:var(--amber); background:linear-gradient(160deg,var(--panel2),var(--panel)); color:var(--paper); }
  .opcion.on svg { color:var(--amber); }

  .asis-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%;
    font-family:'Bebas Neue'; font-size:21px; letter-spacing:2px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),var(--red)); border:2px solid var(--ink);
    padding:14px; border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .asis-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .asis-btn:disabled { opacity:.45; cursor:default; }
  .rehacer { background:linear-gradient(95deg,var(--panel2),var(--panel)); margin-top:4px; }

  .intro-panel { text-align:center; }
  .intro-ic { color:var(--amber); display:flex; justify-content:center; margin-bottom:10px; }
  .intro-h { font-family:'Bebas Neue'; font-size:26px; letter-spacing:1px; color:var(--paper); margin-bottom:10px; }
  .intro-p { font-size:14px; color:var(--txt); line-height:1.5; margin-bottom:8px; }
  .intro-mini { font-size:12px; color:var(--mut); margin-bottom:18px; }

  .plan-kcal { font-family:'Bebas Neue'; font-size:20px; color:var(--paper); text-align:center; margin-bottom:12px; }
  .plan-kcal b { font-size:38px; color:var(--amber); }
  .macros-fila { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
  .macro-chip { background:var(--bg2); border:2px solid var(--ink); border-radius:6px; padding:10px 4px; text-align:center; }
  .macro-chip b { display:block; font-family:'Bebas Neue'; font-size:22px; color:var(--paper); }
  .macro-chip span { font-size:10px; color:var(--mut); letter-spacing:1px; font-weight:700; }

  .plan-row { display:flex; gap:12px; padding:10px; background:var(--bg2); border:2px solid var(--ink);
    border-radius:6px; margin-bottom:8px; align-items:center; }
  .plan-dia { font-family:'Bebas Neue'; font-size:16px; color:var(--amber); min-width:54px; }
  .plan-foco { font-size:13px; font-weight:700; color:var(--paper); }

  .minuta-row { padding:11px; background:var(--bg2); border:2px solid var(--ink); border-radius:6px; margin-bottom:8px; }
  .minuta-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; }
  .minuta-comida { font-family:'Bebas Neue'; font-size:17px; letter-spacing:1px; color:var(--paper); }
  .minuta-kcal { font-size:13px; font-weight:900; color:var(--amber); }
  .minuta-sug { font-size:12.5px; color:var(--mut); font-weight:500; line-height:1.4; }

  .select-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .select-col { display:flex; flex-direction:column; gap:6px; }
  .select-tit { font-family:'Bebas Neue'; font-size:15px; letter-spacing:1px; margin-bottom:2px; }
  .select-col.come .select-tit { color:var(--teal); }
  .select-col.nocome .select-tit { color:var(--red); }
  .select-item { font-size:12px; font-weight:700; color:var(--txt); background:var(--bg2);
    border:2px solid var(--ink); border-radius:5px; padding:6px 8px; }

  .plan-nota { font-size:10px; color:var(--mut); font-style:italic; text-align:center; margin:10px 0 14px; opacity:.85; line-height:1.4; }
`;