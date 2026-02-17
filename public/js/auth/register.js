import { supabase } from "../services/supabase.js";

function generarCodigo(nombre) {
  const base = nombre
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);

  return base + Math.floor(100 + Math.random() * 900);
}

document.getElementById("registerBtn").addEventListener("click", async () => {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const referralInput = document.getElementById("referralCode").value.trim();

  if (!name || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  // Crear usuario Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  const user = data.user;
  const referralCode = generarCodigo(name);

  // Crear perfil
  await supabase.from("profiles").insert({
    id: user.id,
    name,
    email,
    referral_code: referralCode
  });

  // Procesar referido
  if (referralInput) {
    const { data: refUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", referralInput)
      .single();

    if (refUser) {
      await supabase.from("referrals").insert({
        referrer_id: refUser.id,
        referred_id: user.id
      });
    }
  }

  alert("Cuenta creada correctamente");
  window.location.href = "index.html";
});
