export function initModal() {
  const btnCrear = document.getElementById("btnCrearRifa");
  const modal = document.getElementById("modalRifa");
  const cerrar = document.getElementById("cerrarModal");

  if (!btnCrear || !modal) return;

  btnCrear.addEventListener("click", () => {
    modal.classList.add("active");
  });

  cerrar.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}
