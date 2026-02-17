export function initMensajes() {
  const btn = document.getElementById("btnMensajes");
  const dynamicSection = document.getElementById("dynamicSection");

  if (!btn) return;

  btn.addEventListener("click", () => {
    dynamicSection.innerHTML = `
      <h3>📩 Mensajes</h3>
      <p>Aquí irán los mensajes guardados.</p>
    `;
  });
}
