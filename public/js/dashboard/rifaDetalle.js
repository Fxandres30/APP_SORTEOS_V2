import { supabase } from "../services/supabase.js";

export async function cargarVistaRifaDetalle(rifa) {

  const dynamicSection = document.getElementById("dynamicSection");

  dynamicSection.innerHTML = `
    <div class="screen-header">
      <button id="backBtn">⬅ Atrás</button>
      <h2>${rifa.titulo}</h2>
    </div>

    <div class="filtros">
      <input type="text" id="busqueda" placeholder="Buscar por nombre o teléfono">
      <button data-filtro="todos">Todos</button>
      <button data-filtro="reservado">Reservados</button>
      <button data-filtro="pagado">Pagados</button>
    </div>

    <div id="numerosLista"></div>
  `;

  document.getElementById("backBtn").onclick = () => {
    document.getElementById("btnMisRifas").click();
  };

  cargarNumeros(rifa.id);
}

async function cargarNumeros(rifaId, filtro = "todos", busqueda = "") {

  const lista = document.getElementById("numerosLista");

  let query = supabase
    .from("rifa_numeros")
    .select("*")
    .eq("rifa_id", rifaId);

  if (filtro !== "todos") {
    query = query.eq("estado", filtro);
  }

  if (busqueda) {
    query = query.or(`nombre.ilike.%${busqueda}%,telefono.ilike.%${busqueda}%`);
  }

  const { data } = await query.order("numero");

  lista.innerHTML = "";

  data.forEach(n => {
    lista.innerHTML += `
      <div class="numero-item estado-${n.estado}">
        <strong>${n.numero}</strong>
        <span>${n.nombre || "-"}</span>
        <span>${n.telefono || "-"}</span>
      </div>
    `;
  });

  // Filtros
  document.querySelectorAll("[data-filtro]").forEach(btn => {
    btn.onclick = () => {
      cargarNumeros(rifaId, btn.dataset.filtro,
        document.getElementById("busqueda").value);
    };
  });

  // Buscador
  document.getElementById("busqueda").oninput = (e) => {
    cargarNumeros(rifaId, "todos", e.target.value);
  };
}
