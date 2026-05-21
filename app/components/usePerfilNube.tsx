"use client";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
//  usePerfilNube — lee y guarda el perfil del usuario logueado
//  en la tabla 'perfiles' de Supabase (en la nube).
// ============================================================

export type PerfilDatos = {
  nombre: string;
  avatar: string;
  objetivo: string;
  peso_meta: string;
  kcal_meta: string;
  altura: string;
  edad: string;
};

const VACIO: PerfilDatos = {
  nombre: "GUERRERO",
  avatar: "a1",
  objetivo: "bajar",
  peso_meta: "70",
  kcal_meta: "2600",
  altura: "175",
  edad: "25",
};

export function usePerfilNube() {
  const [perfil, setPerfil] = useState<PerfilDatos>(VACIO);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Al cargar: traer el perfil del usuario desde la nube
  useEffect(() => {
    let activo = true;
    async function cargar() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        if (activo) setCargando(false);
        return;
      }
      // Buscar el perfil de este usuario
      const { data } = await supabase
        .from("perfiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (activo && data) {
        // Convertir números a texto para los inputs
        const cargado: PerfilDatos = {
          nombre: data.nombre ?? VACIO.nombre,
          avatar: data.avatar ?? VACIO.avatar,
          objetivo: data.objetivo ?? VACIO.objetivo,
          peso_meta: data.peso_meta != null ? String(data.peso_meta) : VACIO.peso_meta,
          kcal_meta: data.kcal_meta != null ? String(data.kcal_meta) : VACIO.kcal_meta,
          altura: data.altura != null ? String(data.altura) : VACIO.altura,
          edad: data.edad != null ? String(data.edad) : VACIO.edad,
        };
        setPerfil(cargado);
        // También a localStorage, para que Dashboard y otras pantallas lo lean
        sincronizarLocal(cargado);
      }
      if (activo) setCargando(false);
    }
    cargar();
    return () => { activo = false; };
  }, []);

  // Guardar el perfil en la nube (crea o actualiza)
  async function guardarPerfil(nuevo: PerfilDatos): Promise<boolean> {
    setGuardando(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setGuardando(false);
      return false;
    }
    // upsert = si existe lo actualiza, si no lo crea
    const { error } = await supabase.from("perfiles").upsert({
      user_id: user.id,
      nombre: nuevo.nombre,
      avatar: nuevo.avatar,
      objetivo: nuevo.objetivo,
      peso_meta: Number(nuevo.peso_meta) || null,
      kcal_meta: Number(nuevo.kcal_meta) || null,
      altura: Number(nuevo.altura) || null,
      edad: Number(nuevo.edad) || null,
      actualizado: new Date().toISOString(),
    });
    setGuardando(false);
    if (!error) {
      setPerfil(nuevo);
      sincronizarLocal(nuevo); // también a localStorage para las otras pantallas
      return true;
    }
    return false;
  }

  return { perfil, setPerfil, guardarPerfil, cargando, guardando };
}

// Guarda los datos del perfil en localStorage con las MISMAS claves
// que usan Dashboard y otras pantallas (para que sigan funcionando).
function sincronizarLocal(p: PerfilDatos) {
  try {
    localStorage.setItem("perfil.nombre", JSON.stringify(p.nombre));
    localStorage.setItem("perfil.avatar", JSON.stringify(p.avatar));
    localStorage.setItem("perfil.objetivo", JSON.stringify(p.objetivo));
    localStorage.setItem("perfil.pesoMeta", JSON.stringify(p.peso_meta));
    localStorage.setItem("perfil.kcalMeta", JSON.stringify(p.kcal_meta));
    localStorage.setItem("perfil.altura", JSON.stringify(p.altura));
    localStorage.setItem("perfil.edad", JSON.stringify(p.edad));
  } catch {
    // si localStorage no está disponible, no pasa nada grave
  }
}