"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
//  useDiarioNube — agua y pasos del usuario EN LA NUBE.
//  Se REINICIAN cada día: si la fecha guardada no es hoy,
//  empezamos de cero (día nuevo).
// ============================================================

export type Diario = {
  agua: number;        // vasos de agua
  pasos: number;       // pasos del día
  entrenos: number;    // entrenamientos de hoy
};

const INICIAL: Diario = { agua: 0, pasos: 0, entrenos: 0 };

// Fecha de hoy en formato "AAAA-MM-DD" (para comparar días)
function hoyTexto(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDiarioNube() {
  const [diario, setDiario] = useState<Diario>(INICIAL);
  const [cargando, setCargando] = useState(true);

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

    const hoy = hoyTexto();

    if (data) {
      // ¿La fecha guardada es de hoy?
      if (data.fecha === hoy) {
        // Mismo día: usamos los valores guardados
        setDiario({ agua: Number(data.agua) || 0, pasos: Number(data.pasos) || 0, entrenos: Number(data.entrenos) || 0 });
      } else {
        // Día nuevo: reiniciamos a cero y actualizamos la fecha
        await supabase.from("diario").update({
          agua: 0, pasos: 0, entrenos: 0, fecha: hoy, actualizado: new Date().toISOString(),
        }).eq("user_id", user.id);
        setDiario(INICIAL);
      }
    } else {
      // Primera vez: creamos el registro de hoy
      await supabase.from("diario").insert({ user_id: user.id, agua: 0, pasos: 0, entrenos: 0, fecha: hoy });
      setDiario(INICIAL);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Guardar un cambio (agua o pasos) en la nube, con la fecha de hoy
  async function actualizar(nuevo: Diario) {
    setDiario(nuevo);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      await supabase.from("diario").upsert({
        user_id: user.id,
        agua: nuevo.agua,
        pasos: nuevo.pasos,
        entrenos: nuevo.entrenos,
        fecha: hoyTexto(),
        actualizado: new Date().toISOString(),
      });
    }
  }

  return { diario, cargando, actualizar };
}