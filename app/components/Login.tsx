"use client";
import React, { useState } from "react";
import { Flame, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "./supabaseClient";

// ============================================================
//  NEO NUTRI — LOGIN / REGISTRO (shonen pintado)
//  Inicia sesión o crea cuenta con Supabase Auth.
// ============================================================

export default function Login({ onEntrar }: { onEntrar?: () => void }) {
  const [modo, setModo] = useState<"login" | "registro" | "recuperar">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function enviar() {
    setError("");
    setMensaje("");

    // El modo recuperar solo necesita el correo (no contraseña)
    if (modo === "recuperar") {
      if (!email.trim()) {
        setError("Escribe tu correo para recuperar la contraseña.");
        return;
      }
      setCargando(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/?recuperar=1`,
        });
        if (error) {
          setError("No se pudo enviar el correo. Verifica el email.");
        } else {
          setMensaje("¡Listo! Revisa tu correo para restablecer tu contraseña.");
        }
      } catch {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
      setCargando(false);
      return;
    }

    // Login y registro sí necesitan contraseña
    if (!email.trim() || !pass.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }
    setCargando(true);
    try {
      if (modo === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          setError("Correo o contraseña incorrectos.");
        } else {
          onEntrar && onEntrar();
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) {
          setError(error.message.includes("already") ? "Ese correo ya está registrado." : "No se pudo crear la cuenta.");
        } else {
          setMensaje("¡Cuenta creada! Revisa tu correo para confirmar, luego inicia sesión.");
          setModo("login");
        }
      }
    } catch {
      setError("Ocurrió un error. Intenta de nuevo.");
    }
    setCargando(false);
  }

  return (
    <div className="auth">
      <style suppressHydrationWarning>{CSS}</style>

      <div className="auth-box">
        {/* LOGO */}
        <div className="auth-logo">
          <Flame size={36} className="auth-flame" />
          <h1 className="auth-brand">NEO NUTRI</h1>
          <span className="auth-jp">ネオニュートリ</span>
        </div>

        <p className="auth-tagline">
          {modo === "login" ? "Bienvenido de vuelta, guerrero."
            : modo === "registro" ? "Únete a la batalla, guerrero."
            : "Recupera tu acceso, guerrero."}
        </p>

        {/* PESTAÑAS */}
        <div className="auth-tabs">
          <button className={`auth-tab ${modo === "login" ? "on" : ""}`} onClick={() => { setModo("login"); setError(""); setMensaje(""); }}>
            INICIAR SESIÓN
          </button>
          <button className={`auth-tab ${modo === "registro" ? "on" : ""}`} onClick={() => { setModo("registro"); setError(""); setMensaje(""); }}>
            CREAR CUENTA
          </button>
        </div>

        {/* FORMULARIO */}
        <label className="auth-field">
          <Mail size={16} />
          <input
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        {modo !== "recuperar" && (
          <label className="auth-field">
            <Lock size={16} />
            <input
              type={verPass ? "text" : "password"}
              placeholder="Tu contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete={modo === "login" ? "current-password" : "new-password"}
            />
            <button type="button" className="ver-pass" onClick={() => setVerPass(!verPass)} aria-label="Mostrar u ocultar contraseña">
              {verPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
        )}

        {error && <p className="auth-error">{error}</p>}
        {mensaje && <p className="auth-ok">{mensaje}</p>}

        <button className="auth-btn" onClick={enviar} disabled={cargando}>
          {cargando ? "..." : modo === "login" ? "ENTRAR" : modo === "registro" ? "CREAR CUENTA" : "ENVIAR CORREO"}
        </button>

        {/* Enlace de "olvidé mi contraseña" (solo en login) */}
        {modo === "login" && (
          <p className="auth-olvido">
            <button onClick={() => { setModo("recuperar"); setError(""); setMensaje(""); }}>
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        <p className="auth-switch">
          {modo === "recuperar" ? "¿Recordaste tu contraseña? "
            : modo === "login" ? "¿No tienes cuenta? "
            : "¿Ya tienes cuenta? "}
          <button onClick={() => {
            setModo(modo === "login" ? "registro" : "login");
            setError(""); setMensaje("");
          }}>
            {modo === "recuperar" ? "Volver a iniciar sesión"
              : modo === "login" ? "Créala aquí"
              : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}

const CSS = `
  * { box-sizing: border-box; margin: 0; }
  .auth {
    --paper:#f6e9c8; --ink:#0d0805; --red:#d23b2e; --amber:#e8a13a; --gold:#d4a84a;
    --txt:#f3e6cd; --mut:#b09a7e;
    min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px;
    font-family:'Zen Kaku Gothic New', sans-serif; color:var(--txt);
    background:
      radial-gradient(#00000022 1px, transparent 1.5px) 0 0 / 8px 8px,
      radial-gradient(circle at 50% 20%, #5a2a1e 0%, transparent 55%),
      linear-gradient(165deg, #241410, #1a0f0a);
  }
  .auth-box {
    width:100%; max-width:400px;
    background:linear-gradient(160deg,#32201a,#2a1812);
    border:2px solid var(--ink); border-radius:10px; padding:28px 22px;
    box-shadow:6px 6px 0 #00000066;
  }
  .auth-logo { text-align:center; margin-bottom:6px; }
  .auth-flame { color:var(--amber); }
  .auth-brand { font-family:'Bebas Neue'; font-size:38px; letter-spacing:2px; color:var(--paper);
    text-shadow:3px 3px 0 var(--red); line-height:1; margin-top:4px; }
  .auth-jp { font-size:11px; color:var(--mut); letter-spacing:3px; }
  .auth-tagline { text-align:center; font-size:13px; color:var(--mut); margin:10px 0 20px; }

  .auth-tabs { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:18px; }
  .auth-tab { font-family:'Bebas Neue'; font-size:14px; letter-spacing:1px; padding:10px 4px;
    border:2px solid var(--ink); border-radius:6px; cursor:pointer; color:var(--mut);
    background:#241410; transition:.12s; }
  .auth-tab.on { color:var(--paper); background:linear-gradient(135deg,var(--red),#7a1d13); border-color:var(--amber); }

  .auth-field { display:flex; align-items:center; gap:9px; background:#1c1410;
    border:2px solid var(--ink); border-radius:6px; padding:11px 12px; margin-bottom:11px; }
  .auth-field svg { color:var(--mut); flex-shrink:0; }
  .auth-field input { flex:1; background:none; border:none; outline:none; color:var(--paper);
    font-family:'Zen Kaku Gothic New'; font-size:15px; font-weight:700; }
  .auth-field:focus-within { border-color:var(--amber); }
  .ver-pass { background:none; border:none; cursor:pointer; color:var(--mut); display:flex;
    align-items:center; padding:0; flex-shrink:0; transition:.12s; }
  .ver-pass:hover { color:var(--amber); }

  .auth-error { font-size:13px; color:#ff6b5e; background:#3a1410; border:2px solid #d23b2e;
    border-radius:6px; padding:9px 11px; margin-bottom:11px; }
  .auth-ok { font-size:13px; color:#7fd6a0; background:#10301f; border:2px solid #3f7d6e;
    border-radius:6px; padding:9px 11px; margin-bottom:11px; }

  .auth-btn { width:100%; font-family:'Bebas Neue'; font-size:21px; letter-spacing:2px; color:var(--paper);
    cursor:pointer; background:linear-gradient(95deg,var(--red),#a02619); border:2px solid var(--ink);
    padding:13px; border-radius:6px; box-shadow:3px 3px 0 var(--ink); transition:.1s; margin-top:4px; }
  .auth-btn:active { transform:translate(3px,3px); box-shadow:none; }
  .auth-btn:disabled { opacity:.6; cursor:default; }

  .auth-switch { text-align:center; font-size:13px; color:var(--mut); margin-top:16px; }
  .auth-olvido { text-align:center; margin-top:12px; }
  .auth-olvido button { background:none; border:none; color:var(--mut); cursor:pointer;
    font-family:'Zen Kaku Gothic New'; font-size:12px; text-decoration:underline; }
  .auth-olvido button:hover { color:var(--amber); }
  .auth-switch button { background:none; border:none; color:var(--amber); cursor:pointer;
    font-family:'Zen Kaku Gothic New'; font-size:13px; font-weight:700; text-decoration:underline; }
`;