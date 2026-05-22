"use client";
import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "./supabaseClient";

// ============================================================
//  NEO NUTRI — NUEVA CONTRASEÑA
//  Aparece cuando el usuario llega desde el enlace de
//  recuperación del correo. Define su nueva contraseña.
// ============================================================

export default function NuevaContrasena({ onListo }: { onListo?: () => void }) {
  const [pass, setPass] = useState("");
  const [ver, setVer] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  async function guardar() {
    setError("");
    if (pass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setCargando(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pass });
      if (error) {
        setError("No se pudo cambiar la contraseña. El enlace pudo expirar.");
      } else {
        setOk(true);
        setTimeout(() => onListo && onListo(), 1800);
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
        <h1 className="auth-brand">NUEVA CLAVE</h1>
        <span className="auth-jp">新しいパスワード</span>
        <p className="auth-tagline">Crea tu nueva contraseña, guerrero.</p>

        <label className="auth-field">
          <Lock size={16} />
          <input
            type={ver ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="new-password"
          />
          <button type="button" className="ver-pass" onClick={() => setVer(!ver)} aria-label="Mostrar u ocultar">
            {ver ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </label>

        {error && <p className="auth-error">{error}</p>}
        {ok && <p className="auth-ok">¡Contraseña actualizada! Entrando...</p>}

        <button className="auth-btn" onClick={guardar} disabled={cargando}>
          {cargando ? "..." : "GUARDAR CONTRASEÑA"}
        </button>
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
    width:100%; max-width:400px; text-align:center;
    background:linear-gradient(160deg,#32201a,#2a1812);
    border:2px solid var(--ink); border-radius:10px; padding:28px 22px;
    box-shadow:6px 6px 0 #00000066;
  }
  .auth-brand { font-family:'Bebas Neue'; font-size:38px; letter-spacing:2px; color:var(--paper);
    text-shadow:3px 3px 0 var(--red); line-height:1; }
  .auth-jp { font-size:11px; color:var(--mut); letter-spacing:3px; }
  .auth-tagline { font-size:13px; color:var(--mut); margin:10px 0 20px; }
  .auth-field { display:flex; align-items:center; gap:9px; background:#1c1410;
    border:2px solid var(--ink); border-radius:6px; padding:11px 12px; margin-bottom:11px; text-align:left; }
  .auth-field svg { color:var(--mut); flex-shrink:0; }
  .auth-field input { flex:1; background:none; border:none; outline:none; color:var(--paper);
    font-family:'Zen Kaku Gothic New'; font-size:15px; font-weight:700; }
  .auth-field:focus-within { border-color:var(--amber); }
  .ver-pass { background:none; border:none; cursor:pointer; color:var(--mut); display:flex;
    align-items:center; padding:0; flex-shrink:0; }
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
`;