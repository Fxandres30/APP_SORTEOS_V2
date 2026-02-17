export function initConfiguracion(session) {

  const btn = document.getElementById("btnConfiguracion");
  const view = document.getElementById("configuracionView");

  if (!btn || !view) return;

  btn.addEventListener("click", () => {

    view.innerHTML = `
      <div class="view-header">
        <button id="volverDashboard">← Volver</button>
        <h2>Configuración</h2>
      </div>
      <p>Aquí irá la configuración.</p>
    `;

    document.getElementById("volverDashboard")
      .addEventListener("click", () => {
        document.getElementById("dashboardView").classList.remove("hidden");
        view.classList.add("hidden");
      });

  });
}
