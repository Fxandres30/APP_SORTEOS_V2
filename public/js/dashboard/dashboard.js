import { supabase } from "../services/supabase.js";

import { initMisRifas } from "./rifas.js";
import { initMensajes } from "./mensajes.js";
import { initHorarios } from "./horarios.js";
import { initConfiguracion } from "./configuracion.js";
import { initCrearRifa } from "./crearRifa.js";

document.addEventListener("DOMContentLoaded", async () => {

  try {

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "index.html";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", session.user.id)
      .maybeSingle();

    const welcome = document.getElementById("welcomeText");
    if (profile && welcome) {
      welcome.textContent = profile.name;
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "index.html";
      });
    }

    // 🚀 INICIALIZAR MÓDULOS
    initMisRifas(session);
    initMensajes(session);
    initHorarios(session);
    initConfiguracion(session);
    initCrearRifa(); // SOLO AQUÍ

  } catch (error) {
    console.error("Error en dashboard:", error);
  }

});
