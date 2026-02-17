export function initConfiguracion() {
  const btn = document.getElementById("btnConfiguracion");
  const dynamicSection = document.getElementById("dynamicSection");

  if (!btn) return;

  btn.addEventListener("click", () => {
    dynamicSection.innerHTML = `
      <h3>⚙️ Configuración</h3>
      <p>Aquí irá la configuración del usuario.</p>
    `;
  });
}
