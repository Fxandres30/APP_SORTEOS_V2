import { supabase } from "../services/supabase.js";

export function initMisRifas() {
  const btn = document.getElementById("btnMisRifas");
  const dynamicSection = document.getElementById("dynamicSection");

  if (!btn) return;

  btn.addEventListener("click", async () => {
    dynamicSection.innerHTML = "<p>Cargando rifas...</p>";

    const { data: { session } } = await supabase.auth.getSession();

    const { data: rifas } = await supabase
      .from("rifas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!rifas || rifas.length === 0) {
      dynamicSection.innerHTML = "<p>No tienes rifas creadas.</p>";
      return;
    }

    let html = `
      <h3>Mis rifas</h3>
      <table class="rifas-table">
        <tr>
          <th>Título</th>
          <th>Cifras</th>
          <th>Total</th>
        </tr>
    `;

    rifas.forEach(r => {
      html += `
        <tr>
          <td>${r.titulo}</td>
          <td>${r.cifras}</td>
          <td>${r.total_numeros}</td>
        </tr>
      `;
    });

    html += "</table>";

    dynamicSection.innerHTML = html;
  });
}
