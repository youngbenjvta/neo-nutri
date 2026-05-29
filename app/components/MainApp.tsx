"use client";
import React, { useState, useEffect } from "react";
import {
  Home, Dumbbell, Salad, TrendingUp, User, Flame
} from "lucide-react";
import Dashboard from "./Dashboard";
import Porciones from "./Porciones";
import Perfil from "./Perfil";
import Rutinas from "./Rutinas";
import Comida from "./Comida";
import Progreso from "./Progreso";
import Logros from "./Logros";
import Login from "./Login";
import NuevaContrasena from "./NuevaContrasena";
import YunsFlotante from "./YunsFlotante";
import Cronometro from "./Cronometro";
import MonedasAnimacion from "./MonedasAnimacion";
import Intro from "./Intro";
import Asistente from "./Asistente";
import Compartir from "./Compartir";
import { useTema } from "./temas";
import { supabase } from "./supabaseClient";

// ============================================================
//  NUT-KAIZEN — MainApp (el "cerebro" de navegación)
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
  // Activa el sistema de temas (aplica los colores guardados al cargar)
  useTema();

  // 'screen' recuerda qué pantalla mostrar. Empieza en 'inicio'.
  const [screen, setScreen] = useState("inicio");

  // Sesión del usuario: null = no logueado, objeto = logueado, undefined = aún verificando
  const [sesion, setSesion] = useState<object | null | undefined>(undefined);

  // ¿El usuario llegó desde el enlace de recuperación de contraseña?
  const [recuperando, setRecuperando] = useState(false);

  // ¿Mostrar la introducción? (solo la primera vez)
  const [verIntro, setVerIntro] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("kaizen.introVista")) setVerIntro(true);
    } catch { /* nada */ }
  }, []);

  useEffect(() => {
    // Detectar si venimos del enlace de recuperación (?recuperar=1 en la URL)
    if (typeof window !== "undefined" && window.location.search.includes("recuperar=1")) {
      setRecuperando(true);
    }
    // Al cargar: revisar si ya hay sesión activa
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
    });
    // Escuchar cambios de sesión (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((evento, nuevaSesion) => {
      setSesion(nuevaSesion);
      // Si Supabase nos avisa que es recuperación, mostramos la pantalla
      if (evento === "PASSWORD_RECOVERY") setRecuperando(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setScreen("inicio");
  }

  // Función para terminar la recuperación: limpia la URL y vuelve a la app
  function terminarRecuperacion() {
    setRecuperando(false);
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }

  // Mientras verifica la sesión, mostramos un cargando simple
  if (sesion === undefined) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#1a0f0a", color: "#e8a13a", fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2 }}>
        CARGANDO...
      </div>
    );
  }

  // Si venimos del enlace de recuperación, mostramos la pantalla de nueva contraseña
  if (recuperando) {
    return <NuevaContrasena onListo={terminarRecuperacion} />;
  }

  // Si NO hay sesión, mostramos el login
  if (!sesion) {
    return <Login onEntrar={() => { /* el listener actualiza la sesión solo */ }} />;
  }

  // La primera vez (ya logueado), mostramos la introducción
  if (verIntro) {
    return <Intro onListo={() => setVerIntro(false)} />;
  }

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
        return <Progreso onBack={() => setScreen("inicio")} />;
      case "perfil":
        return <Perfil onBack={() => setScreen("inicio")} onCerrarSesion={cerrarSesion} onLogros={() => setScreen("logros")} onCompartir={() => setScreen("compartir")} />;
      case "logros":
        return <Logros onBack={() => setScreen("perfil")} />;
      case "asistente":
        return <Asistente onBack={() => setScreen("inicio")} />;
      case "compartir":
        return <Compartir onBack={() => setScreen("perfil")} />;
      default:
        return <Dashboard onNavigate={setScreen} />;
    }
  }

  // La barra inferior marca como activa la pestaña correspondiente.
  // (Porciones no está en la barra, así que cae bajo 'inicio'.)
  const activeTab = TABS.some((t) => t.id === screen) ? screen : "inicio";

  return (
    <div className="shell" suppressHydrationWarning>
      <style suppressHydrationWarning>{SHELL_CSS}</style>

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

      {/* Yuns flotante: presente en toda la app */}
      <YunsFlotante />

      {/* Cronómetro de descanso: presente en toda la app */}
      <Cronometro />

      {/* Animación '+X monedas' cuando ganas KAIZEN COINS */}
      <MonedasAnimacion />
    </div>
  );
}

const SHELL_CSS = `
  /* ===== SISTEMA DE TEMAS =====
     Variables del tema. KAIZEN por defecto (se ven incluso antes de que useTema corra).
     Cuando el hook aplica un tema diferente, sobreescribe las --t-* y todo sigue funcionando. */
  :root {
    --t-bg1: #1a0f0a; --t-bg2: #241410; --t-panel: #2a1812; --t-panel2: #32201a;
    --t-paper: #f6e9c8; --t-ink: #0d0805;
    --t-red: #d23b2e; --t-amber: #e8a13a; --t-gold: #d4a84a; --t-teal: #3f7d6e;
    --t-txt: #f3e6cd; --t-mut: #b09a7e; --t-glow: #5a2a1e;

    --bg1: var(--t-bg1); --bg2: var(--t-bg2);
    --panel: var(--t-panel); --panel2: var(--t-panel2);
    --paper: var(--t-paper); --ink: var(--t-ink);
    --red: var(--t-red); --amber: var(--t-amber);
    --gold: var(--t-gold); --teal: var(--t-teal);
    --txt: var(--t-txt); --mut: var(--t-mut);
  }
  body { background: var(--t-bg1); transition: background .3s; }

  .shell { position:relative; }
  .screen-area { padding-bottom:70px; }
  .bottom-nav {
    position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:460px;
    display:flex; justify-content:space-around; padding:9px 6px 13px;
    background:linear-gradient(0deg,var(--t-ink),var(--t-bg1)); border-top:2px solid var(--t-red); z-index:50;
  }
  .bottom-nav .nav-item { display:flex; flex-direction:column; align-items:center; gap:3px;
    background:none; border:none; color:var(--t-mut); cursor:pointer; font-size:10px; letter-spacing:1px; font-weight:700; }
  .bottom-nav .nav-item.active { color:var(--t-amber); }
`;

const PRONTO_CSS = `
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