export function showView(viewId) {

  const dashboard = document.getElementById("dashboardView");
  const views = document.querySelectorAll(".view");

  // Ocultar dashboard
  if (dashboard) {
    dashboard.classList.add("hidden");
  }

  // Ocultar todas las vistas
  views.forEach(view => {
    view.classList.add("hidden");
  });

  // Si queremos volver al dashboard
  if (viewId === "dashboard") {
    if (dashboard) {
      dashboard.classList.remove("hidden");
    }
    return;
  }

  // Mostrar la vista seleccionada
  const selectedView = document.getElementById(viewId);

  if (selectedView) {
    selectedView.classList.remove("hidden");
  }
}
