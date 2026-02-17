export function initHorarios() {
  const btn = document.getElementById("btnHorarios");
  const dynamicSection = document.getElementById("dynamicSection");

  if (!btn) return;

  btn.addEventListener("click", () => {
    dynamicSection.innerHTML = `
      <h3>⏰ Horarios</h3>
      <p>Aquí irán los horarios de juegos.</p>
    `;
  });
}
