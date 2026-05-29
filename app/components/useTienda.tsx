"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import { TEMAS_EXTRA } from "./productos";
import { TEMAS } from "./temas";

// ============================================================
//  useTienda — Maneja productos comprados y equipados
//  Se guardan en Supabase (columna inventario en progreso)
//  Estructura: { comprados: ["novato", "galaxy"], tituloEquipado: "novato", temaExtra: "galaxy" }
// ============================================================

export type Inventario = {
  comprados: string[];         // IDs de productos comprados (títulos y temas)
  tituloEquipado: string;      // ID del título actualmente puesto ("" = ninguno)
  temaExtraEquipado: string;   // ID del tema extra activo ("" = usa tema base)
};

const INICIAL: Inventario = {
  comprados: [],
  tituloEquipado: "",
  temaExtraEquipado: "",
};

const CLAVE_LOCAL = "kaizen.inventario";

export function useTienda() {
  const [inv, setInv] = useState<Inventario>(INICIAL);
  const [cargando, setCargando] = useState(true);

  // Cargar inventario desde la nube
  const cargar = useCallback(async () => {
    // Caché local primero (rápido)
    try {
      const local = localStorage.getItem(CLAVE_LOCAL);
      if (local) setInv(JSON.parse(local));
    } catch { /* nada */ }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setCargando(false);
      return;
    }
    const { data } = await supabase
      .from("progreso")
      .select("inventario")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data && data.inventario) {
      try {
        const parsed: Inventario = typeof data.inventario === "string"
          ? JSON.parse(data.inventario)
          : data.inventario;
        const completo: Inventario = {
          comprados: parsed.comprados || [],
          tituloEquipado: parsed.tituloEquipado || "",
          temaExtraEquipado: parsed.temaExtraEquipado || "",
        };
        setInv(completo);
        try { localStorage.setItem(CLAVE_LOCAL, JSON.stringify(completo)); } catch { /* nada */ }
      } catch { /* nada */ }
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Guardar en nube + local
  async function guardar(nuevo: Inventario) {
    setInv(nuevo);
    try { localStorage.setItem(CLAVE_LOCAL, JSON.stringify(nuevo)); } catch { /* nada */ }
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;
    await supabase.from("progreso").upsert({
      user_id: user.id,
      inventario: nuevo,
      actualizado: new Date().toISOString(),
    });
  }

  // Comprar un producto (marca como comprado)
  async function comprar(id: string) {
    if (inv.comprados.includes(id)) return;
    const nuevo: Inventario = {
      ...inv,
      comprados: [...inv.comprados, id],
    };
    await guardar(nuevo);
  }

  // Aplica el tema (extra si está equipado, base si no) al DOM
  function aplicarTemaActivo(temaExtraId: string) {
    if (typeof document === "undefined") return;
    if (temaExtraId) {
      // Aplica un tema EXTRA comprado
      const extra = TEMAS_EXTRA.find((t) => t.id === temaExtraId);
      if (extra) {
        Object.entries(extra.vars).forEach(([k, v]) => {
          document.documentElement.style.setProperty(k, v);
        });
        document.documentElement.setAttribute("data-tema", extra.id);
        return;
      }
    }
    // Sin tema extra: volver al tema base guardado
    try {
      const base = localStorage.getItem("kaizen.tema") || "kaizen";
      const tema = TEMAS.find((t) => t.id === base) || TEMAS[0];
      Object.entries(tema.vars).forEach(([k, v]) => {
        document.documentElement.style.setProperty(k, v);
      });
      document.documentElement.setAttribute("data-tema", tema.id);
    } catch { /* nada */ }
  }

  // Aplica el tema extra equipado al cargar (si hay)
  useEffect(() => {
    if (!cargando && inv.temaExtraEquipado) {
      aplicarTemaActivo(inv.temaExtraEquipado);
    }
  }, [cargando, inv.temaExtraEquipado]);

  // Equipar/desequipar título
  async function equiparTitulo(id: string) {
    const nuevo: Inventario = {
      ...inv,
      tituloEquipado: inv.tituloEquipado === id ? "" : id,
    };
    await guardar(nuevo);
  }

  // Equipar/desequipar tema extra (también aplica al DOM)
  async function equiparTemaExtra(id: string) {
    const nuevoId = inv.temaExtraEquipado === id ? "" : id;
    const nuevo: Inventario = {
      ...inv,
      temaExtraEquipado: nuevoId,
    };
    await guardar(nuevo);
    aplicarTemaActivo(nuevoId);
  }

  function tieneComprado(id: string): boolean {
    return inv.comprados.includes(id);
  }

  return {
    inventario: inv,
    cargando,
    comprar,
    equiparTitulo,
    equiparTemaExtra,
    tieneComprado,
  };
}