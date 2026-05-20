"use client";
import React, { useState } from "react";
import {
  Home, Dumbbell, Salad, TrendingUp, User, Flame
} from "lucide-react";
import Dashboard from "./Dashboard";
import Porciones from "./Porciones";
import Perfil from "./Perfil";
import Rutinas from "./Rutinas";
import Comida from "./Comida";

// ============================================================
//  NEO NUTRI — MainApp (el "cerebro" de navegación)
//  Recuerda qué pantalla está activa y muestra la correcta.
// ============================================================

// Pantalla temporal para las secciones que aún no existen.
function ProntoScreen({ titulo, jp }: { titulo: string; jp: string }) {
  return (
    <div className="pronto">
      <style>{PRONTO_CSS}</style>
      <Flame size={48} className="pronto-ic" />
      <h1 className="pronto-title">{titulo}</h1>
      <span className="pronto-jp">{jp}</span>
      <p className="pronto-msg">PRÓXIMAMENTE</p>
      <p className="pronto-sub">Esta sección se está forjando, guerrero.</p>
    </div>
  );
}

const TABS = [
  { id: "inicio", icon: Home, label: "Inicio" },
  { id: "rutinas", icon: Dumbbell, label: "Rutinas" },
  { id: "comida", icon: Salad, label: "Comida" },
  { id: "progreso", icon: TrendingUp, label: "Progreso" },
  { id: "perfil", icon: User, label: "Perfil" },
];

export default function MainApp() {
  // 'screen' recuerda qué pantalla mostrar. Empieza en 'inicio'.
  const [screen, setScreen] = useState("inicio");

  // Decide qué componente mostrar según 'screen'.
  function renderScreen() {
    switch (screen) {
      case "inicio":
        // Le pasamos 'setScreen' para que el menú del dashboard pueda navegar.
        return <Dashboard onNavigate={setScreen} />;
      case "porciones":
        return <Porciones onBack={() => setScreen("inicio")} />;
      case "rutinas":
        return <Rutinas onBack={() => setScreen("inicio")} />;
      case "comida":
        return <Comida onBack={() => setScreen("inicio")} />;
      case "progreso":
        return <ProntoScreen titulo="PROGRESO" jp="進捗" />;
      case "perfil":
        return <Perfil onBack={() => setScreen("inicio")} />;
      default:
        return <Dashboard onNavigate={setScreen} />;
    }
  }

  // La barra inferior marca como activa la pestaña correspondiente.
  // (Porciones no está en la barra, así que cae bajo 'inicio'.)
  const activeTab = TABS.some((t) => t.id === screen) ? screen : "inicio";

  return (
    <div className="shell">
      <style>{SHELL_CSS}</style>

      <div className="screen-area">{renderScreen()}</div>

      <nav className="bottom-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-item ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setScreen(t.id)}
          >
            <t.icon size={20} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const SHELL_CSS = `
  .shell { position:relative; }
  .screen-area { padding-bottom:70px; }
  .bottom-nav {
    position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:460px;
    display:flex; justify-content:space-around; padding:9px 6px 13px;
    background:linear-gradient(0deg,#0d0805,#1a0f0a); border-top:2px solid #d23b2e; z-index:50;
    font-family:'Zen Kaku Gothic New', sans-serif;
  }
  .bottom-nav .nav-item { display:flex; flex-direction:column; align-items:center; gap:3px;
    background:none; border:none; color:#b09a7e; cursor:pointer; font-size:10px; letter-spacing:1px; font-weight:700; }
  .bottom-nav .nav-item.active { color:#e8a13a; }
`;

const PRONTO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Zen+Kaku+Gothic+New:wght@500;700;900&display=swap');
  .pronto {
    max-width:460px; margin:0 auto; min-height:100vh; padding:16px 14px 92px;
    display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
    color:#f3e6cd; font-family:'Zen Kaku Gothic New', sans-serif;
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 30%, #5a2a1e 0%, transparent 50%),
      linear-gradient(165deg, #241410, #1a0f0a);
  }
  .pronto-ic { color:#e8a13a; margin-bottom:8px; }
  .pronto-title { font-family:'Bebas Neue'; font-size:42px; letter-spacing:3px; color:#f6e9c8; }
  .pronto-jp { font-size:14px; color:#b09a7e; letter-spacing:4px; margin-bottom:24px; }
  .pronto-msg { font-family:'Bebas Neue'; font-size:24px; letter-spacing:4px; color:#d23b2e; margin-top:16px; }
  .pronto-sub { font-size:13px; color:#b09a7e; margin-top:6px; }
`;