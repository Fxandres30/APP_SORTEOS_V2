import { showView } from "./router.js";

export function initMensajes(session) {

  const btn = document.getElementById("btnMensajes");
  const view = document.getElementById("mensajesView");

  if (!btn || !view) return;

  btn.addEventListener("click", () => {

    showView("mensajesView");

    view.innerHTML = `
      <div class="view-header">
        <button id="volverDashboard">← Volver</button>
        <h2>Mensajes</h2>
      </div>

      <p>Aquí irán los mensajes.</p>
    `;

    document.getElementById("volverDashboard")
      .addEventListener("click", () => showView("dashboard"));
  });
}
