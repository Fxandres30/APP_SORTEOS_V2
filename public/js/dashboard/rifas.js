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

    let html = `
      <table class="rifas-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Cifras</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    rifas.forEach((rifa) => {
      html += `
        <tr>
          <td>${String(rifa.numero_rifa).padStart(9, "0")}</td>
          <td>${rifa.titulo}</td>
          <td>${rifa.cifras}</td>
          <td>${rifa.total_numeros}</td>
          <td class="acciones">
            <button class="btn-ver" data-id="${rifa.id}">
              Ver
            </button>
            <button class="btn-edit" data-id="${rifa.id}">
              Editar
            </button>
            <button class="btn-delete" data-id="${rifa.id}">
              Eliminar
            </button>
          </td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    content.innerHTML = html;

    // ===============================
    // VER NÚMEROS
    // ===============================
    document.querySelectorAll(".btn-ver").forEach((btnVer) => {
      btnVer.addEventListener("click", () => {
        const rifa = rifas.find(r => r.id === btnVer.dataset.id);
        if (rifa) {
          cargarVistaNumeros(rifa);
        }
      });
    });

    // ===============================
    // ELIMINAR RIFA
    // ===============================
    document.querySelectorAll(".btn-delete").forEach((btnDelete) => {
      btnDelete.addEventListener("click", async () => {

        const confirmacion = confirm("¿Seguro que quieres eliminar esta rifa?");
        if (!confirmacion) return;

        const { error } = await supabase
          .from("rifas")
          .delete()
          .eq("id", btnDelete.dataset.id);

        if (error) {
          alert("Error al eliminar");
          return;
        }

        btnDelete.closest("tr").remove();
      });
    });

    // ===============================
    // EDITAR (por ahora básico)
    // ===============================
    document.querySelectorAll(".btn-edit").forEach((btnEdit) => {
      btnEdit.addEventListener("click", () => {
        alert("Vista editar próximamente 🔧");
      });
    });

  });
}
