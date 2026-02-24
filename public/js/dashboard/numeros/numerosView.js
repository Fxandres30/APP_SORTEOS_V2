import { supabase } from "../../services/supabase.js";
import { showView } from "../router.js";
import { initAccionesNumeros } from "./numerosActions.js";
import { initCompartirNumeros } from "./numerosShare.js";

export async function cargarVistaNumeros(rifa) {

  const view = document.getElementById("numerosView");
  if (!view) return;

  showView("numerosView");

  view.innerHTML = `
  <div class="view-header">
  <button id="volverRifas">← Volver</button>
  <h2>
  ${rifa.titulo || "Rifa"} 
  <span class="rifa-numero">
    #${String(rifa.numero_rifa).padStart(9, "0")}
  </span>
</h2>
  <button id="btnCompartirNumeros" class="btn-compartir">
    📤 Compartir
  </button>
</div>

  <div class="numeros-container">

    <div class="numeros-card">

      <div class="numeros-grid"></div>

      <div class="leyenda-estados">
        <div><span class="dot libre"></span> Disponible</div>
        <div><span class="dot reservado"></span> Reservado</div>
        <div><span class="dot pagado"></span> Pagado</div>
      </div>
</div>
</div>
      <div class="filtros-estados">
        <button class="filtro-btn activo" data-estado="todos">Todos</button>
        <button class="filtro-btn" data-estado="libre">Libres</button>
        <button class="filtro-btn" data-estado="reservado">Reservados</button>
        <button class="filtro-btn" data-estado="pagado">Pagados</button>
      </div>
</div>
      <div class="busqueda-wrapper">
        <input 
          type="text" 
          id="busquedaNumero" 
          placeholder="Buscar por nombre o teléfono..."
        />
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
  // 📋 FILTRO + BUSQUEDA
  // ===========================

  const tbody = view.querySelector("#detalleNumeros");

  let filtroActual = "todos";
  let textoBusqueda = "";

  function renderLista() {

    tbody.innerHTML = "";

    numeros.forEach(n => {

      // Filtro por estado
      if (filtroActual !== "todos" && n.estado !== filtroActual) return;

      // Filtro por búsqueda
      if (textoBusqueda) {
        const nombre = (n.nombre || "").toLowerCase();
        const telefono = (n.telefono || "").toLowerCase();

        if (
          !nombre.includes(textoBusqueda) &&
          !telefono.includes(textoBusqueda)
        ) {
          return;
        }
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${n.numero}</td>
        <td class="estado ${n.estado}">${n.estado}</td>
        <td>${n.nombre || "-"}</td>
        <td>${n.telefono || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderLista();

  // ===========================
  // 🎛 BOTONES FILTRO
  // ===========================

  view.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {

      view.querySelectorAll(".filtro-btn")
        .forEach(b => b.classList.remove("activo"));

      btn.classList.add("activo");

      filtroActual = btn.dataset.estado;
      renderLista();
    });
  });

  // ===========================
  // 🔎 BUSQUEDA
  // ===========================

  const inputBusqueda = view.querySelector("#busquedaNumero");

  inputBusqueda.addEventListener("input", () => {
    textoBusqueda = inputBusqueda.value.toLowerCase();
    renderLista();
  });

  // ===========================
  // 🔗 Acciones
  // ===========================

  initAccionesNumeros(rifa);
  initCompartirNumeros();
}
