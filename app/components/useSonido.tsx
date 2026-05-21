"use client";
import { usePersistedState } from "./usePersistedState";

// ============================================================
//  useSonido — maneja el audio de la app.
//  levelup.mp3 al subir de nivel + beeps sintéticos (entrenar,
//  click) generados con Web Audio API. Mute persistente.
// ============================================================

// Reproduce un "beep" corto sintético (sin archivos externos).
function beep(freq: number, durMs: number, tipo: OscillatorType = "square", vol = 0.15) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    // pequeño fade out para que no suene "cortado"
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durMs / 1000);
    osc.stop(ctx.currentTime + durMs / 1000);
    osc.onended = () => ctx.close();
  } catch {
    // si el navegador no soporta audio, simplemente no suena
  }
}

export function useSonido() {
  const [mudo, setMudo] = usePersistedState<boolean>("sonido.mudo", false);

  function levelUp() {
    if (mudo) return;
    try {
      const audio = new Audio("/levelup.mp3");
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch {
      // si falla el mp3, al menos un beep de victoria
      beep(660, 200, "square");
    }
  }

  function entrenar() {
    if (mudo) return;
    // dos beeps ascendentes (sensación de "logro")
    beep(440, 90, "square");
    setTimeout(() => beep(660, 120, "square"), 100);
  }

  function click() {
    if (mudo) return;
    beep(330, 50, "sine", 0.08);
  }

  function toggleMudo() {
    setMudo((m) => !m);
  }

  return { mudo, toggleMudo, levelUp, entrenar, click };
}