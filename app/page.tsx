"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tab, setTab] = useState("home");

  const [xp, setXp] = useState(0);
  const [days, setDays] = useState(0);
  const [water, setWater] = useState(0);
  const [streak, setStreak] = useState(0);

  // 🔥 LOAD DATA (APP REAL)
  useEffect(() => {
    const data = {
      xp: Number(localStorage.getItem("xp")) || 0,
      days: Number(localStorage.getItem("days")) || 0,
      water: Number(localStorage.getItem("water")) || 0,
      streak: Number(localStorage.getItem("streak")) || 0,
    };

    setXp(data.xp);
    setDays(data.days);
    setWater(data.water);
    setStreak(data.streak);
  }, []);

  // 🔥 SAVE DATA (APP REAL)
  useEffect(() => {
    localStorage.setItem("xp", String(xp));
    localStorage.setItem("days", String(days));
    localStorage.setItem("water", String(water));
    localStorage.setItem("streak", String(streak));
  }, [xp, days, water, streak]);

  function completeDay() {
    setDays(days + 1);
    setXp(xp + 120);
    setStreak(streak + 1);
  }

  function addXp() {
    setXp(xp + 50);
  }

  function drinkWater() {
    setWater(water + 0.5);
  }

  const rank =
    xp >= 2000 ? "FINAL BOSS" :
    xp >= 1500 ? "DIOS SUPREMO" :
    xp >= 1000 ? "DIAMANTE" :
    xp >= 500 ? "ORO" :
    "BRONCE";

  const progress = Math.min((xp / 1000) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <img src="/icon.png" className="w-28 mx-auto rounded-2xl" />
        <h1 className="text-3xl font-black">NEO NUTRI</h1>
        <p className="text-slate-400 text-sm">App de progreso real</p>
      </div>

      {/* NAV */}
      <div className="flex gap-6 mt-6 text-slate-300 text-sm">
        <button onClick={() => setTab("home")}>🏠</button>
        <button onClick={() => setTab("stats")}>📊</button>
        <button onClick={() => setTab("profile")}>👤</button>
      </div>

      {/* HOME */}
      {tab === "home" && (
        <div className="w-full max-w-md mt-6 space-y-4">

          {/* RANK */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 rounded-2xl text-center">
            <p className="text-sm opacity-80">Rango</p>
            <p className="text-2xl font-black">{rank}</p>
          </div>

          {/* XP BAR */}
          <div className="bg-slate-900 p-5 rounded-2xl space-y-3">
            <p className="text-sm text-slate-400">XP Progress</p>

            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-3"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-slate-500">{xp}/1000 XP</p>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={completeDay}
              className="bg-purple-600 p-4 rounded-2xl font-bold"
            >
              + Día
            </button>

            <button
              onClick={addXp}
              className="bg-blue-600 p-4 rounded-2xl font-bold"
            >
              + XP
            </button>

            <button
              onClick={drinkWater}
              className="bg-cyan-600 p-4 rounded-2xl font-bold"
            >
              💧 Agua
            </button>

            <div className="bg-slate-800 p-4 rounded-2xl text-center">
              <p className="text-xs text-slate-400">Streak</p>
              <p className="text-xl font-black">{streak}</p>
            </div>

          </div>
        </div>
      )}

      {/* STATS */}
      {tab === "stats" && (
        <div className="w-full max-w-md mt-6 bg-slate-900 p-5 rounded-2xl text-center space-y-2">
          <h2 className="text-xl font-bold">Estadísticas</h2>
          <p>XP: {xp}</p>
          <p>Días: {days}</p>
          <p>Agua: {water} L</p>
          <p>🔥 Streak: {streak}</p>
        </div>
      )}

      {/* PROFILE */}
      {tab === "profile" && (
        <div className="w-full max-w-md mt-6 bg-slate-900 p-5 rounded-2xl text-center">
          <h2 className="text-xl font-bold">Perfil</h2>
          <p className="text-slate-400">Usuario Neo Nutri</p>
        </div>
      )}

    </div>
  );
}