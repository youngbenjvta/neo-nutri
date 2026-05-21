"use client";
import React, { useState } from "react";
import { ChevronLeft, Target, Check } from "lucide-react";
import { usePersistedState } from "./usePersistedState";
import { AVATARS, WarriorSVG } from "./avatars";

// ============================================================
//  NEO NUTRI — PERFIL (shonen pintado)
//  Selector de avatar + formulario completo de metas.
//  Por ahora los datos viven en useState (no se guardan al
//  recargar). El guardado permanente se conecta más adelante.
// ============================================================

const OBJETIVOS = [
  { id: "bajar", label: "BAJAR" },
  { id: "mantener", label: "MANTENER" },
  { id: "subir", label: "SUBIR" },
];

export default function Perfil({ onBack }: { onBack?: () => void }) {
  const [avatar, setAvatar] = usePersistedState("perfil.avatar", "a1");
  const [nombre, setNombre] = usePersistedState("perfil.nombre", "GUERRERO");
  const [objetivo, setObjetivo] = usePersistedState("perfil.objetivo", "bajar");
  const [pesoMeta, setPesoMeta] = usePersistedState("perfil.pesoMeta", "70");
  const [kcalMeta, setKcalMeta] = usePersistedState("perfil.kcalMeta", "2600");
  const [altura, setAltura] = usePersistedState("perfil.altura", "175");
  const [edad, setEdad] = usePersistedState("perfil.edad", "25");
  const [guardado, setGuardado] = useState(false);

  const sel = AVATARS.find((a) => a.id === avatar) || AVATARS[0];

  function guardar() {
    // Por ahora solo muestra confirmación. El guardado real se conecta luego.
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1800);
  }

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="top">
        <button className="back" aria-label="Volver" onClick={() => onBack && onBack()}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="top-title">PERFIL</h1>
        <span className="top-jp">プロフィール</span>
      </header>

      {/* AVATAR ACTUAL */}
      <section className="panel current">
        <div className="current-frame" style={{ borderColor: sel.aura }}>
          <WarriorSVG aura={sel.aura} hair={sel.hair} />
        </div>
        <p className="current-name">{nombre || "GUERRERO"}</p>
        <p className="current-sub">Elige tu forma de batalla</p>
      </section>

      {/* SELECTOR DE AVATAR */}
      <section className="panel">
        <h2 className="card-title">姿 ELIGE TU AVATAR</h2>
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              className={`avatar-opt ${avatar === a.id ? "on" : ""}`}
              style={{ borderColor: avatar === a.id ? a.aura : "#0d0805" }}
              onClick={() => setAvatar(a.id)}
            >
              <WarriorSVG aura={a.aura} hair={a.hair} />
              {avatar === a.id && (
                <span className="avatar-check" style={{ background: a.aura }}><Check size={14} /></span>
              )}
            </button>
          ))}
        </div>
        <p className="hint">Pronto podrás subir tu propia foto.</p>
      </section>

      {/* OBJETIVO */}
      <section className="panel">
        <h2 className="card-title"><Target size={18} /> OBJETIVO</h2>
        <div className="obj-row">
          {OBJETIVOS.map((o) => (
            <button
              key={o.id}
              className={`obj-btn ${objetivo === o.id ? "on" : ""}`}
              onClick={() => setObjetivo(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>

      {/* FORMULARIO DE METAS */}
      <section className="panel">
        <h2 className="card-title">目 TUS METAS</h2>
        <div className="form">
          <label className="field">
            <span>NOMBRE DE GUERRERO</span>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={16} />
          </label>

          <div className="field-row">
            <label className="field">
              <span>PESO META (kg)</span>
              <input type="number" value={pesoMeta} onChange={(e) => setPesoMeta(e.target.value)} />
            </label>
            <label className="field">
              <span>CALORÍAS META</span>
              <input type="number" value={kcalMeta} onChange={(e) => setKcalMeta(e.target.value)} />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>ALTURA (cm)</span>
              <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} />
            </label>
            <label className="field">
              <span>EDAD</span>
              <input type="number" value={edad} onChange={(e) => setEdad(e.target.value)} />
            </label>
          </div>
        </div>

        <button className="save-btn" onClick={guardar}>
          {guardado ? "✓ ¡GUARDADO!" : "GUARDAR CAMBIOS"}
        </button>
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
  .top { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .back { width:38px; height:38px; border-radius:6px; border:2px solid var(--ink);
    background:linear-gradient(160deg,#341f18,#26150f); color:var(--paper);
    display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .top-title { font-family:'Bebas Neue'; font-size:30px; letter-spacing:2px; color:var(--paper); flex:1; }
  .top-jp { font-size:12px; color:var(--mut); letter-spacing:2px; }

  .panel { position:relative; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:8px; padding:16px; margin-bottom:14px;
    box-shadow:4px 4px 0 #00000055; }
  .card-title { display:flex; align-items:center; gap:7px; font-family:'Bebas Neue'; font-size:21px;
    letter-spacing:2px; color:var(--paper); border-bottom:3px solid var(--red); padding-bottom:5px;
    margin-bottom:14px; }
  .card-title svg { color:var(--amber); }

  .current { text-align:center; }
  .current-frame { width:120px; height:120px; margin:0 auto 10px; border:3px solid; border-radius:50%;
    background:#1c1410; display:flex; align-items:center; justify-content:center; padding:6px;
    box-shadow:0 4px 14px #00000066; }
  .warrior { width:100%; height:100%; }
  .current-name { font-family:'Bebas Neue'; font-size:26px; letter-spacing:2px; color:var(--paper); }
  .current-sub { font-size:12px; color:var(--mut); }

  .avatar-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .avatar-opt { position:relative; aspect-ratio:1; border:2px solid; border-radius:8px; cursor:pointer;
    background:#1c1410; padding:8px; transition:.12s; }
  .avatar-opt:hover { transform:translateY(-2px); }
  .avatar-opt.on { box-shadow:0 0 0 2px #00000055; }
  .avatar-check { position:absolute; top:5px; right:5px; width:22px; height:22px; border-radius:50%;
    color:#0d0805; display:flex; align-items:center; justify-content:center; }
  .hint { font-size:11px; color:var(--mut); margin-top:10px; text-align:center; }

  .obj-row { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
  .obj-btn { font-family:'Bebas Neue'; font-size:16px; letter-spacing:1px; padding:12px 4px;
    border:2px solid var(--ink); border-radius:6px; cursor:pointer; color:var(--mut);
    background:#241410; transition:.12s; }
  .obj-btn.on { color:var(--paper); background:linear-gradient(135deg,var(--red),#7a1d13); border-color:var(--amber); }

  .form { display:flex; flex-direction:column; gap:12px; }
  .field { display:flex; flex-direction:column; gap:5px; flex:1; }
  .field span { font-size:11px; letter-spacing:1.5px; color:var(--mut); font-weight:700; }
  .field input { background:#1c1410; border:2px solid var(--ink); border-radius:6px; padding:10px;
    color:var(--paper); font-family:'Zen Kaku Gothic New'; font-size:15px; font-weight:700; outline:none; }
  .field input:focus { border-color:var(--amber); }
  .field-row { display:flex; gap:10px; }

  .save-btn { width:100%; margin-top:16px; font-family:'Bebas Neue'; font-size:20px; letter-spacing:2px;
    color:var(--paper); cursor:pointer; background:linear-gradient(95deg,var(--red),#a02619);
    border:2px solid var(--ink); padding:12px; border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .save-btn:active { transform:translate(3px,3px); box-shadow:none; }
`;