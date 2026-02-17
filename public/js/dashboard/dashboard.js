import { supabase } from "../services/supabase.js";
import { initCrearRifa } from "./crearRifa.js";

// ==============================
// 🔐 VERIFICAR SESIÓN
// ==============================
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = "index.html";
}

// ==============================
// 👤 CARGAR PERFIL
// ==============================
const { data: profile, error } = await supabase
  .from("profiles")
  .select("name")
  .eq("id", session.user.id)
  .single();

if (error) {
  console.error("Error cargando perfil:", error);
}

if (profile) {
  document.getElementById("welcomeText").textContent =
    `Bienvenido ${profile.name}`;
}

// ==============================
// 🚪 LOGOUT
// ==============================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "index.html";
});

initCrearRifa ();
