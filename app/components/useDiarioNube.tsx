"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
//  useDiarioNube — agua y pasos del usuario EN LA NUBE.
//  Dato único por usuario (patrón del perfil).
// ============================================================

export type Diario = {
  agua: number;   // vasos de agua
  pasos: number;  // pasos del día
};

const INICIAL: Diario = { agua: 0, pasos: 0 };

export function useDiarioNube() {
  const [diario, setDiario] = useState<Diario>(INICIAL);
  const [cargando, setCargando] = useState(true);

  // Cargar agua/pasos del usuario (o crear el registro si no existe)
  const cargar = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setCargando(false);
      return;
    }
    const { data } = await supabase
      .from("diario")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setDiario({ agua: Number(data.agua) || 0, pasos: Number(data.pasos) || 0 });
    } else {
      // Crear registro inicial para este usuario
      await supabase.from("diario").insert({ user_id: user.id, agua: 0, pasos: 0 });
      setDiario(INICIAL);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Guardar un cambio (agua o pasos) en la nube
  async function actualizar(nuevo: Diario) {
    setDiario(nuevo); // actualiza la pantalla al instante
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      await supabase.from("diario").upsert({
        user_id: user.id,
        agua: nuevo.agua,
        pasos: nuevo.pasos,
        actualizado: new Date().toISOString(),
      });
    }
  }

  return { diario, cargando, actualizar };
}