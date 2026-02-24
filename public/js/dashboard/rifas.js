import { supabase } from "../services/supabase.js";
import { showView } from "./router.js";
import { cargarVistaNumeros } from "./numeros/numerosView.js";

export function initMisRifas(session) {

  const btn = document.getElementById("btnMisRifas");
  const view = document.getElementById("misRifasView");

  if (!btn || !view) return;

  btn.addEventListener("click", async () => {

    showView("misRifasView");

    view.innerHTML = `
      <div class="view-header">
        <button id="volverDashboard">← Volver</button>
        <h2>Mis rifas</h2>
      </div>
      <div id="rifasContent">
        <p>Cargando rifas...</p>
      </div>
    `;

    document.getElementById("volverDashboard")
      .addEventListener("click", () => showView("dashboard"));

    const { data: rifas, error } = await supabase
      .from("rifas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    const content = document.getElementById("rifasContent");

    if (error) {
      console.error(error);
      content.innerHTML = "<p>Error al cargar rifas</p>";
      return;
    }

    if (!rifas || rifas.length === 0) {
      content.innerHTML = "<p>No has creado rifas todavía.</p>";
      return;
    }

    let html = `<div class="rifas-list">`;

    rifas.forEach((rifa) => {

      const estado = rifa.estado || "activa";

      html += `
        <div class="rifa-card" data-id="${rifa.id}">

          <div class="rifa-top">
            <div class="rifa-numero">
              #${String(rifa.numero_rifa).padStart(9, "0")}
            </div>

            <span class="estado ${estado}">
              ${estado === "activa" ? "Activa" : "Finalizada"}
            </span>
          </div>

          <div class="rifa-middle">
  <div class="rifa-info">
    <h3>${rifa.titulo}</h3>
    <span>${rifa.cifras} cifras · ${rifa.total_numeros} números</span>
  </div>
</div>

<div class="rifa-actions">
  <button class="btn-edit" data-id="${rifa.id}">
    Editar
  </button>
  <button class="btn-delete" data-id="${rifa.id}">
    Eliminar
    
  </button>

  <button class="btn-config" data-id="${rifa.id}">
    ⚙ Configurar
  </button>

  ${
    estado === "activa"
      ? `<button class="btn-finalizar" data-id="${rifa.id}">
          Finalizar
        </button>`
      : ""
  }
</div>

        </div>
      `;
    });

    html += `</div>`;
    content.innerHTML = html;

    // ===========================
    // VER TABLA
    // ===========================
    document.querySelectorAll(".btn-ver").forEach((btnVer) => {
      btnVer.addEventListener("click", () => {
        const rifa = rifas.find(r => r.id === btnVer.dataset.id);
        if (rifa) {
          cargarVistaNumeros(rifa);
        }
      });
    });

  // ===========================
// ELIMINAR
// ===========================
document.querySelectorAll(".btn-delete").forEach((btnDelete) => {

  btnDelete.addEventListener("click", () => {

    const modal = document.getElementById("confirmModal");
    const btnCancel = document.getElementById("cancelConfirm");
    const btnAccept = document.getElementById("acceptConfirm");

    const modalTitle = modal.querySelector("h3");
    const modalText = modal.querySelector("p");

    // 🔥 Texto
    modalTitle.textContent = "Eliminar rifa";
    modalText.textContent =
      "¿Seguro que deseas eliminar esta rifa? Esta acción no se puede deshacer.";

    // 🔥 Estilo rojo
    modal.classList.remove("modal-primary");
    modal.classList.add("modal-danger");

    modal.classList.remove("hidden");

    // 🔥 Limpiar eventos anteriores
    const newBtnAccept = btnAccept.cloneNode(true);
    btnAccept.parentNode.replaceChild(newBtnAccept, btnAccept);

    const newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    // Cancelar
    newBtnCancel.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Confirmar eliminar
    newBtnAccept.addEventListener("click", async () => {

      modal.classList.add("hidden");

      const { error } = await supabase
        .from("rifas")
        .delete()
        .eq("id", btnDelete.dataset.id);

      if (error) {
        console.error(error);
        showMessage("Error al eliminar", "error");
        return;
      }

      btnDelete.closest(".rifa-card").remove();

      showMessage("Rifa eliminada correctamente", "success");
    });

  });

});

    // ===========================
// FINALIZAR
// ===========================
document.querySelectorAll(".btn-finalizar").forEach((btnFinalizar) => {

  btnFinalizar.addEventListener("click", () => {

    const modal = document.getElementById("confirmModal");
    const btnCancel = document.getElementById("cancelConfirm");
    const btnAccept = document.getElementById("acceptConfirm");

    const modalTitle = modal.querySelector("h3");
    const modalText = modal.querySelector("p");

    // 🔥 Texto diferente
    modalTitle.textContent = "Finalizar rifa";
    modalText.textContent =
      "Al finalizar la rifa se bloquearán las reservas y se deshabilitará la opción de compartir. ¿Confirmas esta acción?";

    // 🔥 Estilo azul
    modal.classList.remove("modal-danger");
    modal.classList.add("modal-primary");

    modal.classList.remove("hidden");

    // 🔥 Limpiar eventos anteriores
    const newBtnAccept = btnAccept.cloneNode(true);
    btnAccept.parentNode.replaceChild(newBtnAccept, btnAccept);

    const newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    // Cancelar
    newBtnCancel.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Confirmar finalizar
    newBtnAccept.addEventListener("click", async () => {

      modal.classList.add("hidden");

      const { error } = await supabase
        .from("rifas")
        .update({ estado: "finalizada" })
        .eq("id", btnFinalizar.dataset.id);

      if (error) {
        console.error(error);
        showMessage("Error al finalizar", "error");
        return;
      }

      const card = btnFinalizar.closest(".rifa-card");
      card.querySelector(".estado").className = "estado finalizada";
      card.querySelector(".estado").textContent = "Finalizada";

      btnFinalizar.remove();

      showMessage("Rifa finalizada correctamente", "success");
    });

  });

});

    // ===========================
// ABRIR NÚMEROS AL TOCAR CARD
// ===========================
document.querySelectorAll(".rifa-card").forEach((card) => {
  card.addEventListener("click", (e) => {

    // Evita que se active si se hace click en un botón
    if (e.target.closest("button")) return;

    const id = card.dataset.id;

    const rifa = rifas.find(r => r.id === id);

    if (rifa) {
      cargarVistaNumeros(rifa);
    }
  });
});


    // ===========================
    // EDITAR (placeholder)
    // ===========================
    document.querySelectorAll(".btn-edit").forEach((btnEdit) => {
      btnEdit.addEventListener("click", () => {
        alert("Vista editar próximamente 🔧");
      });
    });

  });
}
