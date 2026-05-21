"use client";
import { createClient } from "@supabase/supabase-js";

// ============================================================
//  Cliente de Supabase — conecta la app con tu base de datos.
//  Las claves vienen del archivo .env.local (no se suben a git).
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);