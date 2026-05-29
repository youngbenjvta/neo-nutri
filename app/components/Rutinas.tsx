"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Dumbbell, Flame, Plus, Trash2, Check, X } from "lucide-react";
import { useProgreso, XP_POR_ENTRENO } from "./useProgreso";
import { useSonido } from "./useSonido";
import { usePersistedState } from "./usePersistedState";
import { useDiarioNube } from "./useDiarioNube";
import { useMonedas } from "./useMonedas";
import { useMisRutinas, type RutinaPropia } from "./useMisRutinas";
import { EJERCICIOS, GRUPOS } from "./ejercicios";

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
    tone: "var(--red)",
    ejercicios: ["Press de banca", "Press inclinado con mancuernas", "Press militar", "Elevaciones laterales", "Fondos en paralelas", "Extensión de tríceps en polea"],
  },
  {
    id: "pull",
    name: "PULL DAY",
    jp: "引く",
    muscles: "Espalda · Bíceps",
    tone: "var(--amber)",
    ejercicios: ["Dominadas", "Remo con barra", "Jalón al pecho", "Remo en polea baja", "Curl con barra", "Curl martillo"],
  },
  {
    id: "leg",
    name: "LEG DAY",
    jp: "脚",
    muscles: "Piernas · Glúteos",
    tone: "var(--teal)",
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
  const { diario, actualizar } = useDiarioNube();
  const { rutinas: misRutinas, crear, borrar } = useMisRutinas();
  const { sumar: sumarMonedas } = useMonedas();
  const sonido = useSonido();
  const [hecho, setHecho] = useState(false); // muestra confirmación de XP ganado

  // Editor de rutinas propias
  const [editor, setEditor] = useState(false);              // ¿abierto el editor?
  const [nombreRutina, setNombreRutina] = useState("");
  const [ejerciciosElegidos, setEjerciciosElegidos] = useState<string[]>([]);
  const [grupoFiltro, setGrupoFiltro] = useState("Pecho");
  const [ejercicioLibre, setEjercicioLibre] = useState("");

  // Cuántos ejercicios mostrar según el nivel (principiante ve menos)
  const tope = EJERCICIOS_POR_NIVEL[nivel] || 2;

  // Buscar la rutina abierta: primero en preset, luego en mis rutinas
  const rutinaPreset = RUTINAS.find((r) => r.id === abierta);
  const rutinaPropia = misRutinas.find((r) => r.id === abierta);
  const rutina = rutinaPreset || rutinaPropia;
  const esPropia = !!rutinaPropia;
  const series = SERIES_POR_NIVEL[nivel];

  // Cambiar nivel también lo guarda en el perfil
  function cambiarNivel(n: string) {
    setNivel(n);
    setNivelGuardado(n);
  }

  // Al completar un entrenamiento: suma XP, suena, y muestra confirmación.
  async function entrenar() {
    const subioNivel = await completarEntreno();
    // Sumamos el entrenamiento de hoy (se reinicia cada día)
    await actualizar({ ...diario, entrenos: diario.entrenos + 1 });
    // ¡Ganas 15 monedas KAIZEN por entrenar! 🪙
    await sumarMonedas(15, "¡Por entrenar! 💪");
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
    // Unifica los campos: preset usa name/muscles; propias usan nombre y no tienen muscles
    const tituloRutina = (rutina as { name?: string }).name || (rutina as { nombre?: string }).nombre || "";
    const musculos = (rutina as { muscles?: string }).muscles || "Rutina personalizada";
    // Las preset se limitan por nivel; las propias muestran TODOS los ejercicios del usuario
    const listaEjercicios = esPropia ? rutina.ejercicios : rutina.ejercicios.slice(0, tope);

    return (
      <div className="app">
        <style suppressHydrationWarning>{CSS}</style>
        <header className="top">
          <button className="back" aria-label="Volver" onClick={() => setAbierta(null)}>
            <ChevronLeft size={22} />
          </button>
          <h1 className="top-title" style={{ color: rutina.tone }}>{tituloRutina}</h1>
          <span className="top-jp">{rutina.jp}</span>
        </header>

        <div className="detail-head panel" style={{ borderColor: rutina.tone }}>
          <Dumbbell size={20} style={{ color: rutina.tone }} />
          <div>
            <p className="detail-muscles">{musculos}</p>
            <p className="detail-level">{NIVELES.find((n) => n.id === nivel)?.label} · {series} por ejercicio</p>
          </div>
        </div>

        <div className="ex-list">
          {listaEjercicios.map((e, i) => (
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

      {/* TARJETAS DE RUTINA (PRESET) */}
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

      {/* MIS RUTINAS (creadas por el usuario) */}
      <div className="mis-head">
        <h2 className="mis-titulo">MIS RUTINAS</h2>
        <button className="crear-rutina-btn" onClick={() => {
          setEditor(true);
          setNombreRutina("");
          setEjerciciosElegidos([]);
        }}>
          <Plus size={16} /> CREAR
        </button>
      </div>

      <div className="cards">
        {misRutinas.length === 0 && (
          <p className="mis-vacio">Aún no has creado rutinas. Toca CREAR para empezar 🥋</p>
        )}
        {misRutinas.map((r) => (
          <div key={r.id} className="rutina-card propia" style={{ borderColor: r.tone }}>
            <button className="rutina-card-tap" onClick={() => setAbierta(r.id)}>
              <div className="rutina-bar" style={{ background: r.tone }} />
              <div className="rutina-info">
                <div className="rutina-name" style={{ color: r.tone }}>
                  {r.nombre} <span className="rutina-jp">{r.jp}</span>
                </div>
                <div className="rutina-muscles">Personalizada</div>
                <div className="rutina-meta">{r.ejercicios.length} ejercicios · {series}</div>
              </div>
            </button>
            <button
              className="borrar-rutina"
              onClick={() => {
                if (confirm(`¿Borrar la rutina "${r.nombre}"?`)) borrar(r.id);
              }}
              aria-label="Borrar"
            ><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      {/* MODAL DEL EDITOR DE RUTINAS */}
      {editor && (
        <div className="editor-overlay" onClick={() => setEditor(false)}>
          <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="editor-head">
              <h2 className="editor-titulo">CREAR RUTINA</h2>
              <button className="editor-cerrar" onClick={() => setEditor(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            {/* Nombre */}
            <input
              className="editor-input"
              placeholder="Nombre de la rutina (ej. Lunes intenso)"
              value={nombreRutina}
              onChange={(e) => setNombreRutina(e.target.value)}
              maxLength={30}
            />

            {/* Ejercicios elegidos */}
            <p className="editor-label">EJERCICIOS ({ejerciciosElegidos.length})</p>
            <div className="elegidos">
              {ejerciciosElegidos.length === 0 && (
                <p className="editor-vacio">Aún no añadiste ejercicios.</p>
              )}
              {ejerciciosElegidos.map((e, i) => (
                <div key={i} className="elegido">
                  <span className="elegido-num">{i + 1}</span>
                  <span className="elegido-nombre">{e}</span>
                  <button
                    className="elegido-quitar"
                    onClick={() => setEjerciciosElegidos(ejerciciosElegidos.filter((_, idx) => idx !== i))}
                  ><X size={14} /></button>
                </div>
              ))}
            </div>

            {/* Catálogo por grupo muscular */}
            <p className="editor-label">AÑADIR DEL CATÁLOGO</p>
            <div className="grupo-filtros">
              {GRUPOS.map((g) => (
                <button
                  key={g}
                  className={`grupo-filtro ${grupoFiltro === g ? "on" : ""}`}
                  onClick={() => setGrupoFiltro(g)}
                >{g}</button>
              ))}
            </div>
            <div className="catalogo">
              {EJERCICIOS.filter((e) => e.grupo === grupoFiltro).map((e) => {
                const ya = ejerciciosElegidos.includes(e.nombre);
                return (
                  <button
                    key={e.nombre}
                    className={`catalogo-item ${ya ? "ya" : ""}`}
                    disabled={ya}
                    onClick={() => setEjerciciosElegidos([...ejerciciosElegidos, e.nombre])}
                  >
                    {ya ? <Check size={14} /> : <Plus size={14} />} {e.nombre}
                  </button>
                );
              })}
            </div>

            {/* Añadir ejercicio libre */}
            <p className="editor-label">O ESCRIBE UNO PROPIO</p>
            <div className="libre-row">
              <input
                className="editor-input"
                placeholder="Ej. Sentadilla con barra olímpica"
                value={ejercicioLibre}
                onChange={(e) => setEjercicioLibre(e.target.value)}
                maxLength={50}
              />
              <button
                className="libre-add"
                disabled={!ejercicioLibre.trim()}
                onClick={() => {
                  setEjerciciosElegidos([...ejerciciosElegidos, ejercicioLibre.trim()]);
                  setEjercicioLibre("");
                }}
              ><Plus size={18} /></button>
            </div>

            {/* Guardar */}
            <button
              className="editor-guardar"
              disabled={!nombreRutina.trim() || ejerciciosElegidos.length === 0}
              onClick={() => {
                crear(nombreRutina, ejerciciosElegidos);
                setEditor(false);
              }}
            >
              GUARDAR RUTINA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
  * { box-sizing: border-box; margin: 0; }
  .app {
    max-width:460px; margin:0 auto; padding:16px 14px 32px;
    color:var(--txt); min-height:100vh; position:relative; overflow-x:hidden;
    font-family:'Zen Kaku Gothic New', sans-serif; font-weight:500;
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 8%, var(--glow) 0%, transparent 45%),
      linear-gradient(165deg, var(--bg2), var(--bg1));
  }
  .top { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
  .back { width:38px; height:38px; border-radius:6px; border:2px solid var(--ink);
    background:var(--bg2); color:var(--paper);
    display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
  .top-title { font-family:'Bebas Neue'; font-size:30px; letter-spacing:2px; color:var(--paper); flex:1; }
  .top-jp { font-size:12px; color:var(--mut); letter-spacing:2px; }

  .panel { position:relative; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:8px; padding:14px; box-shadow:4px 4px 0 #00000055; }

  /* NIVELES */
  .levels { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; margin-bottom:16px; }
  .level-tab { font-family:'Bebas Neue'; font-size:13px; letter-spacing:1px; padding:10px 2px;
    border:2px solid var(--ink); border-radius:6px; cursor:pointer; color:var(--mut);
    background:var(--bg2); transition:.12s; }
  .level-tab.on { color:var(--paper); background:linear-gradient(135deg,var(--red),var(--red)); border-color:var(--amber); }

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
  .ex { display:flex; align-items:center; gap:12px; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:6px; padding:12px; }
  .ex-num { width:30px; height:30px; border-radius:6px; border:2px solid var(--ink); color:var(--ink);
    font-family:'Bebas Neue'; font-size:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ex-name { flex:1; font-size:14px; font-weight:700; color:var(--paper); }
  .ex-sets { font-family:'Bebas Neue'; font-size:18px; letter-spacing:1px; color:var(--amber); }
  .start-btn { width:100%; margin-top:18px; display:flex; align-items:center; justify-content:center; gap:8px;
    font-family:'Bebas Neue'; font-size:20px; letter-spacing:2px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),var(--red)); border:2px solid var(--ink); padding:13px;
    border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .start-btn:active { transform:translate(3px,3px); box-shadow:none; }

  /* MIS RUTINAS */
  .mis-head { display:flex; justify-content:space-between; align-items:center; margin:24px 0 12px; }
  .mis-titulo { font-family:'Bebas Neue'; font-size:22px; letter-spacing:2px; color:var(--paper);
    border-bottom:3px solid var(--amber); padding-bottom:3px; }
  .crear-rutina-btn { display:flex; align-items:center; gap:5px; font-family:'Bebas Neue'; font-size:14px;
    letter-spacing:1.5px; padding:7px 13px; cursor:pointer; color:var(--paper);
    background:linear-gradient(95deg,var(--amber),#b8801f); border:2px solid var(--ink); border-radius:6px;
    box-shadow:2px 2px 0 var(--ink); transition:.1s; }
  .crear-rutina-btn:active { transform:translate(2px,2px); box-shadow:none; }
  .mis-vacio { font-size:13px; color:var(--mut); text-align:center; padding:14px; font-style:italic;
    background:var(--bg2); border:2px dashed var(--ink); border-radius:8px; }
  .rutina-card.propia { display:flex; align-items:stretch; padding:0; overflow:hidden; }
  .rutina-card-tap { flex:1; display:flex; align-items:center; gap:14px; padding:14px; cursor:pointer;
    background:none; border:none; color:inherit; text-align:left; }
  .borrar-rutina { padding:0 14px; cursor:pointer; color:var(--mut); border:none;
    border-left:2px solid var(--ink); background:var(--bg2); display:flex; align-items:center; justify-content:center; }
  .borrar-rutina:hover { color:var(--red); background:var(--panel); }

  /* MODAL EDITOR */
  .editor-overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:9999;
    display:flex; align-items:flex-start; justify-content:center; padding:20px 14px; overflow-y:auto; }
  .editor-modal { width:100%; max-width:430px; background:var(--bg2); border:2px solid var(--amber);
    border-radius:10px; padding:18px; box-shadow:0 10px 40px #000000bb; }
  .editor-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
  .editor-titulo { font-family:'Bebas Neue'; font-size:24px; letter-spacing:2px; color:var(--paper); }
  .editor-cerrar { background:none; border:none; cursor:pointer; color:var(--mut); padding:4px;
    display:flex; align-items:center; }
  .editor-cerrar:hover { color:var(--red); }
  .editor-input { width:100%; padding:10px 12px; margin-bottom:10px;
    background:var(--panel); border:2px solid var(--ink); border-radius:6px;
    color:var(--paper); font-family:'Zen Kaku Gothic New'; font-size:14px; font-weight:700; outline:none; }
  .editor-input:focus { border-color:var(--amber); }
  .editor-label { font-family:'Bebas Neue'; font-size:14px; letter-spacing:1.5px; color:var(--amber);
    margin:14px 0 7px; }
  .editor-vacio { font-size:12px; color:var(--mut); padding:10px; text-align:center; font-style:italic; }
  .elegidos { display:flex; flex-direction:column; gap:5px; max-height:160px; overflow-y:auto; }
  .elegido { display:flex; align-items:center; gap:8px; padding:8px 10px;
    background:var(--panel); border:2px solid var(--ink); border-radius:6px; }
  .elegido-num { font-family:'Bebas Neue'; font-size:14px; color:var(--amber); min-width:18px; }
  .elegido-nombre { flex:1; font-size:13px; color:var(--paper); font-weight:700; }
  .elegido-quitar { background:none; border:none; cursor:pointer; color:var(--mut); padding:2px;
    display:flex; align-items:center; }
  .elegido-quitar:hover { color:var(--red); }

  .grupo-filtros { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px; }
  .grupo-filtro { font-size:10px; font-weight:700; padding:5px 9px; cursor:pointer; border-radius:12px;
    background:var(--panel); border:2px solid var(--ink); color:var(--mut); transition:.12s; }
  .grupo-filtro:hover { color:var(--amber); border-color:var(--amber); }
  .grupo-filtro.on { background:linear-gradient(95deg,var(--red),#7a1d13); color:var(--paper); border-color:var(--ink); }
  .catalogo { display:flex; flex-direction:column; gap:4px; max-height:200px; overflow-y:auto;
    background:var(--panel); border:2px solid var(--ink); border-radius:6px; padding:6px; }
  .catalogo-item { display:flex; align-items:center; gap:6px; padding:7px 10px; cursor:pointer;
    background:var(--bg2); border:1px solid var(--ink); border-radius:5px;
    color:var(--paper); font-size:12.5px; font-weight:700; text-align:left; transition:.12s; }
  .catalogo-item:hover:not(:disabled) { border-color:var(--amber); }
  .catalogo-item.ya { opacity:.5; cursor:default; color:var(--teal); }

  .libre-row { display:flex; gap:6px; align-items:flex-start; }
  .libre-row .editor-input { flex:1; margin-bottom:0; }
  .libre-add { width:42px; height:42px; flex-shrink:0; cursor:pointer; color:var(--paper);
    background:var(--amber); border:2px solid var(--ink); border-radius:6px;
    display:flex; align-items:center; justify-content:center; transition:.12s; }
  .libre-add:disabled { opacity:.4; cursor:default; }
  .libre-add:active:not(:disabled) { transform:scale(.92); }

  .editor-guardar { width:100%; margin-top:16px; padding:13px; cursor:pointer;
    font-family:'Bebas Neue'; font-size:18px; letter-spacing:2px; color:var(--paper);
    background:linear-gradient(95deg,var(--red),#a02619); border:2px solid var(--ink); border-radius:6px;
    box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .editor-guardar:active:not(:disabled) { transform:translate(3px,3px); box-shadow:none; }
  .editor-guardar:disabled { opacity:.4; cursor:default; }
`;