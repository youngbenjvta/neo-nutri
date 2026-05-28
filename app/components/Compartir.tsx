"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, Download, Share2, Flame, Dumbbell, Award, Sparkles } from "lucide-react";
import { useProgreso } from "./useProgreso";
import { useRacha } from "./useRacha";
import { usePersistedState } from "./usePersistedState";
import { YunsSVG } from "./Yuns";
import { calcularRango, GuerreroSVG } from "./Guerrero";

// ============================================================
//  KAIZEN — COMPARTIR PROGRESO
//  Genera una imagen vertical (estilo Instagram Story 9:16)
//  con todos los stats del usuario para compartir.
//  Usa html2canvas para convertir el HTML en PNG.
// ============================================================

export default function Compartir({ onBack }: { onBack?: () => void }) {
  const { prog } = useProgreso();
  const { racha } = useRacha();
  const [nombre] = usePersistedState("perfil.nombre", "GUERRERO");
  const [genero] = usePersistedState<"hombre" | "mujer">("perfil.avatar", "hombre");
  const [logrosCount] = usePersistedState("logros.desbloqueados", 0);

  const tarjetaRef = useRef<HTMLDivElement>(null);
  const [generando, setGenerando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Rango del guerrero (cinturón) según nivel/racha/logros
  const rango = calcularRango(prog.nivel, racha, logrosCount);

  async function compartir() {
    if (!tarjetaRef.current) return;
    setGenerando(true);
    setMensaje("");
    try {
      // Cargar html2canvas dinámicamente (solo cuando se usa)
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(tarjetaRef.current, {
        backgroundColor: null,
        scale: 2, // alta calidad
        logging: false,
        useCORS: true,
      });

      // Convertir a blob para compartir
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          setMensaje("No se pudo generar la imagen");
          setGenerando(false);
          return;
        }
        const archivo = new File([blob], "kaizen-progreso.png", { type: "image/png" });

        // Probar API nativa de compartir del celular
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [archivo] })) {
          try {
            await navigator.share({
              files: [archivo],
              title: "Mi progreso en KAIZEN",
              text: "Mi progreso entrenando con KAIZEN 🦊🔥",
            });
            setMensaje("¡Compartido!");
          } catch {
            // Cancelado por el usuario, no es error
          }
        } else {
          // Fallback: descargar la imagen
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "kaizen-progreso.png";
          a.click();
          URL.revokeObjectURL(url);
          setMensaje("¡Imagen descargada! Ya puedes compartirla 📤");
        }
      }, "image/png");
    } catch {
      setMensaje("Error al generar. Intenta de nuevo.");
    }
    setGenerando(false);
  }

  return (
    <div className="comp">
      <style suppressHydrationWarning>{CSS}</style>
      <header className="top">
        <button className="back" onClick={() => onBack && onBack()}><ChevronLeft size={22} /></button>
        <h1 className="top-title">COMPARTIR</h1>
        <span className="top-jp">共有</span>
      </header>

      <p className="comp-hint">Comparte tu progreso con tus amigos 🦊✨</p>

      {/* ===== TARJETA QUE SE CONVIERTE EN IMAGEN ===== */}
      <div className="tarjeta-wrap">
        <div ref={tarjetaRef} className="tarjeta">
          {/* Fondo y marco */}
          <div className="t-marco">
            {/* Logo KAIZEN arriba */}
            <div className="t-logo">
              <span className="t-kanji">改善</span>
              <h2 className="t-brand">KAIZEN</h2>
            </div>

            {/* Yuns + Guerrero */}
            <div className="t-figs">
              <div className="t-fig"><YunsSVG size={90} /></div>
              <div className="t-fig"><GuerreroSVG genero={genero} nivel={prog.nivel} racha={racha} logros={logrosCount} size={130} /></div>
            </div>

            {/* Nombre y rango */}
            <div className="t-nombre">
              <span className="t-saludo">SOY</span>
              <h3 className="t-name">{nombre}</h3>
              <div className="t-rango" style={{ background: rango.cinturon.color }}>
                <span>{rango.cinturon.nombre}</span>
              </div>
            </div>

            {/* Stats principales */}
            <div className="t-stats">
              <div className="t-stat">
                <Sparkles size={20} />
                <b>{prog.nivel}</b>
                <span>NIVEL</span>
              </div>
              <div className="t-stat">
                <Flame size={20} />
                <b>{racha}</b>
                <span>RACHA</span>
              </div>
              <div className="t-stat">
                <Dumbbell size={20} />
                <b>{prog.entrenos}</b>
                <span>ENTRENOS</span>
              </div>
              <div className="t-stat">
                <Award size={20} />
                <b>{logrosCount}</b>
                <span>LOGROS</span>
              </div>
            </div>

            {/* Frase motivadora */}
            <p className="t-frase">"La constancia vence al talento"</p>

            {/* Footer */}
            <div className="t-footer">
              <span>改善 · MEJORA CONTINUA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón compartir */}
      <button className="comp-btn" onClick={compartir} disabled={generando}>
        {generando ? "GENERANDO..." : (<>
          <Share2 size={18} /> COMPARTIR PROGRESO
        </>)}
      </button>

      {mensaje && <p className="comp-msg">{mensaje}</p>}

      <p className="comp-nota">
        Se generará una imagen lista para compartir en Instagram, WhatsApp y más. 📱
      </p>
    </div>
  );
}

const CSS = `
  * { box-sizing:border-box; margin:0; }
  .comp {
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
  .top-title { font-family:'Bebas Neue'; font-size:26px; letter-spacing:2px; flex:1; }
  .top-jp { font-size:12px; color:var(--mut); letter-spacing:2px; }
  .comp-hint { font-size:13px; color:var(--mut); text-align:center; margin-bottom:14px; font-style:italic; }

  /* ===== TARJETA COMPARTIBLE (relación 9:16, estilo story) ===== */
  .tarjeta-wrap { display:flex; justify-content:center; margin-bottom:18px; }
  .tarjeta { width:100%; max-width:340px; aspect-ratio:9/16;
    border-radius:18px; overflow:hidden; box-shadow:0 12px 40px #00000099; }
  .t-marco { width:100%; height:100%; padding:24px 18px; display:flex; flex-direction:column; align-items:center;
    background:
      radial-gradient(circle at 50% 12%, #6b3220 0%, transparent 55%),
      radial-gradient(circle at 50% 90%, var(--panel2) 0%, transparent 50%),
      linear-gradient(170deg, var(--panel), var(--bg1));
    border:3px solid var(--amber); position:relative; }
  .t-marco::before { content:""; position:absolute; inset:8px; border:1px solid var(--amber)55; border-radius:10px; pointer-events:none; }

  .t-logo { text-align:center; margin-bottom:8px; }
  .t-kanji { font-family:'Bebas Neue'; font-size:18px; color:var(--amber); letter-spacing:6px; display:block; }
  .t-brand { font-family:'Bebas Neue'; font-size:32px; letter-spacing:4px; color:var(--paper);
    text-shadow:2px 2px 0 var(--red); line-height:1; }

  .t-figs { display:flex; align-items:flex-end; gap:8px; margin:10px 0 4px; }
  .t-fig { filter:drop-shadow(2px 3px 0 #00000066); }

  .t-nombre { text-align:center; margin-bottom:14px; }
  .t-saludo { font-family:'Bebas Neue'; font-size:13px; letter-spacing:3px; color:var(--mut); display:block; }
  .t-name { font-family:'Bebas Neue'; font-size:26px; letter-spacing:2px; color:var(--paper); line-height:1; margin:2px 0 6px;
    text-shadow:2px 2px 0 var(--ink); }
  .t-rango { display:inline-block; padding:4px 12px; border-radius:14px; border:2px solid var(--ink);
    font-family:'Bebas Neue'; font-size:13px; letter-spacing:2px; color:var(--ink); }

  .t-stats { display:grid; grid-template-columns:1fr 1fr; gap:8px; width:100%; margin-bottom:12px; }
  .t-stat { display:flex; flex-direction:column; align-items:center; padding:8px 4px; gap:2px;
    background:var(--bg1); border:2px solid var(--ink); border-radius:7px; color:var(--amber); }
  .t-stat b { font-family:'Bebas Neue'; font-size:24px; color:var(--paper); line-height:1; }
  .t-stat span { font-size:9px; letter-spacing:1px; color:var(--mut); font-weight:700; }

  .t-frase { font-size:12px; color:var(--txt); font-style:italic; text-align:center; margin-bottom:10px; opacity:.9; }
  .t-footer { font-family:'Bebas Neue'; font-size:11px; letter-spacing:3px; color:var(--amber); text-align:center; }

  /* Botones */
  .comp-btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%;
    font-family:'Bebas Neue'; font-size:21px; letter-spacing:2px; color:var(--paper); cursor:pointer;
    background:linear-gradient(95deg,var(--red),var(--red)); border:2px solid var(--ink);
    padding:14px; border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; margin-bottom:10px; }
  .comp-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .comp-btn:disabled { opacity:.6; cursor:default; }
  .comp-msg { text-align:center; font-size:13px; font-weight:700; color:var(--amber); margin-bottom:10px; }
  .comp-nota { font-size:11px; color:var(--mut); text-align:center; font-style:italic; line-height:1.4; }
`;