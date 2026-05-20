"use client";
import { useState, useEffect } from "react";

// ============================================================
//  usePersistedState — como useState, pero recuerda el valor
//  en el navegador (localStorage). Seguro para Next.js.
//
//  Uso:  const [nombre, setNombre] = usePersistedState("nombre", "GUERRERO");
//  Funciona igual que useState, pero el valor sobrevive al recargar.
// ============================================================

export function usePersistedState<T>(key: string, valorInicial: T) {
  // Empezamos siempre con el valor inicial (igual en servidor y navegador,
  // para que Next.js no se queje). Luego, ya en el navegador, leemos lo guardado.
  const [value, setValue] = useState<T>(valorInicial);
  const [cargado, setCargado] = useState(false);

  // Al montar en el navegador: intentamos leer lo que había guardado.
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(key);
      if (guardado !== null) {
        setValue(JSON.parse(guardado));
      }
    } catch {
      // si algo falla (ej. datos corruptos), seguimos con el valor inicial
    }
    setCargado(true);
  }, [key]);

  // Cada vez que cambia el valor (y ya cargamos), lo guardamos.
  useEffect(() => {
    if (!cargado) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // si el almacenamiento está lleno o bloqueado, lo ignoramos
    }
  }, [key, value, cargado]);

  return [value, setValue] as const;
}