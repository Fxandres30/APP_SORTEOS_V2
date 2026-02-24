import { supabase } from "../../services/supabase.js";
import { cargarVistaNumeros } from "./numerosView.js";
import { showMessage } from "../../utils/showMessage.js";

let seleccionados = [];
let rifaActual = null;

export function initAccionesNumeros(rifa) {

  rifaActual = rifa;
  seleccionados = [];

  const panel = document.getElementById("accionesNumeros");
  const contador = document.getElementById("contadorSeleccion");
  const btnGuardar = document.getElementById("guardarCambios");
  const btnCancelar = document.getElementById("cancelarSeleccion");

  const inputNombre = document.getElementById("nombreCliente");
  const inputTelefono = document.getElementById("telefonoCliente");

  panel.classList.add("hidden");
  contador.textContent = "0 seleccionados";

  // 🚫 Si la rifa está finalizada no permitir selección
  if (rifa.estado === "finalizada") {
    document.querySelectorAll(".numero-box").forEach((box) => {
      box.classList.add("bloqueado");
    });
    return;
  }

  // ==============================
  // 🔘 SELECCIÓN DE NÚMEROS
  // ==============================
  document.querySelectorAll(".numero-box").forEach((box) => {

    box.addEventListener("click", () => {

      if (box.classList.contains("estado-pagado")) {
        showMessage("No puedes modificar un número pagado", "error");
        return;
      }

      const id = box.dataset.id;

      box.classList.toggle("seleccionado");

      if (seleccionados.includes(id)) {
        seleccionados = seleccionados.filter(n => n !== id);
      } else {
        seleccionados.push(id);
      }

      if (seleccionados.length > 0) {
        panel.classList.remove("hidden");
        contador.textContent = `${seleccionados.length} seleccionados`;
      } else {
        panel.classList.add("hidden");
      }

    });

  });

  // ==============================
  // ❌ CANCELAR
  // ==============================
  btnCancelar.addEventListener("click", () => {

    seleccionados = [];

    document
      .querySelectorAll(".numero-box")
      .forEach(b => b.classList.remove("seleccionado"));

    inputNombre.value = "";
    inputTelefono.value = "";

    panel.classList.add("hidden");

  });

  // ==============================
  // 💾 GUARDAR
  // ==============================
  btnGuardar.addEventListener("click", async () => {

  if (seleccionados.length === 0) return;

  btnGuardar.disabled = true;
  btnGuardar.textContent = "Guardando...";

  try {

    const nuevoEstado = document.querySelector(
      'input[name="estadoNumero"]:checked'
    ).value;

    const nombre = inputNombre.value.trim();
    const telefono = inputTelefono.value.trim();

    for (const id of seleccionados) {

      const updateData = {
        estado: nuevoEstado,
        updated_at: new Date()
      };

      if (nuevoEstado === "libre") {
        updateData.nombre = null;
        updateData.telefono = null;
      }

      if (nombre !== "") updateData.nombre = nombre;
      if (telefono !== "") updateData.telefono = telefono;

      const { error } = await supabase
        .from("rifa_numeros")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    }

    showMessage("Cambios guardados correctamente", "success");

    // 🔥 Reset UI antes de recargar vista
    seleccionados = [];
    inputNombre.value = "";
    inputTelefono.value = "";
    panel.classList.add("hidden");

    btnGuardar.disabled = false;
    btnGuardar.textContent = "Guardar";

    // 🔄 Ahora sí recarga
    cargarVistaNumeros(rifaActual);

  } catch (error) {

    console.error(error);
    showMessage("Error al guardar cambios", "error");

    btnGuardar.disabled = false;
    btnGuardar.textContent = "Guardar";
  }

});

}