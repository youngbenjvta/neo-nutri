"use client";
import { useState, useEffect } from "react";

// ============================================================
//  useFavoritos — Comidas favoritas del usuario.
//  Se guardan localmente (suficiente porque son atajos de registro,
//  no datos críticos como peso o progreso).
// ============================================================

export type Favorito = {
  id: string;       // identificador único
  tipo: string;     // desayuno/almuerzo/merienda/cena
  nombre: string;
  kcal: number;
};

const CLAVE = "comida.favoritos";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);

  // Cargar al iniciar
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setFavoritos(JSON.parse(guardado));
    } catch { /* nada */ }
  }, []);

  // Guardar cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(favoritos));
    } catch { /* nada */ }
  }, [favoritos]);

  function agregarFavorito(tipo: string, nombre: string, kcal: number) {
    // No duplicar (mismo nombre + tipo)
    if (favoritos.some((f) => f.nombre === nombre && f.tipo === tipo)) return;
    const nuevo: Favorito = {
      id: Date.now().toString(),
      tipo, nombre, kcal,
    };
    setFavoritos([...favoritos, nuevo]);
  }

  function quitarFavorito(id: string) {
    setFavoritos(favoritos.filter((f) => f.id !== id));
  }

  function esFavorito(nombre: string, tipo: string): boolean {
    return favoritos.some((f) => f.nombre === nombre && f.tipo === tipo);
  }

  return { favoritos, agregarFavorito, quitarFavorito, esFavorito };
}