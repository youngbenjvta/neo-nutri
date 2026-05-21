"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
//  usePesosNube — lee y añade registros de peso del usuario
//  logueado en la tabla 'pesos' de Supabase (en la nube).
//  Patrón de LISTA, igual que las comidas.
// ============================================================

export type PesoNube = {
  id: number;
  peso: number;
  creado: string;
};

export function usePesosNube() {
  const [pesos, setPesos] = useState<PesoNube[]>([]);
  const [cargando, setCargando] = useState(true);

  // Trae todos los registros de peso del usuario desde la nube
  const recargar = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setCargando(false);
      return;
    }
    const { data } = await supabase
      .from("pesos")
      .select("*")
      .eq("user_id", user.id)
      .order("creado", { ascending: true });

    if (data) {
      setPesos(
        data.map((p) => ({
          id: p.id,
          peso: Number(p.peso) || 0,
          creado: p.creado,
        }))
      );
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  // Añadir un registro de peso nuevo a la nube
  async function agregar(peso: number): Promise<boolean> {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return false;

    const { data, error } = await supabase
      .from("pesos")
      .insert({ user_id: user.id, peso })
      .select()
      .single();

    if (!error && data) {
      setPesos((prev) => [...prev, { id: data.id, peso: Number(data.peso) || 0, creado: data.creado }]);
      return true;
    }
    return false;
  }

  return { pesos, cargando, agregar, recargar };
}