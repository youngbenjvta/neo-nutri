"use client";
import React, { useEffect, useState } from "react";
import { EVENTO_GANASTE, type EventoGanaste } from "./useMonedas";

// ============================================================
//  Animación "+X 🪙" flotante cuando ganas monedas.
//  Escucha el evento global EVENTO_GANASTE.
// ============================================================

type Notif = {
  id: number;
  cantidad: number;
  razon: string;
};

export default function MonedasAnimacion() {
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    function escuchar(e: Event) {
      const detalle = (e as CustomEvent<EventoGanaste>).detail;
      const id = Date.now() + Math.random();
      setNotifs((n) => [...n, { id, cantidad: detalle.cantidad, razon: detalle.razon }]);
      // Quitar después de la animación
      setTimeout(() => {
        setNotifs((n) => n.filter((x) => x.id !== id));
      }, 2800);
    }
    window.addEventListener(EVENTO_GANASTE, escuchar);
    return () => window.removeEventListener(EVENTO_GANASTE, escuchar);
  }, []);

  if (notifs.length === 0) return null;

  return (
    <>
      <style suppressHydrationWarning>{CSS}</style>
      <div className="monedas-stack">
        {notifs.map((n, i) => (
          <div key={n.id} className="moneda-flotante" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="moneda-icono">🪙</div>
            <div className="moneda-info">
              <b className="moneda-num">+{n.cantidad}</b>
              <span className="moneda-razon">{n.razon}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const CSS = `
  .monedas-stack {
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    z-index:10000; pointer-events:none; display:flex; flex-direction:column; gap:8px;
  }
  .moneda-flotante {
    display:flex; align-items:center; gap:10px; padding:12px 18px;
    background:linear-gradient(95deg, #d4a84a, #b8923a);
    border:3px solid #0d0805; border-radius:12px; box-shadow:0 6px 20px #00000099;
    color:#0d0805; animation: monedaPop 2.8s ease-out forwards;
  }
  .moneda-icono { font-size:32px; line-height:1; animation: monedaSpin 1.2s ease-in-out; }
  .moneda-info { display:flex; flex-direction:column; }
  .moneda-num { font-family:'Bebas Neue'; font-size:26px; letter-spacing:1px; line-height:1; color:#3a1a0a; }
  .moneda-razon { font-size:11px; font-weight:700; letter-spacing:.5px; }

  @keyframes monedaPop {
    0% { opacity:0; transform:scale(.5) translateY(20px); }
    10% { opacity:1; transform:scale(1.15) translateY(0); }
    20% { transform:scale(1) translateY(0); }
    80% { opacity:1; transform:scale(1) translateY(-10px); }
    100% { opacity:0; transform:scale(.9) translateY(-30px); }
  }
  @keyframes monedaSpin {
    0% { transform:rotateY(0); }
    100% { transform:rotateY(720deg); }
  }
`;