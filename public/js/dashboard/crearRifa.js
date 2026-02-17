import { supabase } from "../services/supabase.js";

export function initCrearRifa() {

  const btnCrear = document.getElementById("btnCrearRifa");
  const modal = document.getElementById("modalRifa");
  const cerrar = document.getElementById("cerrarModal");
  const form = document.getElementById("crearRifaForm");

  if (!btnCrear || !modal || !cerrar || !form) return;

  // Abrir modal
  btnCrear.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Cerrar modal
  cerrar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Crear rifa
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const titulo = document.getElementById("titulo")?.value.trim();
    const descripcion = document.getElementById("descripcion")?.value.trim();
    const precio = Number(document.getElementById("precio")?.value);
    const cifrasInput = document.querySelector('input[name="cifras"]:checked');

    if (!titulo || !cifrasInput || precio <= 0) {
      alert("Datos inválidos");
      return;
    }

    const cifras = Number(cifrasInput.value);
    const totalNumeros = Math.pow(10, cifras);

    const { error } = await supabase
      .from("rifas")
      .insert([{
        user_id: session.user.id,
        titulo,
        descripcion,
        precio,
        cifras,
        total_numeros: totalNumeros
      }]);

    if (error) {
      alert("Error creando rifa");
      console.error(error);
      return;
    }

    alert("Rifa creada correctamente");

    form.reset();
    modal.classList.add("hidden");
  });
}
