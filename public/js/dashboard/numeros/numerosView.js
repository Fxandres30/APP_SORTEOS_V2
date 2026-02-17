import { supabase } from "../../services/supabase.js";
import { showView } from "../router.js";
import { initAccionesNumeros } from "./numerosActions.js";

export async function cargarVistaNumeros(rifa) {

  const view = document.getElementById("numerosView");
  if (!view) return;

  showView("numerosView");

  view.innerHTML = `
    <div class="view-header">
      <button id="volverRifas">← Volver</button>
      <h2>Números #${String(rifa.numero_rifa).padStart(9, "0")}</h2>
    </div>

    <div class="numeros-container">
      <div class="numeros-grid"></div>

      <div class="leyenda-estados">
        <div><span class="dot libre"></span> Disponible</div>
        <div><span class="dot reservado"></span> Reservado</div>
        <div><span class="dot pagado"></span> Pagado</div>
      </div>

      <div class="lista-numeros">
        <table class="detalle-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Estado</th>
              <th>Nombre</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody id="detalleNumeros"></tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("volverRifas")
    .addEventListener("click", () => showView("misRifasView"));

  // ===========================
  // 🔎 CONSULTAR NÚMEROS
  // ===========================

  const { data: numeros, error } = await supabase
    .from("rifa_numeros")
    .select("*")
    .eq("rifa_id", rifa.id)
    .order("numero", { ascending: true });

  if (error) {
    alert("Error cargando números");
    return;
  }

  // ===========================
  // 🔢 RENDER GRID
  // ===========================

  const grid = view.querySelector(".numeros-grid");

  numeros.forEach(n => {
    const div = document.createElement("div");
    div.className = `numero-box estado-${n.estado}`;
    div.textContent = n.numero;
    grid.appendChild(div);
  });

  // ===========================
  // 📋 RENDER LISTA
  // ===========================

  const tbody = view.querySelector("#detalleNumeros");

  numeros.forEach(n => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${n.numero}</td>
      <td class="estado ${n.estado}">${n.estado}</td>
      <td>${n.nombre || "-"}</td>
      <td>${n.telefono || "-"}</td>
    `;
    tbody.appendChild(tr);
  });

  // ===========================
  // 🔗 Acciones
  // ===========================

  initAccionesNumeros(rifa);
}
