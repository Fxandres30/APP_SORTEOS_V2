import { supabase } from "../services/supabase.js";

export function initCrearRifa() {

  const btnCrear = document.getElementById("btnCrearRifa");
  const modal = document.getElementById("modalRifa");
  const cerrar = document.getElementById("cerrarModal");
  const form = document.getElementById("crearRifaForm");
  const mensaje = document.getElementById("crearRifaMsg");

  if (!btnCrear || !modal || !cerrar || !form) return;

  btnCrear.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cerrar.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("🚀 Iniciando creación de rifa...");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("❌ No hay sesión");
      return;
    }

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

    console.log("📌 Datos rifa:", { titulo, cifras, totalNumeros });

    // =============================
    // 1️⃣ CREAR RIFA
    // =============================
    const { data, error: errorRifa } = await supabase
      .from("rifas")
      .insert([{
        user_id: session.user.id,
        titulo,
        descripcion,
        precio,
        cifras,
        total_numeros: totalNumeros
      }])
      .select();

    if (errorRifa) {
      console.error("❌ Error creando rifa:", errorRifa);
      alert("Error creando rifa: " + errorRifa.message);
      return;
    }

    const nuevaRifa = data?.[0];

    console.log("✅ Rifa creada:", nuevaRifa);

    if (!nuevaRifa?.id) {
      alert("No se pudo obtener ID de la rifa");
      return;
    }

    // =============================
    // 2️⃣ GENERAR NÚMEROS
    // =============================
    const numeros = [];

    for (let i = 0; i < totalNumeros; i++) {
      numeros.push({
        rifa_id: nuevaRifa.id,
        numero: i.toString().padStart(cifras, "0"),
        estado: "libre"
      });
    }

    console.log("🔢 Cantidad números generados:", numeros.length);

    // Insertar en bloques
    const chunkSize = 1000;

    for (let i = 0; i < numeros.length; i += chunkSize) {
      const chunk = numeros.slice(i, i + chunkSize);

      console.log(`📦 Insertando bloque ${i} - ${i + chunk.length}`);

      const { error: errorNumeros } = await supabase
        .from("rifa_numeros")
        .insert(chunk);

      if (errorNumeros) {
        console.error("❌ Error generando números:", errorNumeros);
        alert("Error generando números: " + errorNumeros.message);
        return;
      }
    }

    console.log("🎉 Números insertados correctamente");

    const globalMsg = document.getElementById("globalMsg");

form.reset();
modal.classList.add("hidden");

globalMsg.textContent = "Rifa creada correctamente ✅";
globalMsg.classList.add("show");

setTimeout(() => {
  globalMsg.classList.remove("show");
}, 3000);

    form.reset();
    modal.classList.add("hidden");
  });
}
