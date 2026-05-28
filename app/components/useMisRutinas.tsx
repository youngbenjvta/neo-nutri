"use client";
import { useState, useEffect } from "react";

// ============================================================
//  useMisRutinas — Maneja las rutinas creadas por el usuario.
//  Se guardan localmente. Las preset no se tocan.
// ============================================================

export type RutinaPropia = {
  id: string;           // identificador único
  nombre: string;       // ej. "Lunes intenso"
  jp: string;           // kanji decorativo (auto)
  tone: string;         // color (auto, cálido)
  ejercicios: string[]; // lista de ejercicios
  creada: string;       // fecha en formato ISO
};

const CLAVE = "kaizen.misRutinas";

// Colores cálidos rotatorios para las rutinas nuevas
const TONOS = ["#d23b2e", "#e8a13a", "#d4a84a", "#3f7d6e", "#c77d3a"];
// Kanjis decorativos rotatorios
const KANJIS = ["力", "闘", "勇", "鍛", "剣"];

export function useMisRutinas() {
  const [rutinas, setRutinas] = useState<RutinaPropia[]>([]);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setRutinas(JSON.parse(guardado));
    } catch { /* nada */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(rutinas));
    } catch { /* nada */ }
  }, [rutinas]);

  function crear(nombre: string, ejercicios: string[]): RutinaPropia {
    const n = rutinas.length;
    const nueva: RutinaPropia = {
      id: Date.now().toString(),
      nombre: nombre.trim() || "Rutina sin nombre",
      jp: KANJIS[n % KANJIS.length],
      tone: TONOS[n % TONOS.length],
      ejercicios,
      creada: new Date().toISOString(),
    };
    setRutinas([...rutinas, nueva]);
    return nueva;
  }

  function borrar(id: string) {
    setRutinas(rutinas.filter((r) => r.id !== id));
  }

  return { rutinas, crear, borrar };
}