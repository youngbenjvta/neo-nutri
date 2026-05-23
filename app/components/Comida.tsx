"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus, Trash2, Flame, X, Search } from "lucide-react";
import { useComidasNube } from "./useComidasNube";
import { ALIMENTOS, CATEGORIAS, CANTIDADES, type Alimento } from "./alimentos";
import { YunsTip } from "./Yuns";
import { usePersistedState } from "./usePersistedState";
import { calcularMetaKcal } from "./calcularMeta";

// ============================================================
//  NEO NUTRI — ALIMENTACIÓN (shonen pintado)
//  Registro de comidas del día. Añadir / borrar. Persistente.
// ============================================================

const TIPOS = [
  { id: "Desayuno", jp: "朝", tone: "#e8a13a" },
  { id: "Almuerzo", jp: "昼", tone: "#d23b2e" },
  { id: "Merienda", jp: "間", tone: "#9b6bd2" },
  { id: "Cena", jp: "夜", tone: "#3f7d6e" },
];

function tonoDe(tipo: string) {
  return TIPOS.find((t) => t.id === tipo)?.tone || "#e8a13a";
}
function jpDe(tipo: string) {
  return TIPOS.find((t) => t.id === tipo)?.jp || "食";
}

export default function Comida({ onBack }: { onBack?: () => void }) {
  // Comidas desde la nube (Supabase)
  const { comidas, cargando, agregar, borrar: borrarNube } = useComidasNube();

  // Estado del formulario para añadir
  const [abrir, setAbrir] = useState(false);
  const [tipo, setTipo] = useState("Desayuno");
  const [modo, setModo] = useState<"alimento" | "manual">("alimento");

  // Modo "por alimento": elegir alimento + cantidad (calcula kcal solo)
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Proteínas");
  const [elegido, setElegido] = useState<Alimento | null>(null);
  const [cantidad, setCantidad] = useState(1);

  // Plato en construcción: lista de alimentos que se guardarán juntos
  const [plato, setPlato] = useState<{ nombre: string; kcal: number }[]>([]);

  // Modo manual (por si el alimento no está en la lista)
  const [nombre, setNombre] = useState("");
  const [kcal, setKcal] = useState("");

  // Lista filtrada por búsqueda o categoría
  const alimentosFiltrados = busqueda.trim()
    ? ALIMENTOS.filter((a) => a.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : ALIMENTOS.filter((a) => a.categoria === categoria);

  // Calorías calculadas automáticamente
  const kcalCalculado = elegido ? Math.round(elegido.kcalPorUnidad * cantidad) : 0;

  // Cada vez que cambian las comidas, sincronizamos a localStorage
  // para que el Dashboard (que lee "comida.lista") siga funcionando.
  useEffect(() => {
    if (!cargando) {
      try {
        localStorage.setItem("comida.lista", JSON.stringify(comidas));
      } catch {
        // si no hay localStorage, no pasa nada
      }
    }
  }, [comidas, cargando]);

  const totalKcal = comidas.reduce((suma, c) => suma + (Number(c.kcal) || 0), 0);
  // Leemos los datos del perfil (sincronizados en localStorage) para la meta
  const [perfilPeso] = usePersistedState("perfil.pesoMeta", "70");
  const [perfilAltura] = usePersistedState("perfil.altura", "175");
  const [perfilEdad] = usePersistedState("perfil.edad", "25");
  const [perfilObjetivo] = usePersistedState("perfil.objetivo", "bajar");

  // Meta de calorías calculada automáticamente según el perfil
  const META = calcularMetaKcal({
    peso: Number(perfilPeso),
    altura: Number(perfilAltura),
    edad: Number(perfilEdad),
    objetivo: perfilObjetivo,
  });
  const pct = Math.min((totalKcal / META) * 100, 100);

  const totalPlato = plato.reduce((s, p) => s + p.kcal, 0);

  // Agregar el alimento elegido al PLATO (no a la nube todavía)
  function agregarAlPlato() {
    if (!elegido) return;
    const nombreItem = cantidad === 1
      ? elegido.nombre
      : `${elegido.nombre} (${cantidad} ${elegido.unidad})`;
    setPlato([...plato, { nombre: nombreItem, kcal: kcalCalculado }]);
    setElegido(null);
    setCantidad(1);
    setBusqueda("");
  }

  // Quitar un alimento del plato
  function quitarDelPlato(i: number) {
    setPlato(plato.filter((_, idx) => idx !== i));
  }

  // Guardar TODO el plato como UNA comida en la nube
  async function guardarPlato() {
    if (plato.length === 0) return;
    const nombreComida = plato.map((p) => p.nombre).join(" + ");
    await agregar(tipo, nombreComida, totalPlato);
    setPlato([]);
    setAbrir(false);
  }

  // Añadir desde el modo manual
  async function añadirManual() {
    if (!nombre.trim() || !kcal) return;
    await agregar(tipo, nombre.trim(), Number(kcal));
    setNombre("");
    setKcal("");
    setAbrir(false);
  }

  async function borrar(id: number) {
    await borrarNube(id);
  }

  return (
    <div className="app">
      <style suppressHydrationWarning>{CSS}</style>

      {/* HEADER */}
      <header className="top">
        <button className="back" aria-label="Volver" onClick={() => onBack && onBack()}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="top-title">ALIMENTACIÓN</h1>
        <span className="top-jp">食事</span>
      </header>

      <YunsTip consejo="Registra todo lo que comes, ¡hasta el café! Cada dato cuenta. 🦊" />

      {/* RESUMEN DE CALORÍAS */}
      <section className="panel resumen">
        <div className="resumen-top">
          <div>
            <p className="resumen-lbl">CALORÍAS DE HOY</p>
            <p className="resumen-num">{totalKcal.toLocaleString()} <em>/ {META.toLocaleString()} kcal</em></p>
          </div>
          <div className="resumen-count">
            <Flame size={16} /> {comidas.length}
            <span>comidas</span>
          </div>
        </div>
        <div className="resumen-bar"><div className="resumen-fill" style={{ width: `${pct}%` }} /></div>
      </section>

      {/* LISTA DE COMIDAS */}
      <section className="panel">
        <div className="card-head">
          <h2 className="card-title">録 REGISTRO</h2>
          <button className="add-btn" onClick={() => setAbrir(!abrir)} aria-label="Añadir comida">
            {abrir ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {/* FORMULARIO PARA AÑADIR (aparece/desaparece) */}
        {abrir && (
          <div className="form">
            {/* Tipo de comida */}
            <div className="tipo-row">
              {TIPOS.map((t) => (
                <button
                  key={t.id}
                  className={`tipo-btn ${tipo === t.id ? "on" : ""}`}
                  style={{ borderColor: tipo === t.id ? t.tone : "#0d0805", color: tipo === t.id ? t.tone : "#b09a7e" }}
                  onClick={() => setTipo(t.id)}
                >
                  {t.jp} {t.id}
                </button>
              ))}
            </div>

            {/* Selector de modo: por alimento o manual */}
            <div className="modo-row">
              <button className={`modo-btn ${modo === "alimento" ? "on" : ""}`} onClick={() => setModo("alimento")}>
                ⚖️ POR ALIMENTO
              </button>
              <button className={`modo-btn ${modo === "manual" ? "on" : ""}`} onClick={() => setModo("manual")}>
                ✏️ MANUAL
              </button>
            </div>

            {/* MODO POR ALIMENTO (calcula calorías solo) */}
            {modo === "alimento" && (
              <>
                {/* Buscador */}
                <div className="buscador">
                  <Search size={16} />
                  <input
                    placeholder="Buscar alimento..."
                    value={busqueda}
                    onChange={(e) => { setBusqueda(e.target.value); setElegido(null); }}
                  />
                </div>

                {/* Categorías (si no hay búsqueda) */}
                {!busqueda.trim() && (
                  <div className="cat-row">
                    {CATEGORIAS.map((c) => (
                      <button
                        key={c}
                        className={`cat-btn ${categoria === c ? "on" : ""}`}
                        onClick={() => { setCategoria(c); setElegido(null); }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                {/* Lista de alimentos */}
                <div className="alim-lista">
                  {alimentosFiltrados.length === 0 && (
                    <p className="alim-vacio">No se encontró. Usa el modo Manual.</p>
                  )}
                  {alimentosFiltrados.map((a) => (
                    <button
                      key={a.id}
                      className={`alim-item ${elegido?.id === a.id ? "on" : ""}`}
                      onClick={() => setElegido(a)}
                    >
                      <span className="alim-nombre">{a.nombre}</span>
                      <span className="alim-kcal">{a.kcalPorUnidad} kcal / {a.unidad}</span>
                    </button>
                  ))}
                </div>

                {/* Si hay alimento elegido: cantidad y cálculo */}
                {elegido && (
                  <div className="calc">
                    <p className="calc-titulo">{elegido.nombre} — ¿cuánto?</p>
                    <div className="cant-row">
                      {CANTIDADES.map((q) => (
                        <button
                          key={q}
                          className={`cant-btn ${cantidad === q ? "on" : ""}`}
                          onClick={() => setCantidad(q)}
                        >
                          {q} {elegido.unidad}
                        </button>
                      ))}
                    </div>
                    <div className="calc-total">
                      <Flame size={18} />
                      <b>{kcalCalculado}</b> kcal
                    </div>
                    <button className="confirm-btn" onClick={agregarAlPlato}>+ AGREGAR AL PLATO</button>
                  </div>
                )}

                {/* PLATO EN CONSTRUCCIÓN */}
                {plato.length > 0 && (
                  <div className="plato">
                    <p className="plato-titulo">🍱 TU PLATO</p>
                    {plato.map((p, i) => (
                      <div key={i} className="plato-item">
                        <span className="plato-nombre">{p.nombre}</span>
                        <span className="plato-kcal">{p.kcal} kcal</span>
                        <button className="plato-x" onClick={() => quitarDelPlato(i)} aria-label="Quitar">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <div className="plato-total">
                      <span>TOTAL</span>
                      <b>{totalPlato} kcal</b>
                    </div>
                    <button className="confirm-btn guardar-plato" onClick={guardarPlato}>
                      GUARDAR {tipo.toUpperCase()}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* MODO MANUAL */}
            {modo === "manual" && (
              <>
                <input
                  className="form-input"
                  placeholder="¿Qué comiste? (ej. Pollo con arroz)"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <div className="form-bottom">
                  <input
                    className="form-input kcal"
                    type="number"
                    placeholder="kcal"
                    value={kcal}
                    onChange={(e) => setKcal(e.target.value)}
                  />
                  <button className="confirm-btn" onClick={añadirManual}>AÑADIR</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* LISTA */}
        <div className="meals">
          {cargando && (
            <p className="vacio">Cargando tus comidas desde la nube...</p>
          )}
          {!cargando && comidas.length === 0 && (
            <p className="vacio">Aún no has registrado comidas hoy. Toca + para empezar.</p>
          )}
          {comidas.map((c) => (
            <div key={c.id} className="meal">
              <span className="meal-tag" style={{ borderColor: tonoDe(c.tipo), color: tonoDe(c.tipo) }}>
                {jpDe(c.tipo)}
              </span>
              <div className="meal-info">
                <b>{c.tipo}</b>
                <em>{c.nombre}</em>
              </div>
              <span className="meal-kcal">{c.kcal}<small>kcal</small></span>
              <button className="del-btn" onClick={() => borrar(c.id)} aria-label="Borrar">
                <Trash2 size={16} />
              </button>
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
  .back { width:38px; height:38px; border-radius:10px; border:2px solid var(--ink);
    background:linear-gradient(160deg,#341f18,#26150f); color:var(--paper);
    display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
  .top-title { font-family:'Bebas Neue'; font-size:28px; letter-spacing:2px; color:var(--paper); flex:1; }
  .top-jp { font-size:12px; color:var(--mut); letter-spacing:2px; }

  .panel { position:relative; background:linear-gradient(160deg,var(--panel2),var(--panel));
    border:2px solid var(--ink); border-radius:8px; padding:16px; margin-bottom:14px;
    box-shadow:0 8px 24px #00000066; }

  /* RESUMEN */
  .resumen-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
  .resumen-lbl { font-size:11px; letter-spacing:2px; color:var(--mut); font-weight:700; }
  .resumen-num { font-family:'Bebas Neue'; font-size:34px; letter-spacing:1px; color:var(--paper); line-height:1; margin-top:3px; }
  .resumen-num em { font-size:15px; color:var(--mut); font-style:normal; }
  .resumen-count { display:flex; flex-direction:column; align-items:center; font-family:'Bebas Neue';
    font-size:24px; color:var(--amber); border:2px solid var(--ink); border-radius:6px; padding:6px 12px;
    background:#241410; line-height:1; }
  .resumen-count svg { color:var(--red); }
  .resumen-count span { font-size:9px; color:var(--mut); letter-spacing:1px; font-family:'Zen Kaku Gothic New'; margin-top:3px; }
  .resumen-bar { height:12px; background:#241410; border:2px solid var(--ink); border-radius:3px; overflow:hidden; }
  .resumen-fill { height:100%; background:repeating-linear-gradient(45deg, var(--amber) 0 7px, var(--red) 7px 14px); transition:width .3s; }

  .card-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
  .card-title { font-family:'Bebas Neue'; font-size:21px; letter-spacing:2px; color:var(--paper);
    border-bottom:3px solid var(--red); padding-bottom:5px; }
  .add-btn { width:34px; height:34px; border-radius:6px; cursor:pointer; color:var(--paper);
    background:linear-gradient(135deg,var(--red),#7a1d13); border:2px solid var(--ink);
    display:flex; align-items:center; justify-content:center; box-shadow:2px 2px 0 var(--ink); flex-shrink:0; }

  /* FORMULARIO */
  .form { background:#241410; border:2px solid var(--amber); border-radius:8px; padding:12px; margin-bottom:14px;
    display:flex; flex-direction:column; gap:10px; }
  .tipo-row { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; }
  .tipo-btn { font-family:'Bebas Neue'; font-size:12px; letter-spacing:.5px; padding:8px 2px;
    border:2px solid; border-radius:5px; cursor:pointer; background:#241410; transition:.12s; }
  .form-input { background:#241410; border:2px solid var(--ink); border-radius:6px; padding:10px;
    color:var(--paper); font-family:'Zen Kaku Gothic New'; font-size:14px; font-weight:700; outline:none; width:100%; }
  .form-input:focus { border-color:var(--amber); }
  .form-bottom { display:flex; gap:8px; }
  .form-input.kcal { width:90px; flex-shrink:0; }
  .confirm-btn { flex:1; font-family:'Bebas Neue'; font-size:17px; letter-spacing:1px; color:var(--paper);
    cursor:pointer; background:linear-gradient(95deg,var(--red),#a02619); border:2px solid var(--ink);
    border-radius:6px; box-shadow:2px 2px 0 var(--ink); transition:.1s; }
  .confirm-btn:active { transform:translate(2px,2px); box-shadow:none; }

  /* MODO (alimento / manual) */
  .modo-row { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
  .modo-btn { font-family:'Bebas Neue'; font-size:14px; letter-spacing:1px; padding:9px 4px;
    border:2px solid var(--ink); border-radius:8px; cursor:pointer; color:var(--mut);
    background:#241410; transition:.12s; }
  .modo-btn.on { color:#fff; background:linear-gradient(135deg,var(--red),#7a1d13); border-color:var(--amber); }

  /* BUSCADOR */
  .buscador { display:flex; align-items:center; gap:8px; background:#241410; border:2px solid var(--ink);
    border-radius:8px; padding:9px 11px; }
  .buscador svg { color:var(--mut); flex-shrink:0; }
  .buscador input { flex:1; background:none; border:none; outline:none; color:var(--paper);
    font-family:'Zen Kaku Gothic New'; font-size:14px; font-weight:700; }

  /* CATEGORÍAS */
  .cat-row { display:flex; gap:6px; overflow-x:auto; padding-bottom:3px; }
  .cat-btn { font-size:11px; font-weight:700; white-space:nowrap; padding:7px 11px; border-radius:20px;
    border:2px solid var(--ink); cursor:pointer; color:var(--mut); background:#241410; transition:.12s; flex-shrink:0; }
  .cat-btn.on { color:#fff; background:var(--red); border-color:var(--amber); }

  /* LISTA DE ALIMENTOS */
  .alim-lista { display:flex; flex-direction:column; gap:6px; max-height:200px; overflow-y:auto; }
  .alim-vacio { font-size:12px; color:var(--mut); text-align:center; padding:10px; }
  .alim-item { display:flex; justify-content:space-between; align-items:center; cursor:pointer;
    background:#241410; border:2px solid var(--ink); border-radius:8px; padding:10px 12px; transition:.12s; text-align:left; }
  .alim-item.on { border-color:var(--amber); }
  .alim-nombre { font-size:13px; font-weight:700; color:var(--paper); }
  .alim-kcal { font-size:11px; color:var(--amber); font-weight:700; flex-shrink:0; }

  /* CÁLCULO */
  .calc { background:#241410; border:2px solid var(--amber); border-radius:8px; padding:12px;
    display:flex; flex-direction:column; gap:10px; }
  .calc-titulo { font-size:13px; font-weight:900; color:var(--paper); }
  .cant-row { display:flex; gap:6px; flex-wrap:wrap; }
  .cant-btn { font-size:12px; font-weight:700; padding:7px 10px; border-radius:8px; cursor:pointer;
    border:2px solid var(--ink); color:var(--mut); background:#2a1812; transition:.12s; }
  .cant-btn.on { color:#fff; background:var(--amber); border-color:var(--amber); }
  .calc-total { display:flex; align-items:center; gap:8px; font-family:'Bebas Neue'; font-size:28px;
    color:var(--amber); justify-content:center; }
  .calc-total svg { color:var(--red); }

  /* PLATO EN CONSTRUCCIÓN */
  .plato { background:#1c1410; border:2px solid var(--amber); border-radius:8px; padding:12px;
    display:flex; flex-direction:column; gap:8px; }
  .plato-titulo { font-family:'Bebas Neue'; font-size:16px; letter-spacing:1px; color:var(--amber); }
  .plato-item { display:flex; align-items:center; gap:8px; background:#241410;
    border:2px solid var(--ink); border-radius:6px; padding:8px 10px; }
  .plato-nombre { flex:1; font-size:12px; font-weight:700; color:var(--paper);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .plato-kcal { font-family:'Bebas Neue'; font-size:15px; color:var(--amber); flex-shrink:0; }
  .plato-x { width:24px; height:24px; border-radius:5px; cursor:pointer; color:var(--mut);
    background:#1c1410; border:2px solid var(--ink); display:flex; align-items:center; justify-content:center;
    flex-shrink:0; }
  .plato-x:hover { color:var(--red); border-color:var(--red); }
  .plato-total { display:flex; justify-content:space-between; align-items:center; padding:8px 4px 2px;
    border-top:2px dashed #3a241c; margin-top:2px; }
  .plato-total span { font-size:12px; letter-spacing:2px; color:var(--mut); font-weight:700; }
  .plato-total b { font-family:'Bebas Neue'; font-size:26px; letter-spacing:1px; color:var(--paper); }
  .guardar-plato { margin-top:4px; }

  /* LISTA */
  .meals { display:flex; flex-direction:column; gap:9px; }
  .vacio { font-size:13px; color:var(--mut); text-align:center; padding:16px 8px; }
  .meal { display:flex; align-items:center; gap:11px; background:#341f18;
    border:2px solid var(--ink); border-radius:6px; padding:10px; }
  .meal-tag { width:36px; height:36px; border-radius:6px; border:2px solid; background:#241410;
    display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:900; flex-shrink:0; }
  .meal-info { flex:1; display:flex; flex-direction:column; min-width:0; }
  .meal-info b { font-size:14px; font-weight:900; color:var(--paper); }
  .meal-info em { font-size:11px; color:var(--mut); font-style:normal; font-weight:500;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .meal-kcal { font-family:'Bebas Neue'; font-size:19px; letter-spacing:1px; color:var(--amber); flex-shrink:0; }
  .meal-kcal small { font-size:9px; color:var(--mut); margin-left:2px; }
  .del-btn { width:30px; height:30px; border-radius:6px; cursor:pointer; color:var(--mut);
    background:#241410; border:2px solid var(--ink); display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:.12s; }
  .del-btn:hover { color:var(--red); border-color:var(--red); }
`;