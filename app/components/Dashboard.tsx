"use client";
import React, { useState } from "react";
import {
  Flame, Dumbbell, TrendingUp, ChevronRight,
  Activity, Plus, Droplet, Beef, Wheat, Salad
} from "lucide-react";
import { usePersistedState } from "./usePersistedState";

// ============================================================
//  NEO NUTRI — DASHBOARD (shonen pintado)
//  Recibe onNavigate para cambiar de pantalla.
// ============================================================

const DATA = {
  warrior: { name: "GUERRERO", level: 23, xp: 12450, xpMax: 20000 },
  stats: { streak: 12, workouts: 48, weight: 72.4 },
  macros: {
    kcal: 2350, kcalMax: 2600,
    protein: { v: 165, max: 180 },
    carbs: { v: 280, max: 300 },
    fats: { v: 70, max: 80 },
  },
  menu: [
    { icon: Dumbbell, title: "RUTINAS DE GYM", sub: "Entrena como un guerrero", goTo: "rutinas" },
    { icon: Salad, title: "ALIMENTACIÓN", sub: "Nutre tu cuerpo, domina tu mente", goTo: "comida" },
    { icon: Activity, title: "PORCIONES", sub: "Aprende a medir sin báscula", goTo: "porciones" },
    { icon: TrendingUp, title: "PROGRESO", sub: "Supera tu ayer", goTo: "progreso" },
    { icon: Flame, title: "MOTIVACIÓN", sub: "Frases que encienden tu fuego", goTo: "comida" },
  ],
  meals: [
    { tag: "朝", name: "Desayuno", desc: "Avena con banana y proteína", kcal: 520 },
    { tag: "昼", name: "Almuerzo", desc: "Pollo, arroz y brócoli", kcal: 620 },
    { tag: "間", name: "Merienda", desc: "Yogur griego con frutos rojos", kcal: 250 },
    { tag: "夜", name: "Cena", desc: "Salmón, quinoa y espárragos", kcal: 550 },
  ],
};

function MacroRing({ kcal, kcalMax }: { kcal: number; kcalMax: number }) {
  const R = 52, C = 2 * Math.PI * R;
  const pct = Math.min(kcal / kcalMax, 1);
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 130 130" className="ring">
        <circle cx="65" cy="65" r={R} fill="none" stroke="#2a1d18" strokeWidth="11" />
        <circle
          cx="65" cy="65" r={R} fill="none" stroke="url(#flame)" strokeWidth="11"
          strokeLinecap="round" strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)} transform="rotate(-90 65 65)"
        />
        <defs>
          <linearGradient id="flame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8a13a" />
            <stop offset="100%" stopColor="#d23b2e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-center">
        <span className="ring-kcal">{kcal.toLocaleString()}</span>
        <span className="ring-max">/ {kcalMax.toLocaleString()} kcal</span>
      </div>
    </div>
  );
}

function MacroRow({ icon: Icon, label, v, max, tone }: { icon: React.ElementType; label: string; v: number; max: number; tone: string }) {
  return (
    <div className="macro-row">
      <span className="macro-dot" style={{ background: tone }}><Icon size={15} /></span>
      <div className="macro-info">
        <span className="macro-label">{label}</span>
        <span className="macro-val">{v}g <em>/ {max}g</em></span>
      </div>
    </div>
  );
}

function Avatar({ onClick }: { onClick?: () => void }) {
  return (
    <div className="avatar" role="button" title="Personalizar avatar" onClick={onClick}>
      <div className="avatar-aura" />
      <div className="avatar-frame">
        <svg viewBox="0 0 100 120" className="avatar-fig">
          <circle cx="50" cy="36" r="19" fill="#1c1410" stroke="#f6e9c8" strokeWidth="2.5" />
          <path d="M21 118 C21 80 30 63 50 63 C70 63 79 80 79 118 Z"
            fill="#1c1410" stroke="#f6e9c8" strokeWidth="2.5" />
          <path d="M50 17 L44 33 L56 33 Z" fill="#e8a13a" />
          <path d="M40 35 q10 6 20 0" fill="none" stroke="#f6e9c8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <span className="avatar-edit">編集 · EDITAR</span>
    </div>
  );
}

// Tipo de comida (igual que en Comida.tsx, para compartir los datos)
type Comida = { id: number; tipo: string; nombre: string; kcal: number };

// Mapa de tipo de comida -> kanji, para mostrar la etiqueta
const TIPO_JP: Record<string, string> = {
  Desayuno: "朝", Almuerzo: "昼", Merienda: "間", Cena: "夜",
};

// Comidas de ejemplo iniciales (las MISMAS que en Comida.tsx, misma clave)
const COMIDAS_INICIAL: Comida[] = [
  { id: 1, tipo: "Desayuno", nombre: "Avena con banana y proteína", kcal: 520 },
  { id: 2, tipo: "Almuerzo", nombre: "Pollo, arroz y brócoli", kcal: 620 },
  { id: 3, tipo: "Merienda", nombre: "Yogur griego con frutos rojos", kcal: 250 },
  { id: 4, tipo: "Cena", nombre: "Salmón, quinoa y espárragos", kcal: 550 },
];

export default function Dashboard({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const d = DATA;
  const [beast, setBeast] = usePersistedState("dashboard.beast", false);
  // ¡Misma clave que Comida.tsx! Por eso comparten los datos.
  const [comidas] = usePersistedState<Comida[]>("comida.lista", COMIDAS_INICIAL);
  const xpPct = (d.warrior.xp / d.warrior.xpMax) * 100;
  const go = (s: string) => onNavigate && onNavigate(s);

  // Calorías reales = suma de las comidas registradas
  const kcalReal = comidas.reduce((sum, c) => sum + (Number(c.kcal) || 0), 0);

  return (
    <div className={`app ${beast ? "beast" : ""}`}>
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="hero panel">
        <div className="speedlines" />
        <div className="hero-top">
          <h1 className="brand">NEO NUTRI</h1>
          <span className="brand-jp">ネオニュートリ</span>
        </div>

        <Avatar onClick={() => go("perfil")} />

        <div className="hero-text">
          <p className="hero-hi">BIENVENIDO, <b>{d.warrior.name}</b></p>
          <p className="hero-sub">Cada repetición te acerca a tu mejor versión.</p>
          <button className="beast-btn" onClick={() => setBeast(!beast)}>
            <Flame size={16} /> {beast ? "¡MODO BESTIA!" : "MODO BESTIA"}
          </button>
        </div>
      </header>

      {/* PROGRESO */}
      <section className="panel">
        <h2 className="card-title">闘 TU PROGRESO</h2>
        <div className="xp-head">
          <div className="lvl">
            <span className="lvl-num">{d.warrior.level}</span>
            <span className="lvl-lbl">NIVEL</span>
          </div>
          <div className="xp-info">
            <span className="xp-lbl">XP</span>
            <span className="xp-val">{d.warrior.xp.toLocaleString()} / {d.warrior.xpMax.toLocaleString()}</span>
          </div>
        </div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpPct}%` }} /></div>

        <div className="stat-grid">
          <div className="stat"><Flame size={18} /><b>{d.stats.streak} días</b><span>RACHA</span></div>
          <div className="stat"><Dumbbell size={18} /><b>{d.stats.workouts}</b><span>ENTRENOS</span></div>
          <div className="stat"><Activity size={18} /><b>{d.stats.weight} kg</b><span>PESO</span></div>
        </div>
      </section>

      {/* MACROS */}
      <section className="panel">
        <h2 className="card-title">食 MACROS DIARIAS</h2>
        <div className="macros">
          <MacroRing kcal={kcalReal} kcalMax={d.macros.kcalMax} />
          <div className="macro-list">
            <MacroRow icon={Beef} label="Proteínas" v={d.macros.protein.v} max={d.macros.protein.max} tone="#d23b2e" />
            <MacroRow icon={Wheat} label="Carbohidratos" v={d.macros.carbs.v} max={d.macros.carbs.max} tone="#e8a13a" />
            <MacroRow icon={Droplet} label="Grasas" v={d.macros.fats.v} max={d.macros.fats.max} tone="#3f7d6e" />
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="panel">
        <h2 className="card-title">道 MENÚ PRINCIPAL</h2>
        <div className="menu">
          {d.menu.map((m) => (
            <button key={m.title} className="menu-item" onClick={() => go(m.goTo)}>
              <span className="menu-ic"><m.icon size={20} /></span>
              <span className="menu-txt"><b>{m.title}</b><em>{m.sub}</em></span>
              <ChevronRight size={18} className="menu-arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* COMIDAS */}
      <section className="panel">
        <div className="card-head">
          <h2 className="card-title">録 REGISTRO</h2>
          <button className="add-btn" onClick={() => go("comida")}><Plus size={18} /></button>
        </div>
        <div className="meals">
          {comidas.length === 0 && (
            <p style={{ fontSize: 13, color: "#b09a7e", textAlign: "center", padding: "12px 8px" }}>
              Sin comidas hoy. Toca + para registrar.
            </p>
          )}
          {comidas.map((m) => (
            <div key={m.id} className="meal">
              <span className="meal-tag">{TIPO_JP[m.tipo] || "食"}</span>
              <div className="meal-info"><b>{m.tipo}</b><em>{m.nombre}</em></div>
              <span className="meal-kcal">{m.kcal}<small>kcal</small></span>
            </div>
          ))}
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
    max-width:460px; margin:0 auto; padding:16px 14px 16px;
    color:var(--txt); min-height:100vh; position:relative; overflow-x:hidden;
    font-family:'Zen Kaku Gothic New', sans-serif; font-weight:500;
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 12%, #5a2a1e 0%, transparent 45%),
      linear-gradient(165deg, var(--bg2), var(--bg1));
  }
  .app.beast {
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 12%, #8a3420 0%, transparent 50%),
      linear-gradient(165deg, #2e160e, #1f0d07);
  }
  .panel {
    position:relative; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid #0d0805; border-radius:6px; padding:16px; margin-bottom:14px;
    box-shadow: 4px 4px 0 #00000055, inset 0 1px 0 #ffffff0d;
  }
  .hero { overflow:hidden; }
  .speedlines {
    position:absolute; inset:0; opacity:.08; pointer-events:none;
    background: repeating-linear-gradient(118deg, var(--paper) 0 2px, transparent 2px 12px);
    -webkit-mask: radial-gradient(circle at 72% 32%, #000 8%, transparent 58%);
    mask: radial-gradient(circle at 72% 32%, #000 8%, transparent 58%);
  }
  .hero-top { display:flex; align-items:baseline; gap:10px; }
  .brand { font-family:'Bebas Neue'; font-size:40px; letter-spacing:2px; line-height:.9;
    color:var(--paper); text-shadow:3px 3px 0 var(--red); }
  .brand-jp { font-size:12px; color:var(--mut); letter-spacing:3px; }
  .avatar { position:relative; width:150px; margin:14px auto 16px; text-align:center; }
  .avatar-aura {
    position:absolute; top:-6px; left:50%; transform:translateX(-50%);
    width:150px; height:150px; border-radius:50%;
    background: radial-gradient(circle, #e8a13a55 0%, #d23b2e33 40%, transparent 70%);
    filter: blur(3px);
  }
  .app.beast .avatar-aura { background: radial-gradient(circle, #f5b94288 0%, #d23b2e55 45%, transparent 72%); }
  .avatar-frame {
    position:relative; width:122px; height:122px; margin:0 auto; border:3px solid var(--paper);
    border-radius:50%; overflow:hidden; box-shadow:0 4px 14px #00000066;
    background: repeating-radial-gradient(circle at 50% 65%, #ffffff0a 0 1px, transparent 1px 6px),
                linear-gradient(160deg,#3a241c,#241410);
  }
  .avatar-fig { width:100%; height:100%; }
  .avatar-edit { display:inline-block; margin-top:9px; font-size:10px; font-weight:700; letter-spacing:2px;
    color:var(--ink); background:var(--gold); padding:3px 12px; border-radius:3px; }
  .hero-hi { font-size:19px; font-weight:900; letter-spacing:1px; }
  .hero-hi b { color:var(--amber); }
  .hero-sub { font-size:13px; color:var(--mut); margin:4px 0 12px; }
  .beast-btn {
    display:inline-flex; align-items:center; gap:7px; font-family:'Bebas Neue'; font-size:19px;
    letter-spacing:2px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),#a02619);
    border:2px solid var(--ink); padding:8px 20px; border-radius:4px; box-shadow:3px 3px 0 var(--ink);
    transition:.1s;
  }
  .beast-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .card-title { font-family:'Bebas Neue'; font-size:23px; letter-spacing:2px; color:var(--paper);
    margin-bottom:14px; border-bottom:3px solid var(--red); padding-bottom:5px; display:inline-block; }
  .card-head { display:flex; justify-content:space-between; align-items:flex-start; }
  .xp-head { display:flex; align-items:center; gap:16px; margin-bottom:10px; }
  .lvl { text-align:center; background:linear-gradient(160deg,#3a241c,#241410); color:var(--gold);
    border:2px solid var(--gold); padding:6px 16px; border-radius:5px; }
  .lvl-num { display:block; font-family:'Bebas Neue'; font-size:40px; line-height:.9; }
  .lvl-lbl { font-size:10px; letter-spacing:3px; color:var(--mut); }
  .xp-info { display:flex; flex-direction:column; }
  .xp-lbl { font-size:12px; color:var(--mut); letter-spacing:3px; font-weight:700; }
  .xp-val { font-size:18px; font-weight:900; }
  .xp-bar { height:14px; background:#1a0f0a; border:2px solid var(--ink); border-radius:3px; overflow:hidden; }
  .xp-fill { height:100%; background:
      repeating-linear-gradient(45deg, var(--amber) 0 7px, var(--red) 7px 14px); }
  .stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; margin-top:14px; }
  .stat { background:linear-gradient(160deg,#341f18,#26150f); border:2px solid var(--ink); border-radius:5px;
    padding:11px 6px; text-align:center; }
  .stat svg { color:var(--amber); }
  .stat b { display:block; font-family:'Bebas Neue'; font-size:21px; letter-spacing:1px; margin:3px 0 1px; color:var(--paper); }
  .stat span { font-size:9px; color:var(--mut); letter-spacing:1.5px; font-weight:700; }
  .macros { display:flex; align-items:center; gap:16px; }
  .ring-wrap { position:relative; width:130px; height:130px; flex-shrink:0; }
  .ring { width:100%; height:100%; }
  .ring-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .ring-kcal { font-family:'Bebas Neue'; font-size:27px; letter-spacing:1px; color:var(--paper); }
  .ring-max { font-size:10px; color:var(--mut); font-weight:700; }
  .macro-list { flex:1; display:flex; flex-direction:column; gap:12px; }
  .macro-row { display:flex; align-items:center; gap:11px; }
  .macro-dot { width:32px; height:32px; border-radius:50%; border:2px solid var(--ink);
    color:#fff; display:flex; align-items:center; justify-content:center; }
  .macro-label { display:block; font-size:13px; color:var(--mut); font-weight:700; }
  .macro-val { font-family:'Bebas Neue'; font-size:19px; letter-spacing:1px; color:var(--paper); }
  .macro-val em { color:var(--mut); font-style:normal; font-size:13px; }
  .menu { display:flex; flex-direction:column; gap:9px; }
  .menu-item { display:flex; align-items:center; gap:12px; width:100%; cursor:pointer; text-align:left;
    background:linear-gradient(160deg,#341f18,#26150f); border:2px solid var(--ink); border-radius:5px;
    padding:11px; transition:.12s; }
  .menu-item:hover { transform:translateX(3px); border-color:var(--amber); }
  .menu-ic { width:40px; height:40px; border-radius:5px; border:2px solid var(--ink);
    background:linear-gradient(135deg,var(--red),#7a1d13); color:var(--paper);
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .menu-txt { flex:1; display:flex; flex-direction:column; }
  .menu-txt b { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--paper); }
  .menu-txt em { font-size:12px; color:var(--mut); font-style:normal; }
  .menu-arrow { color:var(--mut); }
  .add-btn { width:34px; height:34px; border-radius:5px; cursor:pointer; color:var(--paper);
    background:linear-gradient(135deg,var(--red),#7a1d13); border:2px solid var(--ink);
    display:flex; align-items:center; justify-content:center; box-shadow:2px 2px 0 var(--ink); }
  .meals { display:flex; flex-direction:column; gap:9px; }
  .meal { display:flex; align-items:center; gap:11px; background:linear-gradient(160deg,#341f18,#26150f);
    border:2px solid var(--ink); border-radius:5px; padding:10px; }
  .meal-tag { width:36px; height:36px; border-radius:5px; border:2px solid var(--gold);
    background:#241410; color:var(--gold); display:flex; align-items:center; justify-content:center;
    font-size:18px; font-weight:900; flex-shrink:0; }
  .meal-info { flex:1; display:flex; flex-direction:column; }
  .meal-info b { font-size:15px; font-weight:900; color:var(--paper); }
  .meal-info em { font-size:11px; color:var(--mut); font-style:normal; font-weight:500; }
  .meal-kcal { font-family:'Bebas Neue'; font-size:20px; letter-spacing:1px; color:var(--amber); }
  .meal-kcal small { font-size:9px; color:var(--mut); margin-left:2px; }
`;