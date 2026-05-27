"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
//  useComidasNube — lee, añade y borra comidas del usuario
//  logueado en la tabla 'comidas' de Supabase (en la nube).
//  A diferencia del perfil, esto es una LISTA (muchas filas).
// ============================================================

export type ComidaNube = {
  id: number;
  tipo: string;
  nombre: string;
  kcal: number;
};

export function useComidasNube() {
  const [comidas, setComidas] = useState<ComidaNube[]>([]);
  const [cargando, setCargando] = useState(true);

  // Trae las comidas de HOY del usuario desde la nube
  // (las de días anteriores siguen guardadas, pero no se muestran)
  const recargar = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setCargando(false);
      return;
    }

    // Inicio del día de hoy (medianoche), para traer solo las de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from("comidas")
      .select("*")
      .eq("user_id", user.id)
      .gte("creado", hoy.toISOString())
      .order("creado", { ascending: true });

    if (data) {
      setComidas(
        data.map((c) => ({
          id: c.id,
          tipo: c.tipo ?? "",
          nombre: c.nombre ?? "",
          kcal: Number(c.kcal) || 0,
        }))
      );
    }
    setCargando(false);
  }, []);

  // Al cargar la pantalla, traer las comidas
  useEffect(() => {
    recargar();
  }, [recargar]);

  // Añadir una comida nueva a la nube
  async function agregar(tipo: string, nombre: string, kcal: number): Promise<boolean> {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return false;

    const { data, error } = await supabase
      .from("comidas")
      .insert({ user_id: user.id, tipo, nombre, kcal })
      .select()
      .single();

    if (!error && data) {
      // Añadimos a la lista local sin tener que recargar todo
      setComidas((prev) => [...prev, { id: data.id, tipo: data.tipo, nombre: data.nombre, kcal: Number(data.kcal) || 0 }]);
      return true;
    }
    return false;
  }

  // Borrar una comida de la nube
  async function borrar(id: number): Promise<boolean> {
    const { error } = await supabase.from("comidas").delete().eq("id", id);
    if (!error) {
      setComidas((prev) => prev.filter((c) => c.id !== id));
      return true;
    }
    return false;
  }

  return { comidas, cargando, agregar, borrar, recargar };
}