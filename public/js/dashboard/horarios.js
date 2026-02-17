export function initHorarios(session) {

  const btn = document.getElementById("btnHorarios");
  const view = document.getElementById("horariosView");

  if (!btn || !view) return;

  btn.addEventListener("click", () => {

    view.innerHTML = `
      <div class="view-header">
        <button id="volverDashboard">← Volver</button>
        <h2>Horarios</h2>
      </div>
      <p>Aquí irán los horarios.</p>
    `;

    document.getElementById("volverDashboard")
      .addEventListener("click", () => {
        document.getElementById("dashboardView").classList.remove("hidden");
        view.classList.add("hidden");
      });

  });
}
