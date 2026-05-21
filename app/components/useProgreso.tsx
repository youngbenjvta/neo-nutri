"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
//  useProgreso — progreso del guerrero EN LA NUBE (Supabase).
//  Mantiene la misma interfaz de antes (prog + completarEntreno)
//  para que Dashboard, Rutinas y Logros sigan funcionando igual.
// ============================================================

export type ProgresoGuerrero = {
  nivel: number;
  xp: number;       // xp dentro del nivel actual
  xpMax: number;    // xp necesario para subir de nivel
  entrenos: number; // total de entrenamientos completados
};

const INICIAL: ProgresoGuerrero = {
  nivel: 23,
  xp: 12450,
  xpMax: 20000,
  entrenos: 48,
};

export const XP_POR_ENTRENO = 1000;

// Guarda en localStorage para que otras pantallas lo lean al instante
function sincronizarLocal(p: ProgresoGuerrero) {
  try {
    localStorage.setItem("guerrero.progreso", JSON.stringify(p));
  } catch {
    // sin localStorage, no pasa nada
  }
}

export function useProgreso() {
  const [prog, setProg] = useState<ProgresoGuerrero>(INICIAL);
  const [cargando, setCargando] = useState(true);

  // Cargar el progreso del usuario desde la nube (o crearlo si no existe)
  const cargar = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setCargando(false);
      return;
    }
    const { data } = await supabase
      .from("progreso")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      // Ya existe: lo usamos
      const p: ProgresoGuerrero = {
        nivel: Number(data.nivel) || INICIAL.nivel,
        xp: Number(data.xp) || 0,
        xpMax: Number(data.xp_max) || INICIAL.xpMax,
        entrenos: Number(data.entrenos) || 0,
      };
      setProg(p);
      sincronizarLocal(p);
    } else {
      // No existe: creamos el registro inicial para este usuario
      await supabase.from("progreso").insert({
        user_id: user.id,
        nivel: INICIAL.nivel,
        xp: INICIAL.xp,
        xp_max: INICIAL.xpMax,
        entrenos: INICIAL.entrenos,
      });
      setProg(INICIAL);
      sincronizarLocal(INICIAL);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Suma XP por completar un entrenamiento. Sube de nivel si llega al máximo.
  // Devuelve true si subió de nivel (para disparar sonido/efecto).
  async function completarEntreno(): Promise<boolean> {
    let subio = false;
    let nivel = prog.nivel;
    let xp = prog.xp + XP_POR_ENTRENO;
    let xpMax = prog.xpMax;
    const entrenos = prog.entrenos + 1;

    while (xp >= xpMax) {
      xp -= xpMax;
      nivel += 1;
      xpMax = Math.round(xpMax * 1.1);
      subio = true;
    }

    const nuevo: ProgresoGuerrero = { nivel, xp, xpMax, entrenos };
    setProg(nuevo);
    sincronizarLocal(nuevo);

    // Guardar en la nube
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      await supabase.from("progreso").upsert({
        user_id: user.id,
        nivel: nuevo.nivel,
        xp: nuevo.xp,
        xp_max: nuevo.xpMax,
        entrenos: nuevo.entrenos,
        actualizado: new Date().toISOString(),
      });
    }

    return subio;
  }

  return { prog, completarEntreno, cargando };
}