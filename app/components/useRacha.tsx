"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import { EVENTO_GANASTE, type EventoGanaste } from "./useMonedas";

// ============================================================
//  useRacha — días seguidos usando la app (efecto "racha 🔥").
//  Lógica por fechas:
//   - Si ya entró hoy: no cambia.
//   - Si la última vez fue ayer: racha + 1.
//   - Si fue hace más de 1 día: racha se reinicia a 1.
//  Se guarda en la tabla 'diario' (columnas racha y ultima_fecha).
// ============================================================

// Fecha en formato "AAAA-MM-DD"
function fechaTexto(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function useRacha() {
  const [racha, setRacha] = useState(0);
  const [cargando, setCargando] = useState(true);

  const revisar = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setCargando(false);
      return;
    }

    const hoy = new Date();
    const hoyTxt = fechaTexto(hoy);
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const ayerTxt = fechaTexto(ayer);

    const { data } = await supabase
      .from("diario")
      .select("racha, ultima_fecha")
      .eq("user_id", user.id)
      .maybeSingle();

    let nuevaRacha = 1;

    if (data && data.ultima_fecha) {
      if (data.ultima_fecha === hoyTxt) {
        // Ya entró hoy: la racha se queda igual
        nuevaRacha = Number(data.racha) || 1;
        setRacha(nuevaRacha);
        setCargando(false);
        return;
      } else if (data.ultima_fecha === ayerTxt) {
        // Entró ayer: ¡racha +1! Y +5 monedas KAIZEN 🪙
        nuevaRacha = (Number(data.racha) || 0) + 1;
        try {
          // Actualizar saldo de monedas en la nube (+5)
          const { data: prog } = await supabase
            .from("progreso")
            .select("monedas")
            .eq("user_id", user.id)
            .maybeSingle();
          const nuevoSaldo = (Number(prog?.monedas) || 0) + 5;
          await supabase.from("progreso").upsert({
            user_id: user.id,
            monedas: nuevoSaldo,
            actualizado: new Date().toISOString(),
          });
          try { localStorage.setItem("kaizen.monedas", String(nuevoSaldo)); } catch { /* nada */ }
          // Disparar animación
          window.dispatchEvent(new CustomEvent<EventoGanaste>(EVENTO_GANASTE, {
            detail: { cantidad: 5, razon: `¡Día ${nuevaRacha} de racha! 🔥` },
          }));
        } catch { /* nada */ }
      } else {
        // Se saltó días: reinicia a 1
        nuevaRacha = 1;
      }
    }

    // Guardar la racha nueva y la fecha de hoy
    await supabase.from("diario").upsert({
      user_id: user.id,
      racha: nuevaRacha,
      ultima_fecha: hoyTxt,
    });
    setRacha(nuevaRacha);
    setCargando(false);
  }, []);

  useEffect(() => {
    revisar();
  }, [revisar]);

  return { racha, cargando };
}