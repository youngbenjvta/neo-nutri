"use client";
import React, { useState } from "react";
import { ChevronLeft, Check, Lock } from "lucide-react";
import { useMonedas } from "./useMonedas";
import { useTienda } from "./useTienda";
import { TITULOS, TEMAS_EXTRA } from "./productos";

// ============================================================
//  KAIZEN — Pantalla TIENDA
//  Comprar títulos y temas extra con KAIZEN COINS.
// ============================================================

export default function Tienda({ onBack }: { onBack?: () => void }) {
  const { monedas, sumar: sumarMonedas } = useMonedas();
  const { inventario, comprar, equiparTitulo, equiparTemaExtra, tieneComprado } = useTienda();
  const [tab, setTab] = useState<"titulos" | "temas">("titulos");
  const [mensaje, setMensaje] = useState("");

  async function comprarTitulo(id: string, precio: number) {
    if (tieneComprado(id)) return;
    if (monedas < precio) {
      setMensaje("Te faltan monedas. ¡A entrenar! 💪");
      setTimeout(() => setMensaje(""), 2500);
      return;
    }
    // Restar monedas (cantidad negativa) y marcar comprado
    await sumarMonedas(-precio, "Compra realizada");
    await comprar(id);
    setMensaje("¡Comprado! Toca para equipar 🎉");
    setTimeout(() => setMensaje(""), 2500);
  }

  async function comprarTema(id: string, precio: number) {
    if (tieneComprado(id)) return;
    if (monedas < precio) {
      setMensaje("Te faltan monedas. ¡A entrenar! 💪");
      setTimeout(() => setMensaje(""), 2500);
      return;
    }
    await sumarMonedas(-precio, "Compra realizada");
    await comprar(id);
    setMensaje("¡Tema desbloqueado! Toca para equipar 🎨");
    setTimeout(() => setMensaje(""), 2500);
  }

  return (
    <div className="tienda">
      <style suppressHydrationWarning>{CSS}</style>

      <header className="top">
        <button className="back" onClick={() => onBack && onBack()}><ChevronLeft size={22} /></button>
        <h1 className="top-title">TIENDA</h1>
        <span className="top-jp">店</span>
      </header>

      {/* Saldo grande arriba */}
      <div className="saldo-wrap">
        <div className="saldo">
          <span className="saldo-icono">🪙</span>
          <span className="saldo-num">{monedas}</span>
          <span className="saldo-label">KAIZEN COINS</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tienda-tabs">
        <button className={`tienda-tab ${tab === "titulos" ? "on" : ""}`} onClick={() => setTab("titulos")}>
          🏆 TÍTULOS
        </button>
        <button className={`tienda-tab ${tab === "temas" ? "on" : ""}`} onClick={() => setTab("temas")}>
          🎨 TEMAS EXTRA
        </button>
      </div>

      {/* Mensaje flotante de compra */}
      {mensaje && <div className="tienda-msg">{mensaje}</div>}

      {/* ===== TÍTULOS ===== */}
      {tab === "titulos" && (
        <div className="productos">
          {TITULOS.map((t) => {
            const comprado = tieneComprado(t.id);
            const equipado = inventario.tituloEquipado === t.id;
            const puedeComprar = monedas >= t.precio;

            return (
              <div key={t.id} className={`producto ${equipado ? "equipado" : ""}`} style={{ borderColor: t.color }}>
                <div className="producto-cab">
                  <span className="producto-emoji">{t.emoji}</span>
                  <div className="producto-info">
                    <h3 className="producto-nombre" style={{ color: t.color }}>{t.nombre}</h3>
                    <p className="producto-desc">{t.descripcion}</p>
                  </div>
                </div>

                {comprado ? (
                  <button
                    className={`producto-btn ${equipado ? "btn-equipado" : "btn-equipar"}`}
                    onClick={() => equiparTitulo(t.id)}
                  >
                    {equipado ? (<><Check size={16} /> EQUIPADO</>) : "EQUIPAR"}
                  </button>
                ) : (
                  <button
                    className={`producto-btn ${puedeComprar ? "btn-comprar" : "btn-bloqueado"}`}
                    onClick={() => comprarTitulo(t.id, t.precio)}
                    disabled={!puedeComprar}
                  >
                    {puedeComprar ? `🪙 ${t.precio}` : (<><Lock size={14} /> 🪙 {t.precio}</>)}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== TEMAS EXTRA ===== */}
      {tab === "temas" && (
        <div className="productos">
          {TEMAS_EXTRA.map((t) => {
            const comprado = tieneComprado(t.id);
            const equipado = inventario.temaExtraEquipado === t.id;
            const puedeComprar = monedas >= t.precio;

            return (
              <div
                key={t.id}
                className={`producto ${equipado ? "equipado" : ""}`}
                style={{ borderColor: t.vars["--t-amber"] }}
              >
                <div className="producto-cab">
                  <div className="tema-preview" style={{ background: t.vars["--t-bg2"] }}>
                    <span className="tema-dot" style={{ background: t.vars["--t-red"] }} />
                    <span className="tema-dot" style={{ background: t.vars["--t-amber"] }} />
                    <span className="tema-dot" style={{ background: t.vars["--t-paper"] }} />
                  </div>
                  <div className="producto-info">
                    <h3 className="producto-nombre" style={{ color: t.vars["--t-amber"] }}>
                      {t.emoji} {t.nombre}
                    </h3>
                    <p className="producto-desc">{t.descripcion}</p>
                  </div>
                </div>

                {comprado ? (
                  <button
                    className={`producto-btn ${equipado ? "btn-equipado" : "btn-equipar"}`}
                    onClick={() => equiparTemaExtra(t.id)}
                  >
                    {equipado ? (<><Check size={16} /> EQUIPADO</>) : "EQUIPAR"}
                  </button>
                ) : (
                  <button
                    className={`producto-btn ${puedeComprar ? "btn-comprar" : "btn-bloqueado"}`}
                    onClick={() => comprarTema(t.id, t.precio)}
                    disabled={!puedeComprar}
                  >
                    {puedeComprar ? `🪙 ${t.precio}` : (<><Lock size={14} /> 🪙 {t.precio}</>)}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="tienda-nota">
        Gana monedas entrenando 💪, cumpliendo tu meta de kcal 🍱 y manteniendo tu racha 🔥
      </p>
    </div>
  );
}

const CSS = `
  * { box-sizing:border-box; margin:0; }
  .tienda {
    max-width:460px; margin:0 auto; padding:16px 14px 90px;
    color:var(--txt); font-family:'Zen Kaku Gothic New', sans-serif;
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 8%, var(--glow) 0%, transparent 45%),
      linear-gradient(165deg, var(--bg2), var(--bg1));
    min-height:100vh;
  }
  .top { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
  .back { width:38px; height:38px; border-radius:6px; border:2px solid var(--ink);
    background:linear-gradient(160deg,var(--panel2),var(--panel)); color:var(--paper); cursor:pointer;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .top-title { font-family:'Bebas Neue'; font-size:28px; letter-spacing:2px; flex:1; color:var(--paper); }
  .top-jp { font-size:18px; color:var(--mut); letter-spacing:2px; }

  /* Saldo grande */
  .saldo-wrap { display:flex; justify-content:center; margin-bottom:18px; }
  .saldo { display:flex; align-items:center; gap:10px; padding:14px 22px;
    background:linear-gradient(95deg,#d4a84a,#b8923a);
    border:3px solid var(--ink); border-radius:14px; box-shadow:4px 4px 0 var(--ink); }
  .saldo-icono { font-size:30px; }
  .saldo-num { font-family:'Bebas Neue'; font-size:34px; letter-spacing:1px; color:#3a1a0a; line-height:1; }
  .saldo-label { font-size:11px; font-weight:900; letter-spacing:1.5px; color:#3a1a0a; }

  /* Tabs */
  .tienda-tabs { display:flex; gap:6px; margin-bottom:14px; }
  .tienda-tab { flex:1; padding:11px 6px; cursor:pointer; font-family:'Bebas Neue'; font-size:15px;
    letter-spacing:1.5px; background:var(--panel); border:2px solid var(--ink); border-radius:6px;
    color:var(--mut); transition:.12s; }
  .tienda-tab.on { color:var(--paper); background:linear-gradient(95deg,var(--red),#7a1d13); }

  /* Mensaje flotante */
  .tienda-msg { position:fixed; top:80px; left:50%; transform:translateX(-50%); z-index:100;
    padding:12px 20px; background:linear-gradient(95deg,var(--amber),#b8801f); border:2px solid var(--ink);
    border-radius:8px; color:var(--ink); font-weight:900; font-size:13px;
    box-shadow:3px 3px 0 var(--ink); animation: msgPop .3s ease-out; }
  @keyframes msgPop { from { opacity:0; transform:translate(-50%,-10px); } to { opacity:1; transform:translate(-50%,0); } }

  /* Productos */
  .productos { display:flex; flex-direction:column; gap:10px; }
  .producto { padding:14px; background:var(--panel); border:2px solid var(--ink); border-radius:8px;
    transition:.2s; }
  .producto.equipado { background:linear-gradient(160deg,var(--panel2),var(--panel));
    box-shadow:0 0 0 2px var(--amber) inset; }
  .producto-cab { display:flex; gap:12px; align-items:center; margin-bottom:10px; }
  .producto-emoji { font-size:36px; flex-shrink:0; }
  .producto-info { flex:1; }
  .producto-nombre { font-family:'Bebas Neue'; font-size:19px; letter-spacing:1px; line-height:1;
    margin-bottom:3px; }
  .producto-desc { font-size:12px; color:var(--mut); font-style:italic; }

  /* Preview de tema */
  .tema-preview { display:flex; gap:4px; padding:9px 11px; border-radius:6px; border:2px solid var(--ink);
    flex-shrink:0; }
  .tema-dot { width:10px; height:10px; border-radius:50%; }

  /* Botones */
  .producto-btn { width:100%; padding:11px; cursor:pointer; font-family:'Bebas Neue';
    font-size:15px; letter-spacing:1.5px; border:2px solid var(--ink); border-radius:6px;
    display:flex; align-items:center; justify-content:center; gap:6px; transition:.1s; }
  .btn-comprar { background:linear-gradient(95deg,var(--amber),#b8801f); color:var(--ink);
    box-shadow:2px 2px 0 var(--ink); }
  .btn-comprar:active { transform:translate(2px,2px); box-shadow:none; }
  .btn-bloqueado { background:var(--bg2); color:var(--mut); cursor:default; }
  .btn-equipar { background:linear-gradient(95deg,#3f7d6e,#2c5d51); color:var(--paper);
    box-shadow:2px 2px 0 var(--ink); }
  .btn-equipar:active { transform:translate(2px,2px); box-shadow:none; }
  .btn-equipado { background:var(--bg2); color:var(--amber); border-color:var(--amber); cursor:default; }

  .tienda-nota { font-size:11px; color:var(--mut); text-align:center; margin-top:18px; font-style:italic;
    line-height:1.5; }
`;