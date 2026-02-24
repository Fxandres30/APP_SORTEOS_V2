import { supabase } from "../services/supabase.js";

export function initConfiguracion(session) {

  const btnConfiguracion = document.getElementById("btnConfiguracion");
  const configView = document.getElementById("configuracionView");
  const dashboardView = document.getElementById("dashboardView");

  if (!btnConfiguracion || !configView || !dashboardView) return;

  // 🔹 Abrir configuración
  btnConfiguracion.addEventListener("click", async () => {

    dashboardView.classList.add("hidden");
    configView.classList.remove("hidden");

    configView.innerHTML = `
  <div class="view-header">
    <button id="volverDashboard">⬅</button>
    <h2>Configuración</h2>
  </div>

  <div class="loading-container">
    <div class="spinner"></div>
    <p>Cargando perfil...</p>
  </div>
`;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("name, email, referral_code, plan, plan_expires_at")
      .eq("id", session.user.id)
      .single();

    if (error || !profile) {
      console.error(error);
      configView.innerHTML = "<p>Error cargando perfil</p>";
      return;
    }

    const linkReferido =
      `${window.location.origin}/public/register.html?ref=${profile.referral_code}`;

    configView.innerHTML = `
      <div class="view-header">
        <button id="volverDashboard">⬅</button>
        <h2>Configuración</h2>
      </div>

      <div id="configContent">

        <div class="config-section">
          <h4>👤 Perfil</h4>
          <p><strong>Nombre:</strong> ${profile.name}</p>
          <p><strong>Email:</strong> ${profile.email}</p>
        </div>

        <div class="config-section">
          <h4>🎁 Referidos</h4>
          <p><strong>Código:</strong> ${profile.referral_code}</p>

          <input value="${linkReferido}" readonly />
          <button class="primary-btn" id="copiarLink">
            Copiar link
          </button>
        </div>

        <div class="config-section">
          <h4>📦 Plan</h4>
          <p><strong>Plan actual:</strong> ${profile.plan}</p>
          <p><strong>Vence:</strong> ${
            profile.plan_expires_at
              ? new Date(profile.plan_expires_at).toLocaleDateString()
              : "Sin fecha"
          }</p>
        </div>

      </div>
    `;

    // 🔹 Copiar link
    document.getElementById("copiarLink").onclick = () => {
      navigator.clipboard.writeText(linkReferido);
      alert("Link copiado");
    };

  });

  // 🔥 Delegación global (esto nunca falla)
  document.addEventListener("click", (e) => {
    if (e.target.id === "volverDashboard") {
      configView.classList.add("hidden");
      dashboardView.classList.remove("hidden");
    }
  });

}