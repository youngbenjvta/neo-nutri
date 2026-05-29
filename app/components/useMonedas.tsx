"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
//  KAIZEN — Sistema de monedas (KAIZEN COINS) 🪙
//  Saldo guardado en la nube (tabla progreso, columna monedas).
//  Al sumar, dispara un evento global que el Dashboard escucha
//  para mostrar la animación "+X 🪙".
// ============================================================

const CLAVE_LOCAL = "kaizen.monedas";

// Evento global para que la animación pueda dispararse desde cualquier lugar
export const EVENTO_GANASTE = "kaizen:ganaste-monedas";

export type EventoGanaste = {
  cantidad: number;
  razon: string;
};

export function useMonedas() {
  const [monedas, setMonedasState] = useState<number>(0);
  const [cargando, setCargando] = useState(true);

  // Cargar el saldo desde la nube
  const cargar = useCallback(async () => {
    // Primero lee el caché local (rápido)
    try {
      const local = localStorage.getItem(CLAVE_LOCAL);
      if (local) setMonedasState(Number(local) || 0);
    } catch { /* nada */ }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setCargando(false);
      return;
    }
    const { data } = await supabase
      .from("progreso")
      .select("monedas")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      const total = Number(data.monedas) || 0;
      setMonedasState(total);
      try { localStorage.setItem(CLAVE_LOCAL, String(total)); } catch { /* nada */ }
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Sumar monedas (dispara animación global)
  async function sumar(cantidad: number, razon: string) {
    if (cantidad <= 0) return;
    const nuevo = monedas + cantidad;
    setMonedasState(nuevo);
    try { localStorage.setItem(CLAVE_LOCAL, String(nuevo)); } catch { /* nada */ }

    // Guardar en la nube
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      await supabase.from("progreso").upsert({
        user_id: user.id,
        monedas: nuevo,
        actualizado: new Date().toISOString(),
      });
    }

    // Disparar evento global para mostrar animación
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent<EventoGanaste>(EVENTO_GANASTE, {
        detail: { cantidad, razon },
      }));
    }
  }

  return { monedas, sumar, cargando };
}

// ============================================================
//  Sistema simple para evitar dar monedas 2 veces el mismo día
//  por la misma razón (ej. "ya cumpliste la meta de kcal hoy").
// ============================================================

const CLAVE_RECLAMADO = "kaizen.monedas.reclamado";

export function yaReclamadoHoy(razon: string): boolean {
  try {
    const data = JSON.parse(localStorage.getItem(CLAVE_RECLAMADO) || "{}");
    const hoy = new Date().toISOString().slice(0, 10);
    return data[razon] === hoy;
  } catch { return false; }
}

export function marcarReclamadoHoy(razon: string) {
  try {
    const data = JSON.parse(localStorage.getItem(CLAVE_RECLAMADO) || "{}");
    const hoy = new Date().toISOString().slice(0, 10);
    data[razon] = hoy;
    localStorage.setItem(CLAVE_RECLAMADO, JSON.stringify(data));
  } catch { /* nada */ }
}