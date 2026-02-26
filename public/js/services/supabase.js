import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ===================================== */
/* ===== CONFIGURACIÓN SUPABASE ======== */
/* ===================================== */

const supabaseUrl = "https://slouziolnwtjbpxtpxvn.supabase.co";
const supabaseAnonKey = "sb_publishable_ps3hys_W0r7ZBv-wY7QAFw_PunRCj34";

/* ===================================== */
/* ===== CREAR CLIENTE ================= */
/* ===================================== */

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // 🔥 Mantiene sesión aunque se cierre la app
    autoRefreshToken: true,     // 🔥 Renueva el token automáticamente
    detectSessionInUrl: true,   // 🔥 Detecta login OAuth (Google)
    flowType: "pkce",           // 🔐 Más seguro para apps web modernas
    storage: window.localStorage
  }
});