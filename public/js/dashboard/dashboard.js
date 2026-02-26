import { supabase } from "../services/supabase.js";

import { initMisRifas } from "./rifas.js";
import { initMensajes } from "./mensajes.js";
import { initHorarios } from "./horarios.js";
import { initConfiguracion } from "./configuracion.js";
import { initCrearRifa } from "./crearRifa.js";

// ================= ROUTER SIMPLE =================

function showView(viewId, addToHistory = true) {

  document.getElementById("dashboardView").classList.add("hidden");

  document.querySelectorAll(".view").forEach(view => {
    view.classList.add("hidden");
  });

  const selectedView = document.getElementById(viewId);
  if (selectedView) {
    selectedView.classList.remove("hidden");
  }

  if (addToHistory) {
    history.pushState({ view: viewId }, "", "#" + viewId);
  }
}

function showDashboard(addToHistory = true) {

  document.querySelectorAll(".view").forEach(view => {
    view.classList.add("hidden");
  });

  document.getElementById("dashboardView")
    .classList.remove("hidden");

  if (addToHistory) {
    history.pushState({ view: "dashboardView" }, "", "#dashboard");
  }
}

// ================= INICIO APP =================

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

    // ===== LOGOUT =====
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await supabase.auth.signOut();
        window.location.href = "index.html";
      });
    }

    // ===== BOTONES MENU =====
    const btnMisRifas = document.getElementById("btnMisRifas");
    if (btnMisRifas) {
      btnMisRifas.addEventListener("click", () => {
        showView("misRifasView");
      });
    }

    const btnConfiguracion = document.getElementById("btnConfiguracion");
    if (btnConfiguracion) {
      btnConfiguracion.addEventListener("click", () => {
        showView("configuracionView");
      });
    }

    // ===== INICIALIZAR MODULOS =====
    initMisRifas(session);
    initMensajes(session);
    initHorarios(session);
    initConfiguracion(session);
    initCrearRifa();

    // ===== RESTAURAR HASH AL CARGAR =====
    const hash = window.location.hash.replace("#", "");

    if (hash && document.getElementById(hash)) {
      showView(hash, false);
    } else {
      showDashboard(false);
    }

  } catch (error) {
    console.error("Error en dashboard:", error);
  }

});

// ===== MANEJO BOTON ATRAS =====

window.addEventListener("popstate", (event) => {

  if (event.state && event.state.view) {

    if (event.state.view === "dashboardView") {
      showDashboard(false);
    } else {
      showView(event.state.view, false);
    }

  } else {
    showDashboard(false);
  }

});