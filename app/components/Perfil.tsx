"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Target, Check, Camera, X } from "lucide-react";
import { GuerreroSVG, calcularRango } from "./Guerrero";
import { usePerfilNube } from "./usePerfilNube";
import { useProgreso } from "./useProgreso";
import { useRacha } from "./useRacha";
import { usePersistedState } from "./usePersistedState";

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

export default function Perfil({ onBack, onCerrarSesion, onLogros }: { onBack?: () => void; onCerrarSesion?: () => void; onLogros?: () => void }) {
  const { perfil, guardarPerfil, cargando, guardando } = usePerfilNube();
  const { prog } = useProgreso();
  const { racha } = useRacha();

  // El género del kimono se guarda en el campo "avatar" del perfil (reutilizado)
  const [genero, setGenero] = useState<"hombre" | "mujer">("hombre");
  const [nombre, setNombre] = useState("GUERRERO");
  const [objetivo, setObjetivo] = useState("bajar");
  const [pesoMeta, setPesoMeta] = useState("70");
  const [kcalMeta, setKcalMeta] = useState("2600");
  const [altura, setAltura] = useState("175");
  const [edad, setEdad] = useState("25");
  const [guardado, setGuardado] = useState(false);

  // Logros desbloqueados (guardados por la pantalla de Logros en localStorage)
  const [logrosCount] = usePersistedState("logros.desbloqueados", 0);

  // Foto de perfil (guardada en el dispositivo como texto base64)
  const [foto, setFoto] = usePersistedState("perfil.foto", "");

  // Cuando el usuario elige una imagen, la convertimos a texto y la guardamos
  function elegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files && e.target.files[0];
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) return;
    const lector = new FileReader();
    lector.onload = () => setFoto(String(lector.result));
    lector.readAsDataURL(archivo);
  }

  // Cuando llega el perfil desde la nube, llenamos los campos
  useEffect(() => {
    if (!cargando) {
      // Si el avatar guardado es "mujer", usamos mujer; si no, hombre
      setGenero(perfil.avatar === "mujer" ? "mujer" : "hombre");
      setNombre(perfil.nombre);
      setObjetivo(perfil.objetivo);
      setPesoMeta(perfil.peso_meta);
      setKcalMeta(perfil.kcal_meta);
      setAltura(perfil.altura);
      setEdad(perfil.edad);
    }
  }, [cargando, perfil]);

  // Rango actual del guerrero según progreso
  const rango = calcularRango(prog.nivel, racha, logrosCount);

  async function guardar() {
    // Guarda en la nube (el género va en el campo avatar)
    const ok = await guardarPerfil({
      nombre, avatar: genero, objetivo,
      peso_meta: pesoMeta, kcal_meta: kcalMeta, altura, edad,
    });
    if (ok) {
      setGuardado(true);
      setTimeout(() => setGuardado(false), 1800);
    }
  }

  return (
    <div className="app">
      <style suppressHydrationWarning>{CSS}</style>

      {/* HEADER */}
      <header className="top">
        <button className="back" aria-label="Volver" onClick={() => onBack && onBack()}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="top-title">PERFIL</h1>
        <span className="top-jp">プロフィール</span>
      </header>

      {/* FOTO DE PERFIL (tu identidad) */}
      <section className="panel foto-sec">
        <div className="foto-frame">
          {foto ? (
            <img src={foto} alt="Tu foto" className="foto-img" />
          ) : (
            <div className="foto-vacia"><Camera size={30} /></div>
          )}
          <label className="foto-btn" title="Cambiar foto">
            <Camera size={16} />
            <input type="file" accept="image/*" onChange={elegirFoto} hidden />
          </label>
        </div>
        <p className="current-name">{nombre || "GUERRERO"}</p>
        {foto ? (
          <button className="foto-quitar" onClick={() => setFoto("")}>
            <X size={12} /> Quitar foto
          </button>
        ) : (
          <p className="current-sub">Toca la cámara para poner tu foto</p>
        )}
      </section>

      {/* GUERRERO EVOLUTIVO (tu personaje de progreso) */}
      <section className="panel current">
        <h2 className="card-title">闘 TU GUERRERO</h2>
        <div className="current-frame" style={{ borderColor: rango.cinturon.color }}>
          <GuerreroSVG genero={genero} nivel={prog.nivel} racha={racha} logros={logrosCount} size={130} />
        </div>
        <p className="current-belt">
          Cinturón <b style={{ color: rango.cinturon.color }}>{rango.cinturon.nombre}</b>
        </p>
        {/* Barra de progreso hacia el siguiente cinturón */}
        <div className="belt-bar">
          <div className="belt-fill" style={{ width: `${Math.round(rango.enRango * 100)}%`, background: rango.cinturon.color }} />
        </div>
        <p className="current-sub">
          Nivel {prog.nivel} · Racha {racha}d · {logrosCount} logros
        </p>
      </section>

      {/* SELECTOR DE GÉNERO DEL KIMONO */}
      <section className="panel">
        <h2 className="card-title">姿 TU KIMONO</h2>
        <div className="genero-row">
          <button
            className={`genero-opt ${genero === "hombre" ? "on" : ""}`}
            onClick={() => setGenero("hombre")}
          >
            <GuerreroSVG genero="hombre" nivel={prog.nivel} racha={racha} logros={logrosCount} size={70} />
            <span>Masculino {genero === "hombre" && <Check size={13} />}</span>
          </button>
          <button
            className={`genero-opt ${genero === "mujer" ? "on" : ""}`}
            onClick={() => setGenero("mujer")}
          >
            <GuerreroSVG genero="mujer" nivel={prog.nivel} racha={racha} logros={logrosCount} size={70} />
            <span>Femenino {genero === "mujer" && <Check size={13} />}</span>
          </button>
        </div>
        <p className="hint">Tu guerrero evoluciona con tu nivel, racha y logros. ¡Entrena para subir de cinturón! 🥋</p>
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

        <button className="save-btn" onClick={guardar} disabled={guardando}>
          {guardando ? "GUARDANDO..." : guardado ? "✓ ¡GUARDADO!" : "GUARDAR CAMBIOS"}
        </button>
      </section>

      {onLogros && (
        <button className="logros-btn" onClick={onLogros}>
          🏅 VER LOGROS
        </button>
      )}

      {onCerrarSesion && (
        <button className="logout-btn" onClick={onCerrarSesion}>
          CERRAR SESIÓN
        </button>
      )}
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
  .top { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
  .back { width:38px; height:38px; border-radius:6px; border:2px solid var(--ink);
    background:#241410; color:var(--paper);
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
  .foto-sec { text-align:center; }
  .foto-frame { position:relative; width:110px; height:110px; margin:0 auto 10px; }
  .foto-img { width:110px; height:110px; border-radius:50%; object-fit:cover;
    border:3px solid var(--amber); box-shadow:0 4px 14px #00000066; }
  .foto-vacia { width:110px; height:110px; border-radius:50%; border:3px dashed var(--mut);
    background:#241410; display:flex; align-items:center; justify-content:center; color:var(--mut); }
  .foto-btn { position:absolute; bottom:0; right:0; width:34px; height:34px; border-radius:50%;
    background:linear-gradient(135deg,var(--red),#7a1d13); border:2px solid var(--ink); color:var(--paper);
    display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:2px 2px 0 var(--ink); }
  .foto-quitar { display:inline-flex; align-items:center; gap:4px; margin-top:6px; font-size:11px;
    color:var(--mut); background:none; border:none; cursor:pointer; }
  .foto-quitar:hover { color:var(--red); }
  .current-frame { width:140px; height:175px; margin:0 auto 10px; border:3px solid; border-radius:14px;
    background:#241410; display:flex; align-items:center; justify-content:center; padding:6px;
    box-shadow:0 4px 14px #00000066; }
  .current-name { font-family:'Bebas Neue'; font-size:26px; letter-spacing:2px; color:var(--paper); }
  .current-belt { font-size:14px; color:var(--mut); margin-top:3px; }
  .current-belt b { font-family:'Bebas Neue'; font-size:17px; letter-spacing:1px; }
  .belt-bar { height:8px; background:#1a0f0a; border:2px solid var(--ink); border-radius:4px;
    overflow:hidden; margin:9px auto 7px; max-width:220px; }
  .belt-fill { height:100%; transition:width .4s; }
  .current-sub { font-size:12px; color:var(--mut); }

  .genero-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .genero-opt { display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer;
    background:#241410; border:2px solid var(--ink); border-radius:8px; padding:12px; transition:.12s; }
  .genero-opt:hover { transform:translateY(-2px); }
  .genero-opt.on { border-color:var(--amber); box-shadow:0 0 0 1px var(--amber); }
  .genero-opt span { display:flex; align-items:center; gap:4px; font-size:13px; font-weight:700; color:var(--paper); }
  .hint { font-size:11px; color:var(--mut); margin-top:10px; text-align:center; line-height:1.4; }

  .obj-row { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
  .obj-btn { font-family:'Bebas Neue'; font-size:16px; letter-spacing:1px; padding:12px 4px;
    border:2px solid var(--ink); border-radius:6px; cursor:pointer; color:var(--mut);
    background:#241410; transition:.12s; }
  .obj-btn.on { color:var(--paper); background:linear-gradient(135deg,var(--red),#7a1d13); border-color:var(--amber); }

  .form { display:flex; flex-direction:column; gap:12px; }
  .field { display:flex; flex-direction:column; gap:5px; flex:1; }
  .field span { font-size:11px; letter-spacing:1.5px; color:var(--mut); font-weight:700; }
  .field input { background:#241410; border:2px solid var(--ink); border-radius:6px; padding:10px;
    color:var(--paper); font-family:'Zen Kaku Gothic New'; font-size:15px; font-weight:700; outline:none; }
  .field input:focus { border-color:var(--amber); }
  .field-row { display:flex; gap:10px; }

  .save-btn { width:100%; margin-top:16px; font-family:'Bebas Neue'; font-size:20px; letter-spacing:2px;
    color:var(--paper); cursor:pointer; background:linear-gradient(95deg,var(--red),#a02619);
    border:2px solid var(--ink); padding:12px; border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; }
  .save-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .logros-btn { width:100%; font-family:'Bebas Neue'; font-size:19px; letter-spacing:2px; color:var(--ink);
    cursor:pointer; background:linear-gradient(95deg,var(--gold),#b8923a); border:2px solid var(--ink);
    padding:12px; border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; margin-bottom:11px; }
  .logros-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .logout-btn { width:100%; font-family:'Bebas Neue'; font-size:17px; letter-spacing:2px; color:var(--mut);
    cursor:pointer; background:#241410; border:2px solid var(--ink); padding:11px; border-radius:6px;
    transition:.12s; }
  .logout-btn:hover { color:var(--red); border-color:var(--red); }
`;