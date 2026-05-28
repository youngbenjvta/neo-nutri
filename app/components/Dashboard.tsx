"use client";
import React, { useState, useEffect } from "react";
import {
  Flame, Dumbbell, TrendingUp, ChevronRight,
  Activity, Plus, Droplet, Beef, Wheat, Salad, Volume2, VolumeX, Sparkles, Moon
} from "lucide-react";
import { usePersistedState } from "./usePersistedState";
import { useProgreso } from "./useProgreso";
import { useDiarioNube } from "./useDiarioNube";
import { nivelDeRacha, diasAlSiguienteNivel } from "./rachaColores";
import { getAvatar, WarriorSVG } from "./avatars";
import { useSonido } from "./useSonido";
import { calcularMetaKcal } from "./calcularMeta";
import { useRacha } from "./useRacha";
import Yuns from "./Yuns";
import { calcularIMC } from "./calcularIMC";

// ============================================================
//  NUT-KAIZEN — DASHBOARD (shonen pintado)
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
            <stop offset="0%" stopColor="var(--amber)" />
            <stop offset="100%" stopColor="var(--red)" />
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

function Avatar({ onClick, avatarId, foto }: { onClick?: () => void; avatarId: string; foto?: string }) {
  const a = getAvatar(avatarId);
  return (
    <div className="avatar" role="button" title="Personalizar avatar" onClick={onClick}>
      <div className="avatar-aura" style={{ background: `radial-gradient(circle, ${a.aura}55 0%, ${a.aura}33 40%, transparent 70%)` }} />
      <div className="avatar-frame" style={{ borderColor: a.aura }}>
        {foto ? (
          <img src={foto} alt="Tu foto" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          <div style={{ width: "78%", height: "78%" }}>
            <WarriorSVG aura={a.aura} hair={a.hair} />
          </div>
        )}
      </div>
      <span className="avatar-edit">編集 · EDITAR</span>
    </div>
  );
}

// Tipo de comida (igual que en Comida.tsx, para compartir los datos)
type Comida = { id: number; tipo: string; nombre: string; kcal: number };

// Tipo de punto de peso (igual que en Progreso.tsx, para compartir los datos)
type Punto = { dia: string; peso: number };

// Historial de peso inicial (las MISMAS que en Progreso.tsx, misma clave)
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
  const [comidas, setComidas] = usePersistedState<Comida[]>("comida.lista", COMIDAS_INICIAL);

  // Las comidas son solo del día. Si cambió el día, limpiamos la lista local
  // (en la nube siguen guardadas; aquí solo se muestran las de hoy).
  const [ultimoDiaComidas, setUltimoDiaComidas] = usePersistedState("comida.fecha", "");
  useEffect(() => {
    const hoy = new Date().toDateString();
    if (ultimoDiaComidas !== hoy) {
      setComidas([]);
      setUltimoDiaComidas(hoy);
    }
  }, [ultimoDiaComidas, setComidas, setUltimoDiaComidas]);
  const { prog } = useProgreso();
  const { diario, actualizar } = useDiarioNube();
  // Leemos del MISMO sitio donde el Perfil guarda (claves compartidas)
  const [nombre] = usePersistedState("perfil.nombre", "GUERRERO");
  const [avatarId] = usePersistedState("perfil.avatar", "a1");
  const [fotoPerfil] = usePersistedState("perfil.foto", "");
  // Mismo historial que Progreso.tsx (clave compartida): el último es el peso actual
  const [historialPeso] = usePersistedState<Punto[]>("progreso.peso", PESO_INICIAL);
  const pesoActual = historialPeso.length ? historialPeso[historialPeso.length - 1].peso : 0;
  // Datos del perfil para calcular la meta de calorías personalizada
  const [perfilPeso] = usePersistedState("perfil.pesoMeta", "70");
  const [perfilAltura] = usePersistedState("perfil.altura", "175");
  const [perfilEdad] = usePersistedState("perfil.edad", "25");
  const [perfilObjetivo] = usePersistedState("perfil.objetivo", "bajar");
  const metaKcal = calcularMetaKcal({
    peso: Number(perfilPeso),
    altura: Number(perfilAltura),
    edad: Number(perfilEdad),
    objetivo: perfilObjetivo,
  });
  // IMC del usuario (guía orientativa) según peso actual y altura
  const imc = calcularIMC(Number(perfilPeso), Number(perfilAltura));
  const sonido = useSonido();
  const { racha } = useRacha();
  // Nivel de la racha (color y nombre evolutivos)
  const nivelRacha = nivelDeRacha(racha);
  const diasFaltan = diasAlSiguienteNivel(racha);
  const xpPct = (prog.xp / prog.xpMax) * 100;
  const go = (s: string) => onNavigate && onNavigate(s);

  // Calorías reales = suma de las comidas registradas
  const kcalReal = comidas.reduce((sum, c) => sum + (Number(c.kcal) || 0), 0);

  // Macros estimados desde las calorías (proporción 30% prote / 45% carbos / 25% grasa)
  // Proteína y carbos = 4 kcal/g, grasa = 9 kcal/g
  function macrosDesde(kcal: number) {
    return {
      protein: Math.round((kcal * 0.30) / 4),
      carbs: Math.round((kcal * 0.45) / 4),
      fats: Math.round((kcal * 0.25) / 9),
    };
  }
  const macrosReales = macrosDesde(kcalReal); // lo que llevas hoy
  const macrosMeta = macrosDesde(metaKcal);   // tu meta diaria

  return (
    <div className={`app ${beast ? "beast" : ""}`}>
      <style suppressHydrationWarning>{CSS}</style>

      {/* HEADER */}
      <header className="hero panel">
        <div className="speedlines" />
        <div className="hero-top">
          <h1 className="brand">KAIZEN</h1>
          <span className="brand-jp">改善 · KAIZEN</span>
          <button className="mute-btn" onClick={sonido.toggleMudo} aria-label="Silenciar" title="Silenciar sonidos">
            {sonido.mudo ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <Avatar onClick={() => go("perfil")} avatarId={avatarId} foto={fotoPerfil} />

        <div className="hero-text">
          <p className="hero-hi">BIENVENIDO, <b>{nombre || "GUERRERO"}</b></p>
          <p className="hero-sub">Cada repetición te acerca a tu mejor versión.</p>
          <button className="beast-btn" onClick={() => { sonido.click(); setBeast(!beast); }}>
            <Flame size={16} /> {beast ? "¡MODO BESTIA!" : "MODO BESTIA"}
          </button>
        </div>
      </header>

      {/* YUNS — la mascota que te saluda */}
      <Yuns nombre={nombre} />

      {/* ACCESO AL ASISTENTE (plan personalizado) */}
      <button className="asis-card" onClick={() => go("asistente")}>
        <div className="asis-card-ic"><Sparkles size={26} /></div>
        <div className="asis-card-txt">
          <b>ASISTENTE KAIZEN</b>
          <span>Crea tu rutina y minuta personalizada 🦊</span>
        </div>
        <ChevronRight size={22} />
      </button>

      {/* PROGRESO */}
      <section className="panel">
        <h2 className="card-title">闘 TU PROGRESO</h2>
        <div className="xp-head">
          <div className="lvl">
            <span className="lvl-num">{prog.nivel}</span>
            <span className="lvl-lbl">NIVEL</span>
          </div>
          <div className="xp-info">
            <span className="xp-lbl">XP</span>
            <span className="xp-val">{prog.xp.toLocaleString()} / {prog.xpMax.toLocaleString()}</span>
          </div>
        </div>
        <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpPct}%` }} /></div>

        <div className="stat-grid">
          <div className="stat racha-stat" style={{ borderColor: nivelRacha.color }}>
            <Flame size={20} style={{ color: nivelRacha.color, filter: `drop-shadow(0 0 4px ${nivelRacha.brillo})` }} />
            <b style={{ color: nivelRacha.color }}>{racha} días</b>
            <span style={{ color: nivelRacha.color }}>{nivelRacha.nombre.toUpperCase()}</span>
          </div>
          <div className="stat"><Dumbbell size={18} /><b>{prog.entrenos}</b><span>ENTRENOS</span></div>
          <div className="stat"><Activity size={18} /><b>{pesoActual} kg</b><span>PESO</span></div>
        </div>
        {diasFaltan > 0 && (
          <p className="racha-hint">🔥 {diasFaltan} {diasFaltan === 1 ? "día" : "días"} para subir de rango</p>
        )}
      </section>

      {/* IMC (guía orientativa) */}
      {imc && (
        <section className="panel">
          <h2 className="card-title">体 TU IMC</h2>
          <div className="imc-row">
            <div className="imc-num" style={{ color: imc.color }}>
              <b>{imc.imc}</b>
              <span style={{ color: imc.color }}>{imc.categoria}</span>
            </div>
            <div className="imc-info">
              <p className="imc-ideal">Peso saludable para tu altura: <b>{imc.pesoIdealMin}–{imc.pesoIdealMax} kg</b></p>
              <p className="imc-msg">{imc.mensaje}</p>
            </div>
          </div>
          <p className="imc-nota">El IMC es solo una guía general, no un diagnóstico médico.</p>
        </section>
      )}

      {/* DESCANSO — sueño de hoy */}
      <section className="panel">
        <h2 className="card-title"><Moon size={18} /> 睡 TU DESCANSO</h2>

        {/* Horas dormidas */}
        <div className="sueno-horas">
          <span className="sueno-label">¿Cuántas horas dormiste?</span>
          <div className="sueno-control">
            <button
              className="sueno-btn"
              onClick={() => actualizar({ ...diario, sueno: Math.max(0, diario.sueno - 0.5) })}
            >−</button>
            <span className="sueno-num">{diario.sueno} <small>h</small></span>
            <button
              className="sueno-btn"
              onClick={() => actualizar({ ...diario, sueno: Math.min(14, diario.sueno + 0.5) })}
            >+</button>
          </div>
        </div>

        {/* Cómo se siente */}
        <span className="sueno-label">¿Cómo te sientes hoy?</span>
        <div className="animo-row">
          {[
            { id: "descansado", emoji: "😄", label: "Descansado" },
            { id: "normal", emoji: "🙂", label: "Normal" },
            { id: "cansado", emoji: "😴", label: "Cansado" },
          ].map((a) => (
            <button
              key={a.id}
              className={`animo-btn ${diario.animo === a.id ? "on" : ""}`}
              onClick={() => actualizar({ ...diario, animo: a.id })}
            >
              <span className="animo-emoji">{a.emoji}</span>
              <span className="animo-label">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Consejo de Yuns según el descanso */}
        {diario.sueno > 0 && (
          <p className="sueno-tip">
            {diario.sueno >= 7
              ? "¡Buen descanso, guerrero! Dormir bien es parte del progreso. 🦊"
              : diario.sueno >= 5
              ? "Descansaste algo, pero tu cuerpo agradece 7-8h. Cuídate. 🦊"
              : "Dormiste poco. El descanso es cuando tu cuerpo se hace fuerte. 🦊"}
          </p>
        )}
      </section>

      {/* MACROS */}
      <section className="panel">
        <h2 className="card-title">食 MACROS DIARIAS</h2>
        <div className="macros">
          <MacroRing kcal={kcalReal} kcalMax={metaKcal} />
          <div className="macro-list">
            <MacroRow icon={Beef} label="Proteínas" v={macrosReales.protein} max={macrosMeta.protein} tone="var(--red)" />
            <MacroRow icon={Wheat} label="Carbohidratos" v={macrosReales.carbs} max={macrosMeta.carbs} tone="var(--amber)" />
            <MacroRow icon={Droplet} label="Grasas" v={macrosReales.fats} max={macrosMeta.fats} tone="var(--teal)" />
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
            <p style={{ fontSize: 13, color: "var(--mut)", textAlign: "center", padding: "12px 8px" }}>
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
  * { box-sizing: border-box; margin: 0; }
  .app {
    max-width:460px; margin:0 auto; padding:16px 14px 16px;
    color:var(--txt); min-height:100vh; position:relative; overflow-x:hidden;
    font-family:'Zen Kaku Gothic New', sans-serif; font-weight:500;
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 12%, var(--glow) 0%, transparent 45%),
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
    border:2px solid var(--ink); border-radius:6px; padding:16px; margin-bottom:14px;
    box-shadow: 4px 4px 0 #00000055, inset 0 1px 0 #ffffff0d;
  }
  .asis-card { display:flex; align-items:center; gap:12px; width:100%; cursor:pointer; text-align:left;
    background:linear-gradient(95deg,var(--panel2),var(--panel)); border:2px solid var(--amber); border-radius:8px;
    padding:14px; margin-bottom:14px; box-shadow:4px 4px 0 #00000055; color:var(--paper); transition:.12s; }
  .asis-card:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #00000055; }
  .asis-card-ic { color:var(--amber); flex-shrink:0; }
  .asis-card-txt { flex:1; display:flex; flex-direction:column; }
  .asis-card-txt b { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; }
  .asis-card-txt span { font-size:12px; color:var(--mut); font-weight:500; }
  .hero { overflow:hidden; }
  .speedlines {
    position:absolute; inset:0; opacity:.08; pointer-events:none;
    background: repeating-linear-gradient(118deg, var(--paper) 0 2px, transparent 2px 12px);
    -webkit-mask: radial-gradient(circle at 72% 32%, #000 8%, transparent 58%);
    mask: radial-gradient(circle at 72% 32%, #000 8%, transparent 58%);
  }
  .hero-top { display:flex; align-items:baseline; gap:10px; }
  .mute-btn { margin-left:auto; align-self:center; width:34px; height:34px; border-radius:6px;
    border:2px solid var(--ink); background:var(--bg2); color:var(--mut); cursor:pointer;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:.12s; }
  .mute-btn:hover { color:var(--amber); border-color:var(--amber); }
  .brand { font-family:'Bebas Neue'; font-size:40px; letter-spacing:2px; line-height:.9;
    color:var(--paper); text-shadow:3px 3px 0 var(--red); }
  .brand-jp { font-size:12px; color:var(--mut); letter-spacing:3px; }
  .avatar { position:relative; width:150px; margin:14px auto 16px; text-align:center; }
  .avatar-aura {
    position:absolute; top:-6px; left:50%; transform:translateX(-50%);
    width:150px; height:150px; border-radius:50%;
    background: radial-gradient(circle, var(--amber)55 0%, var(--red)33 40%, transparent 70%);
    filter: blur(3px);
  }
  .app.beast .avatar-aura { background: radial-gradient(circle, #f5b94288 0%, var(--red)55 45%, transparent 72%); }
  .avatar-frame {
    position:relative; width:122px; height:122px; margin:0 auto; border:3px solid var(--paper);
    border-radius:50%; overflow:hidden; box-shadow:0 4px 14px #00000066;
    background: repeating-radial-gradient(circle at 50% 65%, #ffffff0a 0 1px, transparent 1px 6px),
                linear-gradient(160deg,var(--panel2),var(--bg2));
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
    background:linear-gradient(95deg,var(--red),var(--red));
    border:2px solid var(--ink); padding:8px 20px; border-radius:4px; box-shadow:3px 3px 0 var(--ink);
    transition:.1s;
  }
  .beast-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .card-title { font-family:'Bebas Neue'; font-size:23px; letter-spacing:2px; color:var(--paper);
    margin-bottom:14px; border-bottom:3px solid var(--red); padding-bottom:5px; display:inline-block; }
  .card-head { display:flex; justify-content:space-between; align-items:flex-start; }
  .xp-head { display:flex; align-items:center; gap:16px; margin-bottom:10px; }
  .lvl { text-align:center; background:linear-gradient(160deg,var(--panel2),var(--bg2)); color:var(--gold);
    border:2px solid var(--gold); padding:6px 16px; border-radius:5px; }
  .lvl-num { display:block; font-family:'Bebas Neue'; font-size:40px; line-height:.9;
    }
  .lvl-lbl { font-size:10px; letter-spacing:3px; color:var(--mut); }
  .xp-info { display:flex; flex-direction:column; }
  .xp-lbl { font-size:12px; color:var(--mut); letter-spacing:3px; font-weight:700; }
  .xp-val { font-size:18px; font-weight:900; }
  .xp-bar { height:14px; background:var(--bg1); border:2px solid var(--ink); border-radius:3px; overflow:hidden; }
  .xp-fill { height:100%; background:
      repeating-linear-gradient(45deg, var(--amber) 0 7px, var(--red) 7px 14px); }
  .stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; margin-top:14px; }
  .imc-row { display:flex; align-items:center; gap:16px; }
  .imc-num { text-align:center; flex-shrink:0; min-width:84px; }
  .imc-num b { display:block; font-family:'Bebas Neue'; font-size:42px; line-height:.9; }
  .imc-num span { font-size:11px; font-weight:700; letter-spacing:1px; }
  .imc-info { flex:1; }
  .imc-ideal { font-size:13px; color:var(--txt); margin-bottom:6px; }
  .imc-ideal b { color:var(--amber); }
  .imc-msg { font-size:12px; color:var(--mut); font-weight:500; line-height:1.4; }
  .imc-nota { font-size:10px; color:var(--mut); margin-top:10px; font-style:italic; opacity:.8; }

  /* DESCANSO / SUEÑO */
  .sueno-horas { margin-bottom:16px; }
  .sueno-label { display:block; font-size:13px; font-weight:700; color:var(--txt); margin-bottom:10px; }
  .sueno-control { display:flex; align-items:center; justify-content:center; gap:20px; }
  .sueno-btn { width:42px; height:42px; border-radius:8px; border:2px solid var(--ink); cursor:pointer;
    background:linear-gradient(160deg,var(--panel2),var(--panel)); color:var(--paper);
    font-size:24px; font-weight:900; display:flex; align-items:center; justify-content:center; }
  .sueno-btn:active { transform:scale(.92); }
  .sueno-num { font-family:'Bebas Neue'; font-size:36px; color:var(--amber); min-width:90px; text-align:center; }
  .sueno-num small { font-size:18px; color:var(--mut); }
  .animo-row { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:4px; }
  .animo-btn { display:flex; flex-direction:column; align-items:center; gap:5px; padding:11px 4px; cursor:pointer;
    background:var(--bg2); border:2px solid var(--ink); border-radius:8px; transition:.12s; }
  .animo-btn:hover { border-color:var(--amber); }
  .animo-btn.on { border-color:var(--amber); background:linear-gradient(160deg,var(--panel2),var(--panel)); }
  .animo-emoji { font-size:26px; }
  .animo-label { font-size:11px; font-weight:700; color:var(--txt); }
  .sueno-tip { font-size:12px; color:var(--paper); background:var(--bg2); border:2px solid var(--amber);
    border-radius:8px; padding:10px 12px; margin-top:14px; font-weight:700; line-height:1.4; text-align:center; }
  .stat { background:linear-gradient(160deg,var(--panel2),var(--panel)); border:2px solid var(--ink); border-radius:5px;
    padding:11px 6px; text-align:center; }
  .stat svg { color:var(--amber); }
  .stat b { display:block; font-family:'Bebas Neue'; font-size:21px; letter-spacing:1px; margin:3px 0 1px; color:var(--paper); }
  .stat span { font-size:9px; color:var(--mut); letter-spacing:1.5px; font-weight:700; }
  /* Stat de racha con color dinámico */
  .racha-stat { transition: border-color .3s; animation: rachaGlow 2.4s ease-in-out infinite; }
  @keyframes rachaGlow { 0%,100% { box-shadow: 0 0 0 transparent; } 50% { box-shadow: 0 0 12px currentColor; } }
  .racha-hint { font-size:11px; color:var(--mut); text-align:center; margin-top:8px; font-style:italic; opacity:.85; }
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
    background:linear-gradient(160deg,var(--panel2),var(--panel)); border:2px solid var(--ink); border-radius:5px;
    padding:11px; transition:.12s; }
  .menu-item:hover { transform:translateX(3px); border-color:var(--amber); }
  .menu-ic { width:40px; height:40px; border-radius:5px; border:2px solid var(--ink);
    background:linear-gradient(135deg,var(--red),var(--red)); color:var(--paper);
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .menu-txt { flex:1; display:flex; flex-direction:column; }
  .menu-txt b { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--paper); }
  .menu-txt em { font-size:12px; color:var(--mut); font-style:normal; }
  .menu-arrow { color:var(--mut); }
  .add-btn { width:34px; height:34px; border-radius:10px; cursor:pointer; color:#fff;
    background:linear-gradient(135deg,var(--red),var(--red)); border:2px solid var(--ink);
    display:flex; align-items:center; justify-content:center; box-shadow:2px 2px 0 var(--ink); }
  .meals { display:flex; flex-direction:column; gap:9px; }
  .meal { display:flex; align-items:center; gap:11px; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:5px; padding:10px; }
  .meal-tag { width:36px; height:36px; border-radius:10px; border:2px solid var(--gold);
    background:var(--bg2); color:var(--gold); display:flex; align-items:center; justify-content:center;
    font-size:18px; font-weight:900; flex-shrink:0; }
  .meal-info { flex:1; display:flex; flex-direction:column; }
  .meal-info b { font-size:15px; font-weight:900; color:var(--paper); }
  .meal-info em { font-size:11px; color:var(--mut); font-style:normal; font-weight:500; }
  .meal-kcal { font-family:'Bebas Neue'; font-size:20px; letter-spacing:1px; color:var(--amber); }
  .meal-kcal small { font-size:9px; color:var(--mut); margin-left:2px; }
`;